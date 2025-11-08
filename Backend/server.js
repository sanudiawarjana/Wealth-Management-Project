require('dotenv').config();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { randomUUID } = require('crypto');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const listEndpoints = require('express-list-endpoints');

const connectDB = require('./src/config/db');
const { apiLimiter, recommendationLimiter } = require('./src/middleware/rateLimiter');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

// ----------------- Express App -----------------
const app = express();
const PORT = process.env.PORT || 5000;

// ----------------- Middleware -----------------
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration - Allow localhost and Vercel domains
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Allow all localhost ports in development
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:3002',
      'http://localhost:3003',
      process.env.FRONTEND_URL,
      // Allow Vercel preview and production domains
      /\.vercel\.app$/,
      /^https:\/\/.*\.vercel\.app$/,
      // Allow mobile devices on local network
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
      /^http:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/
    ].filter(Boolean);
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin.startsWith(allowed);
      } else if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // Cache preflight for 10 minutes
};
app.use(cors(corsOptions));

// Handle preflight explicitly
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting to all API routes
app.use('/api', apiLimiter);

// Request ID middleware
app.use((req, res, next) => {
  req.id = randomUUID();
  next();
});

// ----------------- Logging -----------------
const logDir = process.env.LOG_DIR || path.join('/tmp', 'logs'); // EB writable
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

morgan.token('id', (req) => req.id);
morgan.token('body', (req) => {
  try {
    return JSON.stringify(req.body);
  } catch {
    return '';
  }
});

const prodFormat =
  ':id :remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms :body';

const consoleFormat =
  process.env.NODE_ENV === 'production' ? prodFormat : '[:date[clf]] ":method :url" :status :response-time ms';

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',
  path: logDir,
  maxFiles: 14,
});

// Console logging
app.use(
  morgan(consoleFormat, {
    skip: (req) => req.path === '/health',
  })
);

// File logging
app.use(
  morgan(prodFormat, {
    stream: accessLogStream,
    skip: (req) => req.path === '/health',
  })
);

// ----------------- Routes -----------------
const incomeRoutes = require('./src/routes/income');
const assetsRoutes = require('./src/routes/assets');
const liabilitiesRoutes = require('./src/routes/liabilities');
const creditCardsRoutes = require('./src/routes/creditCards');
const recommendationsRoutes = require('./src/routes/recommendations');

app.use('/api/income', incomeRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/liabilities', liabilitiesRoutes);
app.use('/api/creditcards', creditCardsRoutes);
app.use('/api/recommendations', recommendationLimiter, recommendationsRoutes);

// ----------------- Favicon Handler (suppress 404 errors) -----------------
app.get('/favicon.ico', (req, res) => res.status(204).end());

// ----------------- Root -----------------
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Express REST API Server',
    version: '1.0.0',
    endpoints: {
      income: '/api/income',
      assets: '/api/assets',
      liabilities: '/api/liabilities',
      creditCards: '/api/creditcards',
      recommendations: '/api/recommendations',
    },
  });
});

// ----------------- Health Check -----------------
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ----------------- Routes Inspection -----------------
app.get('/routes', (req, res) => {
  const routes = listEndpoints(app);
  res.status(200).json({
    total: routes.length,
    routes,
  });
});

// ----------------- 404 Handler -----------------
app.use(notFound);

// ----------------- Global Error Handler -----------------
app.use(errorHandler);

// ----------------- Start Server -----------------
const startServer = async () => {
  try {
    await connectDB();
    logger.success('Database connected successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      logger.success(`🚀 Server running on port ${PORT}`);
      logger.info(`🔍 Health check: http://localhost:${PORT}/health`);
      logger.info(`📋 Route list: http://localhost:${PORT}/routes`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    logger.error('❌ Failed to start server:');
    logger.error(err);
    process.exit(1); // EB detects this as crash
  }
};

startServer();

module.exports = app;