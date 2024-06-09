import React, { useState } from 'react';
import { Box, Button, Grid, MenuItem, TextField, InputAdornment, Typography, Slider, FormControl, InputLabel, Select } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const FilterBar = ({ onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cuisineType, setCuisineType] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [mealType, setMealType] = useState('');
  const [cookingMethod, setCookingMethod] = useState('');
  const [calories, setCalories] = useState([0, 2000]);
  const [minRating, setMinRating] = useState(0);
  const [proteinType, setProteinType] = useState('');

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

  const handleCaloriesChange = (event, newValue) => {
    const adjustedValue = [2000 - newValue[1], 2000 - newValue[0]];
    setCalories(adjustedValue);
    onFilter('calories', JSON.stringify(adjustedValue));
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
    setCalories([0, 2000]);
    setMinRating(0);
    setProteinType('');
    onFilter('clear', true);
  };

  return (
    <Box my={2}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={10}>
          <TextField
            fullWidth
            placeholder="Search by recipe or creator"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            variant="outlined"
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
        <Grid item xs={2}>
          <Button
            onClick={clearAllFilters}
            variant="contained"
            color="secondary"
            fullWidth
            startIcon={<ClearAllIcon />}
          >
            Clear Filters
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Cuisine Type</InputLabel>
            <Select value={cuisineType} onChange={handleCuisineTypeChange} label="Cuisine Type">
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
            <InputLabel>Difficulty Level</InputLabel>
            <Select value={difficultyLevel} onChange={handleDifficultyLevelChange} label="Difficulty Level">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Easy">Easy</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Hard">Hard</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Dietary Restrictions</InputLabel>
            <Select value={dietaryRestrictions} onChange={handleDietaryRestrictionsChange} label="Dietary Restrictions">
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
            <InputLabel>Meal Type</InputLabel>
            <Select value={mealType} onChange={handleMealTypeChange} label="Meal Type">
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
            <InputLabel>Cooking Method</InputLabel>
            <Select value={cookingMethod} onChange={handleCookingMethodChange} label="Cooking Method">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Baking">Baking</MenuItem>
              <MenuItem value="Grilling">Grilling</MenuItem>
              <MenuItem value="Slow Cooker">Slow Cooker</MenuItem>
              <MenuItem value="Instant Pot">Instant Pot</MenuItem>
              <MenuItem value="Air Fryer">Air Fryer</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Protein Type</InputLabel>
            <Select value={proteinType} onChange={handleProteinTypeChange} label="Protein Type">
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="Chicken">Chicken</MenuItem>
              <MenuItem value="Beef">Beef</MenuItem>
              <MenuItem value="Pork">Pork</MenuItem>
              <MenuItem value="Fish">Fish</MenuItem>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Vegan">Vegan</MenuItem>
              <MenuItem value="N/A">N/A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12}>
          <Typography gutterBottom>Calories</Typography>
          <Slider
            value={calories.map(value => 2000 - value)}
            onChange={handleCaloriesChange}
            valueLabelDisplay="auto"
            aria-labelledby="range-slider"
            min={0}
            max={2000}
            step={10}
            marks={[{ value: 0, label: '0' }, { value: 2000, label: '2000+' }]}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Typography gutterBottom>Minimum Rating</Typography>
          <Slider
            value={minRating}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            aria-labelledby="discrete-slider"
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
