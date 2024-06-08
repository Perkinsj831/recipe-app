import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from "@mui/material";
import Favorite from "@mui/icons-material/Favorite";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/ArrowForward";
import { toast } from "react-toastify";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
} from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";

const RecipeList = ({ token }) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/recipes");
        setRecipes(response.data);
        setError("");
      } catch (error) {
        console.error(
          "Error fetching recipes:",
          error.response?.data || error.message
        );
        setError("Error fetching recipes, please try again.");
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedRecipes(response.data.savedRecipes.map((recipe) => recipe._id));
      } catch (error) {
        console.error(
          "Error fetching saved recipes:",
          error.response?.data || error.message
        );
      }
    };

    fetchRecipes();
    if (token) {
      fetchSavedRecipes();
    }
  }, [token]);

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleClose = () => {
    setSelectedRecipe(null);
  };

  const handleSaveRecipe = async (recipeId) => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (!token) {
      console.error("No token found in localStorage");
      toast.error("You must be logged in to save a recipe.");
      return;
    }

    console.log("Token being sent:", token); // Debugging statement

    try {
      const response = await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Save recipe response:", response.data);
      setSavedRecipes([...savedRecipes, recipeId]);
      toast.success("Recipe saved to profile.");
    } catch (error) {
      console.error("Error saving recipe:", error.response?.data || error.message);
      toast.error("Error saving recipe, please try again");
    }
  };

  const handleUnsaveRecipe = async (recipeId) => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
    if (!token) {
      console.error("No token found in localStorage");
      toast.error("You must be logged in to unsave a recipe.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/unsave`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedRecipes(savedRecipes.filter((id) => id !== recipeId));
      toast.success("Recipe removed from profile");
    } catch (error) {
      console.error("Error unsaving recipe:", error.response?.data || error.message);
      toast.error("Error unsaving recipe, please try again");
    }
  };

  const handleShareClick = (recipe) => {
    setShareRecipe(recipe);
    setShareDialogOpen(true);
  };

  const handleShareClose = () => {
    setShareDialogOpen(false);
    setShareRecipe(null);
  };

  const getShareUrl = (recipeId) => `${window.location.origin}/recipes/${recipeId}`;

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        style={{ fontFamily: "Pacifico, cursive", fontSize: "3rem" }}
      >
        Recipes
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <Grid container spacing={2}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(recipe)}>
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
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
                </CardContent>
              </CardActionArea>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
                <IconButton
                  color="primary"
                  onClick={() => {
                    if (savedRecipes.includes(recipe._id)) {
                      handleUnsaveRecipe(recipe._id);
                    } else {
                      handleSaveRecipe(recipe._id);
                    }
                  }}
                >
                  {savedRecipes.includes(recipe._id) ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<ShareIcon />}
                  onClick={() => handleShareClick(recipe)}
                >
                  Share
                </Button>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
      {selectedRecipe && (
        <Dialog open={Boolean(selectedRecipe)} onClose={handleClose}>
          <DialogTitle>{selectedRecipe.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                style={{ width: "100%", height: "auto" }}
              />
              <Typography variant="h6">Ingredients:</Typography>
              <Typography>{selectedRecipe.ingredients.join(", ")}</Typography>
              <Typography variant="h6">Instructions:</Typography>
              <ol>
                {selectedRecipe.instructions.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
              <Typography>Approximate Time: {selectedRecipe.approxTime}</Typography>
              <Typography>Servings: {selectedRecipe.servings}</Typography>
              <Typography>Created by: {selectedRecipe.createdBy}</Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {shareRecipe && (
        <Dialog open={shareDialogOpen} onClose={handleShareClose}>
          <DialogTitle>Share Recipe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Share {shareRecipe.title} via:
              <div style={{ display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
                <FacebookShareButton url={getShareUrl(shareRecipe._id)} quote={shareRecipe.title}>
                  <FacebookIcon size={40} round />
                </FacebookShareButton>
                <WhatsappShareButton url={getShareUrl(shareRecipe._id)} title={shareRecipe.title}>
                  <WhatsappIcon size={40} round />
                </WhatsappShareButton>
                <TwitterShareButton url={getShareUrl(shareRecipe._id)} title={shareRecipe.title}>
                  <TwitterIcon size={40} round />
                </TwitterShareButton>
                <EmailShareButton url={getShareUrl(shareRecipe._id)} subject={shareRecipe.title}>
                  <EmailIcon size={40} round />
                </EmailShareButton>
                <CopyToClipboard
                  text={getShareUrl(shareRecipe._id)}
                  onCopy={() => {
                    toast.success("Link copied to clipboard.");
                    handleShareClose();
                  }}
                >
                  <Button variant="contained" color="primary">
                    Copy Link
                  </Button>
                </CopyToClipboard>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShareClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default RecipeList;
