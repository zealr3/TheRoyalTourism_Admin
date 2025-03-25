import React, { useEffect, useState } from "react";
import axios from "axios";
import '../Dashboard.css';  // Import CSS file for styling

const Dashboard = () => {
    const [userCount, setUserCount] = useState(0);
    const [totalDestinations, setTotalDestinations] = useState(0);
    const [domesticCount, setDomesticCount] = useState(0);
    const [internationalCount, setInternationalCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch User Count
                const userResponse = await axios.get("http://localhost:5000/api/users");  // Update this URL
                setUserCount(userResponse.data.length);  // Assuming it returns an array of users

                // Fetch Destination Counts
                const destinationResponse = await axios.get("http://localhost:5000/api/destinations/counts");  // Correct URL
                const { total, domestic, international } = destinationResponse.data;

                setTotalDestinations(total);
                setDomesticCount(domestic);
                setInternationalCount(international);

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            <div className="card-container">
                <div className="card">
                    <h2>Total Users</h2>
                    <p>{userCount}</p>
                </div>
                <div className="card">
                    <h2>Total Destinations</h2>
                    <p>{totalDestinations}</p>
                </div>
                <div className="card">
                    <h2>Domestic Destinations</h2>
                    <p>{domesticCount}</p>
                </div>
                <div className="card">
                    <h2>International Destinations</h2>
                    <p>{internationalCount}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
