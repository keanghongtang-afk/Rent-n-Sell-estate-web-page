import { Link } from "react-router-dom";
import './Login.css';

function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        <center>
          <h2>Login</h2>
        </center>
        <label>
          Email:
          <input type="email" placeholder="Enter your email" required />
        </label>
        <label>
          Password:
          <input type="password" placeholder="Enter your password" required />
        </label>
        <button type="submit">Login</button>
        <p>Don't have an account?<Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
}

export default Login;
