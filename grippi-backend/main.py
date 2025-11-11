# main.py
import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String, Numeric, text
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from pydantic_settings import BaseSettings

# --- Configuration ---
# Uses .env file for local dev, and environment variables in production (on Railway)
class Settings(BaseSettings):
    # Default to a local SQLite database file if DATABASE_URL is not set
    DATABASE_URL: str = "sqlite:///./campaigns.db"

settings = Settings()

# --- Database Setup ---
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 1. Define the Database Model (SQLAlchemy)
class CampaignModel(Base):
    __tablename__ = "campaigns"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    status = Column(String)
    clicks = Column(Integer)
    cost = Column(Numeric(10, 2))
    impressions = Column(Integer)

# 2. Define the API Schema (Pydantic)
# This controls the shape of the JSON response
class CampaignSchema(BaseModel):
    id: int
    name: str
    status: str
    clicks: int
    cost: float  # Pydantic will auto-convert the Decimal to a float
    impressions: int

    class Config:
        from_attributes = True # Allows Pydantic to read data from the ORM model

# --- FastAPI App ---
app = FastAPI()

# CORS Middleware: Allows your Next.js app to talk to this API
origins = [
    "http://localhost:3000",  # Local Next.js dev server
    "https://grippi-junior.vercel.app" # <-- ADD YOUR VERCEL URL HERE
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoint ---
@app.get("/campaigns", response_model=List[CampaignSchema])
async def get_campaigns(db: Session = Depends(get_db)):
    """
    Fetches all campaigns from the database.
    """
    campaigns = db.query(CampaignModel).all()
    return campaigns

@app.get("/")
def read_root():
    return {"message": "Grippi Campaign API is running!"}

# --- Database Initialization ---
def setup_database():
    """
    This function creates the table and seeds it with data.
    It runs *only if* the database file (for-sqlite) or table doesn't exist.
    """
    Base.metadata.create_all(bind=engine) # Creates the 'campaigns' table
    
    # Check if table is empty before seeding
    db = SessionLocal()
    try:
        if db.query(CampaignModel).count() == 0:
            print("Database is empty, seeding data...")
            # Insert the 10 sample rows
            data = [
                CampaignModel(name='Summer Sale', status='Active', clicks=150, cost=45.99, impressions=1000),
                CampaignModel(name='Black Friday', status='Paused', clicks=320, cost=89.50, impressions=2500),
                CampaignModel(name='New Year Promo', status='Active', clicks=500, cost=120.00, impressions=5000),
                CampaignModel(name='Spring Fling', status='Active', clicks=80, cost=25.00, impressions=800),
                CampaignModel(name='Cyber Monday', status='Paused', clicks=450, cost=150.75, impressions=6000),
                CampaignModel(name='Back to School', status='Active', clicks=120, cost=30.00, impressions=1200),
                CampaignModel(name='Holiday Special', status='Active', clicks=280, cost=75.50, impressions=3000),
                CampaignModel(name='Flash Sale', status='Paused', clicks=10, cost=5.00, impressions=100),
                CampaignModel(name='Winter Clearance', status='Active', clicks=200, cost=60.00, impressions=2200),
                CampaignModel(name='Early Access', status='Paused', clicks=90, cost=40.00, impressions=900)
            ]
            db.add_all(data)
            db.commit()
            print("Database seeded successfully.")
        else:
            print("Database already contains data.")
    finally:
        db.close()

# Run the setup function when the app starts
setup_database()