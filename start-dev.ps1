# Bug Sleuth Development Startup Script
# This script starts both the Django backend and React frontend simultaneously

Write-Host "Starting Bug Sleuth Development Environment..." -ForegroundColor Green
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($cmdname)
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check for required tools
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "python")) {
    Write-Host "ERROR: Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "node")) {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "ERROR: npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: All prerequisites found!" -ForegroundColor Green
Write-Host ""

# Set up paths
$BackendPath = Join-Path $PSScriptRoot "backend"
$FrontendPath = Join-Path $PSScriptRoot "frontend"

# Check if directories exist
if (-not (Test-Path $BackendPath)) {
    Write-Host "ERROR: Backend directory not found at: $BackendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrontendPath)) {
    Write-Host "ERROR: Frontend directory not found at: $FrontendPath" -ForegroundColor Red
    exit 1
}

Write-Host "Backend path: $BackendPath" -ForegroundColor Cyan
Write-Host "Frontend path: $FrontendPath" -ForegroundColor Cyan
Write-Host ""

# Function to start backend
$BackendJob = Start-Job -ScriptBlock {
    param($BackendPath)
    
    Set-Location $BackendPath
    
    # Check if virtual environment exists
    if (Test-Path "venv") {
        Write-Host "Activating virtual environment..." -ForegroundColor Yellow
        & "venv\Scripts\Activate.ps1"
    } else {
        Write-Host "WARNING: No virtual environment found. Using system Python..." -ForegroundColor Yellow
    }
    
    # Install dependencies if needed
    Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
    
    # Run migrations
    Write-Host "Running database migrations..." -ForegroundColor Yellow
    python manage.py migrate
    
    # Start Django development server
    Write-Host "Starting Django backend on http://localhost:8000" -ForegroundColor Green
    python manage.py runserver 8000
    
} -ArgumentList $BackendPath

# Function to start frontend
$FrontendJob = Start-Job -ScriptBlock {
    param($FrontendPath)
    
    Set-Location $FrontendPath
    
    # Install dependencies if needed
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
    
    # Start React development server
    Write-Host "Starting React frontend on http://localhost:3000" -ForegroundColor Green
    npm start
    
} -ArgumentList $FrontendPath

Write-Host "Starting backend server..." -ForegroundColor Yellow
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Frontend will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Wait for jobs and handle cleanup
try {
    # Wait for either job to complete (which shouldn't happen in normal operation)
    Wait-Job $BackendJob, $FrontendJob
}
finally {
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    
    # Stop the jobs
    Stop-Job $BackendJob, $FrontendJob -Force
    Remove-Job $BackendJob, $FrontendJob -Force
    
    Write-Host "Both servers stopped successfully!" -ForegroundColor Green
}
