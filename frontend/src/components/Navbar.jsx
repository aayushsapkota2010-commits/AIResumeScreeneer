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
import "./Navbar.css";
import api from "../api/api";

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

    const notifications = [
        {
            id: 1,
            title: "New resume submitted",
            detail: "Priya Sharma applied for Frontend Engineer",
            time: "2m ago"
        },
        {
            id: 2,
            title: "ATS score ready",
            detail: "Scoring completed for 12 resumes",
            time: "1h ago"
        },
        {
            id: 3,
            title: "Pipeline update",
            detail: "3 candidates moved to Interview stage",
            time: "3h ago"
        }
    ];

    const initials = userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

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
                <Search
                    size={16}
                    className="navbar-search-icon"
                />

                <input
                    type="text"
                    placeholder="Search resumes..."
                    value={query}
                    onChange={(e) =>
                        setQuery(e.target.value)
                    }
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
                            setNotifOpen(
                                (prev) => !prev
                            );
                            setProfileOpen(false);
                        }}
                    >
                        <Bell size={18} />

                        <span className="navbar-badge" />
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
                                >
                                    Mark all read
                                </button>
                            </div>

                            <div className="navbar-notif-list">

                                {notifications.map(
                                    (notification) => (
                                        <div
                                            className="navbar-notif-item"
                                            key={
                                                notification.id
                                            }
                                        >
                                            <span className="navbar-notif-dot" />

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
                                                {
                                                    notification.time
                                                }
                                            </span>
                                        </div>
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
                            {initials || "U"}
                        </span>

                        <span className="navbar-profile-name">
                            {userName}
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
                                    {initials || "U"}
                                </span>

                                <div>
                                    <p className="navbar-profile-fullname">
                                        {userName}
                                    </p>

                                    <p className="navbar-profile-role">
                                        {userRole}
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