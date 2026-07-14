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
    ChevronsLeft,
    ChevronsRight,
    LogOut
} from "lucide-react";
import "./Sidebar.css";

const NAV_GROUPS = [
    {
        label: "Main",
        items: [
            { to: "/dashboard", label: "Dashboard", icon: LayoutGrid },
            { to: "/upload", label: "Upload Resume", icon: UploadCloud },
            { to: "/resumes", label: "Resume Library", icon: FolderOpen }
        ]
    },
    {
        label: "Recruitment",
        items: [
            { to: "/candidates", label: "Candidates", icon: Users },
              { to: "/interviews", label: "Interviews", icon: CalendarDays },
            { to: "/jobs", label: "Job Posts", icon: Briefcase },
            { to: "/pipeline", label: "Pipeline", icon: GitBranch },
            { to: "/analytics", label: "Analytics", icon: BarChart3 }
        ]
    },
    {
        label: "Admin",
        items: [
            { to: "/users", label: "Users", icon: UserCog },
            { to: "/settings", label: "Settings", icon: Settings }
        ]
    }
];

function Sidebar() {
    const [collapsed, setCollapsed] = useState(() => {
        return localStorage.getItem("sidebar-collapsed") === "true";
    });
    const location = useLocation();
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, opacity: 0 });

    useEffect(() => {
        localStorage.setItem("sidebar-collapsed", collapsed);
    }, [collapsed]);

    useEffect(() => {
        const activeEl = navRef.current?.querySelector(
            ".sidebar-link--active"
        );
        if (activeEl) {
            const navTop = navRef.current.getBoundingClientRect().top;
            const elTop = activeEl.getBoundingClientRect().top;
            setIndicatorStyle({
                top: elTop - navTop,
                height: activeEl.offsetHeight,
                opacity: 1
            });
        } else {
            setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
        }
    }, [location.pathname, collapsed]);

    return (
        <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>
            <div className="sidebar-glass" />

            <div className="sidebar-top">
                <div className="sidebar-brand">
                    <div className="sidebar-logo">AI</div>
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

            <nav className="sidebar-nav" ref={navRef}>
                <div
                    className="sidebar-active-indicator"
                    style={{
                        transform: `translateY(${indicatorStyle.top}px)`,
                        height: indicatorStyle.height,
                        opacity: indicatorStyle.opacity
                    }}
                />

                {NAV_GROUPS.map((group) => (
                    <div className="sidebar-group" key={group.label}>
                        {!collapsed && (
                            <span className="sidebar-group-label">
                                {group.label}
                            </span>
                        )}
                        {collapsed && <div className="sidebar-group-rule" />}

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
                                        <Icon size={18} strokeWidth={2} />
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
                <div className="sidebar-user" data-tooltip="Aayush · Administrator">
                    <div className="sidebar-avatar">AY</div>
                    {!collapsed && (
                        <div className="sidebar-user-meta">
                            <span className="sidebar-user-name">Aayush</span>
                            <span className="sidebar-user-role">
                                Administrator
                            </span>
                        </div>
                    )}
                    {!collapsed && (
                        <button
                            type="button"
                            className="sidebar-logout"
                            aria-label="Log out"
                            data-tooltip="Log out"
                        >
                            <LogOut size={16} strokeWidth={2} />
                        </button>
                    )}
                </div>

                <button
                    type="button"
                    className="sidebar-toggle"
                    onClick={() => setCollapsed((prev) => !prev)}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    data-tooltip={collapsed ? "Expand" : "Collapse"}
                >
                    {collapsed ? (
                        <ChevronsRight size={16} strokeWidth={2} />
                    ) : (
                        <ChevronsLeft size={16} strokeWidth={2} />
                    )}
                    {!collapsed && <span>Collapse</span>}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
