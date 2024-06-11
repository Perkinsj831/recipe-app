import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RecipeList from "./components/RecipeList";
import RecipeForm from "./components/RecipeForm";
import NavBar from "./components/NavBar";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import RecipeCard from "./components/RecipeCard";
import PasswordResetRequest from "./components/PasswordResetRequest";
import PasswordReset from "./components/PasswordReset";
import { jwtDecode } from "jwt-decode";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin);
    }
  }, [token]);

  return (
    <Router>
      <NavBar token={token} isAdmin={isAdmin} setToken={setToken} />
      <Routes>
        <Route path="/" element={token ? <RecipeList token={token} /> : <RecipeList />} />
        <Route path="/login" element={<Login setToken={setToken} setIsAdmin={setIsAdmin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<RecipeForm token={token} />} />
        <Route path="/profile" element={<Profile token={token} />} />
        <Route path="/admin" element={<Admin token={token} />} />
        <Route path="/recipes/:id" element={<RecipeCard />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/reset-password/:token" element={<PasswordReset />} />
      </Routes>
    </Router>
  );
};

export default App;
