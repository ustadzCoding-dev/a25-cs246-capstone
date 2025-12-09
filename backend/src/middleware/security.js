import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

/**
 * Security middleware configuration
 */

// Set security HTTP headers
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Allow inline scripts for Swagger UI
      imgSrc: ["'self'", 'data:', 'https:', 'validator.swagger.io'],
      connectSrc: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

/**
 * RATE LIMITING TIERS (Industry Standard)
 * Based on typical API usage patterns and security best practices
 */

// TIER 1: Global limiter (All endpoints)
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 1000 : 1000, // 1000 for both dev and production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and API docs
    return req.path === '/health' || req.path.startsWith('/api-docs');
  }
});

// TIER 2: Authentication limiter (Login/Register/Refresh)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 100, // 100 for both dev and production
  message: 'Too many login attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

// TIER 3: File upload limiter (Heavy I/O operations)
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 50 : 100, // 50 for production, 100 for dev
  message: 'Too many file uploads, please try again after 1 hour.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

// TIER 4: Bulk operations limiter (Very heavy operations)
export const bulkLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 20 : 50, // 20 for production, 50 for dev
  message: 'Too many bulk operations, please try again after 1 hour.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

// TIER 5: Export limiter (Resource-intensive operations)
export const exportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 30 : 50, // 30 for production, 50 for dev
  message: 'Too many export requests, please try again after 1 hour.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false
});

// Data sanitization against NoSQL query injection
export const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized request data: ${key}`);
  },
  // Don't sanitize req.query as it's read-only
  allowDots: true
});

// Data sanitization against XSS
export const preventXSS = xss();

// Prevent HTTP Parameter Pollution
export const preventHPP = hpp({
  whitelist: [
    'status',
    'learningPath',
    'role',
    'page',
    'limit',
    'sort'
  ]
});

// Custom security headers
export const customHeaders = (req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');

  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  next();
};

export default {
  helmetMiddleware,
  limiter,
  authLimiter,
  uploadLimiter,
  bulkLimiter,
  exportLimiter,
  sanitizeData,
  preventXSS,
  preventHPP,
  customHeaders
};
