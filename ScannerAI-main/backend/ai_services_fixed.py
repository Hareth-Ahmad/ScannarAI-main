import sys
import os
import numpy as np
from PIL import Image
import io
import tempfile
from typing import Dict, Any
import asyncio
import concurrent.futures
import base64
import cv2

# Try to import optional dependencies
try:
    import torch
    from transformers import ViTImageProcessor, ViTForImageClassification
    TORCH_AVAILABLE = True
except ImportError as e:
    print(f"PyTorch/Transformers not available: {e}")
    TORCH_AVAILABLE = False

try:
    import matplotlib.pyplot as plt
    MATPLOTLIB_AVAILABLE = True
except ImportError as e:
    print(f"Matplotlib not available: {e}")
    MATPLOTLIB_AVAILABLE = False

# Noiseprint is not available as a standard package
# We'll use alternative analysis methods
NOISEPRINT_AVAILABLE = False
print("ℹ️ Using alternative image analysis methods (noiseprint not available)")

# Initialize AI models
VIT_PROCESSOR = None
VIT_MODEL = None
DEEPFAKE_PROCESSOR = None
DEEPFAKE_MODEL = None
MODELS_AVAILABLE = False

if TORCH_AVAILABLE:
    try:
        # ViT for image classification
        VIT_PROCESSOR = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
        VIT_MODEL = ViTForImageClassification.from_pretrained("google/vit-base-patch16-224")
        
        # DeepFake detection model
        DEEPFAKE_PROCESSOR = ViTImageProcessor.from_pretrained("prithivMLmods/Deep-Fake-Detector-v2-Model")
        DEEPFAKE_MODEL = ViTForImageClassification.from_pretrained("prithivMLmods/Deep-Fake-Detector-v2-Model")
        
        MODELS_AVAILABLE = True
        print("✅ AI models loaded successfully")
    except Exception as e:
        print(f"AI models not available: {e}")
        MODELS_AVAILABLE = False

