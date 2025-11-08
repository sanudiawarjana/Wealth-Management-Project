# 💰 Wealth Management System - AI Boot Camp Project

A full-stack wealth management application with AI-powered financial recommendations built with Next.js 15, TypeScript, Tailwind CSS, and Node.js Express.

![Status](https://img.shields.io/badge/status-production%20ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-38bdf8)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-blue)
![AWS](https://img.shields.io/badge/AWS-Bedrock-orange)

## 🌟 Features

### 📊 Financial Management
- **Income Tracking** - Manage multiple income sources with frequencies
- **Asset Management** - Track properties, investments, savings, and more
- **Liability Tracking** - Monitor loans, mortgages, and debts
- **Credit Card Management** - Track limits, balances, and utilization

### 🤖 AI-Powered Insights
- **Personalized Recommendations** - AI-generated financial advice using AWS Bedrock Claude 3 Sonnet
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

## 🏗️ Architecture

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety throughout
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Radix UI** - Accessible UI components

### Backend
- **Node.js Express** - REST API server
- **MongoDB Atlas** - Cloud database
- **AWS Bedrock** - AI recommendations (Claude 3 Sonnet)
- **Security** - Helmet, CORS, Rate Limiting

## 🚀 Quick Start

### Prerequisites
- Node.js 18.x or higher
- MongoDB Atlas account
- AWS Account with Bedrock access

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd "AI Boot Camp"

# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../Frontend
npm install
```

### Environment Setup

#### Backend Configuration
Create `Backend/.env`:
```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development

# MongoDB Atlas
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# AWS Bedrock
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0
ANTHROPIC_VERSION=bedrock-2023-05-31
```

#### Frontend Configuration
Create `Frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Running the Application

```bash
# Terminal 1: Start backend
cd Backend
npm run dev

# Terminal 2: Start frontend
cd Frontend
npm run dev
```

Visit `http://localhost:3000` to access the application.

## 📁 Project Structure

```
AI Boot Camp/
├── Backend/                 # Node.js Express API server
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Security, validation, logging
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── server.js           # Entry point
│   └── .env                # Environment variables
├── Frontend/               # Next.js 15 frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and services
│   ├── hooks/              # Custom React hooks
│   └── public/             # Static assets
└── docs/                   # Organized documentation
    ├── architecture/       # System design docs
    ├── deployment/         # Deployment guides
    ├── general/            # Setup and usage guides
    └── testing/            # Testing documentation
```

## 🔌 API Endpoints

### Income Management
- `GET /api/income` - Get all income records
- `POST /api/income` - Create new income record
- `GET /api/income/:id` - Get specific income record
- `PUT /api/income/:id` - Update income record
- `DELETE /api/income/:id` - Delete income record

### Assets Management
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `GET /api/assets/:id` - Get specific asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset

### Liabilities Management
- `GET /api/liabilities` - Get all liabilities
- `POST /api/liabilities` - Create new liability
- `GET /api/liabilities/:id` - Get specific liability
- `PUT /api/liabilities/:id` - Update liability
- `DELETE /api/liabilities/:id` - Delete liability

### Credit Cards Management
- `GET /api/creditcards` - Get all credit cards
- `POST /api/creditcards` - Create new credit card
- `GET /api/creditcards/:id` - Get specific credit card
- `PUT /api/creditcards/:id` - Update credit card
- `DELETE /api/creditcards/:id` - Delete credit card

### AI Recommendations
- `GET /api/recommendations` - Auto-generate recommendations
- `POST /api/recommendations/generate` - Generate with custom parameters
- `GET /api/recommendations/generate` - Generate with query parameters
- `POST /api/recommendations/generate-keywords` - Generate with keywords
- `GET /api/recommendations/history` - Get recommendation history

## 🚀 Deployment

### Backend (AWS Elastic Beanstalk)
1. Install EB CLI: `pip install awsebcli`
2. Initialize: `eb init`
3. Create environment: `eb create production-env`
4. Deploy: `eb deploy`

### Frontend (Vercel)
1. Install Vercel CLI: `npm install -g vercel`
2. Build: `npm run build`
3. Deploy: `vercel --prod`

## 🛡️ Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Input Validation** - Server-side validation
- **Environment Variables** - Secret management
- **Error Handling** - Secure error responses

## 🧪 Testing

### Backend Testing
- Comprehensive API testing with Postman
- CRUD operation validation
- AI recommendation testing
- Error handling verification

### Frontend Testing
- Component rendering tests
- API integration tests
- User interaction tests
- Responsive design validation

## 📚 Documentation

All project documentation has been organized into the [docs](docs/) directory:
- [Architecture Documentation](docs/architecture/)
- [Deployment Guides](docs/deployment/)
- [Setup Instructions](docs/general/setup/)
- [Testing Procedures](docs/testing/)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- AWS Bedrock for AI capabilities
- MongoDB Atlas for database hosting
- Next.js and React communities
- All contributors to this project