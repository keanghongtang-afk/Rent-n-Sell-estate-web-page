from pydantic import BaseModel
from fastapi import  File, UploadFile, Form, HTTPException
class CartItem(BaseModel):
    name: str
    price: float
    type: str

class UserSignup(BaseModel):
    name: str
    email: str
    password: str

class Stock(BaseModel):
    image: UploadFile = File(...)
    name: str = Form(...)
    description: str = Form(...)
    price: float = Form(...)
    listing_type: str = Form(...)
    owner: str = Form(...)