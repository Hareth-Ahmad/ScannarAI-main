from sqlalchemy.orm import Session
from models import User, AnalysisResult
from schemas import UserCreate
from auth import generate_verification_code
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv
from typing import List, Dict, Any
from datetime import datetime

load_dotenv()

async def create_user(db: Session, user_data: UserCreate):
    """Create a new user - simplified without verification"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        # إذا كان المستخدم موجود، قم بتفعيله مباشرة
        existing_user.is_verified = True
        existing_user.verification_code = None
        db.commit()
        return existing_user
    
    # Create new user - مفعل مباشرة
    user = User(
        email=user_data.email,
        verification_code=None,
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

async def authenticate_user(db: Session, email: str):
    """Authenticate user by email - simplified"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # إنشاء مستخدم جديد إذا لم يكن موجود
        user = User(
            email=email,
            verification_code=None,
            is_verified=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

async def send_verification_email(email: str, verification_code: str):
    """Send verification email"""
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        # For development, always print the code to console
        print("=" * 60)
        print(f"🔐 كود التحقق لـ {email}")
        print(f"📧 الكود: {verification_code}")
        print("=" * 60)
        
        if not all([smtp_username, smtp_password]):
            print("⚠️ إعدادات البريد الإلكتروني غير مُعدة - سيتم عرض الكود في الكونسول فقط")
            return
        
        msg = MIMEMultipart()
        msg['From'] = smtp_username
        msg['To'] = email
        msg['Subject'] = "Clario - Email Verification"
        
        body = f"""
        Welcome to Clario!
        
        Your verification code is: {verification_code}
        
        Enter this code to complete your registration.
        
        Best regards,
        The Clario Team
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_username, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_username, email, text)
        server.quit()
        
        print(f"✅ تم إرسال البريد الإلكتروني إلى {email}")
        
    except Exception as e:
        print(f"❌ فشل في إرسال البريد الإلكتروني: {e}")
        print(f"🔐 كود التحقق لـ {email}: {verification_code}")

async def verify_user_email(db: Session, email: str, code: str):
    """Verify user email with verification code"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise Exception("User not found")
    if user.verification_code != code:
        raise Exception("Invalid verification code")
    
    user.is_verified = True
    user.verification_code = None
    db.commit()
    db.refresh(user)
    return user

async def save_analysis_result(
    db: Session, 
    user_id: int, 
    analysis_type: str, 
    filename: str, 
    result: Dict[str, Any]
):
    """Save analysis result to database"""
    analysis = AnalysisResult(
        user_id=user_id,
        analysis_type=analysis_type,
        filename=filename,
        result=result
    )
    db.add(analysis)
    db.commit()
    db.refresh(analysis)
    return analysis

async def get_user_history(db: Session, user_id: int) -> List[Dict[str, Any]]:
    """Get user's analysis history"""
    analyses = db.query(AnalysisResult).filter(
        AnalysisResult.user_id == user_id
    ).order_by(AnalysisResult.created_at.desc()).all()
    
    return [
        {
            "id": analysis.id,
            "analysis_type": analysis.analysis_type,
            "filename": analysis.filename,
            "result": analysis.result,
            "created_at": analysis.created_at
        }
        for analysis in analyses
    ]


