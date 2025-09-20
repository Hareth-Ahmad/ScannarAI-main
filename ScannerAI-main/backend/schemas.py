from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Dict, Any, List, Optional

class UserCreate(BaseModel):
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    email: str
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class ImageAnalysisResponse(BaseModel):
    id: int
    analysis_type: str
    filename: str
    result: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True

class HistoryResponse(BaseModel):
    id: int
    analysis_type: str
    filename: str
    result: Dict[str, Any]
    created_at: datetime
    
    class Config:
        from_attributes = True


