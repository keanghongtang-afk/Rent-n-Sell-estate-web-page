import "./sidebar.css"

function Side() {
    return (
        <>
            <div className="sidebar">
                <h2 className="sidebar-title">Categories</h2>
                <ul className="categories">
                    <li><a href="#">Electronics</a></li>
                    <li><a href="#">Furniture</a></li>
                    <li><a href="#">Vehicles</a></li>
                    <li><a href="#">Sports Equipment</a></li>
                    <li><a href="#">Musical Instruments</a></li>
                    <li><a href="#">Fashion</a></li>
                    <li><a href="#">Books</a></li>
                    <li><a href="#">Home & Garden</a></li>
                    <li><a href="#">Toys & Games</a></li>
                    <li><a href="#">Others</a></li>
                </ul>
            </div>
        </>
    )
}

export default Side;