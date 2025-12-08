import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import routes from './routes/index.js';
import logger from './utils/logger.js';
import swaggerSpec from './config/swagger.js';
import configurePassport from './config/passport.js';
import { responseFormatter } from './middleware/responseFormatter.js';
import { auditLogger } from './middleware/auditLogger.js';
import { handleError } from './utils/errorHandler.js';
import { multerErrorHandler } from './middleware/multerErrorHandler.js';
import { helmetMiddleware, limiter, preventHPP, customHeaders } from './middleware/security.js';

// Environment variables are loaded via `import 'dotenv/config'` above

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// ========== TRUST PROXY (for Railway/Render deployment) ==========
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// ========== GOOGLE OAUTH CONFIGURATION (NEW) ==========
// Configure Passport Google OAuth Strategy
configurePassport();

// ========== SECURITY MIDDLEWARE (EXISTING) ==========
app.use(helmetMiddleware);
app.use(customHeaders);
app.use(limiter);
app.use(preventHPP);

// ========== CORS (UPDATED for credentials) ==========
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true, // Required for cookies (refresh token)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// ========== BODY PARSERS & COOKIE PARSER ==========
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser()); // Required for refresh token cookies

// ========== STATIC FILES (UPLOADS) ==========
app.use('/uploads', express.static('uploads'));

// ========== PASSPORT INITIALIZATION (NEW) ==========
app.use(passport.initialize());

// Note: mongo-sanitize and xss-clean removed due to compatibility issues
// Input validation is handled by Joi schemas in routes

// ========== REQUEST LOGGING & FORMATTING ==========
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Response formatter middleware
app.use(responseFormatter);

// Audit logger middleware (untuk admin actions)
app.use(auditLogger);

// ========== API DOCUMENTATION ==========
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Dicoding Capstone API Docs'
  })
);

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ========== HEALTH CHECK ==========
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      database: 'connected',
      googleOAuth: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured'
    }
  });
});

// ========== ROUTES ==========
app.use('/api', routes);

// ========== 404 HANDLER ==========
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found'
    }
  });
});

// ========== ERROR HANDLERS ==========
// Multer error handler (must come before general error handler)
app.use(multerErrorHandler);

// General error handler
app.use((err, req, res, _next) => {
  handleError(err, req, res);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
  logger.info(`API Docs: http://localhost:${PORT}/api-docs`);
  logger.info(`Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not Configured'}`);
  logger.info(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
