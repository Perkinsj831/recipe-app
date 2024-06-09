const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Get user saved recipes (protected route)
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
    proteinType,
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
      recipes = recipes.filter(recipe =>
        recipe.cuisineType && recipe.cuisineType.toLowerCase().includes(cuisineType.toLowerCase())
      );
    }

    if (difficultyLevel) {
      recipes = recipes.filter(recipe =>
        recipe.difficultyLevel && recipe.difficultyLevel.toLowerCase().includes(difficultyLevel.toLowerCase())
      );
    }

    if (dietaryRestrictions) {
      recipes = recipes.filter(recipe =>
        recipe.dietaryRestrictions && recipe.dietaryRestrictions.some(restriction =>
          restriction.toLowerCase().includes(dietaryRestrictions.toLowerCase())
        )
      );
    }

    if (mealType) {
      recipes = recipes.filter(recipe =>
        recipe.mealType && recipe.mealType.toLowerCase().includes(mealType.toLowerCase())
      );
    }

    if (cookingMethod) {
      recipes = recipes.filter(recipe =>
        recipe.cookingMethod && recipe.cookingMethod.toLowerCase().includes(cookingMethod.toLowerCase())
      );
    }

    // if (calories) {
    //   try {
    //     const [minCalories, maxCalories] = JSON.parse(calories);
    //     recipes = recipes.filter(recipe =>
    //       (recipe.calories >= minCalories && recipe.calories <= maxCalories) ||
    //       recipe.calories === undefined ||
    //       recipe.calories === null
    //     );
    //   } catch (error) {
    //     return res.status(400).json({ error: 'Invalid calories format' });
    //   }
    // }

    if (minRating) {
      recipes = recipes.filter(recipe => recipe.averageRating >= parseFloat(minRating));
    }

    if (proteinType) {
      recipes = recipes.filter(recipe =>
        recipe.proteinType && recipe.proteinType.toLowerCase().includes(proteinType.toLowerCase())
      );
    }

    res.json({ savedRecipes: recipes });
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'Error fetching saved recipes' });
  }
});

module.exports = router;
