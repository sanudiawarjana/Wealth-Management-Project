# 🚀 Quick Start Guide

## Getting Started

### ✅ Prerequisites Installed
- Node.js 20+ 
- MongoDB Atlas account
- AWS Account with Bedrock access

### 🏃 Start the Application

Both servers are now running:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

Click the preview button above to open the application!

---

## 📝 How to Use Each Feature

### 1. **Add Income Source**

1. Navigate to the Income page
2. Click "Add Income" button
3. Fill in the form:
   - **Source**: e.g., "Monthly Salary", "Freelance Work"
   - **Amount**: Enter amount (e.g., 5000)
   - **Currency**: Select LKR, USD, or EUR
   - **Frequency**: Select monthly, yearly, or one-time
4. Click "Add Income"
5. ✅ Data is saved to MongoDB automatically
6. 📊 Charts update in real-time

**What happens behind the scenes:**
```
Frontend → API Service → Backend → MongoDB
         ← Success     ← Validation ← Save
Toast notification appears
```

---

### 2. **Add Asset**

1. Navigate to the Assets page
2. Click "Add Asset" button
3. Fill in the form:
   - **Name**: e.g., "Savings Account", "House", "Stocks"
   - **Type**: Property, Investment, Savings, or Other
   - **Value**: Current value (e.g., 50000)
   - **Currency**: LKR, USD, or EUR
4. Click "Add Asset"
5. ✅ Saved to database
6. 📊 Asset charts update

**Asset Types:**
- **Property**: Real estate, land
- **Investment**: Stocks, bonds, mutual funds
- **Savings**: Bank accounts, fixed deposits
- **Other**: Vehicles, jewelry, collectibles

---

### 3. **Add Liability**

1. Navigate to the Liabilities page
2. Click "Add Liability" button
3. Fill in the form:
   - **Name**: e.g., "Car Loan", "Home Mortgage"
   - **Type**: Loan, Mortgage, or Other
   - **Amount**: Outstanding amount (e.g., 25000)
   - **Currency**: LKR, USD, or EUR
   - **Interest Rate**: Annual rate (e.g., 4.5%)
4. Click "Add Liability"
5. ✅ Saved to database
6. 📊 Debt charts update

**Why Interest Rate Matters:**
- Used in wealth score calculation
- AI recommendations consider high-interest debt
- Helps prioritize debt repayment

---

### 4. **Add Credit Card**

1. Navigate to the Credit Cards page
2. Click "Add Credit Card" button
3. Fill in the form:
   - **Bank**: e.g., "Commercial Bank", "HSBC"
   - **Last 4 Digits**: Last 4 digits of card (e.g., 1234)
   - **Credit Limit**: Total limit (e.g., 100000)
   - **Outstanding Balance**: Current debt (e.g., 25000)
   - **Currency**: LKR, USD, or EUR
   - **Payment Due Date**: Next payment date
4. Click "Add Credit Card"
5. ✅ Saved to database
6. 📊 Credit utilization updates

**Credit Utilization:**
- Calculated as: (Outstanding / Limit) × 100%
- Keep below 30% for best credit health
- Affects wealth score

---

### 5. **Edit Any Entry**

1. Find the entry in the list
2. Click the **Edit** icon (pencil)
3. Modify the fields
4. Click "Update"
5. ✅ Changes saved immediately

---

### 6. **Delete Any Entry**

1. Find the entry in the list
2. Click the **Delete** icon (trash)
3. Confirm deletion
4. ✅ Removed from database
5. 📊 Charts update

---

### 7. **Generate AI Recommendations**

1. Add your financial data (income, assets, liabilities)
2. Navigate to the Recommendations page
3. Click "Generate AI Recommendations"
4. ⏳ Wait 3-5 seconds (AI processing)
5. ✅ Personalized recommendations appear

**AI Analyzes:**
- Your total income vs expenses
- Asset diversification
- Debt-to-income ratio
- Credit card usage
- Savings rate
- Financial goals

**Recommendation Categories:**
- 💰 **Savings**: Emergency funds, savings goals
- 📈 **Investment**: Portfolio diversification, growth
- 💳 **Debt**: Repayment strategies, consolidation
- 💵 **Spending**: Budget optimization, expense reduction

**Rate Limit:** 10 requests per hour to prevent API abuse

---

### 8. **View Charts & Analytics**

Charts automatically update when you:
- Add new data
- Edit existing data
- Delete data

**Available Charts:**

**Home Page:**
- 📊 Wealth Score Card (A+ to F grade)
- 📈 Income vs Expenses
- 🥧 Asset Allocation
- 📉 Liabilities Breakdown

**Income Page:**
- 🥧 Income by Source
- 📊 Monthly Income Comparison

**Assets Page:**
- 🥧 Assets by Type
- 📊 Asset Value Distribution

**Liabilities Page:**
- 🥧 Liabilities by Type
- 📊 Interest Rate Comparison

**Credit Cards Page:**
- 📊 Credit Utilization
- 🥧 Outstanding Balances

**All charts use clear, attractive colors:**
- 🔵 Blue
- 🟢 Green
- 🟠 Orange
- 🔴 Red
- 🟡 Yellow
- 🟣 Purple
- 🔷 Cyan
- 🟥 Pink

---

### 9. **Understand Your Wealth Score**

The wealth score is calculated based on:

