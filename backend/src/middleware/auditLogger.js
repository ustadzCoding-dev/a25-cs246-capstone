import logger from '../utils/logger.js';

/**
 * Audit Logger Middleware
 * Log all admin actions untuk accountability dan debugging
 */

export const auditLogger = (req, res, next) => {
  // Skip logging untuk GET requests (optional)
  if (req.method === 'GET') {
    return next();
  }

  // Capture original res.json
  const originalJson = res.json;

  // Override res.json untuk log response
  res.json = function (data) {
    // Log audit trail
    const auditLog = {
      requestId: req.id,
      timestamp: new Date().toISOString(),
      action: getActionName(req.method, req.path),
      method: req.method,
      endpoint: req.path,
      userId: req.user?._id || 'anonymous',
      userEmail: req.user?.email || 'anonymous',
      userRole: req.user?.role || 'guest',
      ipAddress: req.ip,
      statusCode: res.statusCode,
      success: data.success !== false,
      requestBody: sanitizeBody(req.body),
      responseData: sanitizeResponse(data),
      responseTime: Date.now() - req.startTime
    };

    // Log ke console (production bisa ke external service)
    if (res.statusCode >= 400) {
      logger.warn('Audit Log - Error', auditLog);
    } else {
      logger.info('Audit Log - Success', auditLog);
    }

    // Call original json method
    return originalJson.call(this, data);
  };

  // Capture start time
  req.startTime = Date.now();

  next();
};

/**
 * Get action name dari method + path
 */
function getActionName(method, path) {
  const actions = {
    'POST /api/timeline/add': 'CREATE_TIMELINE',
    'PUT /api/timeline/update': 'UPDATE_TIMELINE',
    'DELETE /api/timeline': 'DELETE_TIMELINE',
    'POST /api/announcements': 'CREATE_ANNOUNCEMENT',
    'PUT /api/announcements': 'UPDATE_ANNOUNCEMENT',
    'DELETE /api/announcements': 'DELETE_ANNOUNCEMENT',
    'POST /api/document/add': 'UPLOAD_DOCUMENT',
    'DELETE /api/document': 'DELETE_DOCUMENT',
    'PUT /api/capstone-group': 'UPDATE_TEAM',
    'POST /api/capstone-group/approve': 'APPROVE_TEAM',
    'POST /api/capstone-group/reject': 'REJECT_TEAM',
    'DELETE /api/capstone-group': 'DELETE_TEAM',
    'POST /api/usecase/add': 'CREATE_USECASE',
    'POST /api/learning-group/add': 'CREATE_LEARNING_GROUP',
    'PUT /api/learning-group/update': 'UPDATE_LEARNING_GROUP',
    'DELETE /api/learning-group': 'DELETE_LEARNING_GROUP'
  };

  // Try exact match
  for (const [key, action] of Object.entries(actions)) {
    if (path.startsWith(key.split(' ')[1])) {
      return action;
    }
  }

  // Fallback
  return `${method}_${path.replace(/\//g, '_').toUpperCase()}`;
}

/**
 * Sanitize request body (remove sensitive data)
 */
function sanitizeBody(body) {
  if (!body) {return {};}

  const sanitized = { ...body };

  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'refreshToken', 'secret'];
  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
}

/**
 * Sanitize response (remove sensitive data)
 */
function sanitizeResponse(data) {
  if (!data || !data.data) {return {};}

  // Untuk list responses, hanya return count
  if (Array.isArray(data.data)) {
    return { count: data.data.length };
  }

  // Untuk single object, return key fields saja
  const obj = data.data;
  return {
    id: obj._id || obj.id,
    type: obj.constructor?.name || 'Unknown'
  };
}
