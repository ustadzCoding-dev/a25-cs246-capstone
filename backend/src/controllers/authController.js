<<<<<<< HEAD
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Counter from "../models/Counter.js";

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
    const { name, email, password, learningPath, role, university } = req.body;
    // Pengecekan apakah user sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Enkripsi password
    const salt = await bcrypt.genSalt(15);
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
        generateDicodingId = `ML${newSeqNumber
            .toString()
            .padStart(5, "0")}`;
        break;
      default:
        return res.status(400).json({
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
      role,
      university
    });

    // Menyimpan user baru ke database
    await newUser.save();

    // Mengirimkan response
    res
      .status(201)
      .json({success: true, message: "User registered successfully", data: newUser });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    console.log("Error in registerUser", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    // Mengambil data dari request
    const { email, password } = req.body;

    // Pengecekan user
    const user = await User.findOne({ email }).select("+password");

    // Komparasi password
    if (user && (await bcrypt.compare(password, user.password))) {
      // Membuat token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "3d",
      });

      // Mengirimkan response
      res.status(200).json({success: true, data: {user, token} });
    } else {
      // Mengirimkan response
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: error.message });
    }
    console.log("Error in loginUser", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
=======
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import logger from '../utils/logger.js'

/**
 * Generate JWT token
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )
}

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      dicodingId,
      name,
      email,
      password,
      learningPath,
      university,
      phoneNumber
    } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { dicodingId }] 
    })

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        })
      }
      if (existingUser.dicodingId === dicodingId) {
        return res.status(409).json({
          success: false,
          message: 'Dicoding ID already registered'
        })
      }
    }

    // Create new user
    const user = await User.create({
      dicodingId,
      name,
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      learningPath,
      university,
      phoneNumber,
      role: 'student' // Default role
    })

    // Generate token
    const token = generateToken(user._id, user.role)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    logger.info(`New user registered: ${email}`)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          dicodingId: user.dicodingId,
          name: user.name,
          email: user.email,
          learningPath: user.learningPath,
          role: user.role
        },
        token
      }
    })
  } catch (error) {
    logger.error(`Register error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user and include password
    const user = await User.findOne({ email }).select('+passwordHash')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Please contact admin.'
      })
    }

    // Compare password
    const isPasswordValid = await user.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // Generate token
    const token = generateToken(user._id, user.role)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    logger.info(`User logged in: ${email}`)

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          dicodingId: user.dicodingId,
          name: user.name,
          email: user.email,
          learningPath: user.learningPath,
          role: user.role,
          capstoneGroupId: user.capstoneGroupId,
          learningGroupId: user.learningGroupId
        },
        token
      }
    })
  } catch (error) {
    logger.error(`Login error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('capstoneGroupId', 'capstoneGroupId teamName status')
      .populate('learningGroupId', 'learningGroupId name cohort')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })
  } catch (error) {
    logger.error(`Get profile error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phoneNumber, university, profilePicture } = req.body

    const user = await User.findById(req.user.userId)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Update allowed fields
    if (name) user.name = name
    if (phoneNumber) user.phoneNumber = phoneNumber
    if (university) user.university = university
    if (profilePicture) user.profilePicture = profilePicture

    await user.save()

    logger.info(`User profile updated: ${user.email}`)

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    })
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
export const logout = async (req, res) => {
  // In JWT, logout is handled client-side by removing the token
  // This endpoint is just for logging purposes
  logger.info(`User logged out: ${req.user.userId}`)

  res.status(200).json({
    success: true,
    message: 'Logout successful'
  })
}
>>>>>>> 3f858f11f0f75f42089f1021b8f008bb97477c63
