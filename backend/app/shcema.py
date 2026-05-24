from pydantic import BaseModel

class CartItem(BaseModel):
    name: str
    price: float
    type: str

class UserSignup(BaseModel):
    name: str
    email: str
    password: str
