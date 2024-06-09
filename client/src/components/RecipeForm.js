import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Alert, Box, MenuItem, FormControl, InputLabel, Select, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
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

  const [proteinType, setProteinType] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [cookingMethod, setCookingMethod] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("");

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
        proteinType,
        cuisineType,
        difficultyLevel,
        dietaryRestrictions,
        cookingMethod,
        calories: parseInt(calories),
        mealType,
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
      setProteinType("");
      setCuisineType("");
      setDifficultyLevel("");
      setDietaryRestrictions([]);
      setCookingMethod("");
      setCalories("");
      setMealType("");
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

  const handleDietaryRestrictionsChange = (event) => {
    const { value } = event.target;
    setDietaryRestrictions((prev) => {
      if (prev.includes(value)) {
        return prev.filter((restriction) => restriction !== value);
      }
      return [...prev, value];
    });
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
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Protein Type</InputLabel>
          <Select
            value={proteinType}
            onChange={(e) => setProteinType(e.target.value)}
            label="Protein Type"
          >
            <MenuItem value="">N/A</MenuItem>
            <MenuItem value="Chicken">Chicken</MenuItem>
            <MenuItem value="Beef">Beef</MenuItem>
            <MenuItem value="Pork">Pork</MenuItem>
            <MenuItem value="Fish">Fish</MenuItem>
            <MenuItem value="Vegetarian">Vegetarian</MenuItem>
            <MenuItem value="Vegan">Vegan</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Cuisine Type</InputLabel>
          <Select
            value={cuisineType}
            onChange={(e) => setCuisineType(e.target.value)}
            label="Cuisine Type"
          >
            <MenuItem value="">N/A</MenuItem>
            <MenuItem value="Italian">Italian</MenuItem>
            <MenuItem value="Mexican">Mexican</MenuItem>
            <MenuItem value="Indian">Indian</MenuItem>
            <MenuItem value="Chinese">Chinese</MenuItem>
            <MenuItem value="American">American</MenuItem>
            <MenuItem value="Japanese">Japanese</MenuItem>
            <MenuItem value="Thai">Thai</MenuItem>
            <MenuItem value="Greek">Greek</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Difficulty Level</InputLabel>
          <Select
            value={difficultyLevel}
            onChange={(e) => setDifficultyLevel(e.target.value)}
            label="Difficulty Level"
          >
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
        <FormControl component="fieldset" margin="normal">
          <Typography variant="body1">Dietary Restrictions</Typography>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("N/A")} onChange={handleDietaryRestrictionsChange} value="N/A" />}
              label="N/A"
            />
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("Gluten-Free")} onChange={handleDietaryRestrictionsChange} value="Gluten-Free" />}
              label="Gluten-Free"
            />
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("Nut-Free")} onChange={handleDietaryRestrictionsChange} value="Nut-Free" />}
              label="Nut-Free"
            />
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("Dairy-Free")} onChange={handleDietaryRestrictionsChange} value="Dairy-Free" />}
              label="Dairy-Free"
            />
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("Low-Carb")} onChange={handleDietaryRestrictionsChange} value="Low-Carb" />}
              label="Low-Carb"
            />
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("Paleo")} onChange={handleDietaryRestrictionsChange} value="Paleo" />}
              label="Paleo"
            />
            <FormControlLabel
              control={<Checkbox checked={dietaryRestrictions.includes("Keto")} onChange={handleDietaryRestrictionsChange} value="Keto" />}
              label="Keto"
            />
          </FormGroup>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Meal Type</InputLabel>
          <Select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            label="Meal Type"
          >
            <MenuItem value="Breakfast">Breakfast</MenuItem>
            <MenuItem value="Lunch">Lunch</MenuItem>
            <MenuItem value="Dinner">Dinner</MenuItem>
            <MenuItem value="Snack">Snack</MenuItem>
            <MenuItem value="Dessert">Dessert</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel>Cooking Method</InputLabel>
          <Select
            value={cookingMethod}
            onChange={(e) => setCookingMethod(e.target.value)}
            label="Cooking Method"
          >
            <MenuItem value="Baking">Baking</MenuItem>
            <MenuItem value="Grilling">Grilling</MenuItem>
            <MenuItem value="Slow Cooker">Slow Cooker</MenuItem>
            <MenuItem value="Instant Pot">Instant Pot</MenuItem>
            <MenuItem value="Air Fryer">Air Fryer</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Calories"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
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
