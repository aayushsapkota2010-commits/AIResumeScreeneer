import { useEffect, useState } from "react";
import api from "../api/api";
import "./AdminUsers.css";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================================
    // LOAD ALL USERS
    // ==========================================

    const loadUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get("/admin/users");

            console.log("Users received:", response.data);

            setUsers(response.data);

        } catch (err) {

            console.error("Failed to load users:", err);

            if (err.response) {

                console.error(
                    "Status:",
                    err.response.status
                );

                console.error(
                    "Response:",
                    err.response.data
                );

            }

            setError("Failed to load users.");

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD USERS WHEN PAGE OPENS
    // ==========================================

    useEffect(() => {

        loadUsers();

    }, []);


    // ==========================================
    // UPDATE USER ROLE
    // ==========================================

    const updateRole = async (id, role) => {

        try {

            console.log(
                "Updating user:",
                id,
                "to role:",
                role
            );

            const response = await api.put(

                `/admin/users/${id}/role`,

                {
                    role: role
                }

            );

            console.log(
                "Role update response:",
                response.data
            );

            // Reload users after successful update

            await loadUsers();

            alert(
                `User role changed to ${role} successfully.`
            );

        } catch (err) {

            console.error(
                "Failed to update role:",
                err
            );

            if (err.response) {

                console.error(
                    "Status:",
                    err.response.status
                );

                console.error(
                    "Response:",
                    err.response.data
                );

            }

            alert(
                "Failed to update user role."
            );

        }
    };


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (

            <div className="admin-users-page">

                <h1>
                    User Management
                </h1>

                <p>
                    Loading users...
                </p>

            </div>

        );

    }


    // ==========================================
    // ERROR STATE
    // ==========================================

    if (error) {

        return (

            <div className="admin-users-page">

                <h1>
                    User Management
                </h1>

                <p className="error-message">
                    {error}
                </p>

                <button
                    onClick={loadUsers}
                >
                    Retry
                </button>

            </div>

        );

    }


    // ==========================================
    // MAIN UI
    // ==========================================

    return (

        <div className="admin-users-page">

            <div className="admin-users-header">

                <div>

                    <p className="eyebrow">
                        ADMINISTRATION
                    </p>

                    <h1>
                        User Management
                    </h1>

                    <p>
                        Manage registered users and their roles.
                    </p>

                </div>

                <div className="user-count">

                    {users.length} Users

                </div>

            </div>


            <div className="users-table-container">

                <table className="users-table">

                    <thead>

                        <tr>

                            <th>
                                ID
                            </th>

                            <th>
                                Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Role
                            </th>

                            <th>
                                Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {users.map((user) => (

                            <tr
                                key={user.id}
                            >

                                <td>
                                    {user.id}
                                </td>


                                <td>
                                    {user.fullName}
                                </td>


                                <td>
                                    {user.email}
                                </td>


                                <td>

                                    <span
                                        className={
                                            user.role === "ADMIN"
                                                ? "role-admin"
                                                : "role-user"
                                        }
                                    >

                                        {user.role}

                                    </span>

                                </td>


                                <td>

                                    {user.role === "USER" ? (

                                        <button
                                            className="action-button"
                                            onClick={() =>
                                                updateRole(
                                                    user.id,
                                                    "ADMIN"
                                                )
                                            }
                                        >

                                            Make Admin

                                        </button>

                                    ) : (

                                        <button
                                            className="action-button"
                                            onClick={() =>
                                                updateRole(
                                                    user.id,
                                                    "USER"
                                                )
                                            }
                                        >

                                            Make User

                                        </button>

                                    )}

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>


                {users.length === 0 && (

                    <div className="empty-users">

                        No users found.

                    </div>

                )}

            </div>

        </div>

    );

}

export default AdminUsers;