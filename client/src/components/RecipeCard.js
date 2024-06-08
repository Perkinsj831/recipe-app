import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent } from "@mui/material";

const RecipeCard = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/recipes/${id}`);
        setRecipe(response.data);
        setError("");
      } catch (error) {
        setError("Error fetching recipe, please try again.");
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <Typography color="error" align="center">{error}</Typography>;
  }

  if (!recipe) {
    return <Typography align="center">Loading...</Typography>;
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
          <Typography variant="body2" color="text.secondary">
            Approximate Time: {recipe.approxTime}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Servings: {recipe.servings}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Created by: {recipe.createdBy}
          </Typography>
          <Typography variant="h6" component="div">
            Ingredients:
          </Typography>
          <Typography>{recipe.ingredients.join(", ")}</Typography>
          <Typography variant="h6" component="div">
            Instructions:
          </Typography>
          <ol>
            {recipe.instructions.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeCard;
