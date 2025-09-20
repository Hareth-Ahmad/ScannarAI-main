# �� ScannerAI - AI-Powered Image Analysis Platform

ScannerAI is a cutting-edge web application that provides AI-powered image analysis with advanced forgery detection, image classification, and deepfake detection capabilities. Built with modern technologies and featuring a beautiful neon-themed UI.

## ✨ Features

### 🔬 AI Analysis Capabilities
- **Image Classification** - Advanced image analysis using computer vision algorithms
- **Forgery Detection** - Detect image manipulation and digital forgeries with confidence scores
- **DeepFake Detection** - Identify AI-generated images using state-of-the-art models
- **Real-time Analysis** - Get results in seconds with detailed reports

### 🎨 User Experience
- **Modern Neon UI** - Beautiful glowing interface with glass morphism effects
- **Responsive Design** - Works perfectly on desktop and mobile devices
- **User Authentication** - Simple email-based registration and login
- **Analysis History** - Track all your previous analyses
- **Usage Tracking** - Monitor your daily analysis usage

## �� Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scannerai.git
   cd scannerai
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   # source venv/bin/activate  # macOS/Linux
   pip install -r requirements.txt
   copy env_example.txt .env
   python main.py
   ```

3. **Frontend Setup** (new terminal)
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   copy env_example.txt .env
   npm start
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 🛠️ Technology Stack

### Backend
- FastAPI - High-performance Python web framework
- SQLAlchemy - Database ORM with SQLite
- JWT - Secure authentication tokens
- OpenCV - Computer vision and image processing
- NumPy - Numerical computing
- Pillow - Image manipulation

### Frontend
- React 18 - Modern JavaScript framework
- TailwindCSS - Utility-first CSS framework
- React Router - Client-side routing
- Axios - HTTP client for API calls
- React Dropzone - File upload handling

## �� Usage

1. **Register** - Create an account with your email
2. **Login** - Sign in to access the dashboard
3. **Upload Image** - Choose an image file (JPEG, PNG, GIF, BMP, WebP)
4. **Select Analysis** - Choose from Classification, Forgery Detection, or DeepFake Detection
5. **View Results** - Get detailed analysis results with confidence scores

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenCV - Computer vision library
- FastAPI - Modern Python web framework
- React - JavaScript library for building user interfaces
- TailwindCSS - Utility-first CSS framework

---

**ScannerAI** - AI-Powered Image Analysis Platform  
Built with ❤️ for the future of image forensics
