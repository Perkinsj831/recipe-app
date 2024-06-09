import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, Alert, IconButton, InputAdornment } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = ({ setToken, setIsAdmin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/auth/login', { username, password });
      const token = response.data.token;
      setToken(token);
      localStorage.setItem('token', token);

      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);

      setError(''); // Clear any previous errors
      navigate('/'); // Navigate to home page after successful login
    } catch (error) {
      setError('Invalid credentials, please try again.');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" component="h1" gutterBottom>Login</Typography>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <Button type="submit" variant="contained" color="primary" fullWidth>Login</Button>
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
