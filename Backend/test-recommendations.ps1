param(
  [string]$BaseUrl = "http://localhost:3000"
)

Write-Host "Testing GET $BaseUrl/api/recommendations" -ForegroundColor Cyan

try {
  $response = Invoke-RestMethod -Uri "$BaseUrl/api/recommendations" -Method GET -TimeoutSec 60
  $response | ConvertTo-Json -Depth 6
} catch {
  Write-Error $_
  exit 1
}


