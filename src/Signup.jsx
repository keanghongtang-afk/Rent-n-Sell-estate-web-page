import { Link } from "react-router-dom";
import './Login.css';

function Signup() {
    return (
        <div className="login-container">
            <form className="login-form">
                <center>
                    <h2>Signup</h2>
                </center>
                <label>
                    Name:
                    <input type="text" placeholder="Enter your name" required />
                </label>
                <label>
                    Email:
                    <input type="email" placeholder="Enter your email" required />
                </label>
                <label>
                    Password:
                    <input type="password" placeholder="Enter your password" required />
                </label>
                <button type="submit">Signup</button>
                <p>Already have an account?<Link to="/login">Login</Link></p>
            </form>
        </div>
    );
}

export default Signup;
