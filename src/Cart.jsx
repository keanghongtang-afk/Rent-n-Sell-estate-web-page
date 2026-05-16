import "./Cart.css";
function Cart() {
    var cart = [
        {
            name: "PS5 Slim",
            price: 599.99,
            qty: 2
        },
        {
            name: "PS5 Slim",
            price: 599.99,
            qty: 1
        }
    ];
    return (
        <>
            <div className="container">
                <center><b style={{ fontSize: "40px" }}>Your Cart</b></center>
                <hr />
                <div className="cart-container">
                    <div className="cart-header">
                        <h2>Name</h2>
                        <p>Quantity</p>
                        <p>Price</p>
                    </div>
                    {cart.map((item) => {
                        return (
                            <div className="cart-item">
                                <h2>{item.name}</h2>
                                <p>{item.qty}</p>
                                <p>{item.price * item.qty}$</p>
                            </div>
                        )
                    })}
                </div>
                <hr />
                <div className="total">
                    <h2>Total: </h2>
                    <p>{cart.reduce((total, item) => total + (item.price * item.qty), 0)}$</p>
                    <p>{cart.reduce((total, item) => total + (item.price * item.qty), 0) * 4000}Riel</p>
                </div>
                <center>
                    <button className="order-btn">Order</button>
                    <button className="shop-btn">Continue Shopping</button>
                </center>
            </div>
        </>
    )
}

export default Cart;