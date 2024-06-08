import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Alert, Box } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const RecipeForm = ({ token }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState([""]);
  const [approxTime, setApproxTime] = useState("");  
  const [servings, setServings] = useState("");      
  const [image, setImage] = useState(null); // State for image file
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', 'your_upload_preset'); // Cloudinary upload preset

      const response = await axios.post('https://api.cloudinary.com/v1_1/your_cloud_name/image/upload', formData);
      imageUrl = response.data.secure_url;
    }

    try {
      await axios.post("http://localhost:5001/api/recipes", {
        title,
        ingredients: ingredients.split(","),
        instructions,
        approxTime,
        servings: parseInt(servings),
        imageUrl,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTitle("");
      setIngredients("");
      setInstructions([""]);
      setApproxTime("");  
      setServings("");    
      setImage(null); // Reset image
      setError("");
      setSuccess("Recipe created successfully");
    } catch (error) {
      console.error("Error creating recipe:", error.response?.data || error.message);  
      setError("Error creating recipe, please try again.");
      setSuccess("");
    }
  };

  const handleInstructionChange = (index, value) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <Container maxWidth="sm">
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <form onSubmit={handleSubmit}>
        <Typography variant="h4" component="h1" gutterBottom>Add Recipe</Typography>
        <TextField
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          label="Ingredients (comma separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        {instructions.map((instruction, index) => (
          <TextField
            key={index}
            label={`Instruction ${index + 1}`}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={instruction}
            onChange={(e) => handleInstructionChange(index, e.target.value)}
          />
        ))}
        <Button type="button" variant="contained" color="secondary" fullWidth onClick={addInstruction}>
          Add Step
        </Button>
        <TextField
          label="Approximate Time"
          variant="outlined"
          fullWidth
          margin="normal"
          value={approxTime}
          onChange={(e) => setApproxTime(e.target.value)}
        />
        <TextField
          label="Number of Servings"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="contained-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span" fullWidth startIcon={<CloudUploadIcon />}>
            Add Photo
          </Button>
        </label>
        <Box mt={2}> {/* Add margin-top here */}
          <Button type="submit" variant="contained" color="primary" fullWidth>Add Recipe</Button>
        </Box>
      </form>
    </Container>
  );
};

export default RecipeForm;
