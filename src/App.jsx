import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "./Card";
import Navbar from "./navbar";
import Side from "./sidebar";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import Profile from "./Profile";
import { getStock } from "./api";
import "./App.css";
import picture from "./assets/house.jpg";

function App() {
  const [islogin, setIslogin] = useState(localStorage.getItem("islogin") === "true");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [stocks, setStocks] = useState([]);
  const [stockMessage, setStockMessage] = useState("");

  const handleSetLogin = (status, email = "") => {
    setIslogin(status);
    localStorage.setItem("islogin", status);
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getStock();
        if (typeof data === "string") {
          setStockMessage(data);
          setStocks([]);
        } else if (Array.isArray(data) && data.length === 0) {
          setStockMessage("No stock available!");
          setStocks([]);
        } else {
          setStocks(data);
          setStockMessage("");
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchStocks();
  }, []);

  return (
    <>
      <Navbar islogin={islogin} setIslogin={handleSetLogin} />
      <Routes>
        <Route path="/" element={
          <>
            <Side />
            <div className="container-items">
              {stockMessage ? (
                <div style={{ padding: "20px", fontSize: "24px", fontWeight: "bold" }}>{stockMessage}</div>
              ) : (
                stocks.map((item, index) => (
                  <Card 
                    key={index}
                    name={item.Item_name} 
                    description={item.item_descripton || item.item_description} 
                    price={item.item_price.toString()} 
                    image={item.Image ? `http://localhost:8000${item.Image}` : picture} 
                    isLogin={islogin}
                  />
                ))
              )}
            </div>
          </>
        } />
        <Route path="/login" element={<Login setLogin={handleSetLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart isLogin={islogin} />} />
        <Route path="/profile" element={<Profile isLogin={islogin} userEmail={userEmail} />} />
      </Routes>
    </>
  )
}

export default App;