class ImageAnalysisService:
    def __init__(self):
        self.executor = concurrent.futures.ThreadPoolExecutor(max_workers=2)
    
    def _basic_image_analysis(self, image_content: bytes) -> Dict[str, Any]:
        """Basic image analysis using OpenCV and PIL when AI models are not available"""
        try:
            # Load image with PIL
            image = Image.open(io.BytesIO(image_content))
            
            # Convert to OpenCV format
            img_array = np.array(image)
            if len(img_array.shape) == 3:
                img_cv = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
            else:
                img_cv = img_array
            
            # Basic image properties
            height, width = img_cv.shape[:2]
            channels = img_cv.shape[2] if len(img_cv.shape) == 3 else 1
            
            # Calculate basic statistics
            mean_color = np.mean(img_cv, axis=(0, 1)) if len(img_cv.shape) == 3 else np.mean(img_cv)
            std_color = np.std(img_cv, axis=(0, 1)) if len(img_cv.shape) == 3 else np.std(img_cv)
            
            # Edge detection for basic analysis
            gray = cv2.cvtColor(img_cv, cv2.COLOR_BGR2GRAY) if len(img_cv.shape) == 3 else img_cv
            edges = cv2.Canny(gray, 50, 150)
            edge_density = np.sum(edges > 0) / (height * width)
            
            # Color histogram analysis
            hist_b = cv2.calcHist([img_cv], [0], None, [256], [0, 256]) if len(img_cv.shape) == 3 else None
            hist_g = cv2.calcHist([img_cv], [1], None, [256], [0, 256]) if len(img_cv.shape) == 3 else None
            hist_r = cv2.calcHist([img_cv], [2], None, [256], [0, 256]) if len(img_cv.shape) == 3 else None
            
            # Basic quality metrics
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()
            
            return {
                "image_properties": {
                    "width": int(width),
                    "height": int(height),
                    "channels": int(channels),
                    "format": image.format,
                    "mode": image.mode
                },
                "color_analysis": {
                    "mean_color": mean_color.tolist() if hasattr(mean_color, 'tolist') else [float(mean_color)],
                    "std_color": std_color.tolist() if hasattr(std_color, 'tolist') else [float(std_color)],
                    "edge_density": float(edge_density),
                    "sharpness": float(laplacian_var)
                },
                "histogram": {
                    "blue": hist_b.flatten().tolist() if hist_b is not None else None,
                    "green": hist_g.flatten().tolist() if hist_g is not None else None,
                    "red": hist_r.flatten().tolist() if hist_r is not None else None
                }
            }
        except Exception as e:
            return {"error": f"Basic analysis failed: {str(e)}"}
    
    async def analyze_classification(self, image_content: bytes) -> Dict[str, Any]:
        """Analyze image for classification"""
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, 
                self._analyze_classification_sync, 
                image_content
            )
            return result
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
                "analysis_type": "classification"
            }
    
    def _analyze_classification_sync(self, image_content: bytes) -> Dict[str, Any]:
        """Synchronous classification analysis using ViT model"""
        try:
            # Load image
            image = Image.open(io.BytesIO(image_content)).convert("RGB")
            
            # Use ViT model if available
            if MODELS_AVAILABLE and VIT_PROCESSOR and VIT_MODEL:
                # Process image with ViT
                inputs = VIT_PROCESSOR(images=image, return_tensors="pt")
                with torch.no_grad():
                    outputs = VIT_MODEL(**inputs)
                    logits = outputs.logits
                    probabilities = torch.nn.functional.softmax(logits, dim=-1)
                    predicted_class_id = logits.argmax(-1).item()
                    confidence = probabilities[0][predicted_class_id].item()
                
                # Get predicted label
                predicted_label = VIT_MODEL.config.id2label[predicted_class_id]
                
                # Get top 5 predictions
                top_indices = torch.topk(probabilities[0], k=5).indices
                top_predictions = []
                for idx in top_indices:
                    label = VIT_MODEL.config.id2label[idx.item()]
                    conf = probabilities[0][idx].item()
                    top_predictions.append({"label": label, "confidence": conf})
                
                # Basic analysis for additional info
                basic_analysis = self._basic_image_analysis(image_content)
                
                return {
                    "success": True,
                    "analysis_type": "classification",
                    "predicted_label": predicted_label,
                    "confidence": confidence,
                    "top_predictions": top_predictions,
                    "basic_analysis": basic_analysis,
                    "message": f"Image classified as '{predicted_label}' with {confidence:.1%} confidence using ViT model"
                }
            else:
                # Fallback to basic analysis if models not available
                basic_analysis = self._basic_image_analysis(image_content)
                
                # Simple classification based on image properties
                width = basic_analysis.get("image_properties", {}).get("width", 0)
                height = basic_analysis.get("image_properties", {}).get("height", 0)
                channels = basic_analysis.get("image_properties", {}).get("channels", 0)
                sharpness = basic_analysis.get("color_analysis", {}).get("sharpness", 0)
                edge_density = basic_analysis.get("color_analysis", {}).get("edge_density", 0)
                
                # Enhanced classification logic
                predictions = []
                
                # Grayscale detection
                if channels == 1:
                    predictions.append({"label": "Grayscale Image", "confidence": 0.95})
                else:
                    predictions.append({"label": "Color Image", "confidence": 0.9})
                
                # Aspect ratio classification
                aspect_ratio = width / height if height > 0 else 1
                if aspect_ratio > 1.5:
                    predictions.append({"label": "Landscape Image", "confidence": 0.85})
                elif aspect_ratio < 0.67:
                    predictions.append({"label": "Portrait Image", "confidence": 0.85})
                else:
                    predictions.append({"label": "Square Image", "confidence": 0.8})
                
                # Quality assessment
                if sharpness > 2000:
                    predictions.append({"label": "High Quality Image", "confidence": 0.8})
                elif sharpness > 1000:
                    predictions.append({"label": "Medium Quality Image", "confidence": 0.7})
                else:
                    predictions.append({"label": "Low Quality Image", "confidence": 0.6})
                
                # Edge analysis
                if edge_density > 0.15:
                    predictions.append({"label": "Detailed Image", "confidence": 0.75})
                elif edge_density > 0.05:
                    predictions.append({"label": "Moderate Detail Image", "confidence": 0.65})
                else:
                    predictions.append({"label": "Smooth Image", "confidence": 0.55})
                
                # Sort predictions by confidence
                predictions.sort(key=lambda x: x["confidence"], reverse=True)
                
                # Get top prediction
                top_prediction = predictions[0]
                
                return {
                    "success": True,
                    "analysis_type": "classification",
                    "predicted_label": top_prediction["label"],
                    "confidence": top_prediction["confidence"],
                    "top_predictions": predictions[:5],  # Top 5 predictions
                    "basic_analysis": basic_analysis,
                    "message": f"Image classified as '{top_prediction['label']}' with {top_prediction['confidence']:.1%} confidence (basic analysis)"
                }
                    
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
                "analysis_type": "classification"
            }
    
    async def analyze_forgery(self, image_content: bytes) -> Dict[str, Any]:
        """Analyze image for forgery detection"""
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, 
                self._analyze_forgery_sync, 
                image_content
            )
            return result
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
                "analysis_type": "forgery"
            }
    
    def _analyze_forgery_sync(self, image_content: bytes) -> Dict[str, Any]:
        """Synchronous forgery detection analysis using Noiseprint"""
        try:
            # Load image
            image = Image.open(io.BytesIO(image_content)).convert("RGB")
            
            # Use alternative analysis methods since noiseprint is not available
            if False:  # NOISEPRINT_AVAILABLE is always False now
                try:
                    # Convert to grayscale for noiseprint
                    img_gray = image.convert("L")
                    img_np = np.array(img_gray)
                    img_np = img_np[np.newaxis, :, :, np.newaxis].astype(np.float32)
                    
                    # Generate noiseprint
                    noise_map = genNoiseprint(img_np)
                    
                    # Calculate noiseprint statistics
                    noise_mean = np.mean(noise_map)
                    noise_std = np.std(noise_map)
                    noise_min = np.min(noise_map)
                    noise_max = np.max(noise_map)
                    
                    # Analyze noise patterns for forgery detection
                    # Higher variance in noise patterns may indicate manipulation
                    noise_variance = np.var(noise_map)
                    
                    # Calculate forgery indicators based on noiseprint
                    forgery_indicators = []
                    
                    # High noise variance might indicate manipulation
                    if noise_variance > 0.1:
                        forgery_indicators.append({"indicator": "High noise variance", "score": 0.8})
                    elif noise_variance > 0.05:
                        forgery_indicators.append({"indicator": "Moderate noise variance", "score": 0.6})
                    
                    # Unusual noise patterns
                    if abs(noise_mean) > 0.1:
                        forgery_indicators.append({"indicator": "Unusual noise mean", "score": 0.7})
                    
                    if noise_std > 0.2:
                        forgery_indicators.append({"indicator": "High noise standard deviation", "score": 0.6})
                    
                    # Calculate overall confidence
                    if forgery_indicators:
                        avg_score = sum(indicator["score"] for indicator in forgery_indicators) / len(forgery_indicators)
                        is_suspicious = avg_score > 0.6
                        confidence = min(avg_score, 0.9)  # Cap at 90%
                    else:
                        is_suspicious = False
                        confidence = 0.2
                    
                    # Determine risk level
                    if confidence >= 0.8:
                        risk_level = "High Risk"
                    elif confidence >= 0.6:
                        risk_level = "Medium Risk"
                    elif confidence >= 0.4:
                        risk_level = "Low Risk"
                    else:
                        risk_level = "Very Low Risk"
                    
                    # Basic analysis for additional info
                    basic_analysis = self._basic_image_analysis(image_content)
                    
                    return {
                        "success": True,
                        "analysis_type": "forgery",
                        "is_forged": is_suspicious,
                        "confidence": confidence,
                        "risk_level": risk_level,
                        "forgery_indicators": forgery_indicators,
                        "noiseprint_stats": {
                            "mean": float(noise_mean),
                            "std": float(noise_std),
                            "min": float(noise_min),
                            "max": float(noise_max),
                            "variance": float(noise_variance)
                        },
                        "basic_analysis": basic_analysis,
                        "message": f"Forgery analysis completed - {risk_level} ({'Suspicious' if is_suspicious else 'Normal'} image) using Noiseprint"
                    }
                    
                except Exception as e:
                    print(f"Noiseprint analysis failed: {e}")
                    # Fall back to basic analysis
                    pass
            
            # Fallback to basic analysis
            basic_analysis = self._basic_image_analysis(image_content)
            
            # Enhanced heuristics for forgery detection
            edge_density = basic_analysis.get("color_analysis", {}).get("edge_density", 0)
            sharpness = basic_analysis.get("color_analysis", {}).get("sharpness", 0)
            mean_color = basic_analysis.get("color_analysis", {}).get("mean_color", [0, 0, 0])
            std_color = basic_analysis.get("color_analysis", {}).get("std_color", [0, 0, 0])
            
            # Calculate forgery indicators
            forgery_indicators = []
            
            # Edge density analysis
            if edge_density < 0.05:
                forgery_indicators.append({"indicator": "Very low edge density", "score": 0.8})
            elif edge_density < 0.1:
                forgery_indicators.append({"indicator": "Low edge density", "score": 0.6})
            elif edge_density > 0.3:
                forgery_indicators.append({"indicator": "High edge density", "score": 0.4})
            
            # Sharpness analysis
            if sharpness < 50:
                forgery_indicators.append({"indicator": "Very low sharpness", "score": 0.9})
            elif sharpness < 100:
                forgery_indicators.append({"indicator": "Low sharpness", "score": 0.7})
            elif sharpness > 2000:
                forgery_indicators.append({"indicator": "Very high sharpness", "score": 0.3})
            
            # Color consistency analysis
            if len(mean_color) >= 3 and len(std_color) >= 3:
                color_variance = sum(std_color) / len(std_color)
                if color_variance < 10:
                    forgery_indicators.append({"indicator": "Low color variance", "score": 0.6})
                elif color_variance > 100:
                    forgery_indicators.append({"indicator": "High color variance", "score": 0.4})
            
            # Calculate overall confidence
            if forgery_indicators:
                avg_score = sum(indicator["score"] for indicator in forgery_indicators) / len(forgery_indicators)
                is_suspicious = avg_score > 0.6
                confidence = min(avg_score, 0.9)  # Cap at 90%
            else:
                is_suspicious = False
                confidence = 0.3
            
            # Determine risk level
            if confidence >= 0.8:
                risk_level = "High Risk"
            elif confidence >= 0.6:
                risk_level = "Medium Risk"
            elif confidence >= 0.4:
                risk_level = "Low Risk"
            else:
                risk_level = "Very Low Risk"
            
            return {
                "success": True,
                "analysis_type": "forgery",
                "is_forged": is_suspicious,
                "confidence": confidence,
                "risk_level": risk_level,
                "forgery_indicators": forgery_indicators,
                "basic_analysis": basic_analysis,
                "message": f"Forgery analysis completed - {risk_level} ({'Suspicious' if is_suspicious else 'Normal'} image) using basic analysis"
            }
                    
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
                "analysis_type": "forgery"
            }
    
    async def analyze_deepfake(self, image_content: bytes) -> Dict[str, Any]:
        """Analyze image for deepfake detection"""
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(
                self.executor, 
                self._analyze_deepfake_sync, 
                image_content
            )
            return result
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
                "analysis_type": "deepfake"
            }
    
    def _analyze_deepfake_sync(self, image_content: bytes) -> Dict[str, Any]:
        """Synchronous deepfake detection analysis using DeepFake model"""
        try:
            # Load image
            image = Image.open(io.BytesIO(image_content)).convert("RGB")
            
            # Use DeepFake model if available
            if MODELS_AVAILABLE and DEEPFAKE_PROCESSOR and DEEPFAKE_MODEL:
                # Process image with DeepFake model
                inputs = DEEPFAKE_PROCESSOR(images=image, return_tensors="pt")
                with torch.no_grad():
                    outputs = DEEPFAKE_MODEL(**inputs)
                    logits = outputs.logits
                    probabilities = torch.nn.functional.softmax(logits, dim=-1)
                    predicted_class_id = logits.argmax(-1).item()
                    confidence = probabilities[0][predicted_class_id].item()
                
                # Get predicted label
                predicted_label = DEEPFAKE_MODEL.config.id2label[predicted_class_id]
                
                # Determine if it's a deepfake based on the label
                # Check for various deepfake indicators in the label
                label_lower = predicted_label.lower()
                is_deepfake = (
                    "deepfake" in label_lower or 
                    "fake" in label_lower or 
                    "synthetic" in label_lower or
                    "generated" in label_lower or
                    "artificial" in label_lower
                )
                
                # Alternative approach: if the model has only 2 classes (0=real, 1=fake)
                # and the predicted class is 1, then it's a deepfake
                if len(DEEPFAKE_MODEL.config.id2label) == 2 and predicted_class_id == 1:
                    is_deepfake = True
                    print(f"Using class ID approach: class {predicted_class_id} = deepfake")
                
                # Debug: Print the actual label for troubleshooting
                print(f"DeepFake Model Prediction: '{predicted_label}' -> is_deepfake: {is_deepfake}")
                print(f"All available labels: {list(DEEPFAKE_MODEL.config.id2label.values())}")
                print(f"Predicted class ID: {predicted_class_id}")
                
                # Determine risk level based on confidence and prediction
                if is_deepfake and confidence >= 0.8:
                    risk_level = "High Risk"
                elif is_deepfake and confidence >= 0.6:
                    risk_level = "Medium Risk"
                elif is_deepfake and confidence >= 0.4:
                    risk_level = "Low Risk"
                else:
                    risk_level = "Very Low Risk"
                
                # Basic analysis for additional info
                basic_analysis = self._basic_image_analysis(image_content)
                
                return {
                    "success": True,
                    "analysis_type": "deepfake",
                    "predicted_label": predicted_label,
                    "is_deepfake": is_deepfake,
                    "confidence": confidence,
                    "risk_level": risk_level,
                    "basic_analysis": basic_analysis,
                    "message": f"Deepfake analysis completed - {risk_level} ({predicted_label}) using AI model"
                }
            else:
                # Fallback to basic analysis if models not available
                basic_analysis = self._basic_image_analysis(image_content)
                
                # Enhanced heuristics for deepfake detection
                sharpness = basic_analysis.get("color_analysis", {}).get("sharpness", 0)
                edge_density = basic_analysis.get("color_analysis", {}).get("edge_density", 0)
                mean_color = basic_analysis.get("color_analysis", {}).get("mean_color", [0, 0, 0])
                std_color = basic_analysis.get("color_analysis", {}).get("std_color", [0, 0, 0])
                
                # Calculate deepfake indicators
                deepfake_indicators = []
                
                # Sharpness analysis for deepfake detection
                if sharpness < 30:
                    deepfake_indicators.append({"indicator": "Very low sharpness (blurry)", "score": 0.9})
                elif sharpness < 100:
                    deepfake_indicators.append({"indicator": "Low sharpness", "score": 0.7})
                elif sharpness > 3000:
                    deepfake_indicators.append({"indicator": "Unusually high sharpness", "score": 0.6})
                
                # Edge density analysis
                if edge_density < 0.03:
                    deepfake_indicators.append({"indicator": "Very low edge density", "score": 0.8})
                elif edge_density < 0.08:
                    deepfake_indicators.append({"indicator": "Low edge density", "score": 0.6})
                elif edge_density > 0.4:
                    deepfake_indicators.append({"indicator": "Unusually high edge density", "score": 0.5})
                
                # Color analysis for deepfake detection
                if len(mean_color) >= 3 and len(std_color) >= 3:
                    # Check for unnatural color patterns
                    color_balance = sum(mean_color) / len(mean_color)
                    color_variance = sum(std_color) / len(std_color)
                    
                    if color_variance < 5:
                        deepfake_indicators.append({"indicator": "Very low color variance", "score": 0.7})
                    elif color_variance > 150:
                        deepfake_indicators.append({"indicator": "Very high color variance", "score": 0.6})
                    
                    # Check for unnatural color balance
                    if color_balance < 50 or color_balance > 200:
                        deepfake_indicators.append({"indicator": "Unnatural color balance", "score": 0.6})
                
                # Calculate overall confidence
                if deepfake_indicators:
                    avg_score = sum(indicator["score"] for indicator in deepfake_indicators) / len(deepfake_indicators)
                    is_suspicious = avg_score > 0.6
                    confidence = min(avg_score, 0.85)  # Cap at 85%
                else:
                    is_suspicious = False
                    confidence = 0.2
                
                # Determine risk level
                if confidence >= 0.8:
                    risk_level = "High Risk"
                    predicted_label = "Likely DeepFake"
                elif confidence >= 0.6:
                    risk_level = "Medium Risk"
                    predicted_label = "Suspicious"
                elif confidence >= 0.4:
                    risk_level = "Low Risk"
                    predicted_label = "Possibly Authentic"
                else:
                    risk_level = "Very Low Risk"
                    predicted_label = "Likely Authentic"
                
                return {
                    "success": True,
                    "analysis_type": "deepfake",
                    "predicted_label": predicted_label,
                    "is_deepfake": is_suspicious,
                    "confidence": confidence,
                    "risk_level": risk_level,
                    "deepfake_indicators": deepfake_indicators,
                    "basic_analysis": basic_analysis,
                    "message": f"Deepfake analysis completed - {risk_level} ({predicted_label}) using basic analysis"
                }
                    
        except Exception as e:
            return {
                "error": str(e),
                "success": False,
                "analysis_type": "deepfake"
            }

