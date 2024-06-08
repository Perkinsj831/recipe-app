const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  createdBy: { type: String, required: true }, // Store username instead of ObjectId
  approxTime: { type: String },
  servings: { type: Number },
  imageUrl: { type: String }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
