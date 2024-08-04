import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert, IconButton, InputAdornment, CircularProgress, Box } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const apiUrl = process.env.REACT_APP_API_URL;

const Login = ({ setToken, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
      const token = response.data.token;
      setToken(token);
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);

      navigate('/');
    } catch (error) {
      setError('Invalid credentials, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit} autoComplete='on'>
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        <TextField
          id="username"
          name="username"
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete='username'
        />
        <TextField
          id="password"
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box position="relative">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            Login
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </form>
      <Typography variant="body1" component="p" marginTop={2}>
        Don't have an account? <Link to="/register">Register here</Link>
      </Typography>
      <Typography variant="body2" component="p" marginTop={2}>
        Forgot your password? <Link to="/password-reset-request">Reset it here</Link>
      </Typography>
    </Container>
  );
};

export default Login;