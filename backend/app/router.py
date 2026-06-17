from fastapi import APIRouter

stock_router = APIRouter()

@stock_router.post("/stock")
def get_stock():
    return {"ok": True}