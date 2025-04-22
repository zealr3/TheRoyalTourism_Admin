import React from "react";
import { Link } from "react-router-dom";
import { List, ListItem, ListItemText } from "@mui/material";

const Sidebar = () => {
  return (
    <aside className="w-80 bg-white h-full p-4">
      <List className="sidebar-nav">
        <ListItem
          button
          component={Link}
          to="/"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-grid mr-3 text-gray-600"></i>
          <ListItemText primary="Royal Dashboard" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/Users"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-newspaper mr-3 text-gray-600"></i>
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/ManageDestinations"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-layout-text-window-reverse mr-3 text-gray-600"></i>
          <ListItemText primary="Manage Destinations" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/ManagePackage"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-layout-text-window-reverse mr-3 text-gray-600"></i>
          <ListItemText primary="Manage Package" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/AdminFoodManagement"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-layout-text-window-reverse mr-3 text-gray-600"></i>
          <ListItemText primary="Food Management" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/AdminActivityManagement"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-layout-text-window-reverse mr-3 text-gray-600"></i>
          <ListItemText primary="Activity Management" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/AdminPlacesManagement"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-layout-text-window-reverse mr-3 text-gray-600"></i>
          <ListItemText primary="Places Management" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/AdminTourManagement"
          className="flex items-center p-2 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <i className="bi bi-layout-text-window-reverse mr-3 text-gray-600"></i>
          <ListItemText primary="Tour Management" />
        </ListItem>
      </List>
    </aside>
  );
};

export default Sidebar;