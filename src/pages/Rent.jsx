import Card from "../components/Card";
import Side from "../components/sidebar";
import { useState, useEffect } from "react";
import { GetrentItems, getStock, Filter } from "../api";

function Rent({ isLogin }){
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
          } else if (data && data.error) {
            setStockMessage("Error loading data");
            setStocks([]);
          } else if (Array.isArray(data) && data.length === 0) {
            setStockMessage(`No ${type} houses available!`);
            setStocks([]);
          } else if (Array.isArray(data)) {
            setStocks(data);
            setStockMessage("");
          } else {
            setStockMessage("No stock available!");
            setStocks([]);
          }
        } catch (err) {
          console.error(err);
          setStockMessage("Error loading data");
          setStocks([]);
        }
      };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await GetrentItems();
        if (typeof data === "string") {
          setStockMessage(data);
          setStocks([]);
        } else if (data && data.error) {
          setStockMessage("Error loading data");
          setStocks([]);
        } else if (Array.isArray(data) && data.length === 0) {
          setStockMessage("No stock available!");
          setStocks([]);
        } else if (Array.isArray(data)) {
          setStocks(data);
          setStockMessage("");
        } else {
          setStockMessage("No stock available!");
          setStocks([]);
        }
      } catch (err) {
        console.error(err);
        setStockMessage("Error loading data");
        setStocks([]);
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
              image={`http://localhost:8000${item.Image}`} 
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