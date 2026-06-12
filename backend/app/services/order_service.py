from fastapi import HTTPException
from app.db import session, Order, Stocks, User
from app.services.emailservice import send_email
from datetime import datetime
import os

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

class OrderService:
    @staticmethod
    def place_order(customer_email: str, customer_name: str, items: list):
        """
        Place an order for multiple items and send email notifications to property owners
        
        Args:
            customer_email: Customer's email address
            customer_name: Customer's username
            items: List of items with structure: {"name": str, "price": float, "type": str}
        """
        try:
            if not items:
                raise HTTPException(status_code=400, detail="Cart cannot be empty")
            
            order_results = []
            
            for item in items:
                try:
                    # Get the stock item to find owner email
                    stock = session.query(Stocks).filter(
                        Stocks.Item_name == item.get("name")
                    ).first()
                    
                    if not stock:
                        continue  # Skip if item not found
                    
                    print(f"[OrderService] Processing item '{item.get('name')}' | stock.owner='{stock.owner}'")

                    # Stage 1: look up owner by their display name
                    owner = session.query(User).filter(
                        User.name == stock.owner
                    ).first()

                    # Stage 2: if not found by name, try treating stock.owner as an email
                    if not owner:
                        owner = session.query(User).filter(
                            User.email == stock.owner
                        ).first()

                    if owner:
                        owner_email = owner.email
                        print(f"[OrderService] Found owner → {owner_email}")
                    else:
                        owner_email = None
                        print(f"[OrderService] ⚠ No user found for owner='{stock.owner}' – email will be skipped.")

                    # Create order record in DB
                    new_order = Order(
                        customer_email=customer_email,
                        customer_name=customer_name,
                        owner_email=owner_email or stock.owner,
                        item_name=item.get("name"),
                        item_price=item.get("price"),
                        order_type=item.get("type")  # "Rent" or "Sell"
                    )
                    session.add(new_order)

                    # Send email notification to the property owner
                    if owner_email:
                        try:
                            send_email(
                                owner_email=owner_email,
                                email_customer=customer_email,
                                username=customer_name
                            )
                            print(f"[OrderService] ✅ Email sent to {owner_email} for '{item.get('name')}'")
                        except Exception as email_err:
                            print(f"[OrderService] ❌ Email failed for {owner_email}: {email_err}")
                    else:
                        print(f"[OrderService] ⚠ Skipping email – no owner_email resolved for item '{item.get('name')}'")


                    try:
                        if stock.Image:
                            img_path = os.path.join(UPLOAD_DIR, os.path.basename(stock.Image))
                            if os.path.exists(img_path):
                                os.remove(img_path)
                    except Exception as img_err:
                        print(f"[OrderService] Could not delete image for {item.get('name')}: {img_err}")
                    
                    session.delete(stock)
                    
                    order_results.append({
                        "status": "success",
                        "item_name": item.get("name"),
                        "owner_notified": owner_email is not None
                    })
                    
                except Exception as item_error:
                    print(f"[OrderService] Error processing item {item.get('name')}: {item_error}")
                    order_results.append({
                        "status": "error",
                        "item_name": item.get("name"),
                        "error": str(item_error)
                    })
            
            # Commit all orders at once
            session.commit()
            
            return {
                "message": "Order placed successfully",
                "order_results": order_results,
                "total_items": len(items),
                "processed_items": len([r for r in order_results if r["status"] == "success"])
            }
            
        except Exception as e:
            session.rollback()
            print(f"[OrderService] Error placing order: {e}")
            return {"error": str(e)}

    @staticmethod
    def get_all_orders():
        """Get all orders from the database"""
        try:
            orders = session.query(Order).all()
            result = []
            for order in orders:
                result.append({
                    "id": order.id,
                    "customer_email": order.customer_email,
                    "customer_name": order.customer_name,
                    "owner_email": order.owner_email,
                    "item_name": order.item_name,
                    "item_price": order.item_price,
                    "order_type": order.order_type,
                    "order_date": order.order_date.isoformat()
                })
            return result
        except Exception as e:
            return {"error": str(e)}

    @staticmethod
    def get_customer_orders(customer_email: str):
        """Get all orders for a specific customer"""
        try:
            orders = session.query(Order).filter(
                Order.customer_email == customer_email
            ).all()
            result = []
            for order in orders:
                result.append({
                    "id": order.id,
                    "item_name": order.item_name,
                    "item_price": order.item_price,
                    "order_type": order.order_type,
                    "order_date": order.order_date.isoformat()
                })
            return result
        except Exception as e:
            return {"error": str(e)}
