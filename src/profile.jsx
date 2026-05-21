import { useState, useEffect } from "react";
import { addStock, getStock } from "./api";
import Card from "./Card";
import picture from "./assets/house.jpg";
import "./profile.css";

function Profile({ isLogin, userEmail }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("Sell");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [myListings, setMyListings] = useState([]);

  const fetchMyListings = async () => {
    try {
      const data = await getStock();
      if (Array.isArray(data)) {
        const userListings = data.filter(item => item.owner === userEmail);
        setMyListings(userListings);
      } else {
        setMyListings([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const initLoad = async () => {
      try {
        const data = await getStock();
        if (isMounted) {
          if (Array.isArray(data)) {
            const userListings = data.filter(item => item.owner === userEmail);
            setMyListings(userListings);
          } else {
            setMyListings([]);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isLogin && userEmail) {
      initLoad();
    }
    
    return () => { isMounted = false; };
  }, [isLogin, userEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      setError("You must be logged in to add a listing.");
      return;
    }

    if (!imageFile) {
      setError("Please select an image file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("listing_type", type);
    formData.append("owner", userEmail);
    formData.append("image", imageFile);

    try {
      await addStock(formData);
      alert("Listing added successfully!");
      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setType("Sell");
      setImageFile(null);
      e.target.reset(); // Reset file input
      
      // Refresh listings
      fetchMyListings();
    } catch (err) {
      setError(err.message || "Failed to add listing.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        alert("Only JPG/JPEG files are allowed!");
        e.target.value = "";
        setImageFile(null);
      } else {
        setImageFile(file);
      }
    }
  };

  if (!isLogin) {
    return <div className="container" style={{ textAlign: "center", marginTop: "50px" }}><h2>Please log in to view your profile and add listings.</h2></div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-form-card">
        <h2>Add a House to Rent or Sell</h2>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            House Name:
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
          </label>
          <label>
            Price ($):
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </label>
          <label>
            Listing Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
            </select>
          </label>
          <label>
            House Image (JPG/JPEG only):
            <input type="file" accept=".jpg, .jpeg" onChange={handleFileChange} required />
          </label>
          <button type="submit">Submit Listing</button>
        </form>
      </div>

      {myListings.length > 0 && (
        <div className="user-listings">
          <h2>Your Listings</h2>
          <div className="listings-grid">
            {myListings.map((item, index) => (
              <Card 
                key={index}
                name={item.Item_name} 
                description={item.item_descripton || item.item_description} 
                price={item.item_price.toString()} 
                image={item.Image ? `http://localhost:8000${item.Image}` : picture} 
                isLogin={isLogin}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;