import { useEffect, useMemo, useState } from "react";
import {
    Search,
    ShieldCheck,
    UserRound,
    Users as UsersIcon,
    RefreshCw,
    Inbox,
    AlertCircle,
    Loader2
} from "lucide-react";
import api from "../api/api";
import "./AdminUsers.css";

function getInitials(user) {
    const source = user.fullName || user.email || "?";

    const parts = source
        .split(/[\s@._-]+/)
        .filter(Boolean);

    if (parts.length === 0) return "?";

    return (
        parts[0].charAt(0) +
        (parts[1] ? parts[1].charAt(0) : "")
    ).toUpperCase();
}

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingId, setUpdatingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");

    // ==========================================
    // LOAD ALL USERS
    // ==========================================

    const loadUsers = async () => {

        try {

            const response = await api.get("/admin/users");

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

            setError("");

        } catch (err) {

            console.error("Failed to load users:", err);

            setError("Failed to load users.");

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        let active = true;

        api.get("/admin/users")
            .then((response) => {

                if (!active) return;

                setUsers(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

                setError("");

            })
            .catch((err) => {

                if (!active) return;

                console.error(
                    "Failed to load users:",
                    err
                );

                setError("Failed to load users.");

            })
            .finally(() => {

                if (!active) return;

                setLoading(false);

            });

        return () => {
            active = false;
        };

    }, []);


    // ==========================================
    // UPDATE USER ROLE
    // ==========================================

    const updateRole = async (id, role) => {

        try {

            setUpdatingId(id);

            await api.put(
                `/admin/users/${id}/role`,
                { role }
            );

            await loadUsers();

            alert(
                `User role changed to ${role} successfully.`
            );

        } catch (err) {

            console.error("Failed to update role:", err);

            alert("Failed to update user role.");

        } finally {

            setUpdatingId(null);

        }
    };


    // ==========================================
    // DERIVED DATA
    // ==========================================

    const stats = useMemo(() => {

        const admins = users.filter(
            (user) => user.role === "ADMIN"
        ).length;

        return {
            total: users.length,
            admins,
            candidates: users.length - admins
        };

    }, [users]);

    const filteredUsers = useMemo(() => {

        const query = searchTerm.trim().toLowerCase();

        return users.filter((user) => {

            const matchesRole =
                roleFilter === "ALL" ||
                (user.role || "").toUpperCase() === roleFilter;

            if (!matchesRole) return false;

            if (!query) return true;

            return (
                user.fullName?.toLowerCase().includes(query) ||
                user.email?.toLowerCase().includes(query) ||
                user.role?.toLowerCase().includes(query)
            );
        });

    }, [users, searchTerm, roleFilter]);


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (
            <div className="au-page">

                <header className="au-header">

                    <div>
                        <p className="au-eyebrow">Administration</p>
                        <h1 className="au-title">User Management</h1>
                        <p className="au-subtitle">
                            Manage registered users and their access
                            levels.
                        </p>
                    </div>

                </header>

                <div className="au-panel">

                    <div className="au-skeleton-toolbar">
                        <div className="au-skeleton-line" />
                        <div className="au-skeleton-line au-skeleton-line--short" />
                    </div>

                    {[0, 1, 2, 3, 4].map((row) => (
                        <div
                            key={row}
                            className="au-skeleton-row"
                        />
                    ))}

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {

        return (
            <div className="au-page">

                <header className="au-header">

                    <div>
                        <p className="au-eyebrow">Administration</p>
                        <h1 className="au-title">User Management</h1>
                    </div>

                </header>

                <div className="au-error-card">

                    <span className="au-error-icon">
                        <AlertCircle size={22} />
                    </span>

                    <h2>Something went wrong</h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="au-retry"
                        onClick={loadUsers}
                    >
                        <RefreshCw size={15} />
                        Retry
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="au-page">

            <header className="au-header">

                <div className="au-header-text">

                    <p className="au-eyebrow">Administration</p>

                    <h1 className="au-title">User Management</h1>

                    <p className="au-subtitle">
                        Manage registered users, review their access
                        level and promote trusted teammates.
                    </p>

                </div>

                <button
                    type="button"
                    className="au-refresh"
                    onClick={loadUsers}
                >
                    <RefreshCw size={15} />
                    Refresh
                </button>

            </header>


            {/* STATS */}

            <div className="au-stats">

                <div className="au-stat au-stat--indigo">
                    <span className="au-stat-icon">
                        <UsersIcon size={18} />
                    </span>
                    <div className="au-stat-text">
                        <span className="au-stat-value">
                            {stats.total}
                        </span>
                        <span className="au-stat-label">
                            Total users
                        </span>
                    </div>
                </div>

                <div className="au-stat au-stat--violet">
                    <span className="au-stat-icon">
                        <ShieldCheck size={18} />
                    </span>
                    <div className="au-stat-text">
                        <span className="au-stat-value">
                            {stats.admins}
                        </span>
                        <span className="au-stat-label">
                            Administrators
                        </span>
                    </div>
                </div>

                <div className="au-stat au-stat--sage">
                    <span className="au-stat-icon">
                        <UserRound size={18} />
                    </span>
                    <div className="au-stat-text">
                        <span className="au-stat-value">
                            {stats.candidates}
                        </span>
                        <span className="au-stat-label">
                            Candidates
                        </span>
                    </div>
                </div>

            </div>


            {/* PANEL */}

            <div className="au-panel">

                <div className="au-toolbar">

                    <div className="au-search">

                        <Search
                            size={16}
                            className="au-search-icon"
                        />

                        <input
                            type="text"
                            placeholder="Search by name, email or role..."
                            value={searchTerm}
                            onChange={(event) =>
                                setSearchTerm(event.target.value)
                            }
                        />

                    </div>

                    <div className="au-toolbar-right">

                        <span className="au-result-count">
                            {filteredUsers.length} of {users.length} users
                        </span>

                        <select
                            className="au-role-filter"
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(event.target.value)
                            }
                        >
                            <option value="ALL">All roles</option>
                            <option value="ADMIN">Admins</option>
                            <option value="USER">Candidates</option>
                        </select>

                    </div>

                </div>


                {filteredUsers.length === 0 ? (

                    <div className="au-empty">

                        <span className="au-empty-icon">
                            <Inbox size={24} />
                        </span>

                        <h3>No users found</h3>

                        <p>
                            Try adjusting your search or role filter.
                        </p>

                    </div>

                ) : (

                    <div className="au-table-wrap">

                        <table className="au-table">

                            <thead>

                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th className="au-th-right">
                                        Actions
                                    </th>
                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.map((user) => {

                                    const isAdmin =
                                        user.role === "ADMIN";

                                    const isUpdating =
                                        updatingId === user.id;

                                    return (

                                        <tr key={user.id}>

                                            <td>

                                                <div className="au-user-cell">

                                                    <div
                                                        className={`au-avatar ${
                                                            isAdmin
                                                                ? "au-avatar--admin"
                                                                : "au-avatar--user"
                                                        }`}
                                                    >
                                                        {getInitials(user)}
                                                    </div>

                                                    <div className="au-user-meta">

                                                        <span className="au-user-name">
                                                            {user.fullName ||
                                                                "Unnamed user"}
                                                        </span>

                                                        <span className="au-user-id">
                                                            ID #{user.id}
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>

                                            <td>

                                                <span
                                                    className="au-email"
                                                    title={user.email}
                                                >
                                                    {user.email || "—"}
                                                </span>

                                            </td>

                                            <td>

                                                <span
                                                    className={`au-role ${
                                                        isAdmin
                                                            ? "au-role--admin"
                                                            : "au-role--user"
                                                    }`}
                                                >
                                                    {isAdmin ? (
                                                        <ShieldCheck size={12} />
                                                    ) : (
                                                        <UserRound size={12} />
                                                    )}
                                                    {user.role}
                                                </span>

                                            </td>

                                            <td className="au-td-right">

                                                <button
                                                    type="button"
                                                    className={`au-action ${
                                                        isAdmin
                                                            ? "au-action--demote"
                                                            : "au-action--promote"
                                                    }`}
                                                    disabled={isUpdating}
                                                    onClick={() =>
                                                        updateRole(
                                                            user.id,
                                                            isAdmin
                                                                ? "USER"
                                                                : "ADMIN"
                                                        )
                                                    }
                                                >

                                                    {isUpdating ? (
                                                        <Loader2
                                                            size={14}
                                                            className="au-spin"
                                                        />
                                                    ) : isAdmin ? (
                                                        <UserRound size={14} />
                                                    ) : (
                                                        <ShieldCheck size={14} />
                                                    )}

                                                    {isUpdating
                                                        ? "Updating..."
                                                        : isAdmin
                                                          ? "Make user"
                                                          : "Make admin"}

                                                </button>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}

export default AdminUsers;
