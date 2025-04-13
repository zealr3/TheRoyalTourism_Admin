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

        <ListItem button component={Link} to="/Adddestination">  
          <ListItemText primary="Add Destination" />
        </ListItem>
        <ListItem button component={Link} to="/AddPackage">  
          <ListItemText primary="Add Packages" />
        </ListItem>
        <ListItem button component={Link} to="/view">  
          <ListItemText primary="View Destinations" />
        </ListItem>
        <ListItem button component={Link} to="/Adminpackages">
          <ListItemText primary="Manage Packages" />
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
