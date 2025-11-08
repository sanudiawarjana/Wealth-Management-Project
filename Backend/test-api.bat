@echo off
echo Testing Express REST API Server...
echo.

set baseUrl=http://localhost:3001

echo 1. Testing root endpoint...
curl -s -o nul -w "%%{http_code}" %baseUrl% > temp_status.txt
set /p status=<temp_status.txt
if %status%==200 (
    echo ✓ GET %baseUrl% - Status: 200
) else (
    echo ✗ GET %baseUrl% - Error: Status %status%
)
del temp_status.txt

echo.
echo 2. Testing health check...
curl -s -o nul -w "%%{http_code}" %baseUrl%/health > temp_status.txt
set /p status=<temp_status.txt
if %status%==200 (
    echo ✓ GET %baseUrl%/health - Status: 200
) else (
    echo ✗ GET %baseUrl%/health - Error: Status %status%
)
del temp_status.txt

echo.
echo 3. Testing GET all income...
curl -s -o nul -w "%%{http_code}" %baseUrl%/api/income > temp_status.txt
set /p status=<temp_status.txt
if %status%==200 (
    echo ✓ GET %baseUrl%/api/income - Status: 200
) else (
    echo ✗ GET %baseUrl%/api/income - Error: Status %status%
)
del temp_status.txt

echo.
echo 4. Testing GET all assets...
curl -s -o nul -w "%%{http_code}" %baseUrl%/api/assets > temp_status.txt
set /p status=<temp_status.txt
if %status%==200 (
    echo ✓ GET %baseUrl%/api/assets - Status: 200
) else (
    echo ✗ GET %baseUrl%/api/assets - Error: Status %status%
)
del temp_status.txt

echo.
echo 5. Testing GET all liabilities...
curl -s -o nul -w "%%{http_code}" %baseUrl%/api/liabilities > temp_status.txt
set /p status=<temp_status.txt
if %status%==200 (
    echo ✓ GET %baseUrl%/api/liabilities - Status: 200
) else (
    echo ✗ GET %baseUrl%/api/liabilities - Error: Status %status%
)
del temp_status.txt

echo.
echo 6. Testing GET all credit cards...
curl -s -o nul -w "%%{http_code}" %baseUrl%/api/creditcards > temp_status.txt
set /p status=<temp_status.txt
if %status%==200 (
    echo ✓ GET %baseUrl%/api/creditcards - Status: 200
) else (
    echo ✗ GET %baseUrl%/api/creditcards - Error: Status %status%
)
del temp_status.txt

echo.
echo API testing completed!
echo Server is running at: %baseUrl%
pause
