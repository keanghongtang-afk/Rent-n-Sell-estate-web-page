import { useLocation } from "react-router-dom";
import { addToCart } from "./api";
import "./Card.css";
function Detail(){
    const location = useLocation();
    const { name, description, price, image, SoR, isLogin } = location.state || {};

    const handleRentNow = async () => {
            if (!isLogin) {
                alert("Please login to order or rent items.");
                return;
            }
            try {
                await addToCart(name, price, "rent");
                alert(`${name} has been added to your rent list`);
            } catch (error) {
                alert(`Failed to add ${name} to cart: ${error.message}`);
            }
        };
    
        const handleBuyNow = async () => {
            if (!isLogin) {
                alert("Please login to order or buy items.");
                return;
            }
            try {
                await addToCart(name, price, "buy");
                alert(`${name} has been added to your buy list`);
            } catch (error) {
                alert(`Failed to add ${name} to cart: ${error.message}`);
            }
        };
    return(
        <>
            <div className="container">
                <div className="pics">
                    {image ? (
                        <img src={image} alt={name} style={{ maxWidth: '100%' }} />
                    ) : (
                        <p>No image available</p>
                    )}
                </div>
                <h3>{name}</h3>
                <h5>Price: ${price}</h5>
                <div className="desciption">
                    <p>{description}</p>
                </div>
                {SoR == "Sell"?<button className="btn" onClick={handleBuyNow}>Buy Now</button>:<button className="btn" onClick={handleRentNow}>Rent Now</button>}
            </div>
        </>
    );
}

export default Detail;