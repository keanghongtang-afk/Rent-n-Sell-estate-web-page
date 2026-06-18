import { Link } from "react-router-dom";
import { House } from "lucide-react";
import { BsCart2 } from "react-icons/bs";
import "./navbar.css";

function Navbar(props) {
    if (props.islogin) {
        return (
            <nav className="navbar">
                <ul className="nav-left">
                    <li><Link to="/"><House /></Link></li>
                    <li><Link to="/rent">Rent</Link></li>
                    <li><Link to="/sell">Sell</Link></li>
                </ul>
                <ul className="nav-right">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/cart"><BsCart2 /></Link></li>
                </ul>
            </nav>
        )
    }

    return (
        <nav className="navbar">
            <ul className="nav-left">
                <li><Link to="/"><House /></Link></li>
                <li><Link to="/rent">Rent</Link></li>
                <li><Link to="/sell">Sell</Link></li>
            </ul>
            <ul className="nav-right">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">SignUp</Link></li>
                <li><Link to="/cart"><BsCart2 /></Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;
