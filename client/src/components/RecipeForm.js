import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Alert, Box, MenuItem, FormControl, InputLabel, Select, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

const RecipeForm = ({ token }) => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState([""]);
  const [approxTime, setApproxTime] = useState("");  
  const [servings, setServings] = useState("");      
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [proteinType, setProteinType] = useState("");
  const [cuisineType, setCuisineType] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [cookingMethod, setCookingMethod] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("");

  const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = ''; 
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      try {
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, formData);
        imageUrl = response.data.secure_url;
      } catch (error) {
        toast.error('Error uploading image to Cloudinary:', error);
        setError('Error uploading image, please try again.');
        return;
      }
    }

    try {
      await axios.post(`${apiUrl}/api/recipes`, {
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
      setImage(null);
      setImagePreview(null);
      setProteinType("");
      setCuisineType("");
      setDifficultyLevel("");
      setDietaryRestrictions([]);
      setCookingMethod("");
      setCalories("");
      setMealType("");
      setError("");
      setSuccess("Recipe created successfully");
      toast.success("Recipe created successfully");
    } catch (error) {
      toast.error("Error creating recipe:", error.response?.data || error.message);  
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
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
        <Typography variant="h4" component="h1" fontFamily={ "Pacifico, cursive"} gutterBottom>Add Recipe</Typography>
        <TextField
          id="recipe-title"
          name="title"
          label="Title"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          id="recipe-ingredients"
          name="ingredients"
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
            id={`recipe-instruction-${index}`}
            name={`instruction-${index}`}
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
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="approx-time-label">Approximate Time</InputLabel>
          <Select
            labelId="approx-time-label"
            id="recipe-approxTime"
            name="approxTime"
            value={approxTime}
            onChange={(e) => setApproxTime(e.target.value)}
            label="Approximate Time"
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="0 - 30 minutes">Under 30 minutes</MenuItem>
            <MenuItem value="30 - 45 minutes">30 minutes - 45 minutes</MenuItem>
            <MenuItem value="45 - 60 minutes">45 minutes - 60 minutes</MenuItem>
            <MenuItem value="60 - 90 minutes">1 hour - 1.5 hours</MenuItem>
            <MenuItem value="90 - 120 minutes">1.5 hours - 2 hours</MenuItem>
            <MenuItem value="Over 120 Minutes">Over 2 hours</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="recipe-servings"
          name="servings"
          label="Number of Servings"
          type="number"
          variant="outlined"
          fullWidth
          margin="normal"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
        />
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="protein-type-label">Protein Type</InputLabel>
          <Select
            labelId="protein-type-label"
            id="recipe-proteinType"
            name="proteinType"
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
          <InputLabel id="cuisine-type-label">Cuisine Type</InputLabel>
          <Select
            labelId="cuisine-type-label"
            id="recipe-cuisineType"
            name="cuisineType"
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
          <InputLabel id="difficulty-level-label">Difficulty Level</InputLabel>
          <Select
            labelId="difficulty-level-label"
            id="recipe-difficultyLevel"
            name="difficultyLevel"
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
              control={<Checkbox id="recipe-dietary-n-a" name="dietary-n-a" checked={dietaryRestrictions.includes("N/A")} onChange={handleDietaryRestrictionsChange} value="N/A" />}
              label="N/A"
            />
            <FormControlLabel
              control={<Checkbox id="recipe-dietary-gluten-free" name="dietary-gluten-free" checked={dietaryRestrictions.includes("Gluten-Free")} onChange={handleDietaryRestrictionsChange} value="Gluten-Free" />}
              label="Gluten-Free"
            />
            <FormControlLabel
              control={<Checkbox id="recipe-dietary-nut-free" name="dietary-nut-free" checked={dietaryRestrictions.includes("Nut-Free")} onChange={handleDietaryRestrictionsChange} value="Nut-Free" />}
              label="Nut-Free"
            />
            <FormControlLabel
              control={<Checkbox id="recipe-dietary-dairy-free" name="dietary-dairy-free" checked={dietaryRestrictions.includes("Dairy-Free")} onChange={handleDietaryRestrictionsChange} value="Dairy-Free" />}
              label="Dairy-Free"
            />
            <FormControlLabel
              control={<Checkbox id="recipe-dietary-low-carb" name="dietary-low-carb" checked={dietaryRestrictions.includes("Low-Carb")} onChange={handleDietaryRestrictionsChange} value="Low-Carb" />}
              label="Low-Carb"
            />
            <FormControlLabel
              control={<Checkbox id="recipe-dietary-paleo" name="dietary-paleo" checked={dietaryRestrictions.includes("Paleo")} onChange={handleDietaryRestrictionsChange} value="Paleo" />}
              label="Paleo"
            />
            <FormControlLabel
              control={<Checkbox id="recipe-dietary-keto" name="dietary-keto" checked={dietaryRestrictions.includes("Keto")} onChange={handleDietaryRestrictionsChange} value="Keto" />}
              label="Keto"
            />
          </FormGroup>
        </FormControl>
        <FormControl fullWidth margin="normal" variant="outlined">
          <InputLabel id="meal-type-label">Meal Type</InputLabel>
          <Select
            labelId="meal-type-label"
            id="recipe-mealType"
            name="mealType"
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
          <InputLabel id="cooking-method-label">Cooking Method</InputLabel>
          <Select
            labelId="cooking-method-label"
            id="recipe-cookingMethod"
            name="cookingMethod"
            value={cookingMethod}
            onChange={(e) => setCookingMethod(e.target.value)}
            label="Cooking Method"
          >
            <MenuItem value="No Cooking Required">No Cooking Required</MenuItem>
            <MenuItem value="Baking">Baking</MenuItem>
            <MenuItem value="Grilling">Grilling</MenuItem>
            <MenuItem value="Slow Cooker">Slow Cooker</MenuItem>
            <MenuItem value="Instant Pot">Instant Pot</MenuItem>
            <MenuItem value="Air Fryer">Air Fryer</MenuItem>
            <MenuItem value="Stove Top">Stove Top</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="recipe-calories"
          name="calories"
          label="Calories (per serving)"
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
          name="image"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="contained-button-file">
          <Button variant="contained" color="primary" component="span" fullWidth startIcon={<CloudUploadIcon />}>
            Add Photo
          </Button>
        </label>
        {imagePreview && (
          <Box mt={2}>
            <img src={imagePreview} alt="Preview" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }} />
            <Button variant="contained" color="secondary" fullWidth onClick={() => { setImage(null); setImagePreview(null); }}>
              Change Photo
            </Button>
          </Box>
        )}
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>Add Recipe</Button>
        </Box>
      </form>
    </Container>
  );
};

export default RecipeForm;