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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#8C387C] ml-56">Dashboard</h1>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-56">
        {[
          { title: "Total Destinations", count: totalDestinations, icon: "/assets/Icons/allDestinations.png" },
          { title: "Total Domestics", count: domesticCount, icon: "/assets/Icons/TotalDomestics.png" },
          { title: "Total International", count: internationalCount, icon: "/assets/Icons/TotalInternational.png" },
          { title: "Total Users", count: totalUsers, icon: "/assets/Icons/users.png" },
          { title: "Regular Users", count: userCount, icon: "/assets/Icons/users.png" },
          { title: "Admins", count: adminCount, icon: "/assets/Icons/users.png" },
        ].map((item, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h5 className="text-lg font-bold text-[#05073D] mb-2">{item.title}</h5>
              <div className="flex items-center gap-2">
                <img
                  src={item.icon}
                  alt={item.title}
                  className="h-16 w-16"
                  onError={(e) => (e.target.src = "/Images/Icons/placeholder.png")}
                />
                <h3 className="font-semibold text-[#8C387C]" style={{fontSize:"2rem"}}>{item.count}</h3>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;