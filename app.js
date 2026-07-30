require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { logger } = require('./utils/logger');
const { errorHandler } = require('./middleware/errorHandler');
const { corsOptions } = require('./config/cors');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const healthRoutes = require('./routes/health');
// In app.js, add the email routes import and mounting
const emailRoutes = require('./routes/email'); // Add this line
const docsRoutes = require('./routes/docs'); // Add this line if you have it

const app = express();
// Add before any middleware
const { requestIdMiddleware } = require('./middleware/requestId');
app.use(requestIdMiddleware);

// In the morgan logging, add request ID
morgan.token('requestId', (req) => req.requestId || '-');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :requestId'));
// Security middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX,
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});
app.use('/api', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/email', emailRoutes); // Add this line
app.use('/api-docs', docsRoutes); // Add this line if you have docs
// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global error handler
app.use(errorHandler);

module.exports = app;
