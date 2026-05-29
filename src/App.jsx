import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Card from "./Card";
import Navbar from "./navbar";
import Detail from "./Detail";
import Side from "./sidebar";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import Profile from "./Profile";
import Rent from "./Rent";
import Sell from "./Sell";
import { getStock, Filter } from "./api";
import "./App.css";
import picture from "./assets/house.jpg";

function App() {
  const [islogin, setIslogin] = useState(localStorage.getItem("islogin") === "true");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [stocks, setStocks] = useState([]);
  const [stockMessage, setStockMessage] = useState("");

  const handleSetLogin = (status, email = "", name = "") => {
    setIslogin(status);
    localStorage.setItem("islogin", status);
    setUserEmail(email);
    localStorage.setItem("userEmail", email);
    setUserName(name);
    localStorage.setItem("userName", name);
  };

  const handleFilter = async (type) => {
    try {
      let data;
      if (type === "All") {
        data = await getStock();
      } else {
        data = await Filter(type);
      }
      
      if (typeof data === "string") {
        setStockMessage(data);
        setStocks([]);
      } else if (Array.isArray(data) && data.length === 0) {
        setStockMessage(`No ${type} houses available!`);
        setStocks([]);
      } else {
        setStocks(data);
        setStockMessage("");
      }
    } catch (err) {
      console.error(err);
    }
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
            <Side onFilter={handleFilter} />
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
                    SoR = {item.SellorRent}
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
        <Route path="/detail" element={<Detail />} />
        <Route path="/profile" element={<Profile isLogin={islogin} userEmail={userEmail} userName={userName} />} />
        <Route path="/rent" element={<Rent isLogin={islogin}/>} />
        <Route path="/sell" element={<Sell isLogin={islogin}/>} />
      </Routes>
    </>
  )
}

export default App;
