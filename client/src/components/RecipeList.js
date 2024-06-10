import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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
  TextField,
  Collapse,
} from '@mui/material';
import Favorite from '@mui/icons-material/Favorite';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import ArrowForward from '@mui/icons-material/ArrowForward';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
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
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState({});
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState({});

  const userIdFromToken = token ? jwtDecode(token).id : null;
  console.log('User ID from Token:', userIdFromToken); // Debugging statement

  const fetchRecipes = async (params = {}) => {
    try {
      const response = await axios.get('http://localhost:5001/api/recipes/search', { params });
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

  const fetchComments = async (recipeId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}/comments`);
      console.log('Fetched comments:', response.data.comments); // Debugging statement
      setComments((prevComments) => ({ ...prevComments, [recipeId]: response.data.comments }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
    fetchComments(recipe._id); // Fetch comments when a recipe is selected
  };

  const handleClose = () => {
    setSelectedRecipe(null);
    setNewComment('');
    setShowComments({});
  };

  const handleSaveRecipe = async (recipeId) => {
    if (!token) {
      toast.error('You must be logged in to save a recipe.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/saved`,
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

  const handleCommentSubmit = async (recipeId) => {
    if (!token) {
      toast.error('You must be logged in to comment.');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/comments`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(recipeId); // Refresh comments after adding a new one
      setNewComment('');
      setShowComments((prev) => ({ ...prev, [recipeId]: true }));
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment, please try again.');
    }
  };

  const toggleComments = (recipeId) => {
    setShowComments((prev) => ({ ...prev, [recipeId]: !prev[recipeId] }));
  };

  const toggleReply = (commentId) => {
    setShowReply((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyComment = async (recipeId, commentId) => {
    if (!token) {
      toast.error('You must be logged in to reply.');
      return;
    }

    if (!replyText.trim()) {
      toast.error('Reply cannot be empty.');
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/recipes/${recipeId}/comments/${commentId}/replies`,
        { text: replyText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(recipeId); // Refresh comments after adding a reply
      setReplyText('');
      setShowReply((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      console.error('Error adding reply:', error);
      toast.error('Error adding reply, please try again.');
    }
  };

  const handleDeleteComment = async (recipeId, commentId) => {
    if (!token) {
      toast.error('You must be logged in to delete a comment.');
      return;
    }

    try {
      console.log(`Attempting to delete comment ${commentId} for recipe ${recipeId}`); // Debugging statement
      const response = await axios.delete(
        `http://localhost:5001/api/recipes/${recipeId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Delete response:', response); // Debugging statement
      fetchComments(recipeId); // Refresh comments after deletion
      toast.success('Comment deleted.');
    } catch (error) {
      console.error('Error deleting comment:', error); // Debugging statement
      if (error.response) {
        console.error('Error response:', error.response.data); // Additional debugging
      }
      toast.error('Error deleting comment, please try again.');
    }
  };

  const handleDeleteReply = async (recipeId, commentId, replyId) => {
    if (!token) {
      toast.error('You must be logged in to delete a reply.');
      return;
    }

    try {
      console.log(`Attempting to delete reply ${replyId}`); // Debugging statement
      await axios.delete(
        `http://localhost:5001/api/recipes/${recipeId}/comments/${commentId}/replies/${replyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(recipeId); // Refresh comments after deletion
      toast.success('Reply deleted.');
    } catch (error) {
      console.error('Error deleting reply:', error);
      toast.error('Error deleting reply, please try again.');
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

  const handleFilter = (filterType, filter) => {
    const params = { [filterType]: filter };
    fetchRecipes(params);
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
        Recipes
      </Typography>
      <FilterBar onFilter={handleFilter} />
      {error && (
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      )}
      <Grid container spacing={4}>
        {recipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => handleCardClick(recipe)}>
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                )}
                <CardContent>
                  <Typography variant="h5" component="div">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    Approximate Time: {recipe.approxTime}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    Servings: {recipe.servings}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
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
                <Typography variant="body2" ml={1} component="div">
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
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<ArrowForward />}
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
            <img
              src={selectedRecipe.imageUrl}
              alt={selectedRecipe.title}
              style={{ width: '100%', height: 'auto' }}
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
              <Box display="flex" alignItems="center" mt={2}>
                <Rating
                  name={`recipe-rating-${selectedRecipe._id}`}
                  value={selectedRecipe.averageRating || 0}
                  precision={0.5}
                  onChange={(event, newValue) => handleRatingChange(selectedRecipe._id, newValue)}
                  style={{ color: '#ffb400' }}
                  onClick={(event) => event.stopPropagation()}
                />
                <Typography variant="body2" ml={1} component="div">
                  ({selectedRecipe.ratings ? selectedRecipe.ratings.length : 0} ratings)
                </Typography>
              </Box>
              <Box mt={2} component="div">
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<CommentIcon />}
                  onClick={() => toggleComments(selectedRecipe._id)}
                >
                  Comments ({comments[selectedRecipe._id] ? comments[selectedRecipe._id].length : 0})
                </Button>
                <Collapse in={showComments[selectedRecipe._id]}>
                  <Box p={2}>
                    <TextField
                      label="Add a comment"
                      variant="outlined"
                      fullWidth
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      multiline
                      rows={2}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCommentSubmit(selectedRecipe._id)}
                      style={{ marginTop: '10px' }}
                    >
                      Post Comment
                    </Button>
                    {comments[selectedRecipe._id] &&
                      comments[selectedRecipe._id].map((comment) => (
                        <Box key={comment._id} mt={2} p={2} border="1px solid #ccc" borderRadius="4px">
                          <Typography variant="body1" component="div">
                            <strong>{comment.username}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary" component="div">
                            {comment.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div">
                            {new Date(comment.date).toLocaleString()}
                          </Typography>
                          <Box mt={1} component="div">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => toggleReply(comment._id)}
                            >
                              <ReplyIcon />
                              {comment.replies && comment.replies.length > 0 && (
                                <Typography variant="caption" color="text.secondary" ml={1}>
                                  ({comment.replies.length})
                                </Typography>
                              )}
                            </IconButton>
                            {console.log('Comment User ID:', comment.userId, 'Token User ID:', userIdFromToken)} {/* Debugging statement */}
                            {comment.userId === userIdFromToken && (
                              <>
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  onClick={() => {
                                    console.log('Attempting to delete comment:', comment._id); // Additional logging
                                    handleDeleteComment(selectedRecipe._id, comment._id);
                                  }}
                                  style={{ color: '#B22222' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                {console.log('Delete button should be visible')} {/* Additional logging */}
                              </>
                            )}
                          </Box>
                          <Collapse in={showReply[comment._id]}>
                            <Box mt={2} ml={4} component="div">
                              <TextField
                                label="Add a reply"
                                variant="outlined"
                                fullWidth
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                multiline
                                rows={2}
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleReplyComment(selectedRecipe._id, comment._id)}
                                style={{ marginTop: '10px' }}
                              >
                                Post Reply
                              </Button>
                              {comment.replies &&
                                comment.replies.map((reply) => (
                                  <Box
                                    key={reply._id}
                                    mt={2}
                                    p={2}
                                    border="1px solid #ccc"
                                    borderRadius="4px"
                                    component="div"
                                  >
                                    <Typography variant="body1" component="div">
                                      <strong>{reply.username}</strong>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" component="div">
                                      {reply.text}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" component="div">
                                      {new Date(reply.date).toLocaleString()}
                                    </Typography>
                                    {console.log('Reply User ID:', reply.userId, 'Token User ID:', userIdFromToken)} {/* Debugging statement */}
                                    {reply.userId === userIdFromToken && (
                                      <>
                                        <IconButton
                                          size="small"
                                          color="secondary"
                                          onClick={() => {
                                            console.log('Attempting to delete reply:', reply._id); // Additional logging
                                            handleDeleteReply(selectedRecipe._id, comment._id, reply._id);
                                          }}
                                          style={{ color: '#B22222' }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
                                        {console.log('Delete button should be visible')} {/* Additional logging */}
                                      </>
                                    )}
                                  </Box>
                                ))}
                            </Box>
                          </Collapse>
                        </Box>
                      ))}
                  </Box>
                </Collapse>
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
            <DialogContentText component="div">
              Share {shareRecipe.title} via:
              <Box display="flex" justifyContent="space-around" mt={2}>
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
              </Box>
              <Box textAlign="center" mt={2} component="div">
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
              </Box>
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
