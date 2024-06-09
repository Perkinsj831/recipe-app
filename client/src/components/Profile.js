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

const Profile = ({ token }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState(null);

  const fetchSavedRecipes = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile/saved', {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setSavedRecipes(response.data.savedRecipes);
      setError('');
    } catch (error) {
      console.error('Error fetching saved recipes:', error.response?.data || error.message);
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
      setSavedRecipes((prevSavedRecipes) => prevSavedRecipes.filter((recipe) => recipe._id !== recipeId));
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
      setSavedRecipes((prevSavedRecipes) =>
        prevSavedRecipes.map((recipe) =>
          recipe._id === recipeId ? { ...recipe, averageRating: response.data.averageRating } : recipe
        )
      );
      toast.success('Rating submitted.');
    } catch (error) {
      toast.error('Error submitting rating, please try again.');
    }
  };

  const getShareUrl = (recipeId) => {
    const url = `${window.location.origin}/recipes/${recipeId}`;
    console.log('Generated Share URL:', url); // Debugging statement
    try {
      new URL(url); // Validate URL
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return null; // Handle invalid URL
    }
  };

  const handleFilter = (filterType, filter) => {
    const params = { [filterType]: filter };
    fetchSavedRecipes(params);
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        style={{ fontFamily: 'Pacifico, cursive', fontSize: '3rem' }}
      >
        Your Saved Recipes
      </Typography>
      <FilterBar onFilter={handleFilter} />
      {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}
      <Grid container spacing={4}>
        {savedRecipes.map((recipe) => (
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
                  <Typography variant="body2" color="text.secondary"><strong>Approximate Time:</strong> {recipe.approxTime}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Servings:</strong> {recipe.servings}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Created by:</strong> {recipe.createdBy}</Typography>
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
              <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2}>
                <IconButton
                  color="primary"
                  onClick={() => handleUnsaveRecipe(recipe._id)}
                >
                  <Favorite />
                </IconButton>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<ArrowForward />}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleShareClick(recipe);
                  }}
                >
                  Share
                </Button>
              </Box>
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
                <Typography variant="body2" color="text.secondary"><strong>Approximate Time:</strong> {selectedRecipe.approxTime}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Servings:</strong> {selectedRecipe.servings}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Created by:</strong> {selectedRecipe.createdBy}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Protein Type:</strong> {selectedRecipe.proteinType}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Difficulty Level:</strong> {selectedRecipe.difficultyLevel}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Dietary Restrictions:</strong> {selectedRecipe.dietaryRestrictions}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Cooking Method:</strong> {selectedRecipe.cookingMethod}</Typography>
                <Typography variant="body2" color="text.secondary"><strong>Calories:</strong> {selectedRecipe.calories}</Typography>
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
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
      {shareRecipe && (
        <Dialog open={shareDialogOpen} onClose={handleShareClose}>
          <DialogTitle>Share Recipe</DialogTitle>
          <DialogContent>
            <DialogContentText>Share {shareRecipe.title} via:</DialogContentText>
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
                <PinterestShareButton url={getShareUrl(shareRecipe._id)} media={shareRecipe.imageUrl} description={shareRecipe.title}>
                  <PinterestIcon size={40} round />
                </PinterestShareButton>
              ) : (
                <PinterestShareButton url={getShareUrl(shareRecipe._id)} media={'https://www.example.com/default-image.jpg'} description={shareRecipe.title}>
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShareClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Profile;
