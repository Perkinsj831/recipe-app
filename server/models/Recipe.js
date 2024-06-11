const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  username: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  replies: [
    {
      username: { type: String, required: true },
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ]
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  createdBy: { type: String, required: true },
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
  cuisineType: { type: String },
  difficultyLevel: { type: String },
  dietaryRestrictions: { type: [String] },
  cookingMethod: { type: String },
  calories: { type: Number },
  proteinType: { type: String },
  mealType: { type: String },
  comments: [CommentSchema]
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
