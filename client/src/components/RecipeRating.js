import React from 'react';
import Rating from 'react-rating-stars-component';

const RecipeRating = ({ recipeId, currentRating, onRatingChange }) => {
  const handleRatingChange = (newRating) => {
    onRatingChange(recipeId, newRating);
  };

  return (
    <Rating
      count={5}
      value={currentRating}
      onChange={handleRatingChange}
      size={24}
      activeColor="#ffd700"
    />
  );
};

export default RecipeRating;
