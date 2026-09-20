import { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    LayoutGrid,
    UploadCloud,
    FolderOpen,
    Users,
    Briefcase,
    GitBranch,
    BarChart3,
    CalendarDays,
    UserCog,
    Settings,
    Bell,
    FileText,
    ChevronsLeft,
    ChevronsRight,
    LogOut
} from "lucide-react";
import "./Sidebar.css";

const ADMIN_NAV_GROUPS = [
    {
        label: "Main",
        items: [
            {
                to: "/dashboard",
                label: "Dashboard",
                icon: LayoutGrid
            },
            {
                to: "/upload",
                label: "Upload Resume",
                icon: UploadCloud
            },
            {
                to: "/resumes",
                label: "Resume Library",
                icon: FolderOpen
            }
        ]
    },
    {
        label: "Recruitment",
        items: [
            {
                to: "/candidates",
                label: "Candidates",
                icon: Users
            },
            {
                to: "/interviews",
                label: "Interviews",
                icon: CalendarDays
            },
            {
                to: "/jobs",
                label: "Job Posts",
                icon: Briefcase
            },
            {
                to: "/pipeline",
                label: "Pipeline",
                icon: GitBranch
            },
            {
                to: "/analytics",
                label: "Analytics",
                icon: BarChart3
            }
        ]
    },
    {
        label: "Admin",
        items: [
            {
                to: "/users",
                label: "Users",
                icon: UserCog
            },
            {
                to: "/settings",
                label: "Settings",
                icon: Settings
            }
        ]
    }
];

const USER_NAV_GROUPS = [
    {
        label: "Main",
        items: [
            {
                to: "/candidate-dashboard",
                label: "Dashboard",
                icon: LayoutGrid
            },
            {
                to: "/browse-jobs",
                label: "Browse Jobs",
                icon: Briefcase
            },
            {
                to: "/my-applications",
                label: "My Applications",
                icon: FileText
            },
            {
                to: "/my-resumes",
                label: "My Resumes",
                icon: FolderOpen
            }
        ]
    },
    {
        label: "Activity",
        items: [
            {
                to: "/interviews",
                label: "Interviews",
                icon: CalendarDays
            },
            {
                to: "/notifications",
                label: "Notifications",
                icon: Bell
            }
        ]
    },
    {
        label: "Account",
        items: [
            {
                to: "/profile",
                label: "Profile",
                icon: UserCog
            },
            {
                to: "/settings",
                label: "Settings",
                icon: Settings
            }
        ]
    }
];

