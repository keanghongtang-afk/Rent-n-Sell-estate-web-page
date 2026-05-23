// API service for backend communication
const API_BASE_URL = "http://localhost:8000";

/**
 * Add an item to the cart
 * @param {string} name - Item name
 * @param {number} price - Item price
 * @param {string} type - Item type (buy/rent)
 * @returns {Promise<Object>} - Response from backend
 */
export const addToCart = async (name, price, type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price: parseFloat(price),
        type,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to add item to cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

/**
 * Get all items from the cart
 * @returns {Promise<Array>} - Array of cart items
 */
export const getCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

/**
 * Delete an item from the cart by index
 * @param {number} itemId - Index of the item to delete
 * @returns {Promise<Object>} - Response from backend
 */
export const deleteFromCart = async (itemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error deleting from cart:", error);
    throw error;
  }
};

/**
 * Clear the entire cart
 * @returns {Promise<Object>} - Response from backend
 */
export const clearCart = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/clear`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to clear cart: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

/**
 * Sign up a new user
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 */
export const signup = async (name, email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (!response.ok) throw new Error("Signup failed");
    return await response.json();
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
};

/**
 * Login a user
 * @param {string} email 
 * @param {string} password 
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}/${encodeURIComponent(password)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    return data; // Returns True or error string
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};/**
 * Get a user's public profile (name + email) by email
 * @param {string} email
 * @returns {Promise<{Name: string, Email: string}>}
 */
export const getUser = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${encodeURIComponent(email)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("User not found");
    return await response.json();
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};


/**
 * Get stocks
 */
export const getStock = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to get stock");
    return await response.json(); // Array of stocks or "No stock available!"
  } catch (error) {
    console.error("Error fetching stock:", error);
    throw error;
  }
};

/**
 * Add a new stock item (with image)
 * @param {FormData} formData 
 */
export const addStock = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock`, {
      method: "POST",
      body: formData // Fetch automatically sets the correct Content-Type for multipart/form-data
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Failed to add stock");
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
};

export const GetrentItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to get stock");
    return await response.json(); // Array of stocks or "No stock available!"
  } catch (error) {
    console.error("Error fetching stock:", error);
    throw error;
  }
}

export const GetSellItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sell`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to get stock");
    return await response.json(); // Array of stocks or "No stock available!"
  } catch (error) {
    console.error("Error fetching stock:", error);
    throw error;
  }
}
