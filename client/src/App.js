import React, { useState } from "react";
import Login from "./components/Login";
import RecipeList from "./components/RecipeList";
import RecipeForm from "./components/RecipeForm";

const App = () => {
  const [token, setToken] = useState("");

  return (
    <div>
      {token ? (
        <>
          <RecipeForm token={token} />
          <RecipeList />
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </div>
  );
};

export default App;
