import { useState, useEffect } from "react";
import { addStock, getStock, getUser } from "./api";
import picture from "./assets/house.jpg";
import "./profile.css";
function Profile({ isLogin, userEmail }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [type, setType] = useState("Sell");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [myListings, setMyListings] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const fetchMyListings = async () => {
    try {
      const data = await getStock();
      if (Array.isArray(data)) {
        const userListings = data.filter((item) => item.owner === userEmail);
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
            const userListings = data.filter((item) => item.owner === userEmail);
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
      // Fetch real name from Users.json via backend
      getUser(userEmail)
        .then((data) => { if (isMounted) setUserName(data.Name || ""); })
        .catch(() => { /* fallback to email prefix silently */ });
    }
    return () => {
      isMounted = false;
    };
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
    setIsSubmitting(true);
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
      setName("");
      setDescription("");
      setPrice("");
      setType("Sell");
      setImageFile(null);
      setImagePreview(null);
      e.target.reset();
      setShowForm(false);
      fetchMyListings();
    } catch (err) {
      setError(err.message || "Failed to add listing.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "image/jpeg" && file.type !== "image/jpg") {
        alert("Only JPG/JPEG files are allowed!");
        e.target.value = "";
        setImageFile(null);
        setImagePreview(null);
      } else {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
      }
    }
  };
  if (!isLogin) {
    return (
      <div className="profile-not-logged-in">
        <h2>You are not logged in</h2>
        <p>Please log in to view your profile and manage your listings.</p>
      </div>
    );
  }
  // Derive display name: real name from DB, else email prefix
  const displayName = userName || (userEmail ? userEmail.split("@")[0] : "User");
  const avatarLetter = displayName.charAt(0).toUpperCase();
  return (
    <div className="profile-page">
      {/* ── Profile Card ── */}
      <div className="profile-hero">
        <div className="profile-avatar-ring">
          <div className="profile-avatar">
          {avatarLetter}
          </div>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{displayName}</h1>
          <div className="profile-meta">
            <span className="profile-meta-item">
              {userEmail}
            </span>
            <span className="profile-meta-item">
              Affiliate: <span className="meta-value">None</span>
            </span>
            <span className="profile-meta-item">
              {myListings.length} listing{myListings.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <button
          id="toggle-listing-form-btn"
          className={`btn-add-listing ${showForm ? "active" : ""}`}
          onClick={() => { setShowForm(!showForm); setError(""); }}
        >
          {showForm ? "✕ Cancel" : "+ Put Item on Rent / Sell"}
        </button>
      </div>
      {/* ── Add Listing Form (toggle) ── */}
      <div className={`listing-form-wrapper ${showForm ? "form-visible" : ""}`}>
        <div className="listing-form-card">
          <h2 className="form-title">
            <span className="form-title-icon">🏡</span>
            New Listing
          </h2>
          {error && <p className="form-error">{error}</p>}
          <form onSubmit={handleSubmit} className="listing-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="house-name">House Name</label>
                <input
                  id="house-name"
                  type="text"
                  placeholder="e.g. Modern Villa in City Center"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="listing-type">Listing Type</label>
                <select
                  id="listing-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Sell">🏷️ Sell</option>
                  <option value="Rent">🔑 Rent</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="house-description">Description</label>
              <textarea
                id="house-description"
                placeholder="Describe the property — location, features, condition..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="house-price">Price ($)</label>
                <input
                  id="house-price"
                  type="number"
                  step="100"
                  min="0"
                  placeholder="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="house-image">House Image (JPG/JPEG)</label>
                <label className="file-upload-label" htmlFor="house-image">
                  <span className="file-upload-icon">📷</span>
                  {imageFile ? imageFile.name : "Choose image…"}
                  <input
                    id="house-image"
                    type="file"
                    accept=".jpg,.jpeg"
                    onChange={handleFileChange}
                    required
                    className="file-input-hidden"
                  />
                </label>
              </div>
            </div>
            {imagePreview && (
              <div className="image-preview-wrapper">
                <img src={imagePreview} alt="Preview" className="image-preview" />
              </div>
            )}
            <button
              id="submit-listing-btn"
              type="submit"
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting…" : "🚀 Submit Listing"}
            </button>
          </form>
        </div>
      </div>
      {/* ── My Listings ── */}
      <div className="my-listings-section">
        <div className="section-header">
          <h2 className="section-title">My Listings</h2>
          <span className="section-count">{myListings.length}</span>
        </div>
        {myListings.length === 0 ? (
          <div className="no-listings">
            <div className="no-listings-icon">🏚️</div>
            <p>You haven't listed any properties yet.</p>
            <button
              className="btn-add-listing"
              onClick={() => setShowForm(true)}
            >
              + Add your first listing
            </button>
          </div>
        ) : (
          <div className="listings-grid">
            {myListings.map((item, index) => {
              const isSold = item.is_sold || item.sold || false;
              const imgSrc = item.Image
                ? `http://localhost:8000${item.Image}`
                : picture;
              return (
                <div key={index} className={`listing-card ${isSold ? "listing-sold" : ""}`}>
                  <div className="listing-img-wrapper">
                    <img
                      src={imgSrc}
                      alt={item.Item_name}
                      className="listing-img"
                    />
                    <span className={`listing-badge ${isSold ? "badge-sold" : "badge-active"}`}>
                      {isSold ? "Sold" : "Active"}
                    </span>
                    <span className="listing-type-tag">
                      {item.SellorRent === "Sell" ? "🏷️ For Sale" : "🔑 For Rent"}
                    </span>
                  </div>
                  <div className="listing-body">
                    <h3 className="listing-name">{item.Item_name}</h3>
                    <p className="listing-desc">
                      {item.item_descripton || item.item_description}
                    </p>
                    <div className="listing-footer">
                      <span className="listing-price">
                        ${Number(item.item_price).toLocaleString()}
                      </span>
                      <span className={`listing-status-text ${isSold ? "status-sold" : "status-active"}`}>
                        {isSold ? "● Sold" : "● Active"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default Profile;