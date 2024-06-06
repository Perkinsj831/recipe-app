import React, { useState } from "react";
import axios from "axios";

const RecipeForm = ({ token }) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/recipes", {
                title,
                ingredients: ingredients.split(","),
                instructions,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setTitle("");
            setIngredients("");
            setInstructions("");
            setError("");
            setSuccess("Recipe created successfully");
        } catch(error) {
            setError("Error creating recipe, please try again.");
            setSuccess("");
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                />
                <input
                type="text"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Ingredients (comma seperated)"
                />
                <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions"
                ></textarea>
                <button type="submit">Add Recipe</button>
            </form>
        </div>
    );
};

export default RecipeForm;