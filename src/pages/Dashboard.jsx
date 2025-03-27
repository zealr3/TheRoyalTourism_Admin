import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userCount, setUserCount] = useState(0); // Non-admin users
  const [adminCount, setAdminCount] = useState(0);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [domesticCount, setDomesticCount] = useState(0);
  const [internationalCount, setInternationalCount] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        navigate("/admin");
        return;
      }

      console.log("Token:", token); // Log the token for debugging

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch user and admin counts
        console.log("Fetching from /api/users/count...");
        const userCountResponse = await axios.get("http://localhost:5000/api/users/count", config);
        console.log("Response from /api/users/count:", userCountResponse.data);
        const { total, users, admins } = userCountResponse.data;
        setTotalUsers(total || 0);
        setUserCount(users || 0);
        setAdminCount(admins || 0);

        // Fetch destination counts
        console.log("Fetching from /api/destinations/counts...");
        const destinationResponse = await axios.get("http://localhost:5000/api/destinations/counts");
        console.log("Response from /api/destinations/counts:", destinationResponse.data);
        const { total: totalDest, domestic, international } = destinationResponse.data;
        setTotalDestinations(totalDest || 0);
        setDomesticCount(domestic || 0);
        setInternationalCount(international || 0);

      } catch (error) {
        console.error("Fetch error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
        if (error.response?.status === 401) {
          setError("Unauthorized: Invalid or expired token. Please log in again.");
          navigate("/admin");
        } else if (error.response?.status === 403) {
          setError("Forbidden: You don’t have admin access.");
          navigate("/admin");
        } else {
          setError(`Failed to fetch data: ${error.message}`);
        }
      }
    };

    fetchData();
  }, [navigate]);

  if (error) {
    return <div style={{ color: "red", textAlign: "center", padding: "20px" }}>{error}</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card-container">
        <div className="card">
          <h2>Total Users</h2>
          <p>{totalUsers}</p>
        </div>
        <div className="card">
          <h2>Regular Users</h2>
          <p>{userCount}</p>
        </div>
        <div className="card">
          <h2>Admins</h2>
          <p>{adminCount}</p>
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