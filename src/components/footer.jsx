
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer(){

    return (
       <footer className="footer">
            <div className="footer-container">

              <div className="footer-left">
                <h2>Real Estate Agent</h2>
                <p>+855 895678117</p>
                <p>realestate@gmail.com</p>
              </div>

              <div className="footer-middle">
                <h3>Quick Links</h3>
                <p><Link to="/rent" className="link">Rent</Link></p>
                <p><Link to="/sell" className="link">Sell</Link></p>
              </div>

              <div className="footer-right">
                <h3>About</h3>
                <p>Find your dream property easily with us.</p>
              </div>

            </div>

            <div className="footer-bottom">
              © 2026 Rent-N-Sell. All rights reserved.
            </div>
        </footer>
    );
}