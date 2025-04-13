import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [userCount, setUserCount] = useState(0);
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

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        const userCountResponse = await axios.get("http://localhost:5000/api/users/count", config);
        const { total, users, admins } = userCountResponse.data;
        setTotalUsers(total || 0);
        setUserCount(users || 0);
        setAdminCount(admins || 0);

        const destinationResponse = await axios.get("http://localhost:5000/api/destinations/counts");
        const { total: totalDest, domestic, international } = destinationResponse.data;
        setTotalDestinations(totalDest || 0);
        setDomesticCount(domestic || 0);
        setInternationalCount(international || 0);
      } catch (error) {
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
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {[{ title: "Total Users", count: totalUsers },
          { title: "Regular Users", count: userCount },
          { title: "Admins", count: adminCount },
          { title: "Total Destinations", count: totalDestinations },
          { title: "Domestic Destinations", count: domesticCount },
          { title: "International Destinations", count: internationalCount }].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-xl font-semibold text-gray-700">{item.title}</h2>
            <p className="text-2xl font-bold text-blue-600 mt-2">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
