import "./sidebar.css"

function Side({ onFilter }) {
    return (
        <>
            <div className="sidebar">
                <h2 className="sidebar-title">Categories</h2>
                <ul className="categories">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onFilter && onFilter("All"); }}>All</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onFilter && onFilter("Luxurious"); }}>Luxurious</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onFilter && onFilter("Medium"); }}>Medium-size House</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onFilter && onFilter("Normal"); }}>Normal-size House</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onFilter && onFilter("Affordable"); }}>Affordable</a></li>
                </ul>
            </div>
        </>
    )
}

export default Side;