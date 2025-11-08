@echo off
set BASE_URL=http://localhost:3000
curl -s %BASE_URL%/api/recommendations | powershell -Command "Get-Content -Raw | ConvertFrom-Json | ConvertTo-Json -Depth 6"
if %ERRORLEVEL% NEQ 0 (
  echo Request failed
  exit /b 1
)
