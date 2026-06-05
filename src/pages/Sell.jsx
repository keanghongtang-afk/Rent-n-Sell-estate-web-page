import Card from "../components/Card";
import Side from "../components/sidebar";
import picture from "../assets/house.jpg";
import { useState, useEffect } from "react";
import { GetSellItems, Filter, getStock } from "../api";

function Sell({ isLogin }){
  const [stocks, setStocks] = useState([]);
  const [stockMessage, setStockMessage] = useState("");
  
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
        const data = await GetSellItems();
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
    <Side onFilter={handleFilter}/>
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

export default Sell;