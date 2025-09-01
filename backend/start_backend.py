#!/usr/bin/env python3
"""
Backend startup script with better error handling and logging
"""

import sys
import subprocess
import os
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 8):
        print("❌ Error: Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    return True

def install_requirements():
    """Install required packages"""
    requirements_file = Path(__file__).parent / "requirements.txt"
    
    if not requirements_file.exists():
        print("❌ Error: requirements.txt not found")
        return False
    
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ])
        print("✅ Packages installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False

def start_server():
    """Start the Flask server"""
    app_file = Path(__file__).parent / "app.py"
    
    if not app_file.exists():
        print("❌ Error: app.py not found")
        return False
    
    print("🚀 Starting Multi-LLM Chat Backend Server...")
    try:
        subprocess.run([sys.executable, str(app_file)])
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        return False
    
    return True

def main():
    """Main startup function"""
    print("🔧 Multi-LLM Chat Backend Setup")
    print("=" * 40)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        sys.exit(1)
    
    # Start server
    if not start_server():
        sys.exit(1)

if __name__ == "__main__":
    main()