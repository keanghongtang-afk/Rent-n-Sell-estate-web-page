import os
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional
from app.schemas import UserSignup, PlaceOrderRequest
from app.services.user_service import UserService
from app.services.stock_service import StockService
from app.services.order_service import OrderService
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://keanghongtang-afk.github.io",
        "https://estatecam.netlify.app",
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
# For SignUp and Login
# 
@app.post("/users")
def signup(user: UserSignup):
    return UserService.signup(user)

@app.get("/users/login/{user_email}")
def login(user_email: str, user_password: str):
    return UserService.login(user_email, user_password)


@app.get("/users/{user_email}")
def get_user_info(user_email: str):
    return UserService.get_user_info(user_email)
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
# Filter out Items
# 
@app.delete("/stock/{item_id}")
def delete_stock_by_id(item_id: int):
    return StockService.delete_inactive_stocks(item_id)

@app.delete("/stock/delete-by-name/{name}")
def delete_stock_by_name(name: str):
    return StockService.delete_stock_by_name(name)

@app.get("/stock/{filter}")
def filter_out_item(filter: str):
    return StockService.filter_stocks(filter)

#
# For Orders
# 
@app.post("/orders")
def place_order(order_data: PlaceOrderRequest):
    return OrderService.place_order(
        customer_email=order_data.customer_email,
        customer_name=order_data.customer_name,
        items=[item.dict() for item in order_data.items]
    )
@app.get("/orders")
def get_all_orders():
    return OrderService.get_all_orders()

@app.get("/orders/{customer_email}")
def get_customer_orders(customer_email: str):
    return OrderService.get_customer_orders(customer_email)
