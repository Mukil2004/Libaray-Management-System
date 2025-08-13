import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("user"); // Default role as "user"
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [proof, setProof] = useState(null);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (file && allowedTypes.includes(file.type) && file.size <= maxSize) {
            setProof(file);
        } else {
            alert("Invalid file. Please upload a JPG, PNG, or PDF file under 5MB.");
            setProof(null);
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!proof) {
            alert("Please upload a valid proof file.");
            return;
        }

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("password", password);
        formData.append("role", role);
        formData.append("phone", phone);
        formData.append("email", email);
        formData.append("proof", proof);

        try {
            const response = await fetch("http://localhost:5000/add-user", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("Sign-Up successful! Please log in.");
                navigate("/"); // Redirect to Login page
            } else {
                alert(data.message || "Sign-Up failed. Please try again.");
            }
        } catch (error) {
            alert("Server error. Please try again later.");
            console.error("Sign-Up error:", error);
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h2>Sign-Up Page</h2>
            <form onSubmit={handleSignUp} encType="multipart/form-data">
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                />
                <br /><br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br /><br />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br /><br />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
                <br /><br />
                <label>
                    Upload Proof:
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                        required
                    />
                </label>
                <br /><br />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <br /><br />
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;
