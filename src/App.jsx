import { Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowBigRight } from "lucide-react";
import Card from "./components/Card";
import Navbar from "./components/navbar";
import Detail from "./pages/Detail";
import Side from "./components/sidebar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Profile from "./pages/profile";
import Rent from "./pages/Rent";
import Sell from "./pages/Sell";
import Footer from "./components/footer";
import { getStock, Filter } from "./api";
import "./App.css";

function App() {
  const [islogin, setIslogin] = useState(localStorage.getItem("islogin") === "true");
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");
  const [stocks, setStocks] = useState([]);
  const [stockMessage, setStockMessage] = useState("");
  const textTitle = "Welcome to Real Estate Agent";
  const textIntroduct = "Here you can find your house type with the reasonable price";
  const textfooter = "Login/Signup to browse through the properties like a rich man";
  const [Title, setTitle] = useState("");
  const [introduct,setIntro] = useState("");
  const [footer, setFoot] = useState("");
  const [done, setdone] = useState(false);
  const showItems = [
    {
      Item_name: "Villa",
      item_descripton: "10 meters width, 20 meter length, a beautiful villa reside in the middle of the city",
      item_price: 1000000,
      Image: "/brief_image/image1.jpg",
      SellorRent: "Rent",
    },
    {
      Item_name: "Villa",
      item_descripton: "",
      item_price: 0,
      Image: "/brief_image/image2.jpg",
      SellorRent: "Sell",
    },
    {
      Item_name: "",
      item_descripton: "",
      item_price: 0,
      Image: "/brief_image/image3.jpg",
      SellorRent: "Sell",
    },
    {
      Item_name: "",
      item_descripton: "",
      item_price: 0,
      Image: "/brief_image/image4.jpg",
      SellorRent: "Rent",
    },
    {
      Item_name: "",
      item_descripton: "",
      item_price: 0,
      Image: "/brief_image/image5.jpg",
      SellorRent: "Sell",
    }
  ]
  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setTitle(textTitle.slice(0, i));
      i++;

      if (i > textTitle.length) {
        clearInterval(interval);
      }
    }, 40); // speed

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setIntro(textIntroduct.slice(0, i));
      i++;

      if (i > textIntroduct.length) {
        clearInterval(interval);
      }
    }, 40); // speed

    return () => clearInterval(interval);
  }, []);

    useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setFoot(textfooter.slice(0, i));
      i++;

      if (i > textfooter.length) {
        clearInterval(interval);

        setTimeout(() => {
          setdone(true);
        }, 300);
      }
    }, 30); // speed
    return () => clearInterval(interval);
  }, []);

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
        const data = await getStock();
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
    <div className="app">
      <Navbar islogin={islogin} setIslogin={handleSetLogin} />
      <Routes>
        <Route path="/" element={islogin?
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
                    image={`https://rent-n-sell-estate-web-page.onrender.com/${item.Image}`} 
                    SoR = {item.SellorRent}
                    isLogin={islogin}
                  />
                ))
              )}
            </div>
          </>:
          <div>
            <div className="intro">
              <h1 className="intro-text">{Title}</h1>
              <p  className="intro-text">{introduct}</p>
              <p  className="intro-text">{footer}</p>
              <div>
                <Link to="/login"  className={done?"show":"noshow"}>Login <ArrowBigRight/></Link>
                <Link to="/signup" className={done?"show":"noshow"}>Signup <ArrowBigRight /></Link>
              </div>
            </div>
            <div className="briefing">
              <h1>Our top listing of the month</h1>
              <div className="items">
                {showItems.map((item, index) => (
                  <Card 
                    key={index}
                    name={item.Item_name}
                    description={item.item_descripton || item.item_description}
                    price={item.item_price.toString()}
                    image={`${item.Image}`}
                    SoR={item.SellorRent}
                    isLogin={islogin}
                  />
                ))}
              </div>
            </div>
            <div className="footer">
                <Footer />
            </div>
          </div>

        } />
        <Route path="/login" element={<Login setLogin={handleSetLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart isLogin={islogin} userEmail={userEmail} userName={userName} />} />
        <Route path="/detail" element={<Detail />} />
        <Route path="/profile" element={<Profile isLogin={islogin} userEmail={userEmail} userName={userName} setIslogin={handleSetLogin} />} />
        <Route path="/rent" element={<Rent isLogin={islogin}/>} />
        <Route path="/sell" element={<Sell isLogin={islogin}/>} />
      </Routes>
    </div>
  )
}

export default App;
