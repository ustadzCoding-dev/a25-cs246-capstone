import LearningPath from '../models/LearningPath.js';
import { asyncHandler } from '../utils/errorHandler.js';

// ========== GET ALL LEARNING PATHS (Admin) ==========
export const getAllLearningPaths = asyncHandler(async (req, res) => {
  const paths = await LearningPath.find().sort({ name: 1 });

  res.success(paths, 'Learning paths retrieved', 200);
});

// ========== GET SINGLE LEARNING PATH ==========
export const getLearningPathById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const path = await LearningPath.findById(id);

  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Learning path not found'
    });
  }

  res.success(path, 'Learning path retrieved', 200);
});

// ========== CREATE LEARNING PATH ==========
export const createLearningPath = asyncHandler(async (req, res) => {
  const { name, code, description, isActive, dicodingIdPrefix } = req.body;

  // Validate required fields
  if (!name || !code || !dicodingIdPrefix) {
    return res.status(400).json({
      success: false,
      message: 'Name, code, and dicodingIdPrefix are required'
    });
  }

  // Check if name already exists
  const existingByName = await LearningPath.findOne({ name });
  if (existingByName) {
    return res.status(400).json({
      success: false,
      message: 'Learning path with this name already exists'
    });
  }

  // Check if code already exists
  const existingByCode = await LearningPath.findOne({ code: code.toUpperCase() });
  if (existingByCode) {
    return res.status(400).json({
      success: false,
      message: 'Learning path with this code already exists'
    });
  }

  // Create new learning path
  const newPath = new LearningPath({
    name: name.trim(),
    code: code.toUpperCase().trim(),
    description: description ? description.trim() : null,
    isActive: isActive !== undefined ? isActive : true,
    dicodingIdPrefix: dicodingIdPrefix.toUpperCase().trim()
  });

  await newPath.save();

  console.log(`✅ Learning path created: ${newPath.name}`);
  res.success(newPath, 'Learning path created successfully', 201);
});

// ========== UPDATE LEARNING PATH ==========
export const updateLearningPath = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, code, description, isActive, dicodingIdPrefix } = req.body;

  const path = await LearningPath.findById(id);
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Learning path not found'
    });
  }

  // Check if new name already exists (exclude current path)
  if (name && name !== path.name) {
    const existingByName = await LearningPath.findOne({
      name,
      _id: { $ne: id }
    });
    if (existingByName) {
      return res.status(400).json({
        success: false,
        message: 'Learning path with this name already exists'
      });
    }
  }

  // Check if new code already exists (exclude current path)
  if (code && code.toUpperCase() !== path.code) {
    const existingByCode = await LearningPath.findOne({
      code: code.toUpperCase(),
      _id: { $ne: id }
    });
    if (existingByCode) {
      return res.status(400).json({
        success: false,
        message: 'Learning path with this code already exists'
      });
    }
  }

  // Update fields
  if (name) {path.name = name.trim();}
  if (code) {path.code = code.toUpperCase().trim();}
  if (description !== undefined) {path.description = description ? description.trim() : null;}
  if (isActive !== undefined) {path.isActive = isActive;}
  if (dicodingIdPrefix) {path.dicodingIdPrefix = dicodingIdPrefix.toUpperCase().trim();}

  await path.save();

  console.log(`✅ Learning path updated: ${path.name}`);
  res.success(path, 'Learning path updated successfully', 200);
});

// ========== DELETE LEARNING PATH ==========
export const deleteLearningPath = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const path = await LearningPath.findById(id);
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Learning path not found'
    });
  }

  // Check if any users have this learning path
  const User = (await import('../models/User.js')).default;
  const usersWithPath = await User.countDocuments({ learningPath: path.name });

  if (usersWithPath > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete learning path. ${usersWithPath} user(s) have this path assigned.`
    });
  }

  await LearningPath.findByIdAndDelete(id);

  console.log(`✅ Learning path deleted: ${path.name}`);
  res.success(null, 'Learning path deleted successfully', 200);
});

// ========== TOGGLE ACTIVE STATUS ==========
export const toggleLearningPathStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const path = await LearningPath.findById(id);
  if (!path) {
    return res.status(404).json({
      success: false,
      message: 'Learning path not found'
    });
  }

  path.isActive = !path.isActive;
  await path.save();

  console.log(`✅ Learning path status toggled: ${path.name} (${path.isActive ? 'active' : 'inactive'})`);
  res.success(path, 'Learning path status updated', 200);
});
