import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Counter from "../models/Counter.js";
import { generateTokens, verifyRefreshToken } from "../utils/jwt.js";

// ========== EXISTING FUNCTIONS (TETAP) ==========

async function getNextSequence(counterName) {
  const counter = await Counter.findByIdAndUpdate(
    counterName,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}

export const registerUser = async (req, res) => {
  try {
    // Mengambil data dari request
    const { name, email, password, learningPath, university, role } = req.body;

    // Pengecekan apakah user sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already registered",
      });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate ID berdasarkan learningpath
    const newSeqNumber = await getNextSequence("dicodingId");
    let generateDicodingId;
    switch (learningPath) {
      case "Front-End Web & Back-End with AI":
        generateDicodingId = `FEBE${newSeqNumber
          .toString()
          .padStart(5, "0")}AI`;
        break;
      case "React & Back-End with AI":
        generateDicodingId = `REBE${newSeqNumber
          .toString()
          .padStart(5, "0")}AI`;
        break;
      case "Machine Learning":
        generateDicodingId = `ML${newSeqNumber.toString().padStart(5, "0")}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: "Learning Path tidak valid.",
        });
    }

    // Membuat user baru
    const newUser = new User({
      dicodingId: generateDicodingId,
      name,
      email,
      password: hashedPassword,
      learningPath,
      role: role || "student", // Default role student, bisa override
      university,
      provider: "local",
      lastLogin: new Date(),
    });

    // Menyimpan user baru ke database
    await newUser.save();

    // GENERATE TOKEN (OLD SYSTEM untuk compatibility)
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    // Mengirimkan response dengan token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: userResponse,
        token: token,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in registerUser", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Mengambil data dari request
    const { email, password } = req.body;

    console.log('[LOGIN] Attempting login for:', email);

    // Pengecekan user (hanya local users)
    const user = await User.findOne({ email, provider: "local" }).select(
      "+password"
    );

    if (!user) {
      console.log('[LOGIN] User not found:', email);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log('[LOGIN] User found, comparing password...');

    // Komparasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    console.log('[LOGIN] Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Membuat token (tetap gunakan sistem lama untuk compatibility)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Mengirimkan response
    res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in loginUser", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// ========== NEW FUNCTIONS FOR GOOGLE OAUTH ==========

/**
 * Handle Google OAuth Callback
 */
export const googleCallback = async (req, res) => {
  try {
    const { googleId, email, name, profilePicture } = req.user;

    // Check if user exists by googleId
    let user = await User.findOne({ googleId });

    if (!user) {
      // Check if email already exists with local account
      const existingUser = await User.findOne({ email });

      if (existingUser && existingUser.provider === "local") {
        return res.redirect(
          `${process.env.FRONTEND_URL}/login?error=email_already_exists`
        );
      }

      // Determine role based on admin whitelist
      const adminEmails =
        process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];
      const role = adminEmails.includes(email) ? "admin" : "student";

      // Create new user (Google OAuth - no dicodingId yet, can be filled later)
      user = await User.create({
        googleId,
        email,
        name,
        profilePicture,
        provider: "google",
        isEmailVerified: true,
        role,
        lastLogin: new Date(),
        // dicodingId, learningPath, university will be null - can be filled via profile completion
      });

      console.log("New Google user created:", user.email);
    } else {
      // Update existing Google user
      user.lastLogin = new Date();

      // Update profile picture if changed
      if (profilePicture && user.profilePicture !== profilePicture) {
        user.profilePicture = profilePicture;
      }

      await user.save();
      console.log("Google user logged in:", user.email);
    }

    // Generate tokens (use new JWT system for Google OAuth)
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.role
    );

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with access token
    const redirectUrl = `${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
  }
};

/**
 * Local Login (New version with JWT refresh token)
 * This is alternative to loginUser above
 */
export const localLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('[LOCAL_LOGIN] Attempting login for:', email);

    // Find user (include password field, only local users)
    const user = await User.findOne({ email, provider: "local" }).select(
      "+password"
    );

    console.log('[LOCAL_LOGIN] User found:', !!user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate tokens (new system)
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      user.role
    );

    // Save refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        accessToken,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Local login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Refresh Access Token
 */
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Find user
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user._id.toString(), user.role);

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Set new refresh token cookie
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

/**
 * Logout
 */
export const logout = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware

    // Clear refresh token from database
    await User.findByIdAndUpdate(userId, { refreshToken: null });

    // Clear refresh token cookie
    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Get Current User
 */
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("capstoneGroupId")
      .populate("learningGroupId");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * Complete Google OAuth User Profile
 * @route POST /api/auth/complete-profile
 * @access Private (Google OAuth users only)
 */
export const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { learningPath, university } = req.body;

    console.log("📥 Complete profile request:", {
      userId,
      learningPath,
      university,
    });

    // Validate required fields
    if (!learningPath || !university) {
      return res.status(400).json({
        success: false,
        message: "Learning path and university are required",
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("👤 Found user:", user.email, "Provider:", user.provider);

    // Only allow Google users to complete profile
    if (user.provider !== "google") {
      return res.status(400).json({
        success: false,
        message: "Only Google OAuth users can complete profile",
      });
    }

    // Check if already completed
    if (user.dicodingId) {
      return res.status(400).json({
        success: false,
        message: "Profile already completed",
      });
    }

    // Validate learning path
    const validPaths = [
      "Front-End Web & Back-End with AI",
      "React & Back-End with AI",
      "Machine Learning",
    ];

    if (!validPaths.includes(learningPath)) {
      return res.status(400).json({
        success: false,
        message: "Invalid learning path",
      });
    }

    // Validate university
    if (university.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "University name must be at least 3 characters",
      });
    }

    // Generate dicodingId using the same helper function
    const newSeqNumber = await getNextSequence("dicodingId");
    let generateDicodingId;

    switch (learningPath) {
      case "Front-End Web & Back-End with AI":
        generateDicodingId = `FEBE${newSeqNumber
          .toString()
          .padStart(5, "0")}AI`;
        break;
      case "React & Back-End with AI":
        generateDicodingId = `REBE${newSeqNumber
          .toString()
          .padStart(5, "0")}AI`;
        break;
      case "Machine Learning":
        generateDicodingId = `ML${newSeqNumber.toString().padStart(5, "0")}`;
        break;
    }

    // Update user
    user.dicodingId = generateDicodingId;
    user.learningPath = learningPath;
    user.university = university.trim();
    await user.save();

    console.log(
      `✅ Profile completed for user: ${user.email} - ${generateDicodingId}`
    );

    res.json({
      success: true,
      message: "Profile completed successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("❌ Complete profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
