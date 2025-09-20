# AI Models Integration Guide

This guide explains how the AI models from `app.py` have been integrated into the web application (frontend + backend).

## 🎯 Integration Overview

The web application now uses the same AI models as the standalone `app.py`:

1. **Vision Transformer (ViT)** - For image classification
2. **DeepFake Detector v2** - For deepfake detection  
3. **Noiseprint Analysis** - For image forgery detection

## 🔧 Backend Integration

### Updated Files

#### `backend/ai_services_fixed.py`
- **Enhanced model loading**: Now loads the same models as `app.py`
- **ViT Integration**: Uses `google/vit-base-patch16-224` for classification
- **DeepFake Model**: Uses `prithivMLmods/Deep-Fake-Detector-v2-Model`
- **Noiseprint Integration**: Added support for noiseprint analysis
- **Fallback support**: Falls back to basic analysis if models aren't available

### Key Features

1. **Real AI Model Processing**:
   ```python
   # ViT Classification
   inputs = VIT_PROCESSOR(images=image, return_tensors="pt")
   outputs = VIT_MODEL(**inputs)
   
   # DeepFake Detection
   inputs = DEEPFAKE_PROCESSOR(images=image, return_tensors="pt")
   outputs = DEEPFAKE_MODEL(**inputs)
   
   # Noiseprint Analysis
   noise_map = genNoiseprint(img_np)
   ```

2. **Enhanced Results**:
   - Top 5 predictions for classification
   - Risk levels for deepfake detection
   - Noiseprint statistics for forgery detection
   - Confidence scores and detailed analysis

## 🎨 Frontend Integration

### Updated Pages

#### `frontend/src/pages/Classification.js`
- **ViT Model Info**: Displays model version and analysis type
- **Enhanced Results**: Shows top predictions and confidence scores
- **AI Model Details**: Information about the Vision Transformer model

#### `frontend/src/pages/DeepFakeDetection.js`
- **Risk Level Display**: Color-coded risk assessment
- **Model Information**: Details about the DeepFake detector
- **Enhanced Predictions**: Shows predicted labels and confidence

#### `frontend/src/pages/ForgeryDetection.js`
- **Noiseprint Statistics**: Displays noise analysis results
- **Forgery Indicators**: Shows specific manipulation indicators
- **Model Information**: Details about the Noiseprint analysis

### Key Features

1. **Enhanced UI Components**:
   - AI Model information panels
   - Risk level indicators
   - Detailed statistics display
   - Color-coded confidence levels

2. **Improved Data Display**:
   - Noiseprint statistics (mean, std, variance)
   - Forgery indicators with scores
   - Top predictions for classification
   - Risk assessment levels

## 🚀 How to Run

### Prerequisites
```bash
# Install backend dependencies
cd ScannerAI-main/backend
pip install -r requirements.txt

# Install frontend dependencies  
cd ../frontend
npm install
```

### Running the Application

1. **Start Backend**:
   ```bash
   cd ScannerAI-main/backend
   python main.py
   ```

2. **Start Frontend**:
   ```bash
   cd ScannerAI-main/frontend
   npm start
   ```

3. **Test Integration**:
   ```bash
   cd ScannerAI-main
   python test_integration.py
   ```

## 📊 API Endpoints

The backend provides these enhanced endpoints:

- `POST /analysis/classification` - ViT-based image classification
- `POST /analysis/deepfake` - DeepFake detection using AI model
- `POST /analysis/forgery` - Noiseprint-based forgery detection

### Response Format

```json
{
  "success": true,
  "analysis_type": "classification|deepfake|forgery",
  "predicted_label": "Predicted class",
  "confidence": 0.95,
  "top_predictions": [...],
  "risk_level": "High|Medium|Low|Very Low Risk",
  "noiseprint_stats": {...},
  "basic_analysis": {...},
  "message": "Analysis completed successfully"
}
```

## 🔍 Model Details

### Vision Transformer (ViT)
- **Model**: `google/vit-base-patch16-224`
- **Purpose**: Image classification
- **Output**: Top 5 predictions with confidence scores

### DeepFake Detector
- **Model**: `prithivMLmods/Deep-Fake-Detector-v2-Model`
- **Purpose**: DeepFake detection
- **Output**: Binary classification with risk levels

### Noiseprint Analysis
- **Library**: Custom noiseprint implementation
- **Purpose**: Image forgery detection
- **Output**: Noise pattern statistics and indicators

## 🛠️ Troubleshooting

### Common Issues

1. **Model Loading Errors**:
   - Ensure PyTorch and transformers are installed
   - Check internet connection for model downloads
   - Verify model paths in the code

2. **Noiseprint Issues**:
   - Ensure noiseprint library is available
   - Check the noiseprint path configuration
   - Verify numpy and PIL dependencies

3. **Frontend Display Issues**:
   - Check browser console for errors
   - Verify API responses are properly formatted
   - Ensure all required data fields are present

### Debug Mode

Enable debug logging by setting environment variables:
```bash
export DEBUG=1
export LOG_LEVEL=DEBUG
```

## 📈 Performance Notes

- **Model Loading**: Models are cached after first load
- **Memory Usage**: Each model uses ~500MB-1GB RAM
- **Processing Time**: 2-5 seconds per analysis
- **Concurrent Requests**: Limited by model memory usage

## 🔄 Future Enhancements

1. **Model Optimization**:
   - Quantization for faster inference
   - GPU acceleration support
   - Model caching strategies

2. **Additional Models**:
   - More specialized detection models
   - Ensemble methods
   - Custom trained models

3. **UI Improvements**:
   - Real-time analysis progress
   - Batch processing support
   - Advanced visualization options

## 📝 Notes

- The integration maintains backward compatibility
- Fallback mechanisms ensure the app works even if models fail to load
- All analysis results are stored in the database
- The frontend gracefully handles missing data fields
