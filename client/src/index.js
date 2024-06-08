import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme'; // Import the custom theme
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Corrected typo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
      <ToastContainer position='top-right' autoClose={2000} />
    </ThemeProvider>
  </React.StrictMode>
);
