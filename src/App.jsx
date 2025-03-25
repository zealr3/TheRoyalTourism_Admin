import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Users from "./pages/Users";
import Dashboard from "./pages/Dashboard";
import Adddestination from './pages/Adddestination';
import ViewDestinations from './pages/ViewDestinations';  // Make sure the path is correct
import "./styles.css";

const App = () => {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />

        <div style={{ 
            flex: 1, 
            padding: "20px", 
            overflowY: "auto", 
            backgroundColor: "white", 
            borderRadius: "8px", 
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", 
            margin: "10px"
        }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/Adddestination" element={<Adddestination />} />
            <Route path="/view" element={<ViewDestinations />} />  {/* Add this line */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
