import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./auth";
import "./styles/LoginSignup.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/login", {
                username,
                password,
            });

            if (response.data.success) {
                login(response.data.data);
                navigate("/");
            }
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("Invalid username or password.");
            } else if (err.response && err.response.status === 400) {
                setError("Username and password are required.");
            } else {
                setError("An error occurred during login. Please try again.");
            }
        }
    };

    return (
        <div className="login-signup-bg">
            <div className="login-signup-card">
                <h3 className="login-signup-title">Login</h3>
                <form className="login-signup-form" onSubmit={handleLogin}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <div className="login-signup-link">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary">Signup here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;