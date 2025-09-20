from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from datetime import date, datetime, timedelta
from typing import Dict, Any, Optional
from models import User, DailyUsage, Subscription

class UsageService:
    def __init__(self, db: Session):
        self.db = db
    
    def check_usage_limit(self, user_id: int) -> Dict[str, Any]:
        """Check if user has exceeded daily usage limit"""
        today = date.today()
        
        # Get today's usage
        daily_usage = self.db.query(DailyUsage).filter(
            and_(
                DailyUsage.user_id == user_id,
                DailyUsage.usage_date == today
            )
        ).first()
        
        # Get user subscription status
        user = self.db.query(User).filter(User.id == user_id).first()
        
        if not user:
            return {
                "error": "User not found",
                "can_analyze": False
            }
        
        # Check if user has active subscription
        active_subscription = self.db.query(Subscription).filter(
            and_(
                Subscription.user_id == user_id,
                Subscription.status == "active",
                Subscription.end_date > datetime.now()
            )
        ).first()
        
        # If user has active subscription, unlimited usage
        if active_subscription:
            return {
                "can_analyze": True,
                "is_subscribed": True,
                "usage_count": daily_usage.analysis_count if daily_usage else 0,
                "limit": "unlimited"
            }
        
        # Free users get 7 analyses per day
        FREE_DAILY_LIMIT = 7
        current_usage = daily_usage.analysis_count if daily_usage else 0
        
        if current_usage >= FREE_DAILY_LIMIT:
            return {
                "can_analyze": False,
                "is_subscribed": False,
                "usage_count": current_usage,
                "limit": FREE_DAILY_LIMIT,
                "message": "You have reached your daily limit of 7 free analyses. Subscribe for unlimited access!"
            }
        
        return {
            "can_analyze": True,
            "is_subscribed": False,
            "usage_count": current_usage,
            "limit": FREE_DAILY_LIMIT,
            "remaining": FREE_DAILY_LIMIT - current_usage
        }
    
    def increment_usage(self, user_id: int) -> bool:
        """Increment user's daily usage count"""
        today = date.today()
        
        # Get or create today's usage record
        daily_usage = self.db.query(DailyUsage).filter(
            and_(
                DailyUsage.user_id == user_id,
                DailyUsage.usage_date == today
            )
        ).first()
        
        if daily_usage:
            daily_usage.analysis_count += 1
        else:
            daily_usage = DailyUsage(
                user_id=user_id,
                usage_date=today,
                analysis_count=1
            )
            self.db.add(daily_usage)
        
        self.db.commit()
        return True
    
    def get_usage_stats(self, user_id: int) -> Dict[str, Any]:
        """Get user's usage statistics"""
        today = date.today()
        
        # Get today's usage
        daily_usage = self.db.query(DailyUsage).filter(
            and_(
                DailyUsage.user_id == user_id,
                DailyUsage.usage_date == today
            )
        ).first()
        
        # Get user subscription status
        user = self.db.query(User).filter(User.id == user_id).first()
        
        # Check for active subscription
        active_subscription = self.db.query(Subscription).filter(
            and_(
                Subscription.user_id == user_id,
                Subscription.status == "active",
                Subscription.end_date > datetime.now()
            )
        ).first()
        
        current_usage = daily_usage.analysis_count if daily_usage else 0
        
        return {
            "user_id": user_id,
            "is_subscribed": bool(active_subscription),
            "usage_today": current_usage,
            "limit": "unlimited" if active_subscription else 7,
            "remaining": "unlimited" if active_subscription else max(0, 7 - current_usage),
            "subscription_end_date": active_subscription.end_date if active_subscription else None
        }
    
    def create_subscription(self, user_id: int, payment_method: str, payment_id: str) -> Dict[str, Any]:
        """Create a new subscription for user"""
        try:
            # Calculate subscription dates
            start_date = datetime.now()
            end_date = start_date + timedelta(days=30)  # Monthly subscription
            
            # Create subscription record
            subscription = Subscription(
                user_id=user_id,
                plan_type="monthly",
                amount=7.00,
                payment_method=payment_method,
                payment_id=payment_id,
                status="active",
                start_date=start_date,
                end_date=end_date
            )
            
            # Update user subscription status
            user = self.db.query(User).filter(User.id == user_id).first()
            if user:
                user.is_subscribed = True
                user.subscription_start_date = start_date
                user.subscription_end_date = end_date
            
            self.db.add(subscription)
            self.db.commit()
            
            return {
                "success": True,
                "subscription_id": subscription.id,
                "end_date": end_date,
                "message": "Subscription activated successfully!"
            }
            
        except Exception as e:
            self.db.rollback()
            return {
                "success": False,
                "error": str(e)
            }