1. **Net Worth (25 points)**
   - Total Assets - Total Liabilities
   - Higher net worth = Higher score

2. **Debt-to-Income Ratio (20 points)**
   - Total Debt ÷ Total Income × 100%
   - Below 20% = Excellent
   - 20-36% = Good
   - 36-50% = Fair
   - Above 50% = Poor

3. **Savings Rate (20 points)**
   - (Income - Debt) ÷ Income × 100%
   - Above 30% = Excellent
   - 20-30% = Good
   - 10-20% = Fair
   - Below 10% = Poor

4. **Asset Diversification (15 points)**
   - Number of different asset types
   - 4+ types = Excellent
   - 3 types = Good
   - 2 types = Fair
   - 1 type = Poor

5. **Credit Utilization (10 points)**
   - Credit Card Debt ÷ Credit Limit × 100%
   - Below 10% = Excellent
   - 10-30% = Good
   - 30-50% = Fair
   - Above 50% = Poor

6. **Income Stability (10 points)**
   - Number of income sources
   - 3+ sources = Excellent
   - 2 sources = Good
   - 1 source = Fair

**Your Grade:**
- A+ (95-100): Exceptional financial health
- A (90-94): Excellent financial health
- B+ (85-89): Very good financial health
- B (80-84): Good financial health
- C+ (75-79): Fair financial health
- C (70-74): Needs improvement
- D (60-69): Poor financial health
- F (0-59): Critical financial health

---

## 🧪 Test the System

### Test Scenario: Complete Financial Profile

**1. Add Income Sources:**
```
Salary
- Source: "Monthly Salary"
- Amount: 150000
- Currency: LKR
- Frequency: monthly

Freelance
- Source: "Freelance Work"
- Amount: 50000
- Currency: LKR
- Frequency: monthly
```

**2. Add Assets:**
```
Savings
- Name: "Emergency Fund"
- Type: Savings
- Value: 500000
- Currency: LKR

Property
- Name: "Apartment"
- Type: Property
- Value: 10000000
- Currency: LKR

Investments
- Name: "Stock Portfolio"
- Type: Investment
- Value: 1000000
- Currency: LKR
```

**3. Add Liabilities:**
```
Mortgage
- Name: "Home Loan"
- Type: Mortgage
- Amount: 5000000
- Currency: LKR
- Interest Rate: 8.5%

Car Loan
- Name: "Vehicle Loan"
- Type: Loan
- Amount: 1500000
- Currency: LKR
- Interest Rate: 12%
```

**4. Add Credit Cards:**
```
Main Card
- Bank: "Commercial Bank"
- Last 4: 1234
- Limit: 200000
- Outstanding: 50000
- Currency: LKR
- Due Date: 2025-11-15

Backup Card
- Bank: "HSBC"
- Last 4: 5678
- Limit: 150000
- Outstanding: 30000
- Currency: LKR
- Due Date: 2025-11-20
```

**5. Generate AI Recommendations**
- Click "Generate AI Recommendations"
- Review personalized advice

**6. Check Your Wealth Score**
- Navigate to Home
- View wealth score and breakdown

---

## 🎯 Expected Results

After adding the test data:

✅ **Charts Display:**
- Income breakdown shows salary + freelance
- Assets show diversification
- Liabilities show mortgage + car loan
- Credit utilization calculated

✅ **Wealth Score:**
- Should show around B+ to A- grade
- All 6 factors calculated
- Specific recommendations provided

✅ **AI Recommendations:**
- Emergency fund advice
- Debt repayment strategy
- Investment diversification
- Credit card management

---

## 🐛 Troubleshooting

**Problem: Data not saving**
- Check backend server is running (http://localhost:5000)
- Check browser console for errors
- Verify MongoDB connection

**Problem: Charts not updating**
- Refresh the page
- Check if data was actually saved
- Clear browser cache

**Problem: AI recommendations fail**
- Check AWS credentials in backend/.env
- Verify Bedrock model access
- Check rate limit (10/hour)

**Problem: "Network Error"**
- Verify backend is running on port 5000
- Check FRONTEND_URL in backend/.env
- Check NEXT_PUBLIC_API_URL in frontend/.env.local

---

## 📊 Currency Support

The system supports multiple currencies:

- **LKR**: Sri Lankan Rupee
- **USD**: US Dollar  
- **EUR**: Euro

**Currency Conversion:**
- Charts convert all to LKR for consistency
- Exchange rates in `lib/currency-utils.ts`
- Can add more currencies easily

**Current Exchange Rates (approximate):**
- 1 USD = 300 LKR
- 1 EUR = 330 LKR

---

## 🚀 Next Steps

1. ✅ Test all CRUD operations
2. ✅ Add your real financial data
3. ✅ Generate AI recommendations
4. ✅ Monitor your wealth score
5. ✅ Review charts and analytics
6. ✅ Track progress over time

---

## 🎉 You're Ready!

The system is fully functional and production-ready!

**Key Features Working:**
- ✅ Full CRUD for all entities
- ✅ Real-time database sync
- ✅ AI-powered recommendations
- ✅ Beautiful, clear charts
- ✅ Accurate wealth scoring
- ✅ Error handling
- ✅ Loading states
- ✅ User feedback
- ✅ Input validation
- ✅ Rate limiting
- ✅ Security headers
- ✅ Logging

**Start managing your wealth today! 💰📈**
