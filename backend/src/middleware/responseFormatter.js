import { v4 as uuidv4 } from 'uuid';

/**
 * Response Formatter Middleware
 * Standardize all API responses
 */

export const responseFormatter = (req, res, next) => {
  // Generate request ID untuk tracking
  req.id = uuidv4();

  /**
   * Success response formatter
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   * @param {object} meta - Additional metadata (pagination, etc)
   */
  res.success = (data, message = 'Success', statusCode = 200, meta = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(Object.keys(meta).length > 0 && { meta }),
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  };

  /**
   * Error response formatter
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 400)
   * @param {object} details - Error details
   */
  res.error = (message = 'Error', statusCode = 400, details = {}) => {
    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: getErrorCode(statusCode),
        ...(Object.keys(details).length > 0 && { details }),
        requestId: req.id,
        timestamp: new Date().toISOString()
      }
    });
  };

  /**
   * Paginated response formatter
   * @param {array} data - Array of items
   * @param {number} page - Current page
   * @param {number} limit - Items per page
   * @param {number} total - Total items
   * @param {string} message - Success message
   */
  res.paginated = (data, page, limit, total, message = 'Success') => {
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      requestId: req.id,
      timestamp: new Date().toISOString()
    });
  };

  next();
};

/**
 * Map HTTP status code to error code
 */
function getErrorCode(statusCode) {
  const codes = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'UNPROCESSABLE_ENTITY',
    429: 'TOO_MANY_REQUESTS',
    500: 'INTERNAL_SERVER_ERROR',
    503: 'SERVICE_UNAVAILABLE'
  };

  return codes[statusCode] || 'UNKNOWN_ERROR';
}
