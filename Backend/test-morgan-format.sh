#!/bin/bash

# Test script for Morgan Logging Format
echo "📊 Testing Morgan Logging Format"
echo "================================="
echo ""

BASE_URL="http://localhost:3001"
LOG_FILE="src/logs/access.log"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Testing Morgan logging format...${NC}"
echo ""

# Function to make request and check logs
test_logging() {
    local method=$1
    local url=$2
    local description=$3
    local data=$4
    
    echo -e "${YELLOW}Testing: $description${NC}"
    echo "  $method $url"
    
    # Get initial log size
    initial_size=$(wc -l < "$LOG_FILE" 2>/dev/null || echo "0")
    
    # Make request
    if [ -n "$data" ]; then
        curl -s -X $method -H "Content-Type: application/json" -d "$data" "$url" > /dev/null
    else
        curl -s "$url" > /dev/null
    fi
    
    # Wait a moment for log to be written
    sleep 1
    
    # Get final log size
    final_size=$(wc -l < "$LOG_FILE" 2>/dev/null || echo "0")
    
    if [ "$final_size" -gt "$initial_size" ]; then
        echo -e "  ${GREEN}✓ Request logged successfully${NC}"
        
        # Show the last log entry
        echo -e "  ${BLUE}Last log entry:${NC}"
        tail -n 1 "$LOG_FILE" 2>/dev/null | sed 's/^/    /'
    else
        echo -e "  ${RED}✗ Request not logged${NC}"
    fi
    echo ""
}

# Check if log file exists
if [ ! -f "$LOG_FILE" ]; then
    echo -e "${YELLOW}Warning: Log file $LOG_FILE not found${NC}"
    echo "Creating logs directory..."
    mkdir -p src/logs
    touch "$LOG_FILE"
fi

echo -e "${BLUE}=== Testing Different Request Types ===${NC}"

# Test various endpoints to generate different log formats
test_logging "GET" "$BASE_URL" "Root endpoint logging"
test_logging "GET" "$BASE_URL/health" "Health check logging"
test_logging "GET" "$BASE_URL/api/income" "GET income logging"
test_logging "POST" "$BASE_URL/api/income" "POST income logging" '{"source":"Log Test","amount":1000,"currency":"USD","frequency":"monthly"}'
test_logging "GET" "$BASE_URL/api/assets" "GET assets logging"
test_logging "POST" "$BASE_URL/api/assets" "POST assets logging" '{"name":"Log Test Asset","type":"Test","value":2000,"currency":"USD"}'

echo -e "${BLUE}=== Log File Analysis ===${NC}"
echo "Log file location: $LOG_FILE"
echo "Total log entries: $(wc -l < "$LOG_FILE" 2>/dev/null || echo "0")"
echo ""

echo -e "${BLUE}=== Recent Log Entries ===${NC}"
if [ -f "$LOG_FILE" ] && [ -s "$LOG_FILE" ]; then
    tail -n 5 "$LOG_FILE" | sed 's/^/  /'
else
    echo "  No log entries found"
fi

echo ""
echo -e "${GREEN}🎉 Morgan logging test completed!${NC}"
echo -e "${BLUE}Check the log file for detailed request information${NC}"
