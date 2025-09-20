#!/usr/bin/env python3
"""
Simple test script for Clario application
"""

import requests
import json
import time
import sys

def test_backend():
    """Test backend endpoints"""
    base_url = "http://localhost:8000"
    
    print("🧪 Testing Clario Backend...")
    
    try:
        # Test root endpoint
        response = requests.get(f"{base_url}/")
        if response.status_code == 200:
            print("✅ Backend is running")
            print(f"   Response: {response.json()}")
        else:
            print(f"❌ Backend root endpoint failed: {response.status_code}")
            return False
            
        # Test registration
        test_email = "test@example.com"
        register_data = {"email": test_email}
        
        response = requests.post(f"{base_url}/auth/register", json=register_data)
        if response.status_code == 200:
            print("✅ Registration endpoint working")
            token_data = response.json()
            print(f"   Token received: {token_data.get('access_token', 'N/A')[:20]}...")
        else:
            print(f"❌ Registration failed: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
        # Test login
        response = requests.post(f"{base_url}/auth/login", json=register_data)
        if response.status_code == 200:
            print("✅ Login endpoint working")
        else:
            print(f"❌ Login failed: {response.status_code}")
            return False
            
        print("🎉 All backend tests passed!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend. Make sure it's running on port 8000")
        return False
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False

def test_frontend():
    """Test frontend availability"""
    print("\n🧪 Testing Clario Frontend...")
    
    try:
        response = requests.get("http://localhost:3000", timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is running")
            return True
        else:
            print(f"❌ Frontend returned status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to frontend. Make sure it's running on port 3000")
        return False
    except Exception as e:
        print(f"❌ Frontend test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 Clario Application Test Suite")
    print("=" * 40)
    
    backend_ok = test_backend()
    frontend_ok = test_frontend()
    
    print("\n📊 Test Results:")
    print(f"   Backend: {'✅ PASS' if backend_ok else '❌ FAIL'}")
    print(f"   Frontend: {'✅ PASS' if frontend_ok else '❌ FAIL'}")
    
    if backend_ok and frontend_ok:
        print("\n🎉 All tests passed! Application is ready to use.")
        print("   Open http://localhost:3000 in your browser")
        return 0
    else:
        print("\n❌ Some tests failed. Check the errors above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
