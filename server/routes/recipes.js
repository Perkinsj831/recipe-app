const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Create new recipe (protected route)
router.post('/', verifyToken, async (req, res) => {
  const { title, ingredients, instructions, approxTime, servings, imageUrl } = req.body;

  console.log('Request body:', req.body);

  if (!title || !ingredients || !instructions) {
    console.error('Validation error: Title, ingredients, and instructions are required.');
    return res.status(400).json({ error: "Title, ingredients, and instructions are required." });
  }

  try {
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      approxTime,
      servings,
      imageUrl,
      createdBy: req.user.id
    });

    await recipe.save();
    console.log('Recipe created successfully:', recipe);
    res.status(201).json({ message: 'Recipe created successfully' });
  } catch (error) {
    console.error('Error creating recipe:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get all recipes (public route)
router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get recipe by ID (public route)
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update recipe by ID (protected route)
router.put('/:id', verifyToken, async (req, res) => {
  const { title, ingredients, instructions, approxTime, servings } = req.body;
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions, approxTime, servings },
      { new: true }
    );
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete recipe by ID (protected route)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Save recipe to user profile (protected route)
router.post('/:id/save', verifyToken, async (req, res) => {
  console.log('Save recipe request:', req.params.id);  // Log the request
  console.log('User ID from token:', req.user.id);     // Log the user ID from the token
  try {
    const user = await User.findById(req.user.id);
    console.log('User found:', user);                  // Log the user object

    if (!user.savedRecipes.includes(req.params.id)) {
      user.savedRecipes.push(req.params.id);
      await user.save();
    }
    console.log('Recipe saved successfully:', req.params.id);
    res.status(200).json({ message: 'Recipe saved to profile' });
  } catch (error) {
    console.error('Error saving recipe:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Unsave recipe from user profile (protected route)
router.post('/:id/unsave', verifyToken, async (req, res) => {
  console.log('Unsave recipe request:', req.params.id);  // Log the request
  console.log('User ID from token:', req.user.id);       // Log the user ID from the token
  try {
    const user = await User.findById(req.user.id);
    console.log('User found:', user);                    // Log the user object

    if (user.savedRecipes.includes(req.params.id)) {
      user.savedRecipes.pull(req.params.id);
      await user.save();
    }
    console.log('Recipe unsaved successfully:', req.params.id);
    res.status(200).json({ message: 'Recipe removed from profile' });
  } catch (error) {
    console.error('Error unsaving recipe:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
