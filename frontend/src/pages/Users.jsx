import { useEffect, useState } from "react";
import api from "../api/api";
import {
    Search,
    UserRound,
    ShieldCheck,
    Trash2,
    RefreshCw
} from "lucide-react";
import "./Users.css";

function Users() {

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/user/all");

            setUsers(response.data);

        } catch (err) {

            console.error("Failed to fetch users:", err);

            setError("Failed to load users.");

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchUsers();

    }, []);

    const filteredUsers = users.filter((user) => {

        const query = searchTerm.toLowerCase();

        return (
            user.fullName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.role?.toLowerCase().includes(query)
        );

    });

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(`/user/${id}`);

            alert("User deleted successfully.");

            fetchUsers();

        } catch (err) {

            console.error("Delete failed:", err);

            alert("Failed to delete user.");

        }

    };

    if (loading) {

        return (
            <div className="users-page">

                <div className="users-loading">

                    <div className="users-spinner"></div>

                    <p>Loading users...</p>

                </div>

            </div>
        );

    }

    return (

        <div className="users-page">

            {/* HEADER */}

            <div className="users-header">

                <div>

                    <p className="users-eyebrow">
                        ADMINISTRATION
                    </p>

                    <h1>
                        Users
                    </h1>

                    <p className="users-subtitle">
                        Manage users and their access to the recruitment platform.
                    </p>

                </div>

                <button
                    className="users-refresh-btn"
                    onClick={fetchUsers}
                >

                    <RefreshCw size={16} />

                    Refresh

                </button>

            </div>


            {/* SUMMARY */}

            <div className="users-summary">

                <div className="users-summary-card">

                    <div className="users-summary-icon">

                        <UserRound size={20} />

                    </div>

                    <div>

                        <span className="users-summary-number">
                            {users.length}
                        </span>

                        <span className="users-summary-label">
                            Total Users
                        </span>

                    </div>

                </div>


                <div className="users-summary-card">

                    <div className="users-summary-icon">

                        <ShieldCheck size={20} />

                    </div>

                    <div>

                        <span className="users-summary-number">

                            {
                                users.filter(
                                    user =>
                                        user.role?.toUpperCase() === "ADMIN"
                                ).length
                            }

                        </span>

                        <span className="users-summary-label">
                            Administrators
                        </span>

                    </div>

                </div>

            </div>


            {/* TOOLBAR */}

            <div className="users-toolbar">

                <div className="users-search">

                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(e.target.value)
                        }
                    />

                </div>

                <span className="users-count">

                    {filteredUsers.length} user
                    {filteredUsers.length !== 1 ? "s" : ""}

                </span>

            </div>


            {/* ERROR */}

            {error && (

                <div className="users-error">

                    <p>{error}</p>

                    <button onClick={fetchUsers}>
                        Try Again
                    </button>

                </div>

            )}


            {/* USERS TABLE */}

            {!error && (

                <div className="users-table-card">

                    <table className="users-table">

                        <thead>

                            <tr>

                                <th>User</th>

                                <th>Email</th>

                                <th>Role</th>

                                <th>Account ID</th>

                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredUsers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="users-empty"
                                    >

                                        <UserRound size={30} />

                                        <p>
                                            No users found.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        {/* USER */}

                                        <td>

                                            <div className="user-info">

                                                <div className="user-avatar">

                                                    {user.fullName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() || "U"}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {user.fullName || "Unnamed User"}
                                                    </strong>

                                                    <span>
                                                        User
                                                    </span>

                                                </div>

                                            </div>

                                        </td>


                                        {/* EMAIL */}

                                        <td>

                                            <span className="user-email">

                                                {user.email}

                                            </span>

                                        </td>


                                        {/* ROLE */}

                                        <td>

                                            <span
                                                className={`user-role ${
                                                    user.role?.toLowerCase()
                                                }`}
                                            >

                                                <ShieldCheck size={14} />

                                                {user.role || "USER"}

                                            </span>

                                        </td>


                                        {/* ID */}

                                        <td>

                                            <span className="user-id">

                                                #{user.id}

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <button
                                                className="user-delete-btn"
                                                onClick={() =>
                                                    handleDelete(user.id)
                                                }
                                                title="Delete user"
                                            >

                                                <Trash2 size={16} />

                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default Users;