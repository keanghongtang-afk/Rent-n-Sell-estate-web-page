import { useState, useEffect } from "react";
import { getCart, deleteFromCart, clearCart, placeOrder } from "../api";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart({ isLogin, userEmail, userName }) {
    const [cart, setCart] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load cart from localStorage on mount and whenever the component is focused
    const loadCart = () => {
        const data = getCart();
        setCart(Array.isArray(data) ? data : []);
    };

    useEffect(() => {
        loadCart();
    }, []);

    const handleDeleteItem = (index) => {
        deleteFromCart(index);
        loadCart();
    };

    const handleOrder = async () => {
        if (!isLogin) {
            alert("Please login to place an order.");
            return;
        }
        if (cart.length === 0) return;
        if (!userEmail || !userName) {
            alert("User information is missing. Please login again.");
            return;
        }

        setIsLoading(true);
        try {
            // Prepare cart items for backend
            const items = cart.map(item => ({
                name: item.name,
                price: item.price,
                type: item.type
            }));

            // Send order to backend — backend will email each property owner
            // and delete the stock records automatically
            const response = await placeOrder(userEmail, userName, items);

            // Check if order was successful
            if (response.error) {
                alert(`Order failed: ${response.error}`);
            } else {
                // Clear the local cart
                clearCart();
                loadCart();
                alert("Your order has been placed successfully! Property owners have been notified via email.");
            }
        } catch (err) {
            alert(`Failed to place order: ${err.message}`);
            console.error("Order error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    const totalRiel = total * 4000;

    return (
        <>
            <div className="container">
                <center><b style={{ fontSize: "40px" }}>Your Cart</b></center>
                <hr />
                <div className="cart-container">
                    <div className="cart-header">
                        <h2>Name</h2>
                        <h2>Type</h2>
                        <h2>Price</h2>
                        <h2>Action</h2>
                    </div>
                    {cart.length > 0 ? (
                        cart.map((item, index) => (
                            <div className="cart-item" key={index}>
                                <p>{item.name}</p>
                                <p>{item.type || "N/A"}</p>
                                <p>${item.price}</p>
                                <button
                                    onClick={() => handleDeleteItem(index)}
                                    style={{ padding: "5px 10px", cursor: "pointer", backgroundColor: "black", color: "white" }}
                                >
                                    Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: "20px", textAlign: "center" }}>
                            <p>Your cart is empty</p>
                        </div>
                    )}
                </div>
                <hr />
                <div className="total">
                    <h2>Total: </h2>
                    <p>${total.toFixed(2)}</p>
                    <p>{totalRiel.toFixed(0)} Riel</p>
                </div>
                <center className="btn">
                    <button
                        className="order-btn"
                        onClick={handleOrder}
                        disabled={cart.length === 0 || isLoading}
                    >
                        {isLoading ? "Processing..." : "Order"}
                    </button>
                    <Link to="/"><button className="shop-btn">Continue Shopping</button></Link>
                </center>
            </div>
        </>
    );
}

export default Cart;