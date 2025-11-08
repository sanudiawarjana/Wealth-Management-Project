# 💰 Wealth Management System - Frontend

A **production-ready** Next.js 15 frontend application for personal wealth management with real-time analytics, AI-powered recommendations, and beautiful visualizations.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8)
![React](https://img.shields.io/badge/React-18.3-61dafb)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Backend API running (see Backend README)

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd Frontend

# 2. Install dependencies
npm install

# 3. Configure environment
# Create .env.local file:
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## ✨ Features

### 📊 Financial Management
- **Income Tracking** - Manage multiple income sources with frequencies
- **Asset Management** - Track properties, investments, savings, and more
- **Liability Tracking** - Monitor loans, mortgages, and debts
- **Credit Card Management** - Track limits, balances, and utilization

### 🤖 AI-Powered Insights
- **Personalized Recommendations** - AI-generated financial advice
- **Context-Aware Suggestions** - Based on complete financial picture
- **Category-Based Recommendations** - Savings, investments, debt, spending

### 📈 Analytics & Visualizations
- **Wealth Score** - A+ to F grading based on 6 factors
- **Interactive Charts** - Built with Recharts
- **Real-Time Updates** - Charts update automatically
- **Multi-Currency Support** - LKR, USD, EUR

### 🎨 User Interface
- **Modern Design** - Clean, intuitive interface
- **Dark/Light Mode** - Theme switching support
- **Responsive** - Works on all devices
- **Accessible** - WCAG compliant components
- **Beautiful Colors** - Attractive, clear chart colors

### ⚡ Performance
- **Fast Loading** - Next.js 15 optimizations
- **Type Safety** - Full TypeScript coverage
- **State Management** - React Context API
- **Error Handling** - Comprehensive error boundaries
- **Loading States** - User feedback throughout

---

## 📁 Project Structure

```
Frontend/
├── app/                      # Next.js 15 app directory
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (dashboard)
│   ├── globals.css          # Global styles
│   ├── income/
│   │   └── page.tsx         # Income management page
│   ├── assets/
│   │   └── page.tsx         # Assets management page
│   ├── liabilities/
│   │   └── page.tsx         # Liabilities management page
│   ├── credit-cards/
│   │   └── page.tsx         # Credit cards management page
│   └── recommendations/
│       └── page.tsx         # AI recommendations page
├── components/              # React components
│   ├── ui/                  # Radix UI components (57 files)
│   ├── add-income-dialog.tsx
│   ├── add-asset-dialog.tsx
│   ├── add-liability-dialog.tsx
│   ├── add-credit-card-dialog.tsx
│   ├── financial-chart.tsx
│   ├── wealth-score-card.tsx
│   ├── nav-bar.tsx
│   └── ... (15+ components)
├── lib/                     # Libraries and utilities
│   ├── api-client.ts       # HTTP client with retry logic
│   ├── api-services.ts     # API service layer
│   ├── financial-context.tsx # State management
│   ├── types.ts            # TypeScript types
│   ├── wealth-score.ts     # Wealth calculation logic
│   ├── currency-utils.ts   # Currency conversion
│   └── color-palettes.ts   # Chart color schemes
├── hooks/                   # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── documentation/           # Documentation
│   ├── FEATURES.md
│   ├── COMPONENTS.md
│   ├── API_INTEGRATION.md
│   ├── DEPLOYMENT.md
│   └── DEVELOPMENT.md
├── .env.local              # Environment variables (not committed)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
└── README.md               # This file
```

---

## 🔌 API Integration

### Backend Connection

The frontend connects to the backend API via the configured URL:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### API Service Layer

All API calls go through the service layer:

```typescript
// Example: Create income
import { incomeService } from '@/lib/api-services';

const newIncome = await incomeService.create({
  source: "Salary",
  amount: 5000,
  currency: "USD",
  frequency: "monthly"
});
```

### Available Services

- `incomeService` - Income CRUD operations
- `assetService` - Asset CRUD operations
- `liabilityService` - Liability CRUD operations
- `creditCardService` - Credit card CRUD operations
- `recommendationService` - AI recommendations

### Features

✅ **Automatic Retry** - 3 attempts with exponential backoff  
✅ **Error Handling** - User-friendly error messages  
✅ **Loading States** - Visual feedback during operations  
✅ **Toast Notifications** - Success/error notifications  
✅ **Type Safety** - Full TypeScript support  

---

## 🎨 Components

### Dialog Components

**Add/Edit Dialogs:**
- `add-income-dialog.tsx` - Income form
- `add-asset-dialog.tsx` - Asset form
- `add-liability-dialog.tsx` - Liability form
- `add-credit-card-dialog.tsx` - Credit card form

All dialogs support:
- Create mode
- Edit mode
- Form validation
- Loading states
- Error handling
- Toast notifications

### Chart Components

- `financial-chart.tsx` - General purpose chart wrapper
- `donut-chart.tsx` - Donut/pie charts
- `area-chart.tsx` - Area charts
- `income-expense-chart.tsx` - Income vs expenses
- `liabilities-chart.tsx` - Liabilities breakdown
- `section-pie-chart.tsx` - Sectional pie charts

### Display Components

- `wealth-score-card.tsx` - Wealth score display (A+ to F)
- `stat-card.tsx` - Statistical cards
- `recommendation-card.tsx` - AI recommendation display
- `nav-bar.tsx` - Navigation bar

### UI Components

57 Radix UI components in `components/ui/`:
- `button.tsx` - Button variants
- `dialog.tsx` - Modal dialogs
- `input.tsx` - Input fields
- `select.tsx` - Select dropdowns
- `toast.tsx` - Toast notifications
- ... and 52 more

---

## 📊 State Management

### Financial Context

The app uses React Context API for global state:

```typescript
import { useFinancial } from '@/lib/financial-context';

function MyComponent() {
  const {
    data,              // All financial data
    loading,           // Loading state
    addIncome,         // Add income (async)
    updateIncome,      // Update income (async)
    deleteIncome,      // Delete income (async)
    // ... more methods
  } = useFinancial();
}
```

### Features

- **Real-time sync** with backend
- **Automatic refresh** on mount
- **Optimistic updates** for better UX
- **Error recovery** with toast notifications
- **Loading states** throughout

---

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS 4.x with custom configuration:

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        chart-1: 'hsl(var(--chart-1))',
        chart-2: 'hsl(var(--chart-2))',
        // ... 8 chart colors
      }
    }
  }
}
```

### Color Palette

**Chart Colors:**
- 🔵 Chart 1: Blue (#3b82f6)
- 🟢 Chart 2: Green (#10b981)
- 🟠 Chart 3: Orange (#f59e0b)
- 🔴 Chart 4: Red (#ef4444)
- 🌸 Chart 5: Pink (#ec4899)
- 🟡 Chart 6: Yellow (#fbbf24)
- 🟣 Chart 7: Purple (#8b5cf6)
- 🔷 Chart 8: Cyan (#06b6d4)

### Theme System

Supports dark and light modes with custom CSS variables:

```css
:root {
  --background: oklch(0.99 0.005 106);
  --foreground: oklch(0.15 0.01 250);
  --primary: oklch(0.55 0.22 250);
  /* ... more variables */
}

