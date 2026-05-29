import json
from app.FilePath import CartPath
from app.schemas import CartItem

class CartService:
    @staticmethod
    def add_item(item: CartItem):
        try: 
            with open(CartPath, "r") as f:
                cart = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            cart = []
        cart.append({
            "name": item.name,
            "price": item.price,
            "type": item.type
        })
        
        with open(CartPath, "w") as f:
            json.dump(cart, f, indent=2)
        return {
            "name": item.name,
            "price": item.price,
            "type": item.type,
            "message": "Item added to cart successfully"
        }

    @staticmethod
    def get_items():
        try:
            with open(CartPath, "r") as f:
                cart = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            print("Cart JSON file not found or empty")
            cart = []
        return cart

    @staticmethod
    def delete_item(item_id: int):
        try: 
            with open(CartPath, "r") as f:
                cart = json.load(f)
        except FileNotFoundError:
            cart = []
        if 0 <= item_id < len(cart):
            name = cart[item_id]["name"]
            cart.pop(item_id)
            with open(CartPath, 'w') as f:
                json.dump(cart, f, indent=2)
            return f"You have successfully deleted {name} from your cart"
        return {"error": "Item not found"}

    @staticmethod
    def clear_cart():
        try:
            with open(CartPath, "w") as f:
                json.dump([], f, indent=2)
        except FileNotFoundError:
            pass
        return "Your cart has been cleared!"
