import { ForbiddenError } from '../utils/errorHandler.js';

/**
 * Authorization middleware factory
 * Checks if user has required role
 * @param {string|Array<string>} requiredRoles - Role(s) required to access endpoint
 * @returns {Function} Middleware function
 */
export const authorize = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new ForbiddenError('User not authenticated');
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

    if (!roles.includes(req.user.role)) {
      throw new ForbiddenError(`This action requires one of these roles: ${roles.join(', ')}`);
    }

    next();
  };
};

/**
 * Admin-only middleware
 */
export const adminOnly = authorize('admin');

/**
 * Student-only middleware
 */
export const studentOnly = authorize('student');

/**
 * Admin or Student middleware
 */
export const adminOrStudent = authorize(['admin', 'student']);

export default authorize;
