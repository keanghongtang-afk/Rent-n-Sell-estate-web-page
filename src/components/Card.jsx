import Props from "prop-types";
import { Link } from "react-router-dom";
import "./Card.css";
import { addToCart } from "../api";

function Card(props) {
    const handleRentNow = () => {
        if (!props.isLogin) {
            alert("Please login to order or rent items.");
            return;
        }
        addToCart(props.name, props.price, "rent");
        alert(`You have added ${props.name} to your cart`);
    };

    const handleBuyNow = () => {
        if (!props.isLogin) {
            alert("Please login to order or buy items.");
            return;
        }
        addToCart(props.name, props.price, "buy");
        alert(`You have added ${props.name} to your cart`);
    };

    const formatPrice = (price) => {
        const num = parseFloat(price);
        return isNaN(num) ? price : num.toLocaleString();
    };

    return (
        <div className="card">
            <Link to="/detail" state={{ name: props.name, description: props.description, price: props.price, image: props.image, SoR: props.SoR, isLogin: props.isLogin }} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="img-wrapper">
                    <img src={props.image} alt={props.name} />
                    <span className={`badge ${props.SoR === 'Sell' ? 'badge-sell' : 'badge-rent'}`}>
                        For {props.SoR === 'Sell' ? 'Sale' : 'Rent'}
                    </span>
                </div>
                <div className="card-info">
                    <h3 className="card-title">{props.name}</h3>
                    <p className="description">{props.description}</p>
                    <p className="price">
                        <span className="price-label">Price:</span>
                        <span className="price-value"> ${formatPrice(props.price)}</span>
                    </p>
                </div>
            </Link>
            {props.SoR === "Sell" ? (
                <button className="btn btn-buy" onClick={handleBuyNow}>Buy Now</button>
            ) : (
                <button className="btn btn-rent" onClick={handleRentNow}>Rent Now</button>
            )}
        </div>
    )
}

Card.propTypes = {
    name: Props.string,
    description: Props.string,
    price: Props.string,
    image: Props.string,
    SoR: Props.string,
    isLogin: Props.bool
}

Card.defaultProps = {
    name: "Unknown",
    description: "Unknown",
    price: "Unknown",
    image: "Unknown",
    SoR: "Unknown",
    isLogin: false
}

export default Card;