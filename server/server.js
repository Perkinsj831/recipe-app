const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;
require('dotenv').config();

// Middleware to parse JSON
app.use(express.json());
app.use(cors());

// Import routes
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const profileRoutes = require('./routes/profile'); // Import the profile route
const { verifyToken } = require('./middleware/authMiddleware');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/profile', profileRoutes); // Use the profile route

// Protect specific routes with JWT middleware
app.post('/api/recipes', verifyToken, recipeRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, Recipe App!');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
