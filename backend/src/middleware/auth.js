import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyAccessToken } from '../utils/jwt.js';

// ========== EXISTING MIDDLEWARE (TETAP) ==========

/**
 * OLD SYSTEM: Protect middleware (untuk sistem lama)
 * Digunakan untuk endpoint yang masih pakai token format lama
 */
export const protect = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided'
        }
      });
    }
    const token = authHeader.split(' ')[1];

    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Ambil data user dari database
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    // Tambahkan data user ke request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid or expired token'
      }
    });
  }
};

/**
 * OLD SYSTEM: Authorize middleware
 * Check user roles
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'Access denied'
        }
      });
    }
    next();
  };
};

// ========== NEW MIDDLEWARE FOR GOOGLE OAUTH ==========

/**
 * NEW SYSTEM: Authenticate middleware (untuk Google OAuth + local with refresh token)
 * Mendukung access token dari Google OAuth dan local login baru
 * Format req.user: { id, role }
 */
export const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token using new JWT utility
    const decoded = verifyAccessToken(token);

    // Attach user data to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * NEW SYSTEM: Authenticate with full user data
 * Load complete user from database
 */
export const authenticateWithUser = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = verifyAccessToken(token);

    // Fetch full user data from database
    const user = await User.findById(decoded.id)
      .select('-password -refreshToken')
      .populate('capstoneGroupId')
      .populate('learningGroupId');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach full user object to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * NEW SYSTEM: Check if user is admin
 */
export const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};

/**
 * NEW SYSTEM: Check if user is mentor or admin
 */
export const isMentor = (req, res, next) => {
  if (req.user.role !== 'mentor' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Mentor or Admin only.'
    });
  }
  next();
};

/**
 * NEW SYSTEM: Optional authentication (doesn't fail if no token)
 * Useful for public endpoints that can show different content for authenticated users
 */
export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = verifyAccessToken(token);

      req.user = {
        id: decoded.id,
        role: decoded.role
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * HYBRID: Universal authenticate (support both old and new tokens)
 * Coba verify dengan sistem baru dulu, kalau gagal coba sistem lama
 */
export const universalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Try new token system first (short-lived access token)
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      return next();
    } catch (newTokenError) {
      // If new token fails, try old token system (3 days token)
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }

        req.user = user;
        return next();
      } catch (oldTokenError) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token'
        });
      }
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};
