#!/usr/bin/env bash
set -euo pipefail
BASE_URL=${1:-http://localhost:3000}

if command -v jq >/dev/null 2>&1; then
  curl -s "$BASE_URL/api/recommendations" | jq .
else
  curl -s "$BASE_URL/api/recommendations"
fi
