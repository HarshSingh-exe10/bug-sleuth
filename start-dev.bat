@echo off
echo 🚀 Starting Bug Sleuth Development Environment...
echo.

REM Check if directories exist
if not exist "backend" (
    echo ❌ Backend directory not found
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Frontend directory not found
    pause
    exit /b 1
)

echo 📁 Starting both backend and frontend servers...
echo.
echo 📱 Frontend will be available at: http://localhost:3000
echo 🔌 Backend API will be available at: http://localhost:8000
echo.
echo Press Ctrl+C in both windows to stop the servers
echo.

REM Start backend in new window
start "Django Backend" cmd /k "cd backend && python manage.py runserver 8000"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend in new window
start "React Frontend" cmd /k "cd frontend && npm start"

echo ✅ Both servers started in separate windows!
echo Close this window or press any key to exit this launcher...
pause > nul
