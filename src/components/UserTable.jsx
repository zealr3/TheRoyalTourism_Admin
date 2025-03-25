import React, { useEffect, useState } from "react";
import axios from "axios";

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/users");
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching users:", error);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div>Loading users...</div>;

    return (
        <div>
            <h2>Total Users: {users.length}</h2>
            <table style={{ borderCollapse: "collapse", width: "100%", marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th style={tableHeaderStyle}>No.</th>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Full Name</th>
                        <th style={tableHeaderStyle}>Email</th>
                        <th style={tableHeaderStyle}>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.id}>
                            <td style={tableCellStyle}>{index + 1}</td> {/* Sequential Numbering */}
                            <td style={tableCellStyle}>{user.id}</td> {/* Actual User ID */}
                            <td style={tableCellStyle}>{user.fullname}</td>
                            <td style={tableCellStyle}>{user.email}</td>
                            <td style={tableCellStyle}>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const tableHeaderStyle = {
    backgroundColor: "#f2f2f2",
    padding: "10px",
    border: "1px solid #ddd",
};

const tableCellStyle = {
    padding: "10px",
    border: "1px solid #ddd",
};

export default UserTable;
