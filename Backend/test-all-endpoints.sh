#!/bin/bash

# Test script for Financial API - All Endpoints
echo "🚀 Testing Financial API - All Endpoints"
echo "========================================"
echo ""

BASE_URL="http://localhost:3001"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local url=$2
    local description=$3
    local data=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  $method $url"
    
    if [ -n "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n -1)
    
    if [[ $http_code -ge 200 && $http_code -lt 300 ]]; then
        echo -e "  ${GREEN}✓ Status: $http_code${NC}"
    else
        echo -e "  ${RED}✗ Status: $http_code${NC}"
    fi
    echo ""
}

echo -e "${BLUE}=== General Endpoints ===${NC}"
test_endpoint "GET" "$BASE_URL" "API Information"
test_endpoint "GET" "$BASE_URL/health" "Health Check"

echo -e "${BLUE}=== Income Management ===${NC}"
test_endpoint "GET" "$BASE_URL/api/income" "Get All Income Records"
test_endpoint "POST" "$BASE_URL/api/income" "Create Income Record" '{"source":"Test Salary","amount":5000,"currency":"USD","frequency":"monthly"}'
test_endpoint "GET" "$BASE_URL/api/income" "Get All Income Records (After Create)"

echo -e "${BLUE}=== Assets Management ===${NC}"
test_endpoint "GET" "$BASE_URL/api/assets" "Get All Assets"
test_endpoint "POST" "$BASE_URL/api/assets" "Create Asset" '{"name":"Test Savings","type":"Bank Account","value":10000,"currency":"USD"}'
test_endpoint "GET" "$BASE_URL/api/assets" "Get All Assets (After Create)"

echo -e "${BLUE}=== Liabilities Management ===${NC}"
test_endpoint "GET" "$BASE_URL/api/liabilities" "Get All Liabilities"
test_endpoint "POST" "$BASE_URL/api/liabilities" "Create Liability" '{"name":"Test Loan","type":"Personal Loan","amount":5000,"currency":"USD","interestRate":5.5}'
test_endpoint "GET" "$BASE_URL/api/liabilities" "Get All Liabilities (After Create)"

echo -e "${BLUE}=== Credit Cards Management ===${NC}"
test_endpoint "GET" "$BASE_URL/api/creditcards" "Get All Credit Cards"
test_endpoint "POST" "$BASE_URL/api/creditcards" "Create Credit Card" '{"bank":"Test Bank","last4":"1234","creditLimit":3000,"outstandingBalance":500,"currency":"USD"}'
test_endpoint "GET" "$BASE_URL/api/creditcards" "Get All Credit Cards (After Create)"

echo -e "${GREEN}🎉 All endpoint tests completed!${NC}"
echo -e "${BLUE}Server running at: $BASE_URL${NC}"
