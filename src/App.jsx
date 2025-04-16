import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Adddestination from "./pages/Adddestination";
import ViewDestinations from "./pages/ViewDestinations";
import AdminLogin from "./pages/Adminlogin";
import AdminPackages from "./pages/Adminpackage"; // ✅ Corrected import
import AddPackge from "./pages/Addpackages";
import "./styles.css";
import "./index.css";
import AdminFoodManagement from "./pages/ViewFood";
import AdminActivityManagement from "./pages/AdminActivityManagment";
import AdminPlacesManagement from "./pages/AdminPlacesManagment";
import AdminTourManagement from "./pages/AdminTOurManagment";


// ✅ ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null"); // ✅ Proper check

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// ✅ Admin Layout component
const AdminLayout = ({ children }) => (
  <div style={{ display: "flex", flex: 1 }}>
    <Sidebar />
    <div
      style={{
        flex: 1,
        padding: "20px",
        overflowY: "auto",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        margin: "10px",
      }}
    >
      {children}
    </div>
  </div>
);

const App = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<div>Settings Page</div>} />
                  <Route path="/adddestination" element={<Adddestination />} />
                  <Route path="/view" element={<ViewDestinations />} />
                  <Route path="/Adminpackages" element={<AdminPackages />} /> {/* ✅ Fixed path */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/addPackage" element={<AddPackge />} />
                  <Route path="/AdminFoodManagement" element={<AdminFoodManagement />} />
                  <Route path="/AdminActivityManagement" element={<AdminActivityManagement />} />
                  <Route path="/AdminPlacesManagement" element={<AdminPlacesManagement/>} />
                  <Route path="/AdminTourManagement" element={<AdminTourManagement/>} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
