import { Link } from "react-router-dom";
import "./navbar.css";
import cart from "./assets/cart.jpg";
import logo from "./assets/logo.jpg"
function Navbar(props) {
    if (props.islogin) {
        return (
            <nav className="navbar">
                <ul className="nav-left">
                    <li><Link to="/"><img src={logo} alt="logo" width="40px" /></Link></li>
                    <li><Link to="/rent"><a href="#">Rent</a></Link></li>
                    <li><Link to="/sell"><a href="#">Sell</a></Link></li>
                </ul>
                <ul className="nav-right">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><Link to="/cart"><img src={cart} alt="cart" width="25px" /></Link></li>
                </ul>
            </nav>
        )
    }

    return (
        <nav className="navbar">
            <ul className="nav-left">
                <li><Link to="/"><img src={logo} alt="logo" width="40px" /></Link></li>
                <li><a href="#">Rent</a></li>
                <li><a href="#">Sell</a></li>
            </ul>
            <ul className="nav-right">
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">SignIn</Link></li>
                <li><Link to="/cart"><img src={cart} alt="cart" width="25px" /></Link></li>
            </ul>
        </nav>
    )
}

export default Navbar;
