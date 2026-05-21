import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "./api";
import './Login.css';

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signup(name, email, password);
            alert("Signup successful! Please login.");
            navigate("/login");
        } catch (err) {
            setError(err.message || "Something went wrong during signup");
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <center>
                    <h2>Signup</h2>
                </center>
                {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
                <label>
                    Name:
                    <input 
                        type="text" 
                        placeholder="Enter your name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required 
                    />
                </label>
                <label>
                    Email:
                    <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </label>
                <label>
                    Password:
                    <input 
                        type="password" 
                        placeholder="Enter your password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </label>
                <button type="submit">Signup</button>
                <p>Already have an account?<Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default Signup;
