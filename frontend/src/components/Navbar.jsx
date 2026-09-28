import { useState, useEffect, useRef } from "react";
import {
    Search,
    Bell,
    Moon,
    Sun,
    ChevronDown,
    User,
    Settings as SettingsIcon,
    LogOut
} from "lucide-react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "./Navbar.css";

function Navbar() {
    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    const [notifOpen, setNotifOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

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

        const apiUrl =
            import.meta.env.VITE_API_URL;

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
    // MARK ALL READ
    // ============================================================

    const handleMarkAllRead =
        async () => {

            try {

                await api.put(
                    "/notifications/read-all"
                );

                setNotifications(
                    (previous) =>
                        previous.map(
                            (notification) => ({
                                ...notification,
                                read: true
                            })
                        )
                );

            } catch (error) {

                console.error(
                    "Failed to mark notifications as read:",
                    error
                );

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

                            setNotifOpen(
                                (prev) =>
                                    !prev
                            );

                            setProfileOpen(
                                false
                            );

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

                            <div className="navbar-dropdown-header">

                                <span>
                                    Notifications
                                </span>

                                {unreadCount >
                                    0 && (

                                    <button
                                        type="button"
                                        className="navbar-link-btn"
                                        onClick={
                                            handleMarkAllRead
                                        }
                                    >
                                        Mark all read
                                    </button>

                                )}

                            </div>

                            <div className="navbar-notif-list">

                                {notifications.length ===
                                0 ? (

                                    <div className="navbar-notif-empty">
                                        No notifications
                                    </div>

                                ) : (

                                    notifications.map(
                                        (
                                            notification
                                        ) => (

                                            <div
                                                className={`navbar-notif-item ${
                                                    notification.read
                                                        ? "navbar-notif-item--read"
                                                        : ""
                                                }`}
                                                key={
                                                    notification.id
                                                }
                                            >

                                                {!notification.read && (
                                                    <span className="navbar-notif-dot" />
                                                )}

                                                <div className="navbar-notif-body">

                                                    <p className="navbar-notif-title">

                                                        {
                                                            notification.title
                                                        }

                                                    </p>

                                                    <p className="navbar-notif-detail">

                                                        {
                                                            notification.detail
                                                        }

                                                    </p>

                                                </div>

                                                <span className="navbar-notif-time">

                                                    {notification.createdAt
                                                        ? new Date(
                                                              notification.createdAt
                                                          ).toLocaleTimeString(
                                                              [],
                                                              {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit"
                                                              }
                                                          )
                                                        : ""}

                                                </span>

                                            </div>

                                        )
                                    )

                                )}

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