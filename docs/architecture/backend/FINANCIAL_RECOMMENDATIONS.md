## Financial Recommendations - AWS Bedrock Integration

### Overview
This document describes how the backend generates simple, general financial recommendations using AWS Bedrock (Claude 3 Sonnet) based on financial data stored in MongoDB.

### Architecture
- Data aggregation: `src/services/dataAggregator.js`
- Prompt builder: `src/utils/promptBuilder.js`
- Bedrock client: `src/services/bedrockService.js`
- Engine: `src/services/recommendationEngine.js`
- Controller: `src/controllers/recommendationsController.js`
- Route: `src/routes/recommendations.js` (mounted at `/api/recommendations`)

### Setup
1. Install dependencies:
   - `npm install`
2. Environment variables (`.env`):
   - `AWS_REGION=us-east-1`
   - `AWS_ACCESS_KEY_ID=...`
   - `AWS_SECRET_ACCESS_KEY=...`
   - `BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0`
3. Start server: `npm run dev`

### Endpoint
- `GET /api/recommendations`
  - Response:
  ```json
  {
    "snapshot": {
      "totalAssetValue": 0,
      "totalIncomeMonthly": 0,
      "totalLiabilities": 0,
      "totalCreditCardDebt": 0,
      "netWorth": 0
    },
    "recommendations": [{ "title": "...", "detail": "..." }],
    "disclaimer": "..."
  }
  ```

### Notes
- Returns general information only; no authentication required.
- Prompt builder ensures consistent, concise instructions and JSON output targeting.


