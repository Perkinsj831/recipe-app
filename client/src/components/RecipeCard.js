import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Button,
  IconButton,
  TextField,
  Collapse,
  Rating,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const apiUrl = process.env.REACT_APP_API_URL;

const RecipeCard = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState({});
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userIdFromToken, setUserIdFromToken] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserIdFromToken(decoded.id);
      } catch (error) {
        toast.error('Invalid token', error);
      }
    }
  }, [token]);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/recipes/${id}`);
        setRecipe(response.data);
        setError("");
        if (response.data.userRating) {
          setUserRating(response.data.userRating);
        }
        fetchComments(id);
      } catch (error) {
        setError("Error fetching recipe, please try again.");
      }
    };

    fetchRecipe();
  }, [id]);

  const fetchComments = async (recipeId) => {
    try {
      const response = await axios.get(`${apiUrl}/api/recipes/${recipeId}/comments`);
      setComments(response.data.comments);
    } catch (error) {
      toast.error('Error fetching comments:', error);
    }
  };

  const handleRatingChange = async (event, newValue) => {
    if (!token) {
      toast.error('You must be logged in to rate a recipe.');
      return;
    }

    setUserRating(newValue);
    try {
      await axios.post(
        `${apiUrl}/api/recipes/${id}/rate`,
        { rating: newValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const response = await axios.get(`${apiUrl}/api/recipes/${id}`);
      setRecipe(response.data);
      toast.success('Rating submitted.');
    } catch (error) {
      setError("Error submitting rating, please try again.");
    }
  };

  const handleCommentSubmit = async () => {
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
        `${apiUrl}/api/recipes/${id}/comments`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(id);
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      toast.error('Error adding comment, please try again.');
    }
  };

  const toggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const toggleReply = (commentId) => {
    setShowReply((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const handleReplyComment = async (commentId) => {
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
        `${apiUrl}/api/recipes/${id}/comments/${commentId}/replies`,
        { text: replyText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(id);
      setReplyText('');
      setShowReply((prev) => ({ ...prev, [commentId]: false }));
    } catch (error) {
      toast.error('Error adding reply, please try again.');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!token) {
      toast.error('You must be logged in to delete a comment.');
      return;
    }

    try {
      await axios.delete(`${apiUrl}/api/recipes/${id}/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchComments(id);
      toast.success('Comment deleted.');
    } catch (error) {
      toast.error('Error deleting comment, please try again.');
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    if (!token) {
      toast.error('You must be logged in to delete a reply.');
      return;
    }

    try {
      await axios.delete(
        `${apiUrl}/api/recipes/${id}/comments/${commentId}/replies/${replyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments(id);
      toast.success('Reply deleted.');
    } catch (error) {
      toast.error('Error deleting reply, please try again.');
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
            <Typography variant="body2" color="text.secondary"><strong>Meal Type:</strong> {recipe.mealType}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Cooking Method:</strong> {recipe.cookingMethod}</Typography>
            <Typography variant="body2" color="text.secondary"><strong>Dietary Restrictions:</strong> {recipe.dietaryRestrictions.join(", ")}</Typography>
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
          <Box mt={2} component="div">
            <Button
              variant="text"
              color="primary"
              startIcon={<CommentIcon />}
              onClick={toggleComments}
            >
              Comments ({comments.length})
            </Button>
            <Collapse in={showComments}>
              <Box p={2}>
                <TextField
                  id="new-comment"
                  name="newComment"
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
                  onClick={handleCommentSubmit}
                  style={{ marginTop: '10px' }}
                >
                  Post Comment
                </Button>
                {comments.map((comment) => (
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
                        {comment.replies.length > 0 && (
                          <Typography variant="body2" color="text.secondary" style={{ marginLeft: '5px' }}>
                            {comment.replies.length}
                          </Typography>
                        )}
                      </IconButton>
                      {comment.userId === userIdFromToken && (
                        <>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleDeleteComment(comment._id)}
                            style={{ display: 'inline-block', marginLeft: '10px' }}
                          >
                            <DeleteIcon style={{ color: '#B22222' }} />
                          </IconButton>
                        </>
                      )}
                    </Box>
                    <Collapse in={showReply[comment._id]}>
                      <Box mt={2} ml={4} component="div">
                        <TextField
                          id={`reply-text-${comment._id}`}
                          name={`replyText-${comment._id}`}
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
                          onClick={() => handleReplyComment(comment._id)}
                          style={{ marginTop: '10px' }}
                        >
                          Post Reply
                        </Button>
                        {comment.replies.map((reply) => (
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
                            {reply.userId === userIdFromToken && (
                              <>
                                <IconButton
                                  size="small"
                                  color="secondary"
                                  onClick={() => handleDeleteReply(comment._id, reply._id)}
                                  style={{ display: 'inline-block', marginLeft: '10px' }}
                                >
                                  <DeleteIcon style={{ color: '#B22222' }} />
                                </IconButton>
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
        </CardContent>
      </Card>
    </Container>
  );
};

export default RecipeCard;
