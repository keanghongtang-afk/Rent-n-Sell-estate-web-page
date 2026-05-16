import "./Cart.css";
function Cart() {
    var cart = sessionStorage.getItem("cart") ? JSON.parse(sessionStorage.getItem("cart")) : [];
    console.log(cart);
    return (
        <>
            <h1 className="cart-title">Your Cart</h1>
            <div className="cart-container">
                {cart.map((item) => {
                    return (
                        <div className="cart-item">
                            <img src={item.image} alt={item.name} />
                            <h2>{item.name}</h2>
                            <p>{item.price}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default Cart;