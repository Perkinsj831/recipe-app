import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const NavBar = ({ token, isAdmin, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h5" style={{ fontFamily: 'Pacifico, cursive', fontSize: '1.8rem' }}>
              ReciPeace
              <img src={`${process.env.PUBLIC_URL}/peaceSign3.png`} alt="Peace Sign" style={{ height: '50px', marginLeft: '10px', verticalAlign: 'middle', backgroundColor: '#B22222' }} />
            </Typography>
          </Box>
          <Button
            color="inherit"
            component={Link}
            to="/"
            style={isActive('/') ? { textDecoration: 'underline' } : {}}
          >
            Recipes 
          </Button>
          {token ? (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/recipes"
                style={isActive('/recipes') ? { textDecoration: 'underline' } : {}}
              >
                Add Recipe
              </Button>
              {isAdmin && (
                <Button
                  color="inherit"
                  component={Link}
                  to="/admin"
                  style={isActive('/admin') ? { textDecoration: 'underline' } : {}}
              >
                Admin
              </Button>
              )}
              <Button
                color="inherit"
                component={Link}
                to="/profile"
                style={isActive('/profile') ? { textDecoration: 'underline' } : {}}
              >
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                color="inherit"
                component={Link}
                to="/login"
                style={isActive('/login') ? { textDecoration: 'underline' } : {}}
              >
                Login
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/register"
                style={isActive('/register') ? { textDecoration: 'underline' } : {}}
              >
                Register
              </Button>
            </>
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
