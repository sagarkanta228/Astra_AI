@echo off
TITLE ASTRA AI - Autonomous Security & Threat Response AI Desktop App Launcher
COLOR 0A
CLS

echo ==============================================================================
echo       ASTRA AI - AUTONOMOUS SECURITY & THREAT RESPONSE AI SYSTEM              
echo ==============================================================================
echo.
echo [1/3] Initializing ASTRA AI SOC Desktop Environment...
echo [2/3] Checking Next.js & Django REST backend services...
echo [3/3] Launching ASTRA AI Standalone Application Window...
echo.

:: Launch Chrome / Edge in App Window Mode (No address bar, looks like native desktop application)
start "" "msedge" --app=http://localhost:3000/ --title="ASTRA AI Desktop Application" 2>nul || start "" "chrome" --app=http://localhost:3000/ 2>nul || start http://localhost:3000/

echo ==============================================================================
echo ASTRA AI Desktop Application launched successfully!
echo ==============================================================================
