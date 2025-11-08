#!/bin/bash

# Test script for Morgan Logging
echo "📝 Testing Morgan Logging System"
echo "================================"
echo ""

BASE_URL="http://localhost:3001"
LOG_FILE="src/logs/access.log"
ERROR_LOG_FILE="src/logs/error.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Morgan logging system...${NC}"
echo ""

# Function to make request and check logs
test_request() {
    local method=$1
    local url=$2
    local description=$3
    local data=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  $method $url"
    
    # Make request
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
    
    # Wait for log to be written
    sleep 1
    echo ""
}

# Check if log files exist
if [ ! -f "$LOG_FILE" ]; then
    echo -e "${YELLOW}Creating log files...${NC}"
    mkdir -p src/logs
    touch "$LOG_FILE"
fi

if [ ! -f "$ERROR_LOG_FILE" ]; then
    touch "$ERROR_LOG_FILE"
fi

echo -e "${BLUE}=== Testing Morgan Logging ===${NC}"

# Test various endpoints
test_request "GET" "$BASE_URL" "Root endpoint"
test_request "GET" "$BASE_URL/health" "Health check"
test_request "GET" "$BASE_URL/api/income" "GET income"
test_request "POST" "$BASE_URL/api/income" "POST income" '{"source":"Morgan Test","amount":3000,"currency":"USD","frequency":"monthly"}'
test_request "GET" "$BASE_URL/api/assets" "GET assets"
test_request "POST" "$BASE_URL/api/assets" "POST assets" '{"name":"Morgan Test Asset","type":"Test","value":5000,"currency":"USD"}'
test_request "GET" "$BASE_URL/api/liabilities" "GET liabilities"
test_request "GET" "$BASE_URL/api/creditcards" "GET credit cards"

# Test error scenarios
echo -e "${BLUE}=== Testing Error Logging ===${NC}"
test_request "GET" "$BASE_URL/api/nonexistent" "Non-existent endpoint (should return 404)"
test_request "POST" "$BASE_URL/api/income" "Invalid data" '{"invalid":"data"}'

echo -e "${BLUE}=== Log File Analysis ===${NC}"
echo "Access log file: $LOG_FILE"
echo "Error log file: $ERROR_LOG_FILE"
echo ""

# Show log statistics
if [ -f "$LOG_FILE" ]; then
    echo -e "${GREEN}Access Log Statistics:${NC}"
    echo "  Total entries: $(wc -l < "$LOG_FILE")"
    echo "  File size: $(du -h "$LOG_FILE" | cut -f1)"
    echo ""
    
    echo -e "${GREEN}Recent Access Log Entries:${NC}"
    if [ -s "$LOG_FILE" ]; then
        tail -n 3 "$LOG_FILE" | sed 's/^/  /'
    else
        echo "  No access log entries found"
    fi
else
    echo -e "${RED}Access log file not found${NC}"
fi

echo ""

if [ -f "$ERROR_LOG_FILE" ]; then
    echo -e "${GREEN}Error Log Statistics:${NC}"
    echo "  Total entries: $(wc -l < "$ERROR_LOG_FILE")"
    echo "  File size: $(du -h "$ERROR_LOG_FILE" | cut -f1)"
    echo ""
    
    echo -e "${GREEN}Recent Error Log Entries:${NC}"
    if [ -s "$ERROR_LOG_FILE" ]; then
        tail -n 3 "$ERROR_LOG_FILE" | sed 's/^/  /'
    else
        echo "  No error log entries found"
    fi
else
    echo -e "${RED}Error log file not found${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Morgan logging test completed!${NC}"
echo -e "${BLUE}Check the log files for detailed request and error information${NC}"
