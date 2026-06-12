import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login, getUser } from "../api";
import './Login.css';

function Login({ setLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(email, password);
      if (result) {
        // Fetch real name and cache it
        let realName = "";
        try {
          const userData = await getUser(email);
          realName = userData.Name || "";
        } catch (_) { /* silently ignore, name will fall back to email prefix */ }
        setLogin(true, email, realName);
        alert("Logged in successfully!");
        navigate("/");
      } else {
        console.log(result.error)
        setError(result.error || "Login failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong during login");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <center>
          <h2>Login</h2>
        </center>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
        <button type="submit">Login</button>
        <p>Don't have an account?<Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
}

export default Login;
