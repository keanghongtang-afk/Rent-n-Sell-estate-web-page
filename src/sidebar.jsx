import "./sidebar.css"

function Side() {
    return (
        <>
            <div className="sidebar">
                <h2 className="sidebar-title">Categories</h2>
                <ul className="categories">
                    <li><a href="#">Luxuriuos</a></li>
                    <li><a href="#">Medium-size House</a></li>
                    <li><a href="#">Normal-size House</a></li>
                    <li><a href="#">Affordable</a></li>
                </ul>
            </div>
        </>
    )
}

export default Side;