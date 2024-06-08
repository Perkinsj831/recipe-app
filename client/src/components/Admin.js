import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, List, ListItem, ListItemText, Button, Alert } from "@mui/material";

const Admin = ({ token }) => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/recipes", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRecipes(response.data);
                setError("");
            } catch (error) {
                setError("Error fetching recipes, please try again.");
            }
        };

        fetchRecipes();
    }, [token]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5001/api/recipes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRecipes(recipes.filter((recipe) => recipe._id !== id));
        } catch (error) {
            setError("Error deleting recipe, please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" component="h1" gutterBottom>Admin - Manage Recipes</Typography>
            {error && <Alert severity="error">{error}</Alert>}
            <List>
                {recipes.map((recipe) => (
                    <ListItem key={recipe._id}>
                        <ListItemText primary={recipe.title} secondary={recipe.ingredients.join(", ")} />
                        <Button variant="contained" color="secondary" onClick={() => handleDelete(recipe._id)}>
                            Delete
                        </Button>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default Admin;
