import React from 'react';
import '../styles.css';
import { Link } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';

const Sidebar = () => {
  return (
    <div style={{ width: '200px', backgroundColor: '#f0f0f0', padding: '10px', height: '100vh' }}>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/Users">   
          <ListItemText primary="Users" />
        </ListItem>
        <ListItem button component={Link} to="/ManageDestinations">
          <ListItemText primary="Manage Destinations" />
        </ListItem>
        <ListItem button component={Link} to="/ManagePackage">
          <ListItemText primary="Manage Package" />
        </ListItem>
        <ListItem button component={Link} to="/AdminFoodManagement">
          <ListItemText primary="Food Managment" />
        </ListItem>
        <ListItem button component={Link} to="/AdminActivityManagement">
          <ListItemText primary="Acctivity Managment" />
        </ListItem>
        <ListItem button component={Link} to="/AdminPlacesManagement">
          <ListItemText primary="Places Managment" />
        </ListItem>
        <ListItem button component={Link} to="/AdminTourManagement">
          <ListItemText primary="Tour Managment" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
