import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
  Button,
  TextField,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const Admin = ({ token }) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const fetchRecipes = async (params = {}) => {
    try {
      const response = await axios.get("http://localhost:5001/api/recipes/search", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setRecipes(response.data.recipes);
      setError("");
    } catch (error) {
      setError("Error fetching recipes, please try again.");
    }
  };

  useEffect(() => {
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

  const handleSearch = () => {
    fetchRecipes({ searchTerm });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    fetchRecipes();
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
    setSelectedRecipe(null);
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        style={{ fontFamily: "Pacifico, cursive", fontSize: "3rem" }}
      >
        Admin - Manage Recipes
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box my={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={10}>
            <TextField
              fullWidth
              placeholder="Search by recipe or creator"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={handleSearch} variant="contained" color="primary">
                      <SearchIcon />
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={clearAllFilters}
              variant="contained"
              color="secondary"
              fullWidth
              startIcon={<ClearAllIcon />}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(recipe)}>
                <CardContent>
                  <Typography variant="h5" component="div">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created by: {recipe.createdBy}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(recipe._id)}
                >
                  Delete
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedRecipe && (
        <Dialog open={popupOpen} onClose={handlePopupClose}>
          <DialogTitle>{selectedRecipe.title}</DialogTitle>
          <DialogContent>
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.title}
              style={{ width: '100%', height: 'auto', maxWidth: '500px', maxHeight: '300px', objectFit: 'contain' }}
            />
            <DialogContentText component="div">
              <Typography variant="h6" component="div">
                Ingredients:
              </Typography>
              <Typography variant="body1" component="div">
                {selectedRecipe.ingredients.join(', ')}
              </Typography>
              <Typography variant="h6" component="div" mt={2}>
                Instructions:
              </Typography>
              <Box component="ol">
                {selectedRecipe.instructions.map((step, index) => (
                  <li key={index}>
                    <Typography variant="body1" component="span">
                      {step}
                    </Typography>
                  </li>
                ))}
              </Box>
              <Box mt={2} component="div">
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Created by:</strong> {selectedRecipe.createdBy}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Approximate Time:</strong> {selectedRecipe.approxTime}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Servings:</strong> {selectedRecipe.servings}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Calories:</strong> {selectedRecipe.calories}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Protein Type:</strong> {selectedRecipe.proteinType}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Difficulty Level:</strong> {selectedRecipe.difficultyLevel}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Meal Type:</strong> {selectedRecipe.mealType}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Cooking Method:</strong> {selectedRecipe.cookingMethod}
                </Typography>
                <Typography variant="body2" color="text.secondary" component="div">
                  <strong>Dietary Restrictions:</strong> {selectedRecipe.dietaryRestrictions}
                </Typography>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handlePopupClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Admin;
