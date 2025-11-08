@echo off
echo Starting Express REST API Server...
echo.
cd /d "%~dp0"
echo Current directory: %CD%
echo.
echo Checking if package.json exists...
if exist package.json (
    echo ✓ package.json found
    echo.
    echo Installing dependencies if needed...
    call npm install
    echo.
    echo Starting development server...
    call npm run dev
) else (
    echo ✗ package.json not found in current directory
    echo Please make sure you're running this from the project root directory
    pause
)
