import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Attempting login with:", { userId, password });

        try {
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.error("Login failed:", data.message || "Unknown error");
                alert(data.message || "Login failed. Please check your credentials.");
                return;
            }

            // Set logged-in state and navigate to dashboard
            setIsLoggedIn(true);
            localStorage.setItem("role", data.role); // Save role if needed
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);
            alert("Network error. Please try again.");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Login Page</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <br />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <br />
                <button type="submit">Login</button>
            </form>
            <br />
            <p>
                Don't have an account?{" "}
                <button onClick={() => navigate("/signup")}>Sign Up</button>
            </p>
        </div>
    );
};

export default Login;