function Sidebar() {
    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem("sidebar-collapsed") === "true";
    });

    const [userRole, setUserRole] = useState(
        localStorage.getItem("role") || "USER"
    );

    const [userName, setUserName] = useState(
        localStorage.getItem("name") || "User"
    );

    const location = useLocation();
    const navRef = useRef(null);

    const [indicatorStyle, setIndicatorStyle] = useState({
        top: 0,
        height: 0,
        opacity: 0
    });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", collapsed);
    }, [collapsed]);

    /*
     * Read the role/name again whenever the route changes.
     * This helps when the user logs in without refreshing the browser.
     */
    useEffect(() => {
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");

        if (role) {
            setUserRole(role.toUpperCase());
        }

        if (name) {
            setUserName(name);
        }
    }, [location.pathname]);

    /*
     * Also listen for storage changes.
     */
    useEffect(() => {
        const handleStorageChange = () => {
            const role = localStorage.getItem("role");
            const name = localStorage.getItem("name");

            setUserRole(role ? role.toUpperCase() : "USER");
            setUserName(name || "User");
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener(
                "storage",
                handleStorageChange
            );
        };
    }, []);

    useEffect(() => {
        const activeEl =
            navRef.current?.querySelector(
                ".sidebar-link--active"
            );

        if (activeEl) {
            const navTop =
                navRef.current.getBoundingClientRect().top;

            const elTop =
                activeEl.getBoundingClientRect().top;

            setIndicatorStyle({
                top: elTop - navTop,
                height: activeEl.offsetHeight,
                opacity: 1
            });
        } else {
            setIndicatorStyle((prev) => ({
                ...prev,
                opacity: 0
            }));
        }
    }, [
        location.pathname,
        collapsed,
        userRole
    ]);

    const navGroups =
        userRole === "ADMIN"
            ? ADMIN_NAV_GROUPS
            : USER_NAV_GROUPS;

    const displayRole =
        userRole === "ADMIN"
            ? "Administrator"
            : "Candidate";

    const initials =
        userName
            ?.split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase() || "US";

    return (
        <aside
            className={`sidebar ${
                collapsed
                    ? "sidebar--collapsed"
                    : ""
            }`}
        >
            <div className="sidebar-glass" />

            <div className="sidebar-top">

                <div className="sidebar-brand">

                    <div className="sidebar-logo">
                        AI
                    </div>

                    <div className="sidebar-brand-text">

                        <span className="sidebar-brand-name">
                            AI Resume Screener
                        </span>

                        <span className="sidebar-brand-tag">
                            Recruitment Intelligence
                        </span>

                    </div>

                </div>

            </div>

            <nav
                className="sidebar-nav"
                ref={navRef}
            >

                <div
                    className="sidebar-active-indicator"
                    style={{
                        transform: `translateY(${indicatorStyle.top}px)`,
                        height: indicatorStyle.height,
                        opacity: indicatorStyle.opacity
                    }}
                />

                {navGroups.map((group) => (

                    <div
                        className="sidebar-group"
                        key={group.label}
                    >

                        {!collapsed && (
                            <span className="sidebar-group-label">
                                {group.label}
                            </span>
                        )}

                        {collapsed && (
                            <div className="sidebar-group-rule" />
                        )}

                        {group.items.map((item) => {

                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        `sidebar-link ${
                                            isActive
                                                ? "sidebar-link--active"
                                                : ""
                                        }`
                                    }
                                    data-tooltip={item.label}
                                >

                                    <span className="sidebar-link-icon">
                                        <Icon
                                            size={18}
                                            strokeWidth={2}
                                        />
                                    </span>

                                    {!collapsed && (
                                        <span className="sidebar-link-label">
                                            {item.label}
                                        </span>
                                    )}

                                </NavLink>
                            );
                        })}

                    </div>

                ))}

            </nav>

            <div className="sidebar-bottom">

                <div
                    className="sidebar-user"
                    data-tooltip={`${userName} · ${displayRole}`}
                >

                    <div className="sidebar-avatar">
                        {initials}
                    </div>

                    {!collapsed && (
                        <div className="sidebar-user-meta">

                            <span className="sidebar-user-name">
                                {userName}
                            </span>

                            <span className="sidebar-user-role">
                                {displayRole}
                            </span>

                        </div>
                    )}

                    {!collapsed && (
                        <button
                            type="button"
                            className="sidebar-logout"
                            aria-label="Log out"
                            data-tooltip="Log out"
                            onClick={() => {
                                localStorage.removeItem("token");
                                localStorage.removeItem("role");
                                localStorage.removeItem("name");

                                window.location.href =
                                    "/login";
                            }}
                        >

                            <LogOut
                                size={16}
                                strokeWidth={2}
                            />

                        </button>
                    )}

                </div>

                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={() =>
                        setCollapsed(
                            (prev) => !prev
                        )
                    }
                    aria-label={
                        collapsed
                            ? "Expand sidebar"
                            : "Collapse sidebar"
                    }
                    data-tooltip={
                        collapsed
                            ? "Expand"
                            : "Collapse"
                    }
                >

                    {collapsed ? (
                        <ChevronsRight
                            size={16}
                            strokeWidth={2}
                        />
                    ) : (
                        <ChevronsLeft
                            size={16}
                            strokeWidth={2}
                        />
                    )}

                    {!collapsed && (
                        <span>
                            Collapse
                        </span>
                    )}

                </button>

            </div>

        </aside>
    );
}

export default Sidebar;