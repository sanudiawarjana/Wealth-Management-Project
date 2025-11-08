@echo off
title WealthTrack - Server Startup
color 0A

echo.
echo ========================================
echo   WealthTrack - Quick Server Startup
echo ========================================
echo.

echo Cleaning up old Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo Done!
echo.

echo Starting Backend Server...
start "WealthTrack Backend" cmd /k "cd /d d:\AI Boot Camp\Backend && npm start"
echo Backend starting on http://localhost:5000
echo.

echo Waiting for backend to initialize...
timeout /t 10 /nobreak >nul
echo.

echo Starting Frontend Server...
start "WealthTrack Frontend" cmd /k "cd /d d:\AI Boot Camp\Frontend && npm run dev"
echo Frontend starting on http://localhost:3000
echo.

echo Waiting for frontend to initialize...
timeout /t 15 /nobreak >nul
echo.

echo ========================================
echo   Startup Complete!
echo ========================================
echo.
echo Your WealthTrack application is running:
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:3000
echo.
echo Opening frontend in browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to close this window...
pause >nul
