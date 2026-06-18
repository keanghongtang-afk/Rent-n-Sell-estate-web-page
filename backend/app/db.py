from sqlalchemy import Column, String, Integer, Boolean, DateTime, Float, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")


DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"
engine = create_engine(DATABASE_URL)

Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

# Models
class Stocks(Base):
    __tablename__ = "stocks"
    
    id = Column(Integer, primary_key=True)
    Image = Column(String)
    Item_name = Column(String, unique=True)
    item_description = Column(String)
    item_price = Column(Integer)
    SellorRent = Column(String)
    state = Column(Boolean)
    owner = Column(String)
    
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)
    
class Cart(Base):
    __tablename__ = "cart"
    
    id = Column(Integer, primary_key=True)
    item_name = Column(String)
    type = Column(String)
    price = Column(String)

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True)
    customer_email = Column(String)
    customer_name = Column(String)
    owner_email = Column(String)
    item_name = Column(String)
    item_price = Column(Float)
    order_type = Column(String)  # "Rent" or "Sell"
    order_date = Column(DateTime, default=datetime.utcnow)
    
    
try:
    with engine.connect() as connection:
       print("Connection successful!")
except Exception as e:
    print(f"Failed to connect: {e}")
Base.metadata.create_all(engine)