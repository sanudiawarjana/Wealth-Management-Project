@echo off
echo ========================================
echo   WealthTrack Development Starter
echo ========================================
echo.

echo Starting Backend Server...
echo.
start "WealthTrack Backend" cmd /k "cd /d %~dp0Backend && npm install && npm run dev"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
echo.
start "WealthTrack Frontend" cmd /k "cd /d %~dp0Frontend && npm install && npm run dev"

echo.
echo ========================================
echo   Both Servers Started!
echo ========================================
echo.
echo Two new command windows opened:
echo   1. Backend server (http://localhost:5000)
echo   2. Frontend server (http://localhost:3000)
echo.
echo Wait 10-15 seconds, then open:
echo   http://localhost:3000
echo.
echo To stop servers: Close the command windows
echo.
pause
