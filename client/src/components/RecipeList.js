import React, { useEffect, useState } from "react";
import axios from "axios";

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const response = await axios.get("http://localhost:5001/api/recipes");
                setRecipes(response.data);
                setError("");
            } catch(error) {
                setError("Error fetching recipes, please try again.");
            }
        };

        fetchRecipes();
    }, []);

    return (
        <div>
            <h1>Recipes</h1>
            {error && <p style={{color: "red" }}>{error}</p>}
            <ul>
                {recipes.map((recipe) => (
                    <li key={recipe._id}>{recipe.title}</li>
                ))}
            </ul>
        </div>
    );
};

export default RecipeList;