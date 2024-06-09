import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, Rating, Box, CircularProgress } from "@mui/material";

const RecipeCard = ({ token }) => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
        setRecipe(response.data);
        setError("");
        if (response.data.userRating) {
          setUserRating(response.data.userRating);
        }
      } catch (error) {
        setError("Error fetching recipe, please try again.");
      }
    };

    fetchRecipe();
  }, [id]);

  const handleRatingChange = async (event, newValue) => {
    setUserRating(newValue);
    try {
      await axios.post(
        `http://localhost:5001/api/recipes/${id}/rate`,
        { rating: newValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Refresh recipe to get updated average rating
      const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
      setRecipe(response.data);
    } catch (error) {
      setError("Error submitting rating, please try again.");
    }
  };

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  if (!recipe) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm">
      <Card>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            style={{ width: "100%", height: "auto" }}
          />
        )}
        <CardContent>
          <Typography variant="h5" component="div">
            {recipe.title}
          </Typography>
          <Box display="flex" alignItems="center" mt={2}>
            <Rating
              name="recipe-rating"
              value={recipe.averageRating || 0}
              precision={0.5}
              readOnly
              style={{ color: "#ffb400" }}
            />
            <Typography variant="body2" ml={1}>
              ({recipe.ratings.length} ratings)
            </Typography>
          </Box>
          {token && (
            <Box mt={2}>
              <Typography variant="h6">Rate this recipe:</Typography>
              <Rating
                name="user-rating"
                value={userRating}
                onChange={handleRatingChange}
              />
            </Box>
          )}
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary"><strong>Created by:</strong> {recipe.createdBy}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Approximate Time:</strong> {recipe.approxTime}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Servings:</strong> {recipe.servings}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Calories:</strong> {recipe.calories}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Protein Type:</strong> {recipe.proteinType}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Cuisine Type:</strong> {recipe.cuisineType}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Difficulty Level:</strong> {recipe.difficultyLevel}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Cooking Method:</strong> {recipe.cookingMethod}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Dietary Restrictions:</strong> {recipe.dietaryRestrictions}</Typography>
          </Box>
          <Typography variant="h6" component="div" mt={2}>
            Ingredients:
          </Typography>
          <Typography>{recipe.ingredients.join(", ")}</Typography>
          <Typography variant="h6" component="div" mt={2}>
            Instructions:
          </Typography>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>
                <Typography variant="body1">{step}</Typography>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeCard;
