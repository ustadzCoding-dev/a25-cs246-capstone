import express from "express";
import passport from "passport";
import * as authController from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// ========== PUBLIC ROUTES ==========

/**
 * @route   GET /api/auth/google
 * @desc    Initiate Google OAuth flow
 * @access  Public
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=auth_failed`,
  }),
  authController.googleCallback
);

/**
 * @route   POST /api/auth/register
 * @desc    Register new local user
 * @access  Public
 */
router.post("/register", authController.registerUser);

/**
 * @route   POST /api/auth/login
 * @desc    Local login with email/password
 * @access  Public
 */
router.post("/login", authController.localLogin);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post("/refresh", authController.refreshToken);

// ========== PROTECTED ROUTES ==========

/**
 * @route   POST /api/auth/complete-profile
 * @desc    Complete profile for Google OAuth users
 * @access  Private (Authenticated users only)
 */
router.post("/complete-profile", authenticate, authController.completeProfile);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post("/logout", authenticate, authController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get("/me", authenticate, authController.getCurrentUser);

export default router;
