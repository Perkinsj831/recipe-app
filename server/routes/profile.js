const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../middleware/authMiddleware');

// Get user profile (protected route)
router.get('/saved', verifyToken, async (req, res) => {
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
    const user = await User.findById(req.user.id).populate('savedRecipes');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let recipes = user.savedRecipes;

    if (searchTerm) {
      recipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cuisineType) {
      recipes = recipes.filter(recipe => recipe.cuisineType && recipe.cuisineType.toLowerCase().includes(cuisineType.toLowerCase()));
    }

    if (difficultyLevel) {
      recipes = recipes.filter(recipe => recipe.difficultyLevel && recipe.difficultyLevel.toLowerCase().includes(difficultyLevel.toLowerCase()));
    }

    if (dietaryRestrictions) {
      recipes = recipes.filter(recipe => 
        recipe.dietaryRestrictions && recipe.dietaryRestrictions.some(restriction => restriction.toLowerCase().includes(dietaryRestrictions.toLowerCase()))
      );
    }

    if (mealType) {
      recipes = recipes.filter(recipe => recipe.mealType && recipe.mealType.toLowerCase().includes(mealType.toLowerCase()));
    }

    if (cookingMethod) {
      recipes = recipes.filter(recipe => recipe.cookingMethod && recipe.cookingMethod.toLowerCase().includes(cookingMethod.toLowerCase()));
    }

    if (minRating) {
      recipes = recipes.filter(recipe => recipe.averageRating >= parseFloat(minRating));
    }

    if (proteinType) {
      recipes = recipes.filter(recipe => recipe.proteinType && recipe.proteinType.toLowerCase().includes(proteinType.toLowerCase()));
    }

    res.json({ savedRecipes: recipes });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'Error fetching saved recipes' });
  }
});

// Get user's uploaded recipes (protected route)
router.get('/uploaded', verifyToken, async (req, res) => {
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
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let recipes = await Recipe.find({ createdBy: user.username });

    if (searchTerm) {
      recipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (cuisineType) {
      recipes = recipes.filter(recipe => recipe.cuisineType && recipe.cuisineType.toLowerCase().includes(cuisineType.toLowerCase()));
    }

    if (difficultyLevel) {
      recipes = recipes.filter(recipe => recipe.difficultyLevel && recipe.difficultyLevel.toLowerCase().includes(difficultyLevel.toLowerCase()));
    }

    if (dietaryRestrictions) {
      recipes = recipes.filter(recipe => 
        recipe.dietaryRestrictions && recipe.dietaryRestrictions.some(restriction => restriction.toLowerCase().includes(dietaryRestrictions.toLowerCase()))
      );
    }

    if (mealType) {
      recipes = recipes.filter(recipe => recipe.mealType && recipe.mealType.toLowerCase().includes(mealType.toLowerCase()));
    }

    if (cookingMethod) {
      recipes = recipes.filter(recipe => recipe.cookingMethod && recipe.cookingMethod.toLowerCase().includes(cookingMethod.toLowerCase()));
    }

    if (minRating) {
      recipes = recipes.filter(recipe => recipe.averageRating >= parseFloat(minRating));
    }

    if (proteinType) {
      recipes = recipes.filter(recipe => recipe.proteinType && recipe.proteinType.toLowerCase().includes(proteinType.toLowerCase()));
    }

    res.json({ uploadedRecipes: recipes });
  } catch (error) {
    console.error('Error fetching uploaded recipes:', error);
    res.status(500).json({ error: 'Error fetching uploaded recipes' });
  }
});

// Update user's uploaded recipe (protected route)
router.put('/uploaded/:id', verifyToken, async (req, res) => {
  const {
    title,
    ingredients,
    instructions,
    approxTime,
    servings,
    imageUrl,
    proteinType,
    cuisineType,
    difficultyLevel,
    dietaryRestrictions,
    cookingMethod,
    calories,
    mealType
  } = req.body;

  try {
    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.username },
      {
        title,
        ingredients,
        instructions,
        approxTime,
        servings,
        imageUrl,
        proteinType,
        cuisineType,
        difficultyLevel,
        dietaryRestrictions,
        cookingMethod,
        calories,
        mealType
      },
      { new: true }
    );

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found or you are not authorized to update this recipe' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Error updating recipe' });
  }
});

module.exports = router;
