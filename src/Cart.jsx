import { useState, useEffect } from "react";
import { getCart, deleteFromCart, clearCart } from "./api";
import "./Cart.css";

function Cart({ isLogin }) {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getCart();
            setCart(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch cart:", err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch cart items on component mount
    useEffect(() => {
        let isMounted = true;
        const initLoad = async () => {
            try {
                const data = await getCart();
                if (isMounted) setCart(Array.isArray(data) ? data : []);
            } catch (err) {
                if (isMounted) setError(err.message);
                console.error("Failed to fetch initial cart:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };
        initLoad();
        
        return () => { isMounted = false; };
    }, []);

    const handleDeleteItem = async (index) => {
        try {
            await deleteFromCart(index);
            await fetchCart();
        } catch (err) {
            alert(`Failed to delete item: ${err.message}`);
        }
    };

    const handleOrder = async () => {
        if (!isLogin) {
            alert("Please login to place an order.");
            return;
        }
        try {
            await clearCart();
            alert("Your order has been placed successfully!");
            await fetchCart();
        } catch (err) {
            alert(`Failed to place order: ${err.message}`);
        }
    };

    if (loading) {
        return <div className="container"><center>Loading cart...</center></div>;
    }

    if (error) {
        return <div className="container"><center>Error: {error}</center></div>;
    }

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
                        cart.map((item, index) => {
                            return (
                                <div className="cart-item" key={index}>
                                    <p>{item.name}</p>
                                    <p>{item.type || "N/A"}</p>
                                    <p>${item.price}</p>
                                    <button 
                                        onClick={() => handleDeleteItem(index)}
                                        style={{ padding: "5px 10px", cursor: "pointer" }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )
                        })
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
                <center>
                    <button 
                        className="order-btn"
                        onClick={handleOrder}
                        disabled={cart.length === 0}
                    >
                        Order
                    </button>
                    <button className="shop-btn">Continue Shopping</button>
                </center>
            </div>
        </>
    )
}

export default Cart;