.dark {
  --background: oklch(0.18 0.01 250);
  --foreground: oklch(0.98 0.005 250);
  /* ... more variables */
}
```

---

## 📈 Wealth Score

### Calculation

The wealth score is calculated based on 6 factors:

1. **Net Worth** (25 points) - Assets minus liabilities
2. **Debt-to-Income Ratio** (20 points) - Debt management
3. **Savings Rate** (20 points) - How much you save
4. **Asset Diversification** (15 points) - Spread of assets
5. **Credit Utilization** (10 points) - Credit card usage
6. **Income Stability** (10 points) - Number of income sources

### Grading Scale

- **A+** (95-100): Exceptional financial health
- **A** (90-94): Excellent financial health
- **B+** (85-89): Very good financial health
- **B** (80-84): Good financial health
- **C+** (75-79): Fair financial health
- **C** (70-74): Needs improvement
- **D** (60-69): Poor financial health
- **F** (0-59): Critical financial health

---

## 🔒 Security

### Environment Variables

```env
# .env.local (not committed to git)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Client-Side Validation

All forms include client-side validation before API calls:

```typescript
// Example: Income validation
{
  source: z.string().min(2).max(100),
  amount: z.number().positive(),
  currency: z.enum(['LKR', 'USD', 'EUR']),
  frequency: z.enum(['monthly', 'yearly', 'one-time'])
}
```

