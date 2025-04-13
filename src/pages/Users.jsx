import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const response = await axios.get("http://localhost:5000/api/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Fetch users error:", err.response?.data || err.message);
                setError(err.response?.data?.error || err.message || "Failed to fetch users.");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="text-center text-gray-700 text-xl mt-10">Loading...</div>;
    if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Users</h1>
            <div className="overflow-x-auto">
                <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-blue-500 text-black">
                        <tr>
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Full Name</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-200 transition">
                                <td className="py-3 px-4">{user.id}</td>
                                <td className="py-3 px-4">{user.fullname}</td>
                                <td className="py-3 px-4">{user.email}</td>
                                <td className="py-3 px-4">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Users;
