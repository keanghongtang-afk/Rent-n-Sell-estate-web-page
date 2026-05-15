import Card from "./Card";
import Navbar from "./navbar";
import Side from "./sidebar";
import "./App.css";
import picture from "./src/assets/house.jpg";
function App() {

  return (
    <>
      <Navbar />
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
  )
}

export default App
