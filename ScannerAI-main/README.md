# Clario - AI-Powered Image Analysis Platform

Clario is a full-stack web application that provides AI-powered image analysis with two main features:
1. **Image Classification** - Advanced image analysis using noiseprint technology
2. **Forgery Detection** - Detect image manipulation and digital forgeries

## 🚀 Features

- **Authentication System**: Email-based registration with verification codes
- **JWT Authentication**: Secure session management
- **Image Classification**: AI-powered image analysis using `main_extraction.py` logic
- **Forgery Detection**: Advanced forgery detection using `main_blind.py` logic
- **Neon Theme UI**: Beautiful glowing neon interface with TailwindCSS
- **Analysis History**: Track all your previous analyses
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technology Stack

### Backend
- **FastAPI** - High-performance Python web framework
- **SQLAlchemy** - Database ORM
- **SQLite** - Database (easily upgradeable to PostgreSQL)
- **JWT** - Authentication tokens
- **TensorFlow** - AI/ML processing
- **Noiseprint** - Image forensics library

### Frontend
- **React** - Modern JavaScript framework
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Dropzone** - File upload handling
- **Lucide React** - Beautiful icons

## 📁 Project Structure

```
clario/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── database.py             # Database configuration
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── auth.py                 # Authentication logic
│   ├── services.py             # Business logic
│   ├── ai_services.py          # AI analysis services
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page components
│   │   ├── contexts/           # React contexts
│   │   ├── services/           # API services
│   │   └── App.js              # Main App component
│   ├── public/                 # Static assets
│   └── package.json            # Node.js dependencies
├── ai_face_scanner/            # Original noiseprint library
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**:
   ```bash
   cp env_example.txt .env
   # Edit .env with your configuration
   ```

5. **Run the backend**:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///./clario.db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Email Configuration

For email verification to work, configure SMTP settings:
- **Gmail**: Use App Password (not your regular password)
- **Other providers**: Update SMTP_HOST and SMTP_PORT accordingly

## 📱 Usage

1. **Register**: Create an account with your email
2. **Verify**: Check your email for verification code
3. **Login**: Sign in with your verified email
4. **Analyze**: Upload images for classification or forgery detection
5. **History**: View all your previous analyses

## 🎨 UI Features

- **Neon Theme**: Glowing blue, yellow, green, and purple accents
- **Glass Morphism**: Modern glass-like card effects
- **Responsive Design**: Works on all screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Loading States**: Beautiful loading spinners and progress bars

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Email Verification**: Required for account activation
- **Input Validation**: Comprehensive data validation
- **CORS Protection**: Configured for secure cross-origin requests
- **File Type Validation**: Only image files are accepted

## 🧪 AI Analysis

### Image Classification
- Uses noiseprint technology from `main_extraction.py`
- Analyzes image properties and generates statistics
- Provides JPEG quality factor and image mode information

### Forgery Detection
- Uses advanced algorithms from `main_blind.py`
- Detects image manipulation with confidence scores
- Provides detailed technical analysis results

## 🚀 Deployment

### Backend Deployment
1. Set up a production database (PostgreSQL recommended)
2. Configure environment variables for production
3. Use a production ASGI server like Gunicorn with Uvicorn workers
4. Set up reverse proxy with Nginx

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Serve static files with a web server like Nginx
3. Configure API endpoints for production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Noiseprint Library**: Image forensics research from University Federico II of Naples
- **FastAPI**: Modern Python web framework
- **React**: JavaScript library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Contact the development team

---

**Clario** - AI-Powered Image Analysis Platform
Built with ❤️ for the future of image forensics


