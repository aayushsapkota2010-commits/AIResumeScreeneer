import { useState, useEffect, useRef } from "react";
import {
    Search,
    Bell,
    Moon,
    Sun,
    ChevronDown,
    User,
    Settings,
    LogOut
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import api from "../api/api";

import "./Navbar.css";


function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    // ==============================
    // SEARCH
    // ==============================

    const [query, setQuery] = useState("");


    // ==============================
    // THEME
    // ==============================

    const [isDark, setIsDark] = useState(() => {

        return localStorage.getItem("theme") === "dark";

    });


    // ==============================
    // DROPDOWNS
    // ==============================

    const [notifOpen, setNotifOpen] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);


    // ==============================
    // USER
    // ==============================

    const [user, setUser] = useState({

        fullName: "Aayush",

        email: "",

        role: "USER"

    });


    const [loadingUser, setLoadingUser] = useState(true);


    // ==============================
    // NOTIFICATIONS
    // ==============================

    const [notifications, setNotifications] = useState([

        {
            id: 1,
            title: "New resume submitted",
            detail: "Priya Sharma applied for Frontend Engineer",
            time: "2m ago",
            read: false
        },

        {
            id: 2,
            title: "ATS score ready",
            detail: "Scoring completed for 12 resumes",
            time: "1h ago",
            read: false
        },

        {
            id: 3,
            title: "Pipeline update",
            detail: "3 candidates moved to Interview stage",
            time: "3h ago",
            read: false
        }

    ]);


    // ==============================
    // REFS
    // ==============================

    const notifRef = useRef(null);

    const profileRef = useRef(null);


    // ==============================
    // LOAD USER PROFILE
    // ==============================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoadingUser(true);

                const response =
                    await api.get("/user/profile");

                console.log(
                    "Navbar user:",
                    response.data
                );

                setUser({

                    fullName:
                        response.data.fullName ||
                        "User",

                    email:
                        response.data.email ||
                        "",

                    role:
                        response.data.role ||
                        "USER"

                });

            }

            catch (err) {

                console.error(
                    "Failed to load navbar profile:",
                    err
                );

            }

            finally {

                setLoadingUser(false);

            }

        };


        if (localStorage.getItem("token")) {

            loadProfile();

        }

        else {

            setLoadingUser(false);

        }

    }, []);


    // ==============================
    // DARK MODE
    // ==============================

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


    // ==============================
    // CLOSE DROPDOWNS
    // ==============================

    useEffect(() => {

        function handleClickOutside(e) {

            if (
                notifRef.current &&
                !notifRef.current.contains(e.target)
            ) {

                setNotifOpen(false);

            }


            if (
                profileRef.current &&
                !profileRef.current.contains(e.target)
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


    // ==============================
    // PAGE TITLE
    // ==============================

    const getPageTitle = () => {

        const path = location.pathname;


        if (path === "/dashboard")
            return "Dashboard";


        if (path === "/candidates")
            return "Candidates";


        if (path === "/jobs")
            return "Job Posts";


        if (path === "/analytics")
            return "Analytics";


        if (path === "/users")
            return "Users";


        if (path === "/settings")
            return "Settings";


        if (path === "/interviews")
            return "Interviews";


        if (path === "/pipeline")
            return "Pipeline";


        if (path === "/kanban")
            return "Kanban";


        if (path === "/search")
            return "Search";


        if (path === "/resumes")
            return "Resumes";


        if (path === "/upload")
            return "Upload Resume";


        if (path === "/activity-feed")
            return "Activity";


        if (path === "/candidate-dashboard")
            return "Candidate Dashboard";


        if (path.startsWith("/candidate/"))
            return "Candidate Profile";


        if (path.startsWith("/resume/"))
            return "Resume Details";


        return "Dashboard";

    };


    // ==============================
    // SEARCH SUBMIT
    // ==============================

    const handleSearch = (e) => {

        if (e.key === "Enter") {

            const value =
                query.trim();


            if (!value) {

                return;

            }


            navigate(
                `/search?q=${encodeURIComponent(value)}`
            );

        }

    };


    // ==============================
    // NOTIFICATIONS
    // ==============================

    const unreadCount =
        notifications.filter(
            (notification) =>
                !notification.read
        ).length;


    const markAllRead = () => {

        setNotifications(
            notifications.map(
                (notification) => ({

                    ...notification,

                    read: true

                })
            )
        );

    };


    // ==============================
    // PROFILE
    // ==============================

    const getInitials = (name) => {

        if (!name) return "U";


        const parts =
            name.trim().split(" ");


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    };


    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setProfileOpen(false);

        navigate("/login");

    };


    // ==============================
    // PROFILE CLICK
    // ==============================

    const handleProfile = () => {

        setProfileOpen(false);

        navigate("/settings");

    };


    // ==============================
    // SETTINGS CLICK
    // ==============================

    const handleSettings = () => {

        setProfileOpen(false);

        navigate("/settings");

    };


    return (

        <header className="navbar">

            {/* ================================= */}
            {/* LEFT */}
            {/* ================================= */}

            <div className="navbar-left">

                <h1 className="navbar-title">

                    {getPageTitle()}

                </h1>

            </div>


            {/* ================================= */}
            {/* SEARCH */}
            {/* ================================= */}

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
                    onKeyDown={handleSearch}
                />

                <kbd className="navbar-search-kbd">
                    ⌘K
                </kbd>

            </div>


            {/* ================================= */}
            {/* RIGHT */}
            {/* ================================= */}

            <div className="navbar-right">


                {/* ================================= */}
                {/* NOTIFICATIONS */}
                {/* ================================= */}

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

                        {unreadCount > 0 && (

                            <span className="navbar-badge">
                                {unreadCount}
                            </span>

                        )}

                    </button>


                    {notifOpen && (

                        <div className="navbar-dropdown navbar-dropdown--notif">


                            {/* HEADER */}

                            <div className="navbar-dropdown-header">

                                <span>
                                    Notifications
                                </span>


                                {unreadCount > 0 && (

                                    <button
                                        type="button"
                                        className="navbar-link-btn"
                                        onClick={
                                            markAllRead
                                        }
                                    >
                                        Mark all read
                                    </button>

                                )}

                            </div>


                            {/* NOTIFICATIONS */}

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

                                                    {
                                                        notification.time
                                                    }

                                                </span>

                                            </div>

                                        )
                                    )

                                )}

                            </div>

                        </div>

                    )}

                </div>


                {/* ================================= */}
                {/* THEME */}
                {/* ================================= */}

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


                {/* ================================= */}
                {/* PROFILE */}
                {/* ================================= */}

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

                            {getInitials(
                                user.fullName
                            )}

                        </span>


                        <span className="navbar-profile-name">

                            {loadingUser
                                ? "Loading..."
                                : user.fullName}

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


                            {/* PROFILE HEADER */}

                            <div className="navbar-dropdown-profile-head">

                                <span className="navbar-avatar navbar-avatar--lg">

                                    {getInitials(
                                        user.fullName
                                    )}

                                </span>


                                <div>

                                    <p className="navbar-profile-fullname">

                                        {user.fullName}

                                    </p>


                                    <p className="navbar-profile-role">

                                        {user.role === "ADMIN"
                                            ? "Administrator"
                                            : "User"}

                                    </p>

                                </div>

                            </div>


                            <div className="navbar-dropdown-divider" />


                            {/* MY PROFILE */}

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={
                                    handleProfile
                                }
                            >

                                <User size={15} />

                                <span>
                                    My Profile
                                </span>

                            </button>


                            {/* SETTINGS */}

                            <button
                                type="button"
                                className="navbar-dropdown-item"
                                onClick={
                                    handleSettings
                                }
                            >

                                <Settings size={15} />

                                <span>
                                    Account Settings
                                </span>

                            </button>


                            <div className="navbar-dropdown-divider" />


                            {/* LOGOUT */}

                            <button
                                type="button"
                                className="navbar-dropdown-item navbar-dropdown-item--danger"
                                onClick={
                                    handleLogout
                                }
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