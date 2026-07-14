import { useEffect, useState } from "react";
import api from "../api/api";

function AdminUsers() {

    const [users, setUsers] =
        useState([]);

    const loadUsers = async () => {

        const response =
            await api.get(
                "/admin/users"
            );

        setUsers(response.data);
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const updateRole = async (
        id,
        role
    ) => {

        await api.put(
            `/admin/users/${id}/role`,
            {
                role
            }
        );

        loadUsers();
    };

    return (

        <div>

            <h1>
                User Management
            </h1>

            <table border="1">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>

                </thead>

                <tbody>

                    {
                        users.map(user => (

                            <tr key={user.id}>

                                <td>{user.id}</td>

                                <td>
                                    {user.fullName}
                                </td>

                                <td>
                                    {user.email}
                                </td>

                                <td>
                                    {user.role}
                                </td>

                                <td>

                                    {
                                        user.role ===
                                        "USER"

                                        ?

                                        <button
                                            onClick={() =>
                                                updateRole(
                                                    user.id,
                                                    "ADMIN"
                                                )
                                            }
                                        >
                                            Make Admin
                                        </button>

                                        :

                                        <button
                                            onClick={() =>
                                                updateRole(
                                                    user.id,
                                                    "USER"
                                                )
                                            }
                                        >
                                            Make User
                                        </button>
                                    }

                                </td>

                            </tr>

                        ))
                    }

                </tbody>

            </table>

        </div>
    );
}

export default AdminUsers;