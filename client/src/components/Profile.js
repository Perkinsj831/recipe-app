import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, IconButton, Box } from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { toast } from "react-toastify";
import { FacebookShareButton, FacebookIcon, WhatsappShareButton, WhatsappIcon, TwitterShareButton, EmailShareButton, EmailIcon, PinterestShareButton, PinterestIcon } from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import XIcon from '@mui/icons-material/Close';

const Profile = ({ token }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState(null);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedRecipes(response.data.savedRecipes);
        setError("");
      } catch (error) {
        console.error('Error fetching saved recipes:', error.response?.data || error.message);
        setError("Error fetching saved recipes, please try again.");
      }
    };

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
    try {
      await axios.post(`http://localhost:5001/api/recipes/${recipeId}/unsave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSavedRecipes(savedRecipes.filter(recipe => recipe._id !== recipeId));
      toast.success('Recipe removed from profile.');
    } catch (error) {
      console.error("Error removing recipe:", error.response?.data || error.message);
      toast.error('Error removing recipe, please try again');
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
      <Typography variant="h4" component="h1" gutterBottom align="center" style={{ fontFamily: 'Pacifico, cursive', fontSize: '3rem' }}>
        Your Saved Recipes
      </Typography>
      {error && <Typography color="error" align="center">{error}</Typography>}
      <Grid container spacing={2}>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '8px' }}>
                <IconButton
                  sx={{ color: '#B22222' }}
                  onClick={() => handleUnsaveRecipe(recipe._id)}
                >
                  <Favorite />
                </IconButton>
                <Button
                  endIcon={<ArrowForward />}
                  onClick={() => handleShareClick(recipe)}
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
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginBottom: "20px" }}>
                  <div style={{ textAlign: "center", margin: "0 10px" }}>
                    <FacebookShareButton url={getShareUrl(shareRecipe._id)} quote={shareRecipe.title}>
                      <FacebookIcon size={40} round />
                    </FacebookShareButton>
                    <Typography variant="body2">Facebook</Typography>
                  </div>
                  <div style={{ textAlign: "center", margin: "0 10px" }}>
                    <WhatsappShareButton url={getShareUrl(shareRecipe._id)} title={shareRecipe.title}>
                      <WhatsappIcon size={40} round />
                    </WhatsappShareButton>
                    <Typography variant="body2">WhatsApp</Typography>
                  </div>
                  <div style={{ textAlign: "center", margin: "0 10px" }}>
                    <TwitterShareButton url={getShareUrl(shareRecipe._id)} title={shareRecipe.title}>
                      <XIcon size={40} round />
                    </TwitterShareButton>
                    <Typography variant="body2">X</Typography>
                  </div>
                  <div style={{ textAlign: "center", margin: "0 10px" }}>
                    <EmailShareButton url={getShareUrl(shareRecipe._id)} subject={shareRecipe.title}>
                      <EmailIcon size={40} round />
                    </EmailShareButton>
                    <Typography variant="body2">Email</Typography>
                  </div>
                  <div style={{ textAlign: "center", margin: "0 10px" }}>
                    <PinterestShareButton url={getShareUrl(shareRecipe._id)} media={shareRecipe.imageUrl} description={shareRecipe.title}>
                      <PinterestIcon size={40} round />
                    </PinterestShareButton>
                    <Typography variant="body2">Pinterest</Typography>
                  </div>
                </div>
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

export default Profile;