### Error Boundaries

The app includes error boundaries to prevent crashes:

```typescript
// Catches and displays errors gracefully
<ErrorBoundary fallback={<ErrorUI />}>
  <YourComponent />
</ErrorBoundary>
```

---

## 🧪 Testing

### Manual Testing

```bash
# 1. Start backend (port 5000)
cd Backend
npm run dev

# 2. Start frontend (port 3000)
cd Frontend
npm run dev

# 3. Test features:
# - Add income source
# - Edit asset
# - Delete liability
# - Generate AI recommendations
# - View charts
```

### Testing Checklist

- [ ] Add income source
- [ ] Edit income source
- [ ] Delete income source
- [ ] Add asset
- [ ] Edit asset
- [ ] Delete asset
- [ ] Add liability
- [ ] Edit liability
- [ ] Delete liability
- [ ] Add credit card
- [ ] Edit credit card
- [ ] Delete credit card
- [ ] Generate AI recommendations
- [ ] View wealth score
- [ ] Check chart updates
- [ ] Test dark/light mode
- [ ] Test mobile responsive
- [ ] Test error handling

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod

# 4. Set environment variable in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Alternative Platforms

**Netlify:**
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

**Railway:**
```bash
railway up
```

---

## 📚 Documentation

Comprehensive documentation available in `/documentation`:

- **[FEATURES.md](documentation/FEATURES.md)** - Complete feature list
- **[COMPONENTS.md](documentation/COMPONENTS.md)** - Component guide
- **[API_INTEGRATION.md](documentation/API_INTEGRATION.md)** - API integration guide
- **[DEPLOYMENT.md](documentation/DEPLOYMENT.md)** - Deployment guide
- **[DEVELOPMENT.md](documentation/DEVELOPMENT.md)** - Development guide

---

## 🛠️ Tech Stack

### Core
- **Framework:** Next.js 15.5
- **Language:** TypeScript 5.x
- **React:** 18.3
- **Styling:** Tailwind CSS 4.x

### UI Components
- **Component Library:** Radix UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **Forms:** React Hook Form
- **Validation:** Zod

### State Management
- **Global State:** React Context API
- **Server State:** SWR (future)

### Development
- **Package Manager:** npm
- **Linter:** ESLint
- **Type Checking:** TypeScript

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^4.1.9",
    "recharts": "latest",
    "@radix-ui/*": "latest",
    "lucide-react": "^0.454.0",
    "react-hook-form": "^7.60.0",
    "zod": "3.25.67",
    "sonner": "^1.7.4"
  }
}
```

---

## 🎯 Roadmap

### Planned Features

- [ ] User authentication
- [ ] Multi-user support
- [ ] Data export (CSV/PDF)
- [ ] Budget planning
- [ ] Goal tracking
- [ ] Email notifications
- [ ] Mobile app
- [ ] Offline support
- [ ] Advanced analytics
- [ ] Financial reports

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Radix UI for accessible components
- Recharts for beautiful charts
- Vercel for hosting platform

---

## 📧 Support

For issues and questions:
- Check the [documentation](documentation/)
- Review [troubleshooting guide](documentation/DEVELOPMENT.md#troubleshooting)
- Open an issue on GitHub

---

**Built with ❤️ using Next.js 15**

**Version:** 1.0.0  
**Last Updated:** October 2025
