import Card from "./Card";
import Side from "./sidebar";
import picture from "./assets/house.jpg";
import { useState, useEffect } from "react";
import { GetrentItems } from "./api";

function Rent({ isLogin }){
  const [stocks, setStocks] = useState([]);
  const [stockMessage, setStockMessage] = useState("");
  
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await GetrentItems();
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
              SoR = {item.SellorRent}
              isLogin={isLogin}
            />
          ))
        )}
    </div>
  </>
    
  );
    
}

export default Rent;