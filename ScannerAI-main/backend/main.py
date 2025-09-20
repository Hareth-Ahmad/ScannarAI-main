from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
import os
from dotenv import load_dotenv

from database import get_db, engine
from models import Base
from auth import get_current_user, create_access_token, verify_token
from schemas import UserCreate, UserLogin, Token, UserResponse, ImageAnalysisResponse
from services import (
    create_user, authenticate_user, send_verification_email, 
    verify_user_email, get_user_history, save_analysis_result
)
from ai_services_fixed import ImageAnalysisService
from usage_service import UsageService
from fastapi import HTTPException

# Load environment variables
load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Clario - AI Image Analysis",
    description="AI-powered image analysis with forgery detection and classification",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Initialize AI service
ai_service = ImageAnalysisService()

@app.get("/")
async def root():
    return {"message": "Clario API is running!", "status": "ok"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Backend is running properly"}

@app.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Register a new user - simplified without verification"""
    try:
        user = await create_user(db, user_data)
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    """Login user with email - simplified"""
    try:
        user = await authenticate_user(db, user_credentials.email)
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/auth/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    return current_user

@app.post("/analysis/classification", response_model=ImageAnalysisResponse)
async def analyze_classification(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze image for classification using main_extraction.py logic"""
    try:
        # Check usage limit
        usage_service = UsageService(db)
        usage_check = usage_service.check_usage_limit(current_user.id)
        
        if not usage_check["can_analyze"]:
            raise HTTPException(
                status_code=429, 
                detail={
                    "error": "Daily limit exceeded",
                    "message": usage_check.get("message", "You have reached your daily limit"),
                    "usage_count": usage_check.get("usage_count", 0),
                    "limit": usage_check.get("limit", 7),
                    "subscription_required": True
                }
            )
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        content = await file.read()
        
        # Analyze image
        result = await ai_service.analyze_classification(content)
        
        # Increment usage count
        usage_service.increment_usage(current_user.id)
        
        # Save result to database
        analysis_record = await save_analysis_result(
            db, current_user.id, "classification", file.filename, result
        )
        
        return ImageAnalysisResponse(
            id=analysis_record.id,
            analysis_type="classification",
            filename=file.filename,
            result=result,
            created_at=analysis_record.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analysis/forgery", response_model=ImageAnalysisResponse)
async def analyze_forgery(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze image for forgery detection using main_blind.py logic"""
    try:
        # Check usage limit
        usage_service = UsageService(db)
        usage_check = usage_service.check_usage_limit(current_user.id)
        
        if not usage_check["can_analyze"]:
            raise HTTPException(
                status_code=429, 
                detail={
                    "error": "Daily limit exceeded",
                    "message": usage_check.get("message", "You have reached your daily limit"),
                    "usage_count": usage_check.get("usage_count", 0),
                    "limit": usage_check.get("limit", 7),
                    "subscription_required": True
                }
            )
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        content = await file.read()
        
        # Analyze image
        result = await ai_service.analyze_forgery(content)
        
        # Increment usage count
        usage_service.increment_usage(current_user.id)
        
        # Save result to database
        analysis_record = await save_analysis_result(
            db, current_user.id, "forgery", file.filename, result
        )
        
        return ImageAnalysisResponse(
            id=analysis_record.id,
            analysis_type="forgery",
            filename=file.filename,
            result=result,
            created_at=analysis_record.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analysis/deepfake", response_model=ImageAnalysisResponse)
async def analyze_deepfake(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze image for deepfake detection using ViT model"""
    try:
        # Check usage limit
        usage_service = UsageService(db)
        usage_check = usage_service.check_usage_limit(current_user.id)
        
        if not usage_check["can_analyze"]:
            raise HTTPException(
                status_code=429, 
                detail={
                    "error": "Daily limit exceeded",
                    "message": usage_check.get("message", "You have reached your daily limit"),
                    "usage_count": usage_check.get("usage_count", 0),
                    "limit": usage_check.get("limit", 7),
                    "subscription_required": True
                }
            )
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read file content
        content = await file.read()
        
        # Analyze image
        result = await ai_service.analyze_deepfake(content)
        
        # Increment usage count
        usage_service.increment_usage(current_user.id)
        
        # Save result to database
        analysis_record = await save_analysis_result(
            db, current_user.id, "deepfake", file.filename, result
        )
        
        return ImageAnalysisResponse(
            id=analysis_record.id,
            analysis_type="deepfake",
            filename=file.filename,
            result=result,
            created_at=analysis_record.created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/history")
async def get_history(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's analysis history"""
    try:
        history = await get_user_history(db, current_user.id)
        return {"history": history}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/usage/stats")
async def get_usage_stats(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's usage statistics"""
    try:
        usage_service = UsageService(db)
        stats = usage_service.get_usage_stats(current_user.id)
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/subscription/create")
async def create_subscription(
    payment_method: str,
    payment_id: str,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new subscription"""
    try:
        usage_service = UsageService(db)
        result = usage_service.create_subscription(
            current_user.id, 
            payment_method, 
            payment_id
        )
        
        if result["success"]:
            return result
        else:
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


