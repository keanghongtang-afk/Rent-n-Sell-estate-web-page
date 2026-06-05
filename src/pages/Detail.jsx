import { useLocation } from "react-router-dom";
import { addToCart } from "../api";
import "./Detail.css";

function Detail() {
    const location = useLocation();
    const { name, description, price, image, SoR, isLogin } = location.state || {};

    const handleRentNow = () => {
        if (!isLogin) {
            alert("Please login to order or rent items.");
            return;
        }
        addToCart(name, price, "rent");
        alert(`You have added ${name} to your cart`);
    };

    const handleBuyNow = () => {
        if (!isLogin) {
            alert("Please login to order or buy items.");
            return;
        }
        addToCart(name, price, "buy");
        alert(`You have added ${name} to your cart`);
    };

    const formatPrice = (p) => {
        const num = parseFloat(p);
        return isNaN(num) ? p : num.toLocaleString();
    };

    return (
        <div className="detail-page">
            <div className="detail-image-card">
                <div className="detail-img-wrapper">
                    {image ? (
                        <img src={image} alt={name} />
                    ) : (
                        <p style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>No image available</p>
                    )}
                </div>
            </div>

            <div className="detail-info">
                <span className={`detail-badge ${SoR === 'Sell' ? 'detail-badge-sell' : 'detail-badge-rent'}`}>
                    For {SoR === 'Sell' ? 'Sale' : 'Rent'}
                </span>

                <h1 className="detail-title">{name}</h1>

                <div className="detail-price-block">
                    <span className="detail-price-label">Price</span>
                    <span className="detail-price-value">${formatPrice(price)}</span>
                </div>

                <div className="detail-description-section">
                    <h4 className="detail-description-title">Description</h4>
                    <p className="detail-description-text">{description}</p>
                </div>

                {SoR === "Sell" ? (
                    <button className="detail-btn detail-btn-buy" onClick={handleBuyNow}>Buy Now</button>
                ) : (
                    <button className="detail-btn detail-btn-rent" onClick={handleRentNow}>Rent Now</button>
                )}
            </div>
        </div>
    );
}

export default Detail;