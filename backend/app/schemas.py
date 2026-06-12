from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    name: str
    price: float
    type: str

class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class StockResponse(BaseModel):
    id: int
    Image: str
    Item_name: str
    item_description: str
    item_price: int
    SellorRent: str
    state: bool
    owner: str

    class Config:
        from_attributes = True

class OrderItem(BaseModel):
    name: str
    price: float
    type: str  # "Rent" or "Sell"

class PlaceOrderRequest(BaseModel):
    customer_email: str
    customer_name: str
    items: List[OrderItem]
