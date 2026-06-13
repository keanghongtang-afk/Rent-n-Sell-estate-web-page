import os
import shutil
import uuid
from fastapi import UploadFile, HTTPException
from app.FilePath import Stockspath
from app.db import Stocks, session

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class StockService:
    @staticmethod
    def add_stock(image: UploadFile, name: str, description: str, price: float, status: bool, listing_type: str, owner: str):
        if image.content_type not in ["image/jpeg", "image/jpg"]:
            raise HTTPException(status_code=400, detail="Only JPG/JPEG files are allowed.")
            
        try:
            if price < 0:
                price = 0
            if listing_type.capitalize() not in ["Sell", "Rent"]:
                raise HTTPException(status_code=400, detail="You can only sell or rent the house.")
            # Save the file
            file_extension = os.path.splitext(image.filename)[1]
            unique_filename = f"{uuid.uuid4().hex}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
                
            image_url = f"/uploads/{unique_filename}"

            new_stock = Stocks(
                Image=image_url,
                Item_name=name,
                item_description=description,
                item_price=price,
                SellorRent=listing_type,
                state=status,
                owner=owner
            )
            session.add(new_stock)
            session.commit()
            
            return {"message":"Successfully added"}
            
        except Exception as e:
            return {"error":e}
        finally: session.close()            
            

    @staticmethod
    def get_all_stocks():
        try:
            stocks = session.query(Stocks).all()
            result = []
            for stock in stocks:
                result.append({
                    "id": stock.id,
                    "Image": stock.Image,
                    "Item_name": stock.Item_name,
                    "item_description": stock.item_description,
                    "item_price": stock.item_price,
                    "SellorRent": stock.SellorRent,
                    "state": stock.state,
                    "owner": stock.owner
                })
            return result
        except Exception as e:
            return {"error":str(e)}
        finally: session.close()

    @staticmethod
    def get_rent_items():
        try:
            stocks = session.query(Stocks).filter(Stocks.SellorRent == "Rent").all()
            result = []
            for stock in stocks:
                result.append({
                    "id": stock.id,
                    "Image": stock.Image,
                    "Item_name": stock.Item_name,
                    "item_description": stock.item_description,
                    "item_price": stock.item_price,
                    "SellorRent": stock.SellorRent,
                    "state": stock.state,
                    "owner": stock.owner
                })
            return result
        except Exception as e:
            return {"error":str(e)}
        finally: session.close()

    @staticmethod
    def get_sell_items():
        try:
            stocks = session.query(Stocks).filter(Stocks.SellorRent == "Sell").all()
            result = []
            for stock in stocks:
                result.append({
                    "id": stock.id,
                    "Image": stock.Image,
                    "Item_name": stock.Item_name,
                    "item_description": stock.item_description,
                    "item_price": stock.item_price,
                    "SellorRent": stock.SellorRent,
                    "state": stock.state,
                    "owner": stock.owner
                })
            return result
        except Exception as e:
            return {"error":str(e)}
        finally: session.close()

    @staticmethod
    def delete_inactive_stocks(item_id: int):
        try:
            item = session.query(Stocks).filter(Stocks.id == item_id).first()
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            try:
                img_path = os.path.join(UPLOAD_DIR, os.path.basename(item.Image))
                os.remove(img_path)
            except FileNotFoundError:
                pass
            session.delete(item)
            session.commit()
            return {"message":"Deleted"}
        except Exception as e:
            return {"error":str(e)}
        finally: session.close()

    @staticmethod
    def delete_stock_by_name(name: str):
        try:
            item = session.query(Stocks).filter(Stocks.Item_name == name).first()
            if not item:
                raise HTTPException(status_code=404, detail="Item not found")
            try:
                img_path = os.path.join(UPLOAD_DIR, os.path.basename(item.Image))
                os.remove(img_path)
            except FileNotFoundError:
                pass
            session.delete(item)
            session.commit()
            return {"message":"Deleted"}
        except Exception as e:
            return {"error":str(e)}
        finally: session.close()

    @staticmethod
    def filter_stocks(filter: str):
        try:
            data = []
            
            if filter == "Luxurious":
                items = session.query(Stocks).filter(Stocks.item_price >= 1000000).all()
            elif filter == "Medium":
                items = session.query(Stocks).filter(Stocks.item_price >= 500000, Stocks.item_price < 1000000).all()      
            elif filter == "Normal":
                items = session.query(Stocks).filter(Stocks.item_price >= 200000, Stocks.item_price < 500000).all()
            elif filter == "Affordable":
                items = session.query(Stocks).filter(Stocks.item_price < 200000).all()
            else:
                raise HTTPException(status_code=400, detail=f"There are no such filter like {filter}")
            
            for item in items:
                data.append({
                    "id": item.id,
                    "Image": item.Image,
                    "Item_name": item.Item_name,
                    "item_description": item.item_description,
                    "item_price": item.item_price,
                    "SellorRent": item.SellorRent,
                    "state": item.state,
                    "owner": item.owner
                })
            return data
        except Exception as e:
            return {"error": str(e)}
        finally: session.close()