const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Helper function for filtering recipes
const filterRecipes = (recipes, filters) => {
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
    approxTime,
  } = filters;

  let filteredRecipes = recipes;

  if (searchTerm) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.createdBy.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (cuisineType) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.cuisineType && recipe.cuisineType.toLowerCase().includes(cuisineType.toLowerCase())
    );
  }

  if (difficultyLevel) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.difficultyLevel && recipe.difficultyLevel.toLowerCase().includes(difficultyLevel.toLowerCase())
    );
  }

  if (dietaryRestrictions) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.dietaryRestrictions && recipe.dietaryRestrictions.some(restriction =>
        restriction.toLowerCase().includes(dietaryRestrictions.toLowerCase())
      )
    );
  }

  if (mealType) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.mealType && recipe.mealType.toLowerCase().includes(mealType.toLowerCase())
    );
  }

  if (cookingMethod) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.cookingMethod && recipe.cookingMethod.toLowerCase().includes(cookingMethod.toLowerCase())
    );
  }

  if (minRating) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.averageRating >= parseFloat(minRating));
  }

  if (proteinType) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.proteinType && recipe.proteinType.toLowerCase().includes(proteinType.toLowerCase())
    );
  }

  if (approxTime) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.approxTime === approxTime);
  }

  if (calories) {
    const caloriesMap = {
      '100': recipe => recipe.calories < 100,
      '300': recipe => recipe.calories < 300,
      '500': recipe => recipe.calories < 500,
      '1000': recipe => recipe.calories < 1000
    };
    const filterFunction = caloriesMap[calories];
    if (filterFunction) {
      filteredRecipes = filteredRecipes.filter(filterFunction);
    }
  }

  return filteredRecipes;
};

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
    proteinType,
    approxTime
  } = req.query;

  try {
    let recipes = await Recipe.find();
    recipes = filterRecipes(recipes, {
      searchTerm,
      cuisineType,
      difficultyLevel,
      dietaryRestrictions,
      mealType,
      cookingMethod,
      calories,
      minRating,
      proteinType,
      approxTime
    });

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
  const { title, ingredients, instructions, approxTime, servings, imageUrl, proteinType, cuisineType, difficultyLevel, dietaryRestrictions, cookingMethod, calories, mealType } = req.body;

  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: "Title, ingredients, and instructions are required." });
  }

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Update recipe fields
    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    recipe.approxTime = approxTime;
    recipe.servings = servings;
    recipe.imageUrl = imageUrl;
    recipe.proteinType = proteinType;
    recipe.cuisineType = cuisineType;
    recipe.difficultyLevel = difficultyLevel;
    recipe.dietaryRestrictions = dietaryRestrictions;
    recipe.cookingMethod = cookingMethod;
    recipe.calories = calories;
    recipe.mealType = mealType;

    await recipe.save();
    res.json({ message: 'Recipe updated successfully', recipe });
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

// Add comment to recipe (protected route)
router.post('/:id/comments', verifyToken, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text is required." });
  }

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const user = await User.findById(req.user.id);

    recipe.comments.push({
      userId: user._id,
      username: user.username,
      text,
      date: new Date()
    });

    await recipe.save();
    res.status(201).json({ message: 'Comment added successfully', comments: recipe.comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get comments for a recipe (public route)
router.get('/:id/comments', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json({ comments: recipe.comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Add reply to a comment (protected route)
router.post('/:id/comments/:commentId/replies', verifyToken, async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Reply text is required." });
  }

  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const comment = recipe.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const user = await User.findById(req.user.id);

    comment.replies.push({
      userId: user._id,
      username: user.username,
      text,
      date: new Date()
    });

    await recipe.save();
    res.status(201).json({ message: 'Reply added successfully', comments: recipe.comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a comment (protected route)
router.delete('/:id/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const recipeId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user.id;

    console.log(`Deleting comment with ID ${commentId} for recipe ${recipeId} by user ${userId}`); // Debugging statement

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      console.log('Recipe not found');
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const commentIndex = recipe.comments.findIndex(comment => comment.id === commentId);
    if (commentIndex === -1) {
      console.log('Comment not found');
      return res.status(404).json({ error: 'Comment not found' });
    }

    const comment = recipe.comments[commentIndex];
    if (comment.userId.toString() !== userId) {
      console.log('Unauthorized');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    recipe.comments.splice(commentIndex, 1);
    await recipe.save();

    res.json({ message: 'Comment deleted successfully', comments: recipe.comments });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Delete a reply (protected route)
router.delete('/:id/comments/:commentId/replies/:replyId', verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const comment = recipe.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const reply = comment.replies.id(req.params.replyId);
    if (!reply) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    // Check if the reply belongs to the user
    if (reply.userId.toString() !== req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    reply.remove();
    await recipe.save();
    res.json({ message: 'Reply deleted successfully', comments: recipe.comments });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
