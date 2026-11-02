import { useState, useEffect, useRef } from "react";
import {
    Search,
    Bell,
    Moon,
    Sun,
    ChevronDown,
    User,
    Settings as SettingsIcon,
    LogOut,
    CheckCheck,
    CalendarDays,
    BriefcaseBusiness,
    UserCheck,
    Sparkles,
    BellRing,
    Clock3,
    Loader2
} from "lucide-react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { API_BASE_URL } from "../api/config/constants";
import "./Navbar.css";

function getNotificationIcon(type = "") {
    const normalized = type.toUpperCase();

    if (normalized.includes("INTERVIEW")) {
        return CalendarDays;
    }

    if (normalized.includes("APPLICATION_STATUS")) {
        return UserCheck;
    }

    if (normalized.includes("APPLICATION")) {
        return BriefcaseBusiness;
    }

    if (normalized.includes("AI")) {
        return Sparkles;
    }

    return BellRing;
}

function getRelativeTime(date) {
    if (!date) return "";

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) return "";

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - timestamp) / 1000)
    );

    if (seconds < 60) return "Just now";

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return `${minutes} min ago`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return `${hours} hr ago`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    }

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short"
    });
}

function Navbar() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [markingRead, setMarkingRead] = useState(false);

    const [userName, setUserName] = useState(
        localStorage.getItem("name") || ""
    );

    const [userRole, setUserRole] = useState(
        localStorage.getItem("role") || ""
    );

    const [notifications, setNotifications] = useState([]);

    const notifRef = useRef(null);
    const profileRef = useRef(null);

    // ============================================================
    // THEME
    // ============================================================

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );
    }, [isDark]);

    // ============================================================
    // PROFILE
    // ============================================================

    useEffect(() => {
        const loadNavbarProfile = async () => {
            try {
                const response =
                    await api.get("/user/profile");

                const fullName =
                    response.data?.fullName;

                const role =
                    response.data?.role;

                if (fullName) {
                    setUserName(fullName);

                    localStorage.setItem(
                        "name",
                        fullName
                    );
                }

                if (role) {
                    setUserRole(role);

                    localStorage.setItem(
                        "role",
                        role
                    );
                }
            } catch (error) {
                console.error(
                    "Failed to load navbar profile:",
                    error
                );
            }
        };

        loadNavbarProfile();
    }, []);

    // ============================================================
    // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
    // ============================================================

    useEffect(() => {
        function handleClickOutside(event) {

            if (
                notifRef.current &&
                !notifRef.current.contains(
                    event.target
                )
            ) {
                setNotifOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(
                    event.target
                )
            ) {
                setProfileOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    // ============================================================
    // NOTIFICATIONS + WEBSOCKET
    // ============================================================

    useEffect(() => {

        let isMounted = true;

        // --------------------------------------------------------
        // MERGE NOTIFICATIONS
        // --------------------------------------------------------

        const mergeNotifications = (
            current,
            incoming
        ) => {

            const notificationMap =
                new Map();

            current.forEach(
                (notification) => {

                    if (notification.id) {
                        notificationMap.set(
                            notification.id,
                            notification
                        );
                    }

                }
            );

            incoming.forEach(
                (notification) => {

                    if (notification.id) {
                        notificationMap.set(
                            notification.id,
                            notification
                        );
                    }

                }
            );

            return Array.from(
                notificationMap.values()
            ).sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            );
        };

        // --------------------------------------------------------
        // LOAD EXISTING NOTIFICATIONS
        // --------------------------------------------------------

        const loadNotifications =
            async () => {

                try {

                    const response =
                        await api.get(
                            "/notifications"
                        );

                    if (isMounted) {

                        setNotifications(
                            (previous) =>
                                mergeNotifications(
                                    previous,
                                    response.data ||
                                        []
                                )
                        );

                    }

                } catch (error) {

                    console.error(
                        "Failed to load notifications:",
                        error
                    );

                }

            };

        loadNotifications();

        // --------------------------------------------------------
        // WEBSOCKET URL
        // --------------------------------------------------------

        const apiUrl = API_BASE_URL;

        if (!apiUrl) {

            console.error(
                "VITE_API_URL is not configured."
            );

            return () => {
                isMounted = false;
            };

        }

        const wsUrl =
            apiUrl
                .replace(
                    /^http:/,
                    "ws:"
                )
                .replace(
                    /^https:/,
                    "wss:"
                )
                .replace(
                    /\/api\/?$/,
                    ""
                ) + "/ws";

        // --------------------------------------------------------
        // ROLE + EMAIL
        // --------------------------------------------------------

        const role =
            localStorage.getItem(
                "role"
            ) || "";

        const email =
            localStorage.getItem(
                "email"
            ) || "";

        console.log(
            "Notification WebSocket role:",
            role
        );

        console.log(
            "Notification WebSocket email:",
            email
        );

        // --------------------------------------------------------
        // HANDLE LIVE NOTIFICATION
        // --------------------------------------------------------

        const handleNotification =
            (message) => {

                try {

                    const notification =
                        JSON.parse(
                            message.body
                        );

                    console.log(
                        "================================"
                    );

                    console.log(
                        "LIVE NOTIFICATION RECEIVED"
                    );

                    console.log(
                        "Notification:",
                        notification
                    );

                    console.log(
                        "Notification ID:",
                        notification.id
                    );

                    console.log(
                        "Notification title:",
                        notification.title
                    );

                    console.log(
                        "Notification read:",
                        notification.read
                    );

                    console.log(
                        "================================"
                    );

                    if (
                        !notification.id
                    ) {

                        console.warn(
                            "Received notification without ID:",
                            notification
                        );

                        return;
                    }

                    if (!isMounted) {
                        return;
                    }

                    setNotifications(
                        (previous) => {

                            console.log(
                                "Previous notifications:",
                                previous
                            );

                            const exists =
                                previous.some(
                                    (item) =>
                                        item.id ===
                                        notification.id
                                );

                            if (exists) {

                                console.log(
                                    "Notification already exists:",
                                    notification.id
                                );

                                return previous;
                            }

                            const updated = [
                                notification,
                                ...previous
                            ];

                            console.log(
                                "UPDATED NOTIFICATIONS:",
                                updated
                            );

                            return updated;
                        }
                    );

                } catch (error) {

                    console.error(
                        "Failed to parse notification:",
                        error
                    );

                }

            };

        // --------------------------------------------------------
        // STOMP CLIENT
        // --------------------------------------------------------

        const client =
            new Client({

                brokerURL: wsUrl,

                reconnectDelay: 5000,

                onConnect: () => {

                    console.log(
                        "================================"
                    );

                    console.log(
                        "Notification WebSocket connected"
                    );

                    console.log(
                        "Role:",
                        role
                    );

                    console.log(
                        "Email:",
                        email
                    );

                    console.log(
                        "================================"
                    );

                    // ------------------------------------------------
                    // ADMIN / RECRUITER
                    // ------------------------------------------------

                    if (
                        role === "ADMIN"
                    ) {

                        console.log(
                            "Subscribing to recruiter notifications..."
                        );

                        client.subscribe(
                            "/topic/notifications",
                            handleNotification
                        );

                    }

                    // ------------------------------------------------
                    // CANDIDATE / USER
                    // ------------------------------------------------

                    if (
                        role === "USER" &&
                        email
                    ) {

                        const candidateTopic =
                            `/topic/notifications/candidate/${email}`;

                        console.log(
                            "Subscribing to candidate topic:",
                            candidateTopic
                        );

                        client.subscribe(
                            candidateTopic,
                            handleNotification
                        );

                    }

                },

                onStompError:
                    (frame) => {

                        console.error(
                            "WebSocket STOMP error:",
                            frame
                        );

                    },

                onWebSocketError:
                    (error) => {

                        console.error(
                            "WebSocket error:",
                            error
                        );

                    }

            });

        client.activate();

        // --------------------------------------------------------
        // CLEANUP
        // --------------------------------------------------------

        return () => {

            isMounted = false;

            client.deactivate();

        };

    }, []);

    // ============================================================
    // UNREAD COUNT
    // ============================================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;

    // ============================================================
    // INITIALS
    // ============================================================

    const initials = userName
        ? userName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map(
                  (word) =>
                      word[0]
              )
              .join("")
              .toUpperCase()
        : "U";

    // ============================================================
    // SEARCH
    // ============================================================

    const handleSearch = () => {

        const searchValue =
            query.trim();

        if (!searchValue) {

            navigate("/search");

            return;
        }

        navigate(
            `/search?query=${encodeURIComponent(
                searchValue
            )}`
        );

    };

    const handleSearchKeyDown =
        (event) => {

            if (
                event.key ===
                "Enter"
            ) {

                handleSearch();

            }

        };

    // ============================================================
    // PROFILE
    // ============================================================

    const handleMyProfile = () => {

        setProfileOpen(false);

        navigate("/profile");

    };

    const handleAccountSettings = () => {

        setProfileOpen(false);

        navigate("/settings");

    };

    // ============================================================
    // LOGOUT
    // ============================================================

    const handleLogout = () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );

        localStorage.removeItem(
            "name"
        );

        localStorage.removeItem(
            "email"
        );

        setProfileOpen(false);

        setNotifOpen(false);

        navigate(
            "/login",
            {
                replace: true
            }
        );

    };

    // ============================================================
    // REFRESH NOTIFICATIONS (keeps badge count current)
    // ============================================================

    const refreshNotifications = async () => {
        try {
            const response = await api.get("/notifications");

            setNotifications((previous) => {
                const notificationMap = new Map();

                previous.forEach((notification) => {
                    if (notification.id) {
                        notificationMap.set(
                            notification.id,
                            notification
                        );
                    }
                });

                (response.data || []).forEach((notification) => {
                    if (notification.id) {
                        notificationMap.set(
                            notification.id,
                            notification
                        );
                    }
                });

                return Array.from(
                    notificationMap.values()
                ).sort(
                    (a, b) =>
                        new Date(b.createdAt || 0) -
                        new Date(a.createdAt || 0)
                );
            });
        } catch (error) {
            console.error(
                "Failed to refresh notifications:",
                error
            );
        }
    };

    // ============================================================
    // MARK ALL READ
    // ============================================================

const handleMarkAllRead = async () => {
    if (markingRead || unreadCount === 0) return;

    try {
        setMarkingRead(true);

        await api.put("/notifications/read-all");

        setNotifications((previous) =>
            previous.map((notification) => ({
                ...notification,
                read: true
            }))
        );
    } catch (error) {
        console.error(
            "Failed to mark notifications as read:",
            error
        );
    } finally {
        setMarkingRead(false);
    }
};
    // ============================================================
    // UI
    // ============================================================

    return (
        <header className="navbar">

            <div className="navbar-left">

                <h1 className="navbar-title">
                    Dashboard
                </h1>

            </div>

            <div className="navbar-search">

                <button
                    type="button"
                    className="navbar-search-button"
                    onClick={handleSearch}
                    aria-label="Search"
                >

                    <Search
                        size={17}
                        className="navbar-search-icon"
                    />

                </button>

                <input
                    type="text"
                    placeholder="Search resumes..."
                    value={query}
                    onChange={(event) =>
                        setQuery(
                            event.target.value
                        )
                    }
                    onKeyDown={
                        handleSearchKeyDown
                    }
                />

                <kbd className="navbar-search-kbd">
                    ⌘K
                </kbd>

            </div>

            <div className="navbar-right">

                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <div
                    className="navbar-popover"
                    ref={notifRef}
                >

                    <button
                        type="button"
                        className="navbar-icon-btn"
                        aria-label="Notifications"
                        onClick={() => {

                            const willOpen =
                                !notifOpen;

                            setNotifOpen(
                                willOpen
                            );

                            setProfileOpen(
                                false
                            );

                            if (willOpen) {
                                refreshNotifications();
                            }

                        }}
                    >

                        <Bell size={18} />

                        {unreadCount > 0 && (
                            <span className="navbar-badge">

                                {unreadCount >
                                9
                                    ? "9+"
                                    : unreadCount}

                            </span>
                        )}

                    </button>

                    {notifOpen && (

                        
<div className="navbar-dropdown navbar-dropdown--notif">

    <div className="notif-panel-header">
        <div className="notif-heading">
            <div className="notif-heading-icon">
                <Bell size={18} />
            </div>

            <div>
                <h3>Notifications</h3>
                <p>
                    {unreadCount > 0
                        ? `${unreadCount} unread updates`
                        : "You're all caught up"}
                </p>
            </div>
        </div>

        {unreadCount > 0 && (
            <button
                type="button"
                className="notif-mark-read"
                onClick={handleMarkAllRead}
                disabled={markingRead}
            >
                {markingRead ? (
                    <Loader2 size={14} className="notif-spin" />
                ) : (
                    <CheckCheck size={14} />
                )}
                Mark all read
            </button>
        )}
    </div>

    <div className="navbar-notif-list">

        {notifications.length === 0 ? (
            <div className="notif-empty">
                <div className="notif-empty-icon">
                    <Bell size={25} />
                </div>

                <h4>You're all caught up!</h4>
                <p>New updates will appear here.</p>
            </div>
        ) : (
            notifications.map((notification) => {
                const Icon = getNotificationIcon(
                    notification.type
                );

                return (
                    <div
                        className={`notif-card ${
                            notification.read ? "is-read" : "is-unread"
                        }`}
                        key={notification.id}
                    >
                        <div className={`notif-card-icon ${
                            notification.read ? "" : "notif-card-icon--unread"
                        }`}>
                            <Icon size={17} />
                        </div>

                        <div className="notif-card-content">
                            <div className="notif-card-title-row">
                                <h4>{notification.title || "Notification"}</h4>

                                {!notification.read && (
                                    <span className="notif-unread-label">
                                        NEW
                                    </span>
                                )}
                            </div>

                            <p>
                                {notification.detail || "You have a new update."}
                            </p>

                            <span className="notif-card-time">
                                <Clock3 size={12} />
                                {getRelativeTime(notification.createdAt)}
                            </span>
                        </div>

                        {!notification.read && (
                            <span className="notif-card-dot" />
                        )}
                    </div>
                );
            })
        )}

    </div>

    <div className="notif-panel-footer">
        <span>
            Showing {notifications.length} notifications
        </span>
    </div>

</div>


                    )}

                </div>

                {/* ==================================================
                    THEME
                ================================================== */}

                <button
                    type="button"
                    className="navbar-icon-btn"
                    aria-label={
                        isDark
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    onClick={() =>
                        setIsDark(
                            (prev) =>
                                !prev
                        )
                    }
                >

                    {isDark ? (
                        <Sun size={18} />
                    ) : (
                        <Moon size={18} />
                    )}

                </button>

                <div className="navbar-divider" />

                {/* ==================================================
                    PROFILE
                ================================================== */}

                <div
                    className="navbar-popover"
                    ref={profileRef}
                >

                    <button
                        type="button"
                        className="navbar-profile-btn"
                        onClick={() => {

                            setProfileOpen(
                                (prev) =>
                                    !prev
                            );

                            setNotifOpen(
                                false
                            );

                        }}
                    >

                        <span className="navbar-avatar">

                            {initials}

                        </span>

                        <span className="navbar-profile-name">

                            {userName ||
                                "User"}

                        </span>

                        <ChevronDown
                            size={14}
                            className={`navbar-chevron ${
                                profileOpen
                                    ? "navbar-chevron--open"
                                    : ""
                            }`}
                        />

                    </button>

                    {profileOpen && (

                        <div className="navbar-dropdown navbar-dropdown--profile">

                            <div className="navbar-dropdown-profile-head">

                                <span className="navbar-avatar navbar-avatar--lg">

                                    {initials}

                                </span>

                                <div>

                                    <p className="navbar-profile-fullname">

                                        {userName ||
                                            "User"}

                                    </p>

                                    <p className="navbar-profile-role">

                                        {userRole ||
                                            "User"}

                                    </p>

                                </div>

                            </div>

                            <div className="navbar-dropdown-divider" />

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={
                                    handleMyProfile
                                }
                            >

                                <User size={15} />

                                <span>
                                    My Profile
                                </span>

                            </button>

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={
                                    handleAccountSettings
                                }
                            >

                                <SettingsIcon
                                    size={15}
                                />

                                <span>
                                    Account Settings
                                </span>

                            </button>

                            <div className="navbar-dropdown-divider" />

                            <button
                                type="button"
                                className="navbar-dropdown-item navbar-dropdown-item--danger"
                                onClick={
                                    handleLogout
                                }
                            >

                                <LogOut
                                    size={15}
                                />

                                <span>
                                    Log out
                                </span>

                            </button>

                        </div>

                    )}

                </div>

            </div>

        </header>
    );
}

export default Navbar;