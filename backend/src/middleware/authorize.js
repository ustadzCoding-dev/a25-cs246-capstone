/**
 * Authorization middleware factory
 * Checks if user has required role
 * @param {string|Array<string>} requiredRoles - Role(s) required to access endpoint
 * @returns {Function} Middleware function
 */
export const authorize = (requiredRoles) => {
  return (req, res, next) => {
    try {
      console.log('[authorize] Checking authorization for path:', req.path);
      console.log('[authorize] User:', req.user ? { id: req.user._id, role: req.user.role } : 'NOT SET');
      console.log('[authorize] Required roles:', requiredRoles);

      if (!req.user) {
        console.log('[authorize] User not authenticated');
        return res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'User not authenticated'
          }
        });
      }

      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];

      if (!roles.includes(req.user.role)) {
        console.log('[authorize] User role not in required roles:', { userRole: req.user.role, requiredRoles: roles });
        return res.status(403).json({
          success: false,
          error: {
            code: 'FORBIDDEN',
            message: `This action requires one of these roles: ${roles.join(', ')}`
          }
        });
      }

      console.log('[authorize] Authorization passed');
      next();
    } catch (err) {
      console.error('[authorize] Error:', err.message);
      next(err);
    }
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
