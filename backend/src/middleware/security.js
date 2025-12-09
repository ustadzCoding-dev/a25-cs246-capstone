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

// Rate limiting - Development-friendly settings
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 300 : 1000, // 300 for production, 1000 for dev
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for health checks and API docs in development
    if (process.env.NODE_ENV !== 'production') {
      return req.path === '/health' || req.path.startsWith('/api-docs');
    }
    return false;
  }
});

// Stricter rate limit for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 50 : 50, // 50 for both dev and production
  message: 'Too many login attempts, please try again after 15 minutes.',
  skipSuccessfulRequests: true // Don't count successful requests
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
  sanitizeData,
  preventXSS,
  preventHPP,
  customHeaders
};
