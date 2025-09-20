from sqlalchemy import Column, Integer, String, DateTime, Text, Boolean, ForeignKey, JSON, Date, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    is_verified = Column(Boolean, default=False)
    verification_code = Column(String, nullable=True)
    is_subscribed = Column(Boolean, default=False)
    subscription_start_date = Column(DateTime(timezone=True), nullable=True)
    subscription_end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    analyses = relationship("AnalysisResult", back_populates="user")
    daily_usage = relationship("DailyUsage", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")

class AnalysisResult(Base):
    __tablename__ = "analysis_results"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    analysis_type = Column(String, nullable=False)  # "classification", "forgery", or "deepfake"
    filename = Column(String, nullable=False)
    result = Column(JSON, nullable=False)  # Store analysis results as JSON
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship
    user = relationship("User", back_populates="analyses")

class DailyUsage(Base):
    __tablename__ = "daily_usage"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    usage_date = Column(Date, nullable=False)
    analysis_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="daily_usage")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    plan_type = Column(String, nullable=False)  # "monthly", "yearly"
    amount = Column(Float, nullable=False)  # $7.00 for monthly
    payment_method = Column(String, nullable=False)  # "visa", "mastercard", etc.
    payment_id = Column(String, nullable=True)  # External payment system ID
    status = Column(String, default="active")  # "active", "cancelled", "expired"
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    user = relationship("User", back_populates="subscriptions")


