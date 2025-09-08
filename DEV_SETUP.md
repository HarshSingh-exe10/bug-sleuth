# Bug Sleuth Development Setup

This document explains how to run both the Django backend and React frontend simultaneously for development.

## Prerequisites

Make sure you have the following installed:
- Python 3.8+ (with pip)
- Node.js 16+ (with npm)
- Git (optional, but recommended)

## Quick Start Options

### Option 1: PowerShell Script (Recommended for Windows)

Run the PowerShell script that handles everything:

```powershell
.\start-dev.ps1
```

**Features:**
- ✅ Checks prerequisites
- ✅ Installs dependencies automatically
- ✅ Runs database migrations
- ✅ Starts both servers in parallel
- ✅ Handles cleanup on exit
- ✅ Shows colored output with status updates

### Option 2: Batch Script (Simple Windows)

Double-click `start-dev.bat` or run from command line:

```cmd
start-dev.bat
```

**Features:**
- ✅ Opens separate command windows for each server
- ✅ Simple and lightweight
- ✅ Easy to monitor each server individually

### Option 3: npm concurrently (Cross-platform)

First, install the root dependencies:

```bash
npm run setup
```

Then start both servers:

```bash
npm run dev
```

**Features:**
- ✅ Cross-platform (Windows, macOS, Linux)
- ✅ Professional development workflow
- ✅ Color-coded output from both servers
- ✅ Single terminal window

## Manual Setup (Alternative)

If you prefer to run servers manually:

### Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

### Frontend (React)

```bash
cd frontend
npm install
npm start
```

## Available URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Django Admin:** http://localhost:8000/admin

## Available npm Scripts

```bash
npm run dev              # Start both servers with concurrently
npm run backend          # Start only Django backend
npm run frontend         # Start only React frontend
npm run install-all      # Install dependencies for both projects
npm run install-backend  # Install Python dependencies
npm run install-frontend # Install Node.js dependencies
npm run setup            # Full setup (install root + all dependencies)
```

## Troubleshooting

### Port Already in Use
- Frontend (3000): Kill any existing React processes
- Backend (8000): Kill any existing Django processes

### Python Virtual Environment
If you're using a virtual environment for the backend:
1. Make sure it's activated before running the scripts
2. Or modify the PowerShell script to use your virtual environment path

### Permission Issues (PowerShell)
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Missing Dependencies
Run the setup command to install everything:
```bash
npm run setup
```

## Project Structure

```
bug-sleuth/
├── backend/          # Django REST API
│   ├── manage.py
│   └── requirements.txt
├── frontend/         # React App
│   └── package.json
├── start-dev.ps1     # PowerShell script
├── start-dev.bat     # Batch script
└── package.json      # Root npm scripts
```

## Development Workflow

1. Use any of the startup scripts to begin development
2. Both servers will start automatically
3. Frontend proxies API requests to backend (configured in frontend/package.json)
4. Make changes to code - both servers support hot reload
5. Press Ctrl+C to stop servers
