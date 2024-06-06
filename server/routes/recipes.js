const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../middleware/authMiddleware');

// Create new recipe (protected route)
router.post('/', verifyToken, async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  try {
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      createdBy: req.user.id
    });
    await recipe.save();
    res.status(201).json({ message: 'Recipe created successfully' });
  } catch (error) {
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
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update recipe by ID (protected route)
router.put('/:id', verifyToken, async (req, res) => {
  const { title, ingredients, instructions } = req.body;
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions },
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

module.exports = router;
