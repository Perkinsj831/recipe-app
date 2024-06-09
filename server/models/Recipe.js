const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  createdBy: { type: String, required: true }, // Store username instead of ObjectId
  approxTime: { type: String },
  servings: { type: Number },
  imageUrl: { type: String },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      rating: { type: Number, required: true }
    }
  ],
  averageRating: { type: Number, default: 0 },
  cuisineType: { type: String }, // New field for cuisine type
  difficultyLevel: { type: String }, // New field for difficulty level
  dietaryRestrictions: { type: [String] }, // New field for dietary restrictions
  cookingMethod: { type: String }, // New field for cooking method
  calories: { type: Number }, // New field for calories
  proteinType: { type: String }, // New field for protein type
  mealType: { type: String }, // New field for meal type
});

// Compute the average rating
RecipeSchema.methods.updateAverageRating = function () {
  if (this.ratings.length === 0) {
    this.averageRating = 0;
  } else {
    const total = this.ratings.reduce((sum, rating) => sum + rating.rating, 0);
    this.averageRating = total / this.ratings.length;
  }
};

// Update the average rating before saving
RecipeSchema.pre('save', function (next) {
  this.updateAverageRating();
  next();
});

// Update the average rating before updating
RecipeSchema.pre('findOneAndUpdate', function (next) {
  this.updateAverageRating();
  next();
});

RecipeSchema.set('toJSON', { virtuals: true });
RecipeSchema.set('toObject', { virtuals: true });

const Recipe = mongoose.model('Recipe', RecipeSchema);
module.exports = Recipe;
