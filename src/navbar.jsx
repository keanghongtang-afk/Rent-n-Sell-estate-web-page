import "./navbar.css";
import cart from "./assets/cart.jpg";
import logo from "./assets/logo.jpg"
function Navbar() {
    var isLogin = true;
    if (isLogin == true) {
        return (
            <nav className="navbar">
                <ul className="nav-left">
                    <li><img src={logo} alt="logo" width="40px" /></li>
                    <li><a href="#">Rent</a></li>
                    <li><a href="#">Sell</a></li>
                </ul>
                <ul className="nav-right">
                    <li><a href="#">Profile</a></li>
                    <li><a href="#"><img src={cart} alt="cart" width="25px" /></a></li>
                </ul>
            </nav>
        )
    }

    return (
        <nav className="navbar">
                <ul className="nav-left">
                    <li><img src={logo} alt="logo" width="40px" /></li>
                    <li><a href="#">Rent</a></li>
                    <li><a href="#">Sell</a></li>
                </ul>
                <ul className="nav-right">
                    <li><a href="#">Login</a></li>
                    <li><a href="">SignIn</a></li>
                    <li><a href="#"><img src={cart} alt="cart" width="25px" /></a></li>
                </ul>
            </nav>
    )
}

export default Navbar;
