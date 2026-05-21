# Frontend-Backend Connection Setup

## Overview
The frontend (React) and backend (FastAPI) are now connected. The frontend makes HTTP requests to the backend API.

## Running the Application

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (if not already created):
   ```bash
   python -m venv .venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source .venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # or if using pyproject.toml:
   pip install -e .
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn app.app:app --reload --host 0.0.0.0 --port 8000
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup
1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will typically run on `http://localhost:5173`

## API Endpoints

All endpoints are prefixed with `http://localhost:8000`

### Cart Endpoints

#### GET /cart
- Retrieves all items in the cart
- Returns: Array of cart items
- Example: `[{"name": "PS5 Slim", "price": 599.99, "type": "buy"}]`

#### POST /cart
- Adds an item to the cart
- Body:
  ```json
  {
    "name": "Product Name",
    "price": 599.99,
    "type": "buy" or "rent"
  }
  ```
- Returns: Added item with success message

#### DELETE /cart/{item_id}
- Deletes an item from the cart by index
- Parameters: item_id (integer, 0-indexed)
- Returns: Success message

#### POST /cart/clear
- Clears the entire cart
- Returns: Success message

## Frontend API Service

The `src/api.js` file contains all API communication functions:
- `addToCart(name, price, type)` - Add item to cart
- `getCart()` - Fetch all cart items
- `deleteFromCart(itemId)` - Delete item by index
- `clearCart()` - Clear entire cart

## CORS Configuration

CORS is enabled for all origins in the backend. In production, update the `allow_origins` list in `backend/app/app.py` to specify allowed domains.

## Troubleshooting

### Backend not connecting
- Ensure the backend server is running on port 8000
- Check that CORS is enabled (already configured)
- Verify the API_BASE_URL in `src/api.js` matches your backend URL

### Cart not persisting
- Check that `backend/database/cart.json` file exists or is created
- Ensure the backend has write permissions to the database folder

### Frontend requests failing
- Open browser DevTools (F12) and check the Network tab
- Look for CORS errors or connection refused messages
- Verify backend is running with `http://localhost:8000` accessible

## Environment Variables (Optional for Production)

To use environment variables for the API URL, create a `.env` file in the frontend root:
```
VITE_API_BASE_URL=http://localhost:8000
```

Then update `src/api.js` to use:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
```
