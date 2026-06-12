// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_URL;
// ─────────────────────────────────────────────
//  Cart (localStorage-based — no backend calls)
// ─────────────────────────────────────────────

/**
 * Internal helper – reads cart array from localStorage
 * @returns {Array}
 */
const getCartLocal = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Add an item to the cart (localStorage)
 * @param {string} name
 * @param {number|string} price
 * @param {string} type - "buy" | "rent"
 * @returns {Object}
 */
export const addToCart = (name, price, type) => {
  const cart = getCartLocal();
  cart.push({ name, price: parseFloat(price), type });
  localStorage.setItem("cart", JSON.stringify(cart));
  return { name, price: parseFloat(price), type, message: "Item added to cart successfully" };
};

/**
 * Get all items from the cart (localStorage)
 * @returns {Array}
 */
export const getCart = () => {
  return getCartLocal();
};


/**
 * Delete an item from the cart by index (localStorage)
 * @param {number} itemId
 * @returns {string|Object}
 */
export const deleteFromCart = (itemId) => {
  const cart = getCartLocal();
  if (itemId >= 0 && itemId < cart.length) {
    const name = cart[itemId].name;
    cart.splice(itemId, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    return `You have successfully deleted ${name} from your cart`;
  }
  return { error: "Item not found" };
};

/**
 * Clear the entire cart (localStorage)
 * @returns {string}
 */
export const clearCart = () => {
  localStorage.setItem("cart", JSON.stringify([]));
  return "Your cart has been cleared!";
};

// ─────────────────────────────────────────────
//  Auth
// ─────────────────────────────────────────────

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
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Signup failed (HTTP ${response.status}): ${errorText}`);
    }
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
    const response = await fetch(`${API_BASE_URL}/users/login/${encodeURIComponent(email)}?user_password=${encodeURIComponent(password)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Login failed (HTTP ${response.status}): ${errorText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

/**
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

// ─────────────────────────────────────────────
//  Stock
// ─────────────────────────────────────────────

/**
 * Get all stock items
 */
export const getStock = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to get stock");
    return await response.json();
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
      body: formData
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add stock (HTTP ${response.status}): ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error adding stock:", error);
    throw error;
  }
};

/**
 * Delete a stock/property by its name (called after successful purchase/rent)
 * @param {string} name - The Item_name of the property to delete
 */
export const deleteStockByName = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/delete-by-name/${encodeURIComponent(name)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete stock (HTTP ${response.status}): ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting stock:", error);
    throw error;
  }
};

export const GetrentItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/rent`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to get rent items");
    return await response.json();
  } catch (error) {
    console.error("Error fetching rent items:", error);
    throw error;
  }
};

export const GetSellItems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/sell`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to get sell items");
    return await response.json();
  } catch (error) {
    console.error("Error fetching sell items:", error);
    throw error;
  }
};

export const Filter = async (filter) => {
  try {
    const response = await fetch(`${API_BASE_URL}/stock/${filter}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to fetch");
    return await response.json();
  } catch (e) {
    console.log(e);
    throw e;
  }
};

// ─────────────────────────────────────────────
//  Orders
// ─────────────────────────────────────────────

/**
 * Place an order with cart items
 * Sends customer info to backend which will notify property owners via email
 * @param {string} customerEmail - Customer's email address
 * @param {string} customerName - Customer's username/name
 * @param {Array} items - Cart items array [{name, price, type}, ...]
 * @returns {Promise<Object>} Order confirmation with results
 */
export const placeOrder = async (customerEmail, customerName, items) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_email: customerEmail,
        customer_name: customerName,
        items: items
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to place order`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/**
 * Get all orders (admin/dashboard view)
 */
export const getAllOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to fetch orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Get customer's orders by email
 * @param {string} customerEmail - Customer's email address
 */
export const getCustomerOrders = async (customerEmail) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(customerEmail)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });
    if (!response.ok) throw new Error("Failed to fetch customer orders");
    return await response.json();
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
};