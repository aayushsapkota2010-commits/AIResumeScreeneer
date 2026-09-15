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
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
    const [userRole, setUserRole] = useState(
        localStorage.getItem("role") || ""
    );

    const notifRef = useRef(null);
    const profileRef = useRef(null);

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

    useEffect(() => {
        const loadNavbarProfile = async () => {
            try {
                const response = await api.get("/user/profile");

                const fullName = response.data?.fullName;
                const role = response.data?.role;

                if (fullName) {
                    setUserName(fullName);
                    localStorage.setItem("name", fullName);
                }

                if (role) {
                    setUserRole(role);
                    localStorage.setItem("role", role);
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

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target)
            ) {
                setNotifOpen(false);
            }

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
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

    useEffect(() => {
    if (!userName) {
        return;
    }

    const email =
        localStorage.getItem("email") || "aayush@gmail.com";

    const loadNotifications = async () => {
        try {
            const response =
                await api.get(
                    `/notifications?email=${encodeURIComponent(email)}`
                );

            setNotifications(response.data);

            const unread =
                response.data.filter(
                    (notification) =>
                        !notification.read
                ).length;

            setUnreadCount(unread);

        } catch (error) {
            console.error(
                "Failed to load notifications:",
                error
            );
        }
    };

    loadNotifications();
}, [userName]);


useEffect(() => {
    const email =
        localStorage.getItem("email") || "aayush@gmail.com";

    if (!email) {
        return;
    }

    let controller = new AbortController();

    const connectNotifications = async () => {
        try {

            const token =
                localStorage.getItem("token");

            const response =
                await fetch(
                    `${import.meta.env.VITE_API_URL}/notifications/stream?email=${encodeURIComponent(email)}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        },
                        signal: controller.signal
                    }
                );

            if (!response.ok) {
                throw new Error(
                    `Notification stream failed: ${response.status}`
                );
            }

            const reader =
                response.body.getReader();

            const decoder =
                new TextDecoder();

            let buffer = "";

            while (true) {

                const {
                    value,
                    done
                } = await reader.read();

                if (done) {
                    break;
                }

                buffer +=
                    decoder.decode(
                        value,
                        {
                            stream: true
                        }
                    );

                const events =
                    buffer.split("\n\n");

                buffer =
                    events.pop() || "";

                for (const event of events) {

                    const lines =
                        event.split("\n");

                    let eventName = "";
                    let data = "";

                    for (const line of lines) {

                        if (
                            line.startsWith("event:")
                        ) {
                            eventName =
                                line
                                    .substring(6)
                                    .trim();
                        }

                        if (
                            line.startsWith("data:")
                        ) {
                            data +=
                                line
                                    .substring(5)
                                    .trim();
                        }
                    }

                    if (
                        eventName ===
                        "notification" &&
                        data
                    ) {

                        const notification =
                            JSON.parse(data);

                        setNotifications(
                            (previous) => [
                                notification,
                                ...previous
                            ]
                        );

                        setUnreadCount(
                            (previous) =>
                                previous + 1
                        );
                    }
                }
            }

        } catch (error) {

            if (
                error.name !==
                "AbortError"
            ) {
                console.error(
                    "Notification stream error:",
                    error
                );
            }
        }
    };

    connectNotifications();

    return () => {
        controller.abort();
    };

}, []);

    const initials = userName
        ? userName
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((word) => word[0])
              .join("")
              .toUpperCase()
        : "U";

    const handleSearch = () => {
        const searchValue = query.trim();

        if (!searchValue) {
            navigate("/search");
            return;
        }

        navigate(
            `/search?query=${encodeURIComponent(searchValue)}`
        );
    };

    const handleSearchKeyDown = (event) => {
        if (event.key === "Enter") {
            handleSearch();
        }
    };

    const handleMyProfile = () => {
        setProfileOpen(false);
        navigate("/profile");
    };

    const handleAccountSettings = () => {
        setProfileOpen(false);
        navigate("/settings");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("name");

        setProfileOpen(false);
        setNotifOpen(false);

        navigate("/login", {
            replace: true
        });
    };

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
                        setQuery(event.target.value)
                    }
                    onKeyDown={handleSearchKeyDown}
                />

                <kbd className="navbar-search-kbd">
                    ⌘K
                </kbd>

            </div>

            <div className="navbar-right">

                <div
                    className="navbar-popover"
                    ref={notifRef}
                >
                    <button
    type="button"
    className="navbar-icon-btn"
    aria-label="Notifications"
    onClick={() => {
        setNotifOpen((prev) => !prev);
        setProfileOpen(false);
    }}
>
    <Bell size={18} />

    {unreadCount > 0 && (
        <span className="navbar-badge">
            {unreadCount > 99
                ? "99+"
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

                              <button
    type="button"
    className="navbar-link-btn"
    onClick={async () => {
        try {

            const email =
                localStorage.getItem("email")
                || "aayush@gmail.com";

            await api.post(
                `/notifications/read-all?email=${encodeURIComponent(email)}`
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

            setUnreadCount(0);

        } catch (error) {
            console.error(
                "Failed to mark notifications as read:",
                error
            );
        }
    }}
>
    Mark all read
</button>
                            </div>

                            <div className="navbar-notif-list">

                                {notifications.length === 0 ? (
    <div className="navbar-notif-empty">
        No notifications
    </div>
) : (
    notifications.map(
        (notification) => (
            <div
                className={`navbar-notif-item ${
                    notification.read
                        ? "navbar-notif-item--read"
                        : ""
                }`}
                key={notification.id}
            >

                {!notification.read && (
                    <span className="navbar-notif-dot" />
                )}

                <div className="navbar-notif-body">

                    <p className="navbar-notif-title">
                        {notification.title}
                    </p>

                    <p className="navbar-notif-detail">
                        {notification.message}
                    </p>

                </div>

                <span className="navbar-notif-time">
                    {new Date(
                        notification.createdAt
                    ).toLocaleTimeString(
                        [],
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    )}
                </span>

            </div>
        )
    )
)}

                            </div>

                        </div>
                    )}
                </div>

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
                            (prev) => !prev
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

                <div
                    className="navbar-popover"
                    ref={profileRef}
                >

                    <button
                        type="button"
                        className="navbar-profile-btn"
                        onClick={() => {
                            setProfileOpen(
                                (prev) => !prev
                            );
                            setNotifOpen(false);
                        }}
                    >
                        <span className="navbar-avatar">
                            {initials}
                        </span>

                        <span className="navbar-profile-name">
                            {userName || "User"}
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
                                        {userName || "User"}
                                    </p>

                                    <p className="navbar-profile-role">
                                        {userRole || "User"}
                                    </p>
                                </div>

                            </div>

                            <div className="navbar-dropdown-divider" />

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={handleMyProfile}
                            >
                                <User size={15} />
                                <span>
                                    My Profile
                                </span>
                            </button>

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={handleAccountSettings}
                            >
                                <SettingsIcon size={15} />
                                <span>
                                    Account Settings
                                </span>
                            </button>

                            <div className="navbar-dropdown-divider" />

                            <button
                                type="button"
                                className="navbar-dropdown-item navbar-dropdown-item--danger"
                                onClick={handleLogout}
                            >
                                <LogOut size={15} />
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