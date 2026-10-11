@echo off
TITLE ASTRA AI - Autonomous Security & Threat Response AI Desktop Application
COLOR 0A
CLS

echo ==============================================================================
echo       ASTRA AI - AUTONOMOUS SECURITY & THREAT RESPONSE SOC SYSTEM              
echo ==============================================================================
echo.
echo [1/3] Initializing ASTRA AI Environment...

cd /d "%~dp0"

:: Check if Django backend is running on port 8000
netstat -ano | findstr ":8000" >nul
if errorlevel 1 (
    echo [2/3] Starting Django REST Backend on port 8000...
    start /b python backend-django\manage.py runserver 8000 >nul 2>&1
    timeout /t 2 /nobreak >nul
) else (
    echo [2/3] Django REST Backend is already active on port 8000.
)

:: Check if Next.js frontend is running on port 3000
netstat -ano | findstr ":3000" >nul
if errorlevel 1 (
    echo [3/3] Starting Next.js Frontend on port 3000...
    start /b npm run dev >nul 2>&1
    timeout /t 3 /nobreak >nul
) else (
    echo [3/3] Frontend is already active on port 3000.
)

echo.
echo Launching ASTRA AI Standalone Application Window...

:: Launch Edge / Chrome in Desktop App Window mode (no URL bar, native desktop look)
start "" "msedge" --app=http://localhost:3000/ --title="ASTRA AI Desktop Application" 2>nul || start "" "chrome" --app=http://localhost:3000/ 2>nul || start http://localhost:3000/

echo ==============================================================================
echo ASTRA AI Desktop Application launched successfully!
echo ==============================================================================
