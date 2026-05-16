import { Routes, Route } from "react-router-dom";
import Card from "./Card";
import Navbar from "./navbar";
import Side from "./sidebar";
import Login from "./Login";
import Signup from "./Signup";
import Cart from "./Cart";
import "./App.css";
import picture from "./assets/house.jpg";

function App() {
  var islogin = false;
  return (
    <>
      <Navbar islogin={islogin} />
      <Routes>
        <Route path="/" element={
          <>
            <Side />
            <div className="container-items">
              <Card name="PS5 Slim" description="Sony PlayStation 5 Slim Disc Edition Console" price="599.99" image={picture} />
              <Card name="Xbox Series X" description="Microsoft Xbox Series X Console" price="499.99" image={picture} />
              <Card name="Nintendo Swit ch" description="Nintendo Switch Console" price="299.99" image={picture} />
              <Card name="Nintendo Swit ch" description="Nintendo Switch Console" price="299.99" image={picture} />
              <Card name="Nintendo Swit ch" description="Nintendo Switch Console" price="299.99" image={picture} />
              <Card name="Nintendo Swit ch" description="Nintendo Switch Console" price="299.99" image={picture} />
              <Card name="Nintendo Swit ch" description="Nintendo Switch Console" price="299.99" image={picture} />
            </div>
          </>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  )
}

export default App
