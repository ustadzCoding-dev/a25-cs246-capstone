import logger from './logger.js';

/**
 * Custom Error Classes
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

export class ValidationError extends AppError {
  constructor(message, details = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

/**
 * Error Handler Utility
 */
export const handleError = (error, req, res) => {
  const requestId = req.id || 'unknown';
  const endpoint = `${req.method} ${req.path}`;
  const userId = req.user?._id || 'anonymous';

  // Log error dengan context
  const errorLog = {
    requestId,
    timestamp: new Date().toISOString(),
    endpoint,
    userId,
    method: req.method,
    path: req.path,
    ip: req.ip,
    errorName: error.name,
    errorMessage: error.message,
    errorCode: error.code || 'UNKNOWN',
    statusCode: error.statusCode || 500,
    stack: error.stack
  };

  logger.error('Request Error', errorLog);

  // Determine status code
  let statusCode = error.statusCode || 500;
  let code = error.code || 'INTERNAL_ERROR';
  let message = error.message || 'Internal Server Error';
  let details = error.details || [];

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Validation failed';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_ID';
    message = 'Invalid ID format';
  } else if (error.name === 'MongoServerError' && error.code === 11000) {
    statusCode = 409;
    code = 'DUPLICATE_ENTRY';
    message = 'Duplicate entry';
    const field = Object.keys(error.keyPattern)[0];
    details = [{ field, message: `${field} already exists` }];
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Token expired';
  }

  // Return error response
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: details.length > 0 ? details : undefined,
      requestId,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Async error wrapper untuk express routes
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
