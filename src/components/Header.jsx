import React from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Menu, MenuItem, IconButton } from "@mui/material";

const Header = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  // Retrieve user info from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const adminName = user.fullname || "Admin"; // Fallback to "Admin" if no name is found

  // Handle dropdown menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin"); // Redirect to admin login page
    handleMenuClose();
  };

  return (
    <AppBar position="fixed" className="bg-white drop-shadow-md">
      <Toolbar className="flex justify-between">
        <div className="flex items-center">
          <Link to="/admin" className="flex items-center text-[#8C387C]">
            <img
              src="/logo.svg"
              alt="The Royal Tourism"
              className="h-10 mr-4 ml-3 mt-3 mb-3"
            />
          <small className="text-[#8C387C] font-bold  mr-3" style={{fontSize: "18px"}}>
            The Royal Tourism
          </small>
          </Link>
          <IconButton
            className="ml-5 text-[#8C387C]"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list text-2xl"></i>
          </IconButton>
        </div>
        <div className="flex items-center">
          <div
            className="flex items-center cursor-pointer mx-4"
            onClick={handleMenuOpen}
          >
            <img
              src="/assets/img/user.png"
              alt="Profile"
              className="h-10 w-10 rounded-full mr-2"
            />
            <Typography
              variant="subtitle1"
              className="hidden md:block text-[#8C387C] pr-3"
            >
              {adminName}
            </Typography>
            <i className="bi bi-chevron-down text-[#8C387C]"></i>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              className: "mt-2",
            }}
          >
            <MenuItem onClick={handleMenuClose} component={Link} to="/admin/profile">
              <i className="bi bi-person mr-2"></i> My Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <i className="bi bi-box-arrow-right mr-2"></i> Sign Out
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;