import express from 'express'
import {
  register,
  login,
  getMe,
  updateProfile,
  logout
} from '../controllers/authController.js'
import { authenticate } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {
  registerSchema,
  loginSchema,
  updateProfileSchema
} from '../validators/authValidator.js'

const router = express.Router()

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', validate(registerSchema), register)

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), login)

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authenticate, getMe)

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile)

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, logout)

export default router
