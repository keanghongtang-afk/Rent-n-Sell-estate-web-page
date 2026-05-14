import Props from "prop-types";
import "./Card.css";

function Card(props) {
    return (
        <div className="card">
            <div className="img-wrapper">
                <img src={props.image} alt={props.name} />
            </div>
            <h1>{props.name}</h1>
            <p className="description">{props.description}</p>
            <p className="price"><b>Price: ${props.price}</b></p>
            <div className="buttons">
                <button className="btn" onClick={() => handleRentNow(props)}>Rent Now</button>
                <button className="btn" onClick={() => handleBuyNow(props)}>Buy Now</button>
            </div>
        </div>
    )
}

function handleRentNow(props) {
    alert(`${props.name} has been added to your rent list`);
}

function handleBuyNow(props) {
    alert(`${props.name} has been added to your buy list`);
}

Card.propTypes = {
    name: Props.string,
    description: Props.string,
    price: Props.string,
    image: Props.string
}

Card.defaultProps = {
    name: "Unknown",
    description: "Unknown",
    price: "Unknown",
    image: "Unknown"
}

export default Card;