import json
import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from app.FilePath import Stockspath

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class StockService:
    @staticmethod
    def add_stock(image: UploadFile, name: str, description: str, price: float, status: bool, listing_type: str, owner: str):
        if image.content_type not in ["image/jpeg", "image/jpg"]:
            raise HTTPException(status_code=400, detail="Only JPG/JPEG files are allowed.")
            
        try:
            with open(Stockspath, 'r') as f:
                Stocks = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            Stocks = []
            
        if price < 0:
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
            "SellorRent": listing_type,
            "Status": status,
            "owner": owner
        }
        Stocks.append(new_stock)
        
        with open(Stockspath, 'w') as f:
            json.dump(Stocks, f, indent=2)
            
        return new_stock

    @staticmethod
    def get_all_stocks():
        try:
            with open(Stockspath, 'r') as f:
                Stocks = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return "No stock available!"
        return Stocks

    @staticmethod
    def get_rent_items():
        try:
            with open(Stockspath, 'r') as f:
                Items = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return "No Renting Item Availlable"
        Rent_items = []
        for item in Items:
            if item["SellorRent"] == "Rent":
                Rent_items.append(item)
        return Rent_items

    @staticmethod
    def get_sell_items():
        try:
            with open(Stockspath, 'r') as f:
                Items = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return "No Renting Item Availlable"
        Sell_items = []
        for item in Items:
            if item["SellorRent"] == "Sell":
                Sell_items.append(item)
        return Sell_items

    @staticmethod
    def delete_inactive_stocks():
        try:
            with open(Stockspath, 'r') as f:
                items = json.load(f)
            
            new_items = []
            for item in items:
                if not item["Status"]:
                    try:
                        img_path = os.path.join(UPLOAD_DIR, os.path.basename(item["Image"]))
                        os.remove(img_path)
                    except FileNotFoundError:
                        pass
                else:
                    new_items.append(item)
                    
            with open(Stockspath, 'w') as f:
                json.dump(new_items, f, indent=2)
            return "Successfully deleted"  
        except FileNotFoundError:
            return "Files Not Found!"

    @staticmethod
    def update_status(item_idex: int):
        try:
            with open(Stockspath, 'r') as f:
                items = json.load(f)
            items[item_idex]["Status"] = False
            with open(Stockspath, 'w') as f:
                json.dump(items, f, indent=2)
            return "Success!"
        except FileNotFoundError:
            return "Nothing here"

    @staticmethod
    def filter_stocks(filter: str):
        try:
            data = []
            with open(Stockspath, 'r') as f:
                items = json.load(f)
            if filter == "Affordable":
                for item in items:
                    if item["item_price"] > 0 and item["item_price"] < 60000:
                        data.append(item)
            elif filter == "Normal":
                for item in items:
                    if item["item_price"] > 60000 and item["item_price"] < 150000:
                        data.append(item)
            elif filter == "Medium":
                for item in items:
                    if item["item_price"] > 150000 and item["item_price"] < 400000:
                        data.append(item)
            elif filter == "Luxurious":
                for item in items:
                    if item["item_price"] > 400000 and item["item_price"] < 5000000:
                        data.append(item)
            return data
        except (FileNotFoundError, json.JSONDecodeError):
            return "ERROR"
