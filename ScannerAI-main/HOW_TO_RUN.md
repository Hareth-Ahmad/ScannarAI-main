# 🚀 How to Run ScannerAI (Clario) - Fixed Instructions

## ❌ The Problem
The original scripts had incorrect paths because the project structure is:
```
ScannerAI-main/
└── ScannerAI-main/  ← Actual project is here
    ├── backend/
    ├── frontend/
    └── ai_face_scanner/
```

## ✅ The Solution
I've created fixed scripts that handle the correct paths and dependencies.

## 🎯 Quick Start (Recommended)

### Option 1: One-Click Installation & Run
```bash
# Run this from the ScannerAI-main directory:
install_step_by_step.bat
```
This will install everything step by step with error checking.

### Option 2: Quick Run (if already installed)
```bash
# Run this from the ScannerAI-main directory:
run_simple.bat
```
This starts both backend and frontend in separate windows.

### Option 3: Complete Setup & Run
```bash
# Run this from the ScannerAI-main directory:
fix_and_run.bat
```
This does everything: installs dependencies and starts both services.

## 🔧 Manual Installation (Step by Step)

### 1. Backend Setup
```bash
# Navigate to backend
cd ScannerAI-main\backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install basic dependencies
pip install fastapi uvicorn python-multipart
pip install python-jose[cryptography] passlib[bcrypt]
pip install sqlalchemy alembic
pip install pillow numpy opencv-python
pip install python-dotenv pydantic pydantic-settings email-validator jinja2 aiofiles httpx

# Create .env file
copy env_example.txt .env

# Run backend
python run.py
```

### 2. Frontend Setup
```bash
# Navigate to frontend (in new terminal)
cd ScannerAI-main\frontend

# Install dependencies
npm install

# Create .env file
copy env_example.txt .env

# Run frontend
npm start
```

## 📍 Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs

## 🛠️ What I Fixed

1. **Correct Paths:** All scripts now navigate to `ScannerAI-main\ScannerAI-main\` first
2. **Dependency Issues:** Created step-by-step installation to avoid complex dependency conflicts
3. **Error Handling:** Added proper error checking and user feedback
4. **Virtual Environment:** Proper activation and dependency installation
5. **Environment Files:** Automatic creation of .env files from templates

## 🚨 Troubleshooting

### If you get "ModuleNotFoundError: No module named 'uvicorn'"
```bash
# Make sure you're in the right directory and virtual environment is activated
cd ScannerAI-main\ScannerAI-main\backend
venv\Scripts\activate
pip install fastapi uvicorn python-multipart
```

### If you get "npm: command not found"
- Install Node.js from https://nodejs.org/
- Make sure to check "Add to PATH" during installation

### If you get "python: command not found"
- Install Python from https://www.python.org/downloads/
- Make sure to check "Add to PATH" during installation

## 📁 File Structure (Fixed)
```
ScannerAI-main/
├── install_step_by_step.bat    ← New: Step-by-step installation
├── run_simple.bat             ← New: Simple run script
├── fix_and_run.bat            ← New: Complete setup & run
├── HOW_TO_RUN.md              ← This file
└── ScannerAI-main/            ← Actual project
    ├── backend/
    │   ├── requirements_basic_working.txt  ← New: Working requirements
    │   ├── venv/              ← Virtual environment
    │   └── ...
    └── frontend/
        └── ...
```

## 🎉 Success!
Once everything is running, you should see:
- Backend running on http://localhost:8000
- Frontend running on http://localhost:3000
- Both services running in separate command windows

The app provides AI-powered image analysis with:
- Image Classification
- Forgery Detection  
- Deepfake Detection
- User Authentication
- Analysis History

