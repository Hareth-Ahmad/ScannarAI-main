#!/usr/bin/env python3
"""
Test script to verify the AI model integration
"""
import sys
import os
import numpy as np
from PIL import Image
import io

# Add the backend to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from ai_services_fixed import ImageAnalysisService
    print("✅ Successfully imported ImageAnalysisService")
except ImportError as e:
    print(f"❌ Failed to import ImageAnalysisService: {e}")
    sys.exit(1)

def create_test_image():
    """Create a simple test image"""
    # Create a simple RGB image
    img_array = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
    img = Image.fromarray(img_array)
    
    # Convert to bytes
    img_bytes = io.BytesIO()
    img.save(img_bytes, format='PNG')
    return img_bytes.getvalue()

async def test_ai_services():
    """Test all AI services"""
    print("\n🧪 Testing AI Services Integration...")
    
    # Initialize service
    ai_service = ImageAnalysisService()
    
    # Create test image
    test_image = create_test_image()
    print(f"✅ Created test image ({len(test_image)} bytes)")
    
    # Test classification
    print("\n📊 Testing Image Classification...")
    try:
        classification_result = await ai_service.analyze_classification(test_image)
        print(f"✅ Classification: {classification_result.get('predicted_label', 'Unknown')}")
        print(f"   Confidence: {classification_result.get('confidence', 0):.2%}")
        print(f"   Success: {classification_result.get('success', False)}")
    except Exception as e:
        print(f"❌ Classification failed: {e}")
    
    # Test deepfake detection
    print("\n🕵️ Testing DeepFake Detection...")
    try:
        deepfake_result = await ai_service.analyze_deepfake(test_image)
        print(f"✅ DeepFake Detection: {deepfake_result.get('predicted_label', 'Unknown')}")
        print(f"   Is DeepFake: {deepfake_result.get('is_deepfake', False)}")
        print(f"   Confidence: {deepfake_result.get('confidence', 0):.2%}")
        print(f"   Success: {deepfake_result.get('success', False)}")
    except Exception as e:
        print(f"❌ DeepFake detection failed: {e}")
    
    # Test forgery detection
    print("\n🔍 Testing Forgery Detection...")
    try:
        forgery_result = await ai_service.analyze_forgery(test_image)
        print(f"✅ Forgery Detection: {'Forged' if forgery_result.get('is_forged', False) else 'Authentic'}")
        print(f"   Confidence: {forgery_result.get('confidence', 0):.2%}")
        print(f"   Risk Level: {forgery_result.get('risk_level', 'Unknown')}")
        print(f"   Success: {forgery_result.get('success', False)}")
        
        # Check for noiseprint stats
        if forgery_result.get('noiseprint_stats'):
            print(f"   Noiseprint Stats: {forgery_result['noiseprint_stats']}")
    except Exception as e:
        print(f"❌ Forgery detection failed: {e}")
    
    print("\n🎉 AI Services Integration Test Complete!")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_ai_services())
