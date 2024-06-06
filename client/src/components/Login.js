import React, { useState } from 'react'
import axios from 'axios'

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5001/api/auth/login", { username, password });
            setToken(response.data.token);
            setError("");
        } catch(error) {
            setError("Invalid credentials, please try again.");
        }
    };

    return (
        <div>
            {error && <p style={{ color: "red"}}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type='text'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder='Username'
                    />
                <input
                    type='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    />
                    <button type='submit'>Login</button>
            </form>
        </div>
    );
};

export default Login;