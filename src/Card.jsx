import Props from "prop-types";
import "./Card.css";
import { addToCart } from "./api";

function Card(props) {
    const handleRentNow = async () => {
        if (!props.isLogin) {
            alert("Please login to order or rent items.");
            return;
        }
        try {
            await addToCart(props.name, props.price, "rent");
            alert(`${props.name} has been added to your rent list`);
        } catch (error) {
            alert(`Failed to add ${props.name} to cart: ${error.message}`);
        }
    };

    const handleBuyNow = async () => {
        if (!props.isLogin) {
            alert("Please login to order or buy items.");
            return;
        }
        try {
            await addToCart(props.name, props.price, "buy");
            alert(`${props.name} has been added to your buy list`);
        } catch (error) {
            alert(`Failed to add ${props.name} to cart: ${error.message}`);
        }
    };

    return (
        <div className="card">
            <div className="img-wrapper">
                <img src={props.image} alt={props.name} />
            </div>
            <h1>{props.name}</h1>
            <p className="description">{props.description}</p>
            <p className="price"><b>Price: ${props.price}</b></p>
            <div className="buttons">
                <button className="btn" onClick={handleRentNow}>Rent Now</button>
                <button className="btn" onClick={handleBuyNow}>Buy Now</button>
            </div>
        </div>
    )
}

Card.propTypes = {
    name: Props.string,
    description: Props.string,
    price: Props.string,
    image: Props.string,
    isLogin: Props.bool
}

Card.defaultProps = {
    name: "Unknown",
    description: "Unknown",
    price: "Unknown",
    image: "Unknown",
    isLogin: false
}

export default Card;