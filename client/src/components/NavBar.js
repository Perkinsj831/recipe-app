import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({ token, isAdmin, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Recipes', path: '/' },
    { text: 'Add Recipe', path: '/recipes', auth: true },
    { text: 'Admin', path: '/admin', auth: true, admin: true },
    { text: 'Profile', path: '/profile', auth: true }
  ];

  const authItems = [
    { text: 'Login', path: '/login', auth: false },
    { text: 'Register', path: '/register', auth: false }
  ];

  const renderMenuItems = (drawer = false) => (
    <List>
      {menuItems.map(({ text, path, auth, admin }) => {
        if (auth && !token) return null;
        if (admin && !isAdmin) return null;
        return (
          <ListItem
            button
            key={text}
            component={Link}
            to={path}
            onClick={drawer ? toggleDrawer(false) : undefined}
            selected={isActive(path)}
          >
            <ListItemText primary={text} />
          </ListItem>
        );
      })}
      {!token && authItems.map(({ text, path }) => (
        <ListItem
          button
          key={text}
          component={Link}
          to={path}
          onClick={drawer ? toggleDrawer(false) : undefined}
          selected={isActive(path)}
        >
          <ListItemText primary={text} />
        </ListItem>
      ))}
      {token && (
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItem>
      )}
    </List>
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h5" style={{ fontFamily: 'Pacifico, cursive', fontSize: '1.8rem' }}>
              ReciPeace
              <img
                src={`${process.env.PUBLIC_URL}/peaceSign3.png`}
                alt="Peace Sign"
                style={{
                  height: '50px',
                  marginLeft: '10px',
                  verticalAlign: 'middle',
                  backgroundColor: '#B22222'
                }}
              />
            </Typography>
          </Box>
          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                <Box
                  sx={{ width: 250 }}
                  role="presentation"
                  onClick={toggleDrawer(false)}
                  onKeyDown={toggleDrawer(false)}
                >
                  {renderMenuItems(true)}
                </Box>
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex' }}>
              {menuItems.map(({ text, path, auth, admin }) => {
                if (auth && !token) return null;
                if (admin && !isAdmin) return null;
                return (
                  <Button
                    color="inherit"
                    component={Link}
                    to={path}
                    key={text}
                    style={isActive(path) ? { textDecoration: 'underline' } : {}}
                  >
                    {text}
                  </Button>
                );
              })}
              {!token && authItems.map(({ text, path }) => (
                <Button
                  color="inherit"
                  component={Link}
                  to={path}
                  key={text}
                  style={isActive(path) ? { textDecoration: 'underline' } : {}}
                >
                  {text}
                </Button>
              ))}
              {token && (
                <Button color="inherit" onClick={handleLogout}>
                  Logout
                </Button>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: 'center', padding: '20px 0', backgroundColor: '#FFFAFA' }}>
        <img src="/logo.png" alt="ReciPeace Logo" style={{ height: '200px' }} />
      </Box>
    </Box>
  );
};

export default NavBar;