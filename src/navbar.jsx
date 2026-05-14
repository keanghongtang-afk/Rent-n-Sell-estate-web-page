import "./navbar.css"
function Navbar() {
    var isLogin = true;
    if (isLogin == true) {
        return (
            <nav className="navbar">
                <ul className="nav-left">
                    <li><img src="./src/assets/logo.jpg" alt="logo" width="40px" /></li>
                    <li><a href="#">Rent</a></li>
                    <li><a href="#">Sell</a></li>
                </ul>
                <ul className="nav-right">
                    <li><a href="#">Profile</a></li>
                    <li><a href="#"><img src="./src/assets/cart.jpg" alt="cart" width="25px" /></a></li>
                </ul>
            </nav>
        )
    }

    return (
        <nav className="navbar">
            <ul>
                <div className="nav-left">
                    <li><img src="./src/assets/logo.jpg" alt="logo" /></li>
                    <li><a href="#">Rent</a></li>
                    <li><a href="#">Sell</a></li>
                </div>
                <div className="nav-right">
                    <li><a href="#">Login</a></li>
                    <li><a href="#">Sign Up</a></li>
                </div>
                <li><a href="#"><img src="./src/cart.png" alt="cart" /></a></li>
            </ul>
        </nav>
    )
}

export default Navbar;
