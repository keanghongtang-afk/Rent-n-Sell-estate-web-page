from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import json
import os
import shutil
import uuid
from app.shcema import UserSignup,CartItem,Stock
from app.FilePath import CartPath, UsersPath, Stockspath

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


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

@app.get("/users/{user_email}")
def get_user(user_email: str):
    try:
        with open(UsersPath, "r") as f:
            Users = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        Users = []
    for user in Users:
        if user["Email"] == user_email:
            return {"Name": user["Name"], "Email": user["Email"]}
    raise HTTPException(status_code=404, detail="User not found")

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
    Item: Stock
):
    if Stock.image.content_type not in ["image/jpeg", "image/jpg"]:
        raise HTTPException(status_code=400, detail="Only JPG/JPEG files are allowed.")
        
    try:
        with open(Stockspath, 'r') as f:
            Stocks = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        Stocks = []
        
    if Stock.price < 0:
        Stock.price = 100.0
    if Stock.listing_type.capitalize() not in ["Sell", "Rent"]:
        return "You can only Sell or Rent your house!"
        
    # Save the file
    file_extension = os.path.splitext(Stock.image.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(Stock.image.file, buffer)
        
    image_url = f"/uploads/{unique_filename}"

    new_stock = {
        "Image": image_url,
        "Item_name": Stock.name,
        "item_descripton": Stock.description,
        "item_price": Stock.price,
        "SellorRent": Stock.listing_type,
        "owner": Stock.owner
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

@app.get("/rent")
def get_rent_items():
    try:
        with open(Stockspath,'r') as f:
            Items = json.load(f)
    except (FileNotFoundError,json.JSONDecodeError):
        return "No Renting Item Availlable"
    Rent_items = []
    for item in Items:
        if item["SellorRent"] == "Rent":
            Rent_items.append(item)
    return Rent_items
        
@app.get("/sell")
def get_sell_items():
    try:
        with open(Stockspath,'r') as f:
            Items = json.load(f)
    except (FileNotFoundError,json.JSONDecodeError):
        return "No Renting Item Availlable"
    Sell_items = []
    for item in Items:
        if item["SellorRent"] == "Sell":
            Sell_items.append(item)
    return Sell_items

