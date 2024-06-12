import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  InputAdornment,
  Typography,
  FormControl,
  InputLabel,
  Select,
  Slider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const FilterBar = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [mealType, setMealType] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  const [calories, setCalories] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [proteinType, setProteinType] = useState('');
  const [under30Minutes, setUnder30Minutes] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = () => {
    onFilter('searchTerm', searchTerm);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCuisineTypeChange = (event) => {
    setCuisineType(event.target.value);
    onFilter('cuisineType', event.target.value);
  };

  const handleDifficultyLevelChange = (event) => {
    setDifficultyLevel(event.target.value);
    onFilter('difficultyLevel', event.target.value);
  };

  const handleDietaryRestrictionsChange = (event) => {
    setDietaryRestrictions(event.target.value);
    onFilter('dietaryRestrictions', event.target.value);
  };

  const handleMealTypeChange = (event) => {
    setMealType(event.target.value);
    onFilter('mealType', event.target.value);
  };

  const handleCookingMethodChange = (event) => {
    setCookingMethod(event.target.value);
    onFilter('cookingMethod', event.target.value);
  };

  const handleProteinTypeChange = (event) => {
    setProteinType(event.target.value);
    onFilter('proteinType', event.target.value);
  };

  const handleCaloriesChange = (event) => {
    setCalories(event.target.value);
    onFilter('calories', event.target.value);
  };

  const handleUnder30MinutesChange = (event) => {
    setUnder30Minutes(event.target.value);
    onFilter('approxTime', event.target.value);
  };

  const handleRatingChange = (event, newValue) => {
    setMinRating(newValue);
    onFilter('minRating', newValue);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setCuisineType('');
    setDifficultyLevel('');
    setDietaryRestrictions('');
    setMealType('');
    setCookingMethod('');
    setCalories('');
    setMinRating(0);
    setProteinType('');
    setUnder30Minutes('');
    onFilter('searchTerm', '');
    onFilter('cuisineType', '');
    onFilter('difficultyLevel', '');
    onFilter('dietaryRestrictions', '');
    onFilter('mealType', '');
    onFilter('cookingMethod', '');
    onFilter('calories', '');
    onFilter('minRating', 0);
    onFilter('proteinType', '');
    onFilter('approxTime', '');
  };

  return (
    <Box my={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={10}>
          <TextField
            fullWidth
            placeholder="Search by recipe or creator"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
            id="search-term"
            name="searchTerm"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button onClick={handleSearch} variant="contained" color="primary">
                    <SearchIcon />
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            onClick={clearAllFilters}
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<ClearAllIcon />}
          >
            {isMobile ? 'Clear Filters' : 'Clear Filters'}
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-cuisine-type">Cuisine Type</InputLabel>
            <Select
              labelId="cuisine-type-label"
              id="filter-cuisine-type"
              value={cuisineType}
              onChange={handleCuisineTypeChange}
              label="Cuisine Type"
              name="cuisineType"
            >
              <MenuItem value=""><em>None</em></MenuItem>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-difficulty-level">Difficulty Level</InputLabel>
            <Select
              labelId="difficulty-level-label"
              id="filter-difficulty-level"
              value={difficultyLevel}
              onChange={handleDifficultyLevelChange}
              label="Difficulty Level"
              name="difficultyLevel"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-dietary-restrictions">Dietary Restrictions</InputLabel>
            <Select
              labelId="dietary-restrictions-label"
              id="filter-dietary-restrictions"
              value={dietaryRestrictions}
              onChange={handleDietaryRestrictionsChange}
              label="Dietary Restrictions"
              name="dietaryRestrictions"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Gluten-Free">Gluten-Free</MenuItem>
              <MenuItem value="Nut-Free">Nut-Free</MenuItem>
              <MenuItem value="Dairy-Free">Dairy-Free</MenuItem>
              <MenuItem value="Low-Carb">Low-Carb</MenuItem>
              <MenuItem value="Paleo">Paleo</MenuItem>
              <MenuItem value="Keto">Keto</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-meal-type">Meal Type</InputLabel>
            <Select
              labelId="meal-type-label"
              id="filter-meal-type"
              value={mealType}
              onChange={handleMealTypeChange}
              label="Meal Type"
              name="mealType"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Breakfast">Breakfast</MenuItem>
              <MenuItem value="Lunch">Lunch</MenuItem>
              <MenuItem value="Dinner">Dinner</MenuItem>
              <MenuItem value="Snack">Snack</MenuItem>
              <MenuItem value="Dessert">Dessert</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-cooking-method">Cooking Method</InputLabel>
            <Select
              labelId="cooking-method-label"
              id="filter-cooking-method"
              value={cookingMethod}
              onChange={handleCookingMethodChange}
              label="Cooking Method"
              name="cookingMethod"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="No Cooking Required">No Cooking Required</MenuItem>
              <MenuItem value="Baking">Baking</MenuItem>
              <MenuItem value="Grilling">Grilling</MenuItem>
              <MenuItem value="Slow Cooker">Slow Cooker</MenuItem>
              <MenuItem value="Instant Pot">Instant Pot</MenuItem>
              <MenuItem value="Air Fryer">Air Fryer</MenuItem>
              <MenuItem value="Stove Top">Stove Top</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-protein-type">Protein Type</InputLabel>
            <Select
              labelId="protein-type-label"
              id="filter-protein-type"
              value={proteinType}
              onChange={handleProteinTypeChange}
              label="Protein Type"
              name="proteinType"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Chicken">Chicken</MenuItem>
              <MenuItem value="Turkey">Turkey</MenuItem>
              <MenuItem value="Beef">Beef</MenuItem>
              <MenuItem value="Pork">Pork</MenuItem>
              <MenuItem value="Fish">Fish</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Vegan">Vegan</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-calories-select">Calories (per serving)</InputLabel>
            <Select
              labelId="calories-label"
              id="filter-calories-select"
              value={calories}
              onChange={handleCaloriesChange}
              label="Calories (per serving)"
              name="calories"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="100">Under 100</MenuItem>
              <MenuItem value="300">Under 300</MenuItem>
              <MenuItem value="500">Under 500</MenuItem>
              <MenuItem value="1000">Under 1000</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel htmlFor="filter-under-30">Recipes 30 Minutes or Less</InputLabel>
            <Select
              labelId="under-30-label"
              id="filter-under-30"
              value={under30Minutes}
              onChange={handleUnder30MinutesChange}
              label="Recipes 30 Minutes or Less"
              name="under30Minutes"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="0 - 30 minutes">Under 30 Minutes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>Minimum Rating</Typography>
          <Slider
            value={minRating}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            aria-labelledby="min-rating-label"
            id="min-rating"
            name="minRating"
            min={0}
            max={5}
            step={1}
            marks={[{ value: 0, label: "0" }, { value: 5, label: "5" }]}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default FilterBar;