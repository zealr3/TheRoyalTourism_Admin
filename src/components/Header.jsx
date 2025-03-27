import React from "react";
import "../styles.css";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  // Retrieve user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const adminName = user.fullname || "Admin"; // Fallback to "Admin" if no name is found

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin"); // Redirect to admin login page
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          TheRoyalTourism Admin Panel
        </Typography>
        <Typography variant="subtitle1" sx={{ marginRight: 2 }}>
          Welcome, {adminName}
        </Typography>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
