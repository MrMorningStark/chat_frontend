import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./styles/LoginSignup.css";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const navigate = useNavigate();

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setAvatarPreview(null);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            if (avatar) formData.append("avatar", avatar);


            const response = await axios.post("http://localhost:5000/api/auth/signup", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                setSuccess("Signup successful! You can now login.");
                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setError("Username already exists.");
            } else if (err.response && err.response.status === 400) {
                setError("Username and password are required.");
            } else {
                setError("An error occurred during signup. Please try again.");
            }
        }
    };

    return (
        <div className="login-signup-bg">
            <div className="login-signup-card">
                <h3 className="login-signup-title">Signup</h3>
                <form className="login-signup-form" onSubmit={handleSignup}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
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
                    <div className="mb-3">
                        <label htmlFor="avatar" className="form-label">Avatar</label>
                        <input
                            type="file"
                            className="form-control"
                            id="avatar"
                            accept="image/*"
                            onChange={handleAvatarChange}
                        />
                        {avatarPreview && (
                            <img src={avatarPreview} alt="Avatar Preview" style={{ width: 60, height: 60, borderRadius: "50%", marginTop: 8 }} />
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Signup</button>
                </form>
                <div className="login-signup-link">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
