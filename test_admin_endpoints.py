#!/usr/bin/env python3
"""
Test script for the new admin dashboard endpoints.
Run this script from the backend directory after starting the Django server.

Usage:
    cd backend
    python ../test_admin_endpoints.py
"""

import requests
import json
import os

# Configuration
BASE_URL = 'http://localhost:8000/api'
ADMIN_USERNAME = 'admin'  # Change this to your admin username
ADMIN_PASSWORD = 'admin123'  # Change this to your admin password

def get_auth_token(username, password):
    """Authenticate and get access token"""
    response = requests.post(f'{BASE_URL}/auth/login/', {
        'username': username,
        'password': password
    })
    if response.status_code == 200:
        return response.json()['access']
    else:
        print(f"Authentication failed: {response.text}")
        return None

def test_admin_endpoints():
    """Test all admin endpoints"""
    print("🚀 Testing Admin Dashboard Endpoints")
    print("=" * 50)
    
    # Get authentication token
    print("1. Authenticating...")
    token = get_auth_token(ADMIN_USERNAME, ADMIN_PASSWORD)
    if not token:
        print("❌ Authentication failed. Please check your credentials.")
        return
    
    headers = {'Authorization': f'Bearer {token}'}
    print("✅ Authentication successful")
    
    # Test admin stats
    print("\n2. Testing admin stats endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/auth/admin/stats/', headers=headers)
        if response.status_code == 200:
            stats = response.json()
            print("✅ Admin stats retrieved:")
            print(f"   - Total Users: {stats.get('total_users')}")
            print(f"   - Total Submissions: {stats.get('total_submissions')}")
            print(f"   - Total Bug Reports: {stats.get('total_bug_reports')}")
            print(f"   - Model Accuracy: {stats.get('model_accuracy', 0) * 100:.1f}%")
        else:
            print(f"❌ Admin stats failed: {response.text}")
    except Exception as e:
        print(f"❌ Admin stats error: {e}")
    
    # Test user management
    print("\n3. Testing user management endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/auth/admin/users/', headers=headers)
        if response.status_code == 200:
            users = response.json()
            print(f"✅ Retrieved {users.get('count', 0)} users")
            if users.get('results'):
                print("   Sample users:")
                for user in users['results'][:3]:
                    print(f"   - {user['username']} ({user['email']}) - Active: {user.get('is_active', 'N/A')}")
        else:
            print(f"❌ User management failed: {response.text}")
    except Exception as e:
        print(f"❌ User management error: {e}")
    
    # Test dataset uploads
    print("\n4. Testing dataset upload list endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/bugs/admin/uploads/', headers=headers)
        if response.status_code == 200:
            uploads = response.json()
            print(f"✅ Retrieved {uploads.get('count', 0)} dataset uploads")
            if uploads.get('results'):
                print("   Recent uploads:")
                for upload in uploads['results'][:3]:
                    print(f"   - {upload['filename']} - Status: {upload['status']}")
        else:
            print(f"❌ Dataset uploads failed: {response.text}")
    except Exception as e:
        print(f"❌ Dataset uploads error: {e}")
    
    # Test model info
    print("\n5. Testing model info endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/bugs/admin/model-info/', headers=headers)
        if response.status_code == 200:
            model_info = response.json()
            print("✅ Model info retrieved:")
            print(f"   - Model: {model_info.get('model_name')}")
            print(f"   - Version: {model_info.get('version')}")
            print(f"   - Status: {model_info.get('training_status')}")
            print(f"   - Dataset Size: {model_info.get('dataset_size')}")
        else:
            print(f"❌ Model info failed: {response.text}")
    except Exception as e:
        print(f"❌ Model info error: {e}")
    
    # Test model versions
    print("\n6. Testing model versions endpoint...")
    try:
        response = requests.get(f'{BASE_URL}/bugs/admin/models/', headers=headers)
        if response.status_code == 200:
            models = response.json()
            print(f"✅ Retrieved {len(models)} model versions")
            if models:
                print("   Model versions:")
                for model in models[:3]:
                    print(f"   - {model['name']} v{model['version']} - Status: {model['training_status']}")
        else:
            print(f"❌ Model versions failed: {response.text}")
    except Exception as e:
        print(f"❌ Model versions error: {e}")
    
    print("\n🎉 Testing completed!")
    print("\n💡 Tips:")
    print("   - Make sure you have admin privileges")
    print("   - Ensure the Django server is running on port 8000")
    print("   - Check that you have some test data in the database")

if __name__ == '__main__':
    test_admin_endpoints()
