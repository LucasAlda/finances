import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import {
  Menu,
  MenuItem,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import AppsIcon from "@material-ui/icons/Apps";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import AccountCircle from "@material-ui/icons/AccountCircle";

function Navbar({ location, history, user, setUser }) {
  const handleChange = (event, value) => {
    history.push(value);
  };
  const value = location.pathname.split("/").splice(-1)[0];
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = () => {
    setUser({});
    localStorage.clear();
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Finanzas
          </Typography>
          {user.name && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem>{user.name}</MenuItem>
                <MenuItem onClick={handleLogOut}>Salir</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      {value !== "login" && (
        <AppBar color="primary" className="navbar">
          <BottomNavigation value={value} onChange={handleChange}>
            <BottomNavigationAction label="Principal" value="" icon={<HomeIcon />} />
            <BottomNavigationAction label="Cotizacion" value="cotizacion" icon={<AttachMoneyIcon />} />
            <BottomNavigationAction label="Cartera" value="cartera" icon={<AddCircleIcon />} />
            <BottomNavigationAction label="Otros" value="otros" icon={<AppsIcon />} />
          </BottomNavigation>
        </AppBar>
      )}
    </>
  );
}

export default withRouter(Navbar);
