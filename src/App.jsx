import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/Adminlogin";
import AdminFoodManagement from "./pages/ViewFood";
import AdminActivityManagement from "./pages/AdminActivityManagment";
import AdminPlacesManagement from "./pages/AdminPlacesManagment";
import AdminTourManagement from "./pages/AdminTOurManagment";
import ManageDestinations from "./pages/ManageDestination";
import ManagePackages from "./pages/ManagePackage";
import "./styles.css";
import "./index.css";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user || user.role !== "admin") {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

// Admin Layout component
const AdminLayout = ({ children, isSidebarOpen }) => (
  <div className="flex flex-1">
    <div
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] transition-transform duration-300 ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <Sidebar />
    </div>
    <div
      className={`flex-1  bg-white rounded-lg shadow-md m-2.5 mt-20 transition-all duration-300 ${
        isSidebarOpen ? "ml-24" : "ml-0"
      }`}
    >
      {children}
    </div>
  </div>
);

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleSidebar={toggleSidebar} />
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AdminLayout isSidebarOpen={isSidebarOpen}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/settings" element={<div>Settings Page</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/AdminFoodManagement" element={<AdminFoodManagement />} />
                  <Route path="/AdminActivityManagement" element={<AdminActivityManagement />} />
                  <Route path="/AdminPlacesManagement" element={<AdminPlacesManagement />} />
                  <Route path="/AdminTourManagement" element={<AdminTourManagement />} />
                  <Route path="/ManageDestinations" element={<ManageDestinations />} />
                  <Route path="/ManagePackage" element={<ManagePackages />} />
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