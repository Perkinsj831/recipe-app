const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');

// Get user profile (protected route)
router.get('/', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('savedRecipes');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ savedRecipes: user.savedRecipes });
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
