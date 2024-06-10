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
import ArrowForward from '@mui/icons-material/ArrowForward';
import CommentIcon from '@mui/icons-material/Comment';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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

const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const Profile = ({ token }) => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [uploadedRecipes, setUploadedRecipes] = useState([]);
  const [filteredSavedRecipes, setFilteredSavedRecipes] = useState([]);
  const [filteredUploadedRecipes, setFilteredUploadedRecipes] = useState([]);
  const [error, setError] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareRecipe, setShareRecipe] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState({});
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState({});
  const [filters, setFilters] = useState({
    searchTerm: '',
    cuisineType: '',
    difficultyLevel: '',
    dietaryRestrictions: '',
    mealType: '',
    cookingMethod: '',
    calories: '',
    minRating: 0,
    proteinType: '',
    approxTime: '',
  });

  const userIdFromToken = token ? jwtDecode(token).id : null;

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile/saved', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSavedRecipes(response.data.savedRecipes);
      setError('');
    } catch (error) {
      console.error('Error fetching saved recipes:', error.response?.data || error.message);
      setError('Error fetching saved recipes, please try again.');
    }
  };

  const fetchUploadedRecipes = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/profile/uploaded', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedRecipes(response.data.uploadedRecipes);
      setError('');
    } catch (error) {
      console.error('Error fetching uploaded recipes:', error.response?.data || error.message);
      setError('Error fetching uploaded recipes, please try again.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchSavedRecipes();
      fetchUploadedRecipes();
    }
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [filters, savedRecipes, uploadedRecipes]);

  const applyFilters = () => {
    let filteredSaved = [...savedRecipes];
    let filteredUploaded = [...uploadedRecipes];

    if (filters.searchTerm) {
      filteredSaved = filteredSaved.filter(
        recipe =>
          recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          recipe.createdBy.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
      filteredUploaded = filteredUploaded.filter(
        recipe =>
          recipe.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          recipe.createdBy.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    if (filters.cuisineType) {
      filteredSaved = filteredSaved.filter(recipe => recipe.cuisineType === filters.cuisineType);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.cuisineType === filters.cuisineType);
    }

    if (filters.difficultyLevel) {
      filteredSaved = filteredSaved.filter(recipe => recipe.difficultyLevel === filters.difficultyLevel);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.difficultyLevel === filters.difficultyLevel);
    }

    if (filters.dietaryRestrictions) {
      filteredSaved = filteredSaved.filter(recipe => recipe.dietaryRestrictions.includes(filters.dietaryRestrictions));
      filteredUploaded = filteredUploaded.filter(recipe => recipe.dietaryRestrictions.includes(filters.dietaryRestrictions));
    }

    if (filters.mealType) {
      filteredSaved = filteredSaved.filter(recipe => recipe.mealType === filters.mealType);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.mealType === filters.mealType);
    }

    if (filters.cookingMethod) {
      filteredSaved = filteredSaved.filter(recipe => recipe.cookingMethod === filters.cookingMethod);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.cookingMethod === filters.cookingMethod);
    }

    if (filters.calories) {
      filteredSaved = filteredSaved.filter(recipe => recipe.calories <= parseInt(filters.calories, 10));
      filteredUploaded = filteredUploaded.filter(recipe => recipe.calories <= parseInt(filters.calories, 10));
    }

    if (filters.minRating > 0) {
      filteredSaved = filteredSaved.filter(recipe => recipe.averageRating >= filters.minRating);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.averageRating >= filters.minRating);
    }

    if (filters.proteinType) {
      filteredSaved = filteredSaved.filter(recipe => recipe.proteinType === filters.proteinType);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.proteinType === filters.proteinType);
    }

    if (filters.approxTime) {
      filteredSaved = filteredSaved.filter(recipe => recipe.approxTime === filters.approxTime);
      filteredUploaded = filteredUploaded.filter(recipe => recipe.approxTime === filters.approxTime);
    }

    setFilteredSavedRecipes(filteredSaved);
    setFilteredUploadedRecipes(filteredUploaded);
  };

  const fetchComments = async (recipeId) => {
    try {
      const response = await axios.get(`http://localhost:5001/api/recipes/${recipeId}/comments`);
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
    setEditRecipe(null);
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
      setUploadedRecipes((prevUploadedRecipes) =>
        prevUploadedRecipes.map((recipe) =>
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
    try {
      new URL(url); // Validate URL
      return url;
    } catch (error) {
      console.error('Invalid URL:', url);
      return null; // Handle invalid URL
    }
  };

  const handleFilter = (filterType, filterValue) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: filterValue,
    }));
  };

  const handleEditClick = (recipe) => {
    setEditRecipe(recipe);
  };

  const handleEditChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'image') {
      const file = files[0];
      setEditRecipe({ ...editRecipe, image: file, imagePreview: URL.createObjectURL(file) });
    } else {
      setEditRecipe({ ...editRecipe, [name]: value });
    }
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!token) {
      toast.error('You must be logged in to edit a recipe.');
      return;
    }

    let imageUrl = editRecipe.imageUrl; // Use existing imageUrl by default
    if (editRecipe.image) {
      const formData = new FormData();
      formData.append('file', editRecipe.image);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Use the environment variable

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        setError('Error uploading image, please try again.');
        return; // Stop the form submission if the image upload fails
      }
    }

    try {
      await axios.put(
        `http://localhost:5001/api/recipes/${editRecipe._id}`,
        {
          ...editRecipe,
          imageUrl, // Update with new imageUrl if uploaded
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success('Recipe updated successfully.');
      setEditRecipe(null);
      fetchUploadedRecipes(); // Re-fetch the updated list of uploaded recipes
    } catch (error) {
      console.error('Error updating recipe:', error);
      toast.error('Error updating recipe, please try again.');
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
      await axios.delete(
        `http://localhost:5001/api/recipes/${recipeId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(recipeId); // Refresh comments after deletion
      toast.success('Comment deleted.');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Error deleting comment, please try again.');
    }
  };

  const handleDeleteReply = async (recipeId, commentId, replyId) => {
    if (!token) {
      toast.error('You must be logged in to delete a reply.');
      return;
    }

    try {
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

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        style={{ fontFamily: 'Pacifico, cursive', fontSize: '3rem' }}
      >
        Your Profile
      </Typography>
      <FilterBar onFilter={handleFilter} />
      {error && <Typography variant="body1" color="error" align="center">{error}</Typography>}
      <Typography variant="h4" component="h2" textAlign="center" fontFamily={ "Pacifico, cursive" } gutterBottom sx={{ textDecoration: 'underline', color: '#B22222', marginBottom: '2rem' }}>
        Saved Recipes
      </Typography>
      <Grid container spacing={4}>
        {filteredSavedRecipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardActionArea onClick={() => handleCardClick(recipe)} style={{ flexGrow: 1 }}>
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                <CardContent style={{ height: '100%' }}>
                  <Typography variant="h5" component="div">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Approximate Time:</strong> {recipe.approxTime}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Servings:</strong> {recipe.servings}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Created by:</strong> {recipe.createdBy}</Typography>
                </CardContent>
              </CardActionArea>
              <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2}>
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
      <Typography variant="h4" component="h2" textAlign="center" fontFamily={ "Pacifico, cursive" } gutterBottom style={{ marginTop: '4rem', textDecoration: 'underline', color: '#B22222', marginBottom: '2rem' }}>
        Your Uploaded Recipes
      </Typography>
      <Grid container spacing={4}>
        {filteredUploadedRecipes.map((recipe) => (
          <Grid item key={recipe._id} xs={12} sm={6} md={4}>
            <Card style={{ display: "flex", flexDirection: "column", height: '100%'}}>
              <CardActionArea onClick={() => handleCardClick(recipe)} style={{ flexGrow: 1 }}>
                {recipe.imageUrl && (
                  <img src={recipe.imageUrl} alt={recipe.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                )}
                <CardContent style={{ height: '100%'}}>
                  <Typography variant="h5" component="div">
                    {recipe.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Approximate Time:</strong> {recipe.approxTime}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Servings:</strong> {recipe.servings}</Typography>
                  <Typography variant="body2" color="text.secondary"><strong>Created by:</strong> {recipe.createdBy}</Typography>
                </CardContent>
              </CardActionArea>
              <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pb={2}>
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
                <Button
                  variant="text"
                  color="primary"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleEditClick(recipe);
                  }}
                >
                  Edit
                </Button>
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
            <DialogContentText component="div">
              <Box>
                <img src={selectedRecipe.imageUrl} alt={selectedRecipe.title} style={{ width: '100%', height: 'auto', maxWidth: '500px', maxHeight: '300px', objectFit: 'contain' }} />
                <Typography variant="h6" component="h2">Ingredients:</Typography>
                <Typography variant="body1" component="div">{selectedRecipe.ingredients.join(', ')}</Typography>
                <Typography variant="h6" component="h2" mt={2}>Instructions:</Typography>
                <Box component="ol">
                  {selectedRecipe.instructions.map((step, index) => (
                    <li key={index}>
                      <Typography variant="body1" component="div">{step}</Typography>
                    </li>
                  ))}
                </Box>
                <Box mt={2}>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Created by:</strong> {selectedRecipe.createdBy}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Approximate Time:</strong> {selectedRecipe.approxTime}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Servings:</strong> {selectedRecipe.servings}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Calories:</strong> {selectedRecipe.calories}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Protein Type:</strong> {selectedRecipe.proteinType}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Cuisine Type:</strong> {selectedRecipe.cuisineType}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Difficulty Level:</strong> {selectedRecipe.difficultyLevel}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Meal Type:</strong> {selectedRecipe.mealType}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Cooking Method:</strong> {selectedRecipe.cookingMethod}</Typography>
                  <Typography variant="body2" color="text.secondary" component="div"><strong>Dietary Restrictions:</strong> {selectedRecipe.dietaryRestrictions.join(', ')}</Typography>
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
                <Box mt={2}>
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
                            <Typography variant="body1">
                              <strong>{comment.username}</strong>
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {comment.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(comment.date).toLocaleString()}
                            </Typography>
                            <Box mt={1}>
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => toggleReply(comment._id)}
                              >
                                <ReplyIcon />
                                {comment.replies && comment.replies.length > 0 && (
                                  <Typography variant="caption" color="text.secondary">
                                    {comment.replies.length}
                                  </Typography>
                                )}
                              </IconButton>
                              {comment.userId === userIdFromToken && (
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  onClick={() => handleDeleteComment(selectedRecipe._id, comment._id)}
                                  style={{ color: '#B22222' }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </Box>
                            <Collapse in={showReply[comment._id]}>
                              <Box mt={2} ml={4}>
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
                                    >
                                      <Typography variant="body1">
                                        <strong>{reply.username}</strong>
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {reply.text}
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(reply.date).toLocaleString()}
                                      </Typography>
                                      {reply.userId === userIdFromToken && (
                                        <IconButton
                                          size="small"
                                          color="secondary"
                                          onClick={() => handleDeleteReply(selectedRecipe._id, comment._id, reply._id)}
                                          style={{ color: '#B22222' }}
                                        >
                                          <DeleteIcon />
                                        </IconButton>
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
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
      {editRecipe && (
        <Dialog open={Boolean(editRecipe)} onClose={handleClose}>
          <DialogTitle>Edit Recipe</DialogTitle>
          <DialogContent>
            <DialogContentText component="div">
              <Box component="form" onSubmit={handleEditSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title"
                  name="title"
                  value={editRecipe.title}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Ingredients"
                  name="ingredients"
                  value={editRecipe.ingredients.join(', ')}
                  onChange={(event) => setEditRecipe({ ...editRecipe, ingredients: event.target.value.split(',').map((item) => item.trim()) })}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Instructions"
                  name="instructions"
                  value={editRecipe.instructions.join(', ')}
                  onChange={(event) => setEditRecipe({ ...editRecipe, instructions: event.target.value.split(',').map((item) => item.trim()) })}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Approximate Time"
                  name="approxTime"
                  value={editRecipe.approxTime}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Servings"
                  name="servings"
                  value={editRecipe.servings}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Protein Type"
                  name="proteinType"
                  value={editRecipe.proteinType}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Cuisine Type"
                  name="cuisineType"
                  value={editRecipe.cuisineType}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Difficulty Level"
                  name="difficultyLevel"
                  value={editRecipe.difficultyLevel}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Dietary Restrictions"
                  name="dietaryRestrictions"
                  value={editRecipe.dietaryRestrictions.join(', ')}
                  onChange={(event) => setEditRecipe({ ...editRecipe, dietaryRestrictions: event.target.value.split(',').map((item) => item.trim()) })}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Cooking Method"
                  name="cookingMethod"
                  value={editRecipe.cookingMethod}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Calories"
                  name="calories"
                  value={editRecipe.calories}
                  onChange={handleEditChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Meal Type"
                  name="mealType"
                  value={editRecipe.mealType}
                  onChange={handleEditChange}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="edit-button-file"
                  type="file"
                  name="image"
                  onChange={handleEditChange}
                />
                <label htmlFor="edit-button-file">
                  <Button variant="contained" color="primary" component="span" fullWidth startIcon={<CloudUploadIcon />}>
                    {editRecipe.imagePreview ? "Change Photo" : "Add Photo"}
                  </Button>
                </label>
                {editRecipe.imagePreview && (
                  <Box mt={2}>
                    <img src={editRecipe.imagePreview} alt="Recipe" style={{ width: '100%', height: 'auto' }} />
                  </Box>
                )}
                <Box mt={2}>
                  <Button type="submit" color="primary" variant="contained">
                    Save
                  </Button>
                  <Button onClick={handleClose} color="secondary" variant="contained" style={{ marginLeft: '10px' }}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      )}
      {shareRecipe && (
        <Dialog open={shareDialogOpen} onClose={handleShareClose}>
          <DialogTitle>Share Recipe</DialogTitle>
          <DialogContent>
            <DialogContentText>Share {shareRecipe.title} via:</DialogContentText>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
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
