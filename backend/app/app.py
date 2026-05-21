from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import json
import os
import shutil
import uuid

app = FastAPI()

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins like ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

CartPath = os.path.join(
    os.path.dirname(__file__),
    "..",
    "database",
    "cart.json"
    )

UsersPath = os.path.join(
    os.path.dirname(__file__),
    "..",
    "database",
    "Users.json"
    )

Stockspath = os.path.join(
    os.path.dirname(__file__),
    "..",
    "database",
    "stocks.json"
    )
class CartItem(BaseModel):
    name: str
    price: float
    type: str

class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class House(BaseModel):
    # This model is kept for documentation/reference, but not used in the endpoint directly because of FormData
    name: str
    description: str
    price: float
    type: str

@app.post("/cart")
def add_item_to_cart(item: CartItem):
    try: 
        with open(CartPath,"r") as f:
            cart = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        cart = []
    cart.append({
        "name": item.name,
        "price": item.price,
        "type": item.type
    })
    
    with open(CartPath,"w") as f:
        json.dump(cart, f,indent=2)
    return {
        "name": item.name,
        "price": item.price,
        "type": item.type,
        "message": "Item added to cart successfully"
    }
    
@app.get("/cart")
def show_items():
    try:
        with open(CartPath,"r") as f:
            cart = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        print("Cart JSON file not found or empty")
        cart = []
    return cart

@app.delete("/cart/{item_id}")
def delete_item(item_id: int):
    try: 
        with open(CartPath,"r") as f:
            cart = json.load(f)
    except FileNotFoundError:
        cart = []
    if 0 <= item_id < len(cart):
        name = cart[item_id]["name"]
        cart.pop(item_id)
        with open(CartPath,'w') as f:
            json.dump(cart,f,indent=2)
        return f"You have successfully deleted {name} from your cart"
    return {"error": "Item not found"}

@app.post("/cart/clear")
def clear_cart():
    try:
        with open(CartPath,"w") as f:
            json.dump([],f,indent=2)
    except FileNotFoundError:
        pass
    return "Your cart has been cleared!"

@app.post("/users")
def signup(
    user: UserSignup
):
    try:
        with open(UsersPath,"r") as f:
            Users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        Users = []
    Users.append({
        "Name": user.name,
        "Email": user.email,
        "Password": user.password
    })
    with open(UsersPath,'w') as f:
        json.dump(Users,f,indent=2)
    
    return {
        "Name": user.name,
        "Email": user.email,
        "Password": user.password
    }

@app.get("/users/{user_email}/{user_password}")
def login(
    user_email: str,
    user_password: str
):
    try:
        with open(UsersPath, "r") as f:
            Users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        Users = []
    for user in Users:
        if user["Email"] == user_email:
            if user["Password"] == user_password:
                return True
            return "Wrong Password or Email! Please try again!"
    return "User not found!"

@app.post("/stock")
def add_item(
    image: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    listing_type: str = Form(...),
    owner: str = Form(...),
):
    if image.content_type not in ["image/jpeg", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPG/JPEG files are allowed.")
        
    try:
        with open(Stockspath, 'r') as f:
            Stocks = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        Stocks = []
        
    if not price:
        price = 100.0
    if listing_type.capitalize() not in ["Sell", "Rent"]:
        return "You can only Sell or Rent your house!"
        
    # Save the file
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    image_url = f"/uploads/{unique_filename}"

    new_stock = {
        "Image": image_url,
        "Item_name": name,
        "item_descripton": description,
        "item_price": price,
        "Sell/Rent": listing_type,
        "owner": owner
    }
    Stocks.append(new_stock)
    
    with open(Stockspath, 'w') as f:
        json.dump(Stocks, f, indent=2)
        
    return new_stock
    
@app.get("/stock")
def Stock_item():
    try:
        with open(Stockspath, 'r') as f:
            Stocks = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return "No stock available!"
    return Stocks