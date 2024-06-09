import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Rating,
} from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { toast } from 'react-toastify';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon,
} from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import FilterBar from './FilterBar';

const RecipeList = ({ token }) => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState(null);

  const fetchRecipes = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:5001/api/recipes/search', {
        params,
      });
      setRecipes(response.data.recipes);
      setError('');
    } catch (error) {
      console.error('Error fetching recipes:', error);
      setError('Error fetching recipes, please try again.');
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedRecipes(response.data.savedRecipes.map((recipe) => recipe._id));
    } catch (error) {
      console.error('Error fetching saved recipes:', error);
      setError('Error fetching saved recipes, please try again.');
    }
  };

  useEffect(() => {
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
    if (!token) {
      toast.error('You must be logged in to save a recipe.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSavedRecipes([...savedRecipes, recipeId]);
      toast.success('Recipe saved to profile.');
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Error saving recipe, please try again.');
    }
  };

  const handleUnsaveRecipe = async (recipeId) => {
    if (!token) {
      toast.error('You must be logged in to unsave a recipe.');
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
      toast.success('Recipe removed from profile.');
    } catch (error) {
      console.error('Error unsaving recipe:', error);
      toast.error('Error unsaving recipe, please try again.');
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

  const handleRatingChange = async (recipeId, newRating) => {
    if (!token) {
      toast.error('You must be logged in to rate a recipe.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/rate`,
        { rating: newRating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRecipes(
        recipes.map((recipe) =>
          recipe._id === recipeId ? { ...recipe, averageRating: response.data.averageRating } : recipe
        )
      );
      toast.success('Rating submitted.');
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Error submitting rating, please try again.');
    }
  };

  const getShareUrl = (recipeId) => {
    const url = `${window.location.origin}/recipes/${recipeId}`;
    console.log('Generated Share URL:', url); // Debugging statement
    try {
      new URL(url);
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return null;
    }
  };

  const handleFilter = (filterType, filter) => {
    const params = { [filterType]: filter };
    fetchRecipes(params);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ fontFamily: 'Pacifico, cursive', fontSize: '3rem' }}>
        Recipes
      </Typography>
      <FilterBar onFilter={handleFilter} />
      {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(recipe)}>
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
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
              <Box display="flex" alignItems="center" mt={2} px={2} pb={2}>
                <Rating
                  name={`recipe-rating-${recipe._id}`}
                  value={recipe.averageRating || 0}
                  precision={0.5}
                  onChange={(event, newValue) => handleRatingChange(recipe._id, newValue)}
                  style={{ color: '#ffb400' }}
                  onClick={(event) => event.stopPropagation()}
                />
                <Typography variant="body2" ml={1}>
                  ({recipe.ratings ? recipe.ratings.length : 0} ratings)
                </Typography>
              </Box>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
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
                <Button variant="text" color="primary" startIcon={<ArrowForward />} onClick={() => handleShareClick(recipe)}>
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
              <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} style={{ width: '100%', height: 'auto' }} />
              <Typography variant="h6" component="h2">Ingredients:</Typography>
              <Typography variant="body1">{selectedRecipe.ingredients.join(', ')}</Typography>
              <Typography variant="h6" component="h2" mt={2}>Instructions:</Typography>
              <ol>
                {selectedRecipe.instructions.map((step, index) => (
                  <li key={index}>
                    <Typography variant="body1">{step}</Typography>
                  </li>
                ))}
              </ol>
              <Box mt={2}>
                <Typography variant="body2" color="text.secondary"><strong>Created by:</strong> {selectedRecipe.createdBy}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Approximate Time:</strong> {selectedRecipe.approxTime}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Servings:</strong> {selectedRecipe.servings}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Calories:</strong> {selectedRecipe.calories}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Protein Type:</strong> {selectedRecipe.proteinType}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Difficulty Level:</strong> {selectedRecipe.difficultyLevel}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Cooking Method:</strong> {selectedRecipe.cookingMethod}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Dietary Restrictions:</strong> {selectedRecipe.dietaryRestrictions}</Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={2}>
                <Rating
                  name={`recipe-rating-${selectedRecipe._id}`}
                  value={selectedRecipe.averageRating || 0}
                  precision={0.5}
                  onChange={(event, newValue) => handleRatingChange(selectedRecipe._id, newValue)}
                  style={{ color: '#ffb400' }}
                  onClick={(event) => event.stopPropagation()}
                />
                <Typography variant="body2" ml={1}>
                  ({selectedRecipe.ratings ? selectedRecipe.ratings.length : 0} ratings)
                </Typography>
              </Box>
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
              <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
                {/* Hardcode a valid URL for testing */}
                <FacebookShareButton url="https://www.example.com" quote={shareRecipe.title}>
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
                {shareRecipe.imageUrl ? (
                  <PinterestShareButton
                    url={getShareUrl(shareRecipe._id)}
                    media={shareRecipe.imageUrl}
                    description={shareRecipe.title}
                  >
                    <PinterestIcon size={40} round />
                  </PinterestShareButton>
                ) : (
                  <PinterestShareButton
                    url={getShareUrl(shareRecipe._id)}
                    media={'https://www.example.com/default-image.jpg'}
                    description={shareRecipe.title}
                  >
                    <PinterestIcon size={40} round />
                  </PinterestShareButton>
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <CopyToClipboard
                  text={getShareUrl(shareRecipe._id)}
                  onCopy={() => {
                    toast.success('Link copied to clipboard.');
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
