import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users");
                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users.");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const promoteToAdmin = async (userId) => {
        try {
            const loggedInUser = JSON.parse(localStorage.getItem("user"));  // Get the logged-in user info

            if (!loggedInUser || loggedInUser.role !== 'admin') {
                setMessage("You must be logged in as an admin to perform this action.");
                return;
            }

            const response = await axios.put(
                "http://localhost:5000/api/users/promote",
                { targetUserId: userId },
                { headers: { Authorization: `Bearer ${loggedInUser.token}` } }  // Include token for authentication
            );

            setMessage(response.data.message);
            setUsers(users.map(user => user.id === userId ? { ...user, role: 'admin' } : user));
        } catch (err) {
            console.error(err);
            setMessage("Failed to promote user to admin.");
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Users</h1>
            {message && <div>{message}</div>}
            <table border="1" style={{ width: "100%", textAlign: "left" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.fullname}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.role !== 'admin' && (
                                    <button onClick={() => promoteToAdmin(user.id)}>Promote to Admin</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;
