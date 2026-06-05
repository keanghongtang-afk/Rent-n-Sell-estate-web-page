import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
from app.schemas import UserSignup, CartItem
from app.services.cart_service import CartService
from app.services.user_service import UserService
from app.services.stock_service import StockService
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://keanghongtang-afk.github.io",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
#
# For Cart functions
# 
@app.post("/cart")
def add_item_to_cart(item: CartItem):
    return CartService.add_item(item)
    
@app.get("/cart")
def show_items():
    return CartService.get_items()
@app.delete("/cart/{item_id}")
def delete_item(item_id: int):
    return CartService.delete_item(item_id)
@app.put("/cart")
def clear_cart():
    return CartService.clear_cart()
#
# For SignUp and Login
# 
@app.post("/users")
def signup(user: UserSignup):
    return UserService.signup(user)
@app.get("/users/{user_email}")
def get_user(user_email: str):
    return UserService.get_user(user_email)
@app.get("/users/{user_email}/{user_password}")
def login(user_email: str, user_password: str):
    return UserService.login(user_email, user_password)
#
# For Functions that connect to the Stocks and Order
# 
@app.post("/stock")
def add_item(
    image: UploadFile = File(...),
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    status: bool = True,
    listing_type: str = Form(...),
    owner: str = Form(...)
):
    return StockService.add_stock(image, name, description, price, status, listing_type, owner)
#
# For Item to show in Home, Rent, and Sell Page
# 
@app.get("/stock")
def stock_item():
    return StockService.get_all_stocks()
@app.get("/rent")
def get_rent_items():
    return StockService.get_rent_items()
        
@app.get("/sell")
def get_sell_items():
    return StockService.get_sell_items()
#
# For Function to detect item that already bought or rented
# 
@app.delete("/stock")
def disactive_delete():
    return StockService.delete_inactive_stocks()
@app.put("/stock/{item_idex}")
def update_status(item_idex: int):
    return StockService.update_status(item_idex)
    
#
# Filter out Items
# 
@app.delete("/stock/delete-by-name/{name}")
def delete_stock_by_name(name: str):
    return StockService.delete_stock_by_name(name)

@app.get("/stock/{filter}")
def filter_out_item(filter: str):
    return StockService.filter_stocks(filter)