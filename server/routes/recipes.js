const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Create new recipe (protected route)
router.post('/', verifyToken, async (req, res) => {
  const { title, ingredients, instructions, approxTime, servings, imageUrl, proteinType, cuisineType, difficultyLevel, dietaryRestrictions, cookingMethod, calories, mealType } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: "Title, ingredients, and instructions are required." });
  }

  try {
    const user = await User.findById(req.user.id);
    const recipe = new Recipe({
      title,
      ingredients,
      instructions,
      approxTime,
      servings,
      imageUrl,
      createdBy: user.username, // Store username instead of ObjectId
      proteinType,
      cuisineType,
      difficultyLevel,
      dietaryRestrictions,
      cookingMethod,
      calories,
      mealType,
    });

    await recipe.save();
    res.status(201).json({ message: 'Recipe created successfully', recipe });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Search recipes (public route)
router.get('/search', async (req, res) => {
  const {
    searchTerm,
    cuisineType,
    difficultyLevel,
    dietaryRestrictions,
    mealType,
    cookingMethod,
    calories,
    minRating,
    proteinType
  } = req.query;

  try {
    let query = {};

    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { createdBy: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (cuisineType) {
      query.cuisineType = { $regex: cuisineType, $options: 'i' };
    }

    if (difficultyLevel) {
      query.difficultyLevel = { $regex: difficultyLevel, $options: 'i' };
    }

    if (dietaryRestrictions) {
      query.dietaryRestrictions = { $regex: dietaryRestrictions, $options: 'i' };
    }

    if (mealType) {
      query.mealType = { $regex: mealType, $options: 'i' };
    }

    if (cookingMethod) {
      query.cookingMethod = { $regex: cookingMethod, $options: 'i' };
    }

    // if (calories) {
    //   try {
    //     const [minCalories, maxCalories] = JSON.parse(calories);
    //     query.$or = [
    //       { calories: { $gte: minCalories, $lte: maxCalories } },
    //       { calories: { $exists: false } },
    //     ];
    //   } catch (error) {
    //     return res.status(400).json({ error: 'Invalid calories format' });
    //   }
    // }

    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    if (proteinType) {
      query.proteinType = { $regex: proteinType, $options: 'i' };
    }

    console.log('Search query:', query);

    const recipes = await Recipe.find(query);
    res.json({ recipes });
  } catch (error) {
    console.error('Error during search:', error.message);
    res.status(500).json({ error: error.message });
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
  const { title, ingredients, instructions, approxTime, servings, proteinType, cuisineType, difficultyLevel, dietaryRestrictions, cookingMethod, calories, mealType } = req.body;
  try {
    const recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      { title, ingredients, instructions, approxTime, servings, proteinType, cuisineType, difficultyLevel, dietaryRestrictions, cookingMethod, calories, mealType },
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
router.post('/:id/saved', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.savedRecipes.includes(req.params.id)) {
      user.savedRecipes.push(req.params.id);
      await user.save();
    }
    res.status(200).json({ message: 'Recipe saved to profile' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Unsave recipe from user profile (protected route)
router.post('/:id/unsave', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user.savedRecipes.includes(req.params.id)) {
      user.savedRecipes.pull(req.params.id);
      await user.save();
    }
    res.status(200).json({ message: 'Recipe removed from profile' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rate a recipe (protected route)
router.post('/:id/rate', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const userRating = recipe.ratings.find(r => r.userId.toString() === req.user.id);
    if (userRating) {
      userRating.rating = req.body.rating;
    } else {
      recipe.ratings.push({ userId: req.user.id, rating: req.body.rating });
    }

    await recipe.save();
    const averageRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length;
    recipe.averageRating = averageRating;
    await recipe.save();
    res.status(200).json({ message: 'Rating saved successfully', averageRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
