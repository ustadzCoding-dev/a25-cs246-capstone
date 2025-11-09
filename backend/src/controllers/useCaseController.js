import { UseCase } from '../models/index.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all use cases
 * @route   GET /api/use-cases
 * @access  Public
 */
export const getAllUseCases = async (req, res, next) => {
  try {
    const { learningPath, isActive, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (learningPath) query.learningPath = learningPath;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get use cases
    const useCases = await UseCase.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await UseCase.countDocuments(query);

    res.status(200).json({
      success: true,
      data: useCases,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    logger.error('Error in getAllUseCases:', error);
    next(error);
  }
};

/**
 * @desc    Get use case by ID
 * @route   GET /api/use-cases/:id
 * @access  Public
 */
export const getUseCaseById = async (req, res, next) => {
  try {
    const useCase = await UseCase.findById(req.params.id);

    if (!useCase) {
      return res.status(404).json({
        success: false,
        message: 'Use case not found',
      });
    }

    res.status(200).json({
      success: true,
      data: useCase,
    });
  } catch (error) {
    logger.error('Error in getUseCaseById:', error);
    next(error);
  }
};

/**
 * @desc    Create new use case
 * @route   POST /api/use-cases
 * @access  Private (Admin only)
 */
export const createUseCase = async (req, res, next) => {
  try {
    const { useCaseCode, title, description, partner, learningPath, isActive } = req.body;

    // Check if use case code already exists
    const existingUseCase = await UseCase.findOne({ useCaseCode });
    if (existingUseCase) {
      return res.status(409).json({
        success: false,
        message: 'Use case code already exists',
      });
    }

    // Create use case
    const useCase = await UseCase.create({
      useCaseCode,
      title,
      description,
      partner,
      learningPath,
      isActive: isActive !== undefined ? isActive : true,
    });

    logger.info(`Use case created: ${useCaseCode} by admin ${req.user.email}`);

    res.status(201).json({
      success: true,
      message: 'Use case created successfully',
      data: useCase,
    });
  } catch (error) {
    logger.error('Error in createUseCase:', error);
    next(error);
  }
};

/**
 * @desc    Update use case
 * @route   PUT /api/use-cases/:id
 * @access  Private (Admin only)
 */
export const updateUseCase = async (req, res, next) => {
  try {
    const { title, description, partner, learningPath, isActive } = req.body;

    // Find use case
    const useCase = await UseCase.findById(req.params.id);
    if (!useCase) {
      return res.status(404).json({
        success: false,
        message: 'Use case not found',
      });
    }

    // Update fields
    if (title) useCase.title = title;
    if (description) useCase.description = description;
    if (partner) useCase.partner = partner;
    if (learningPath) useCase.learningPath = learningPath;
    if (isActive !== undefined) useCase.isActive = isActive;

    await useCase.save();

    logger.info(`Use case updated: ${useCase.useCaseCode} by admin ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Use case updated successfully',
      data: useCase,
    });
  } catch (error) {
    logger.error('Error in updateUseCase:', error);
    next(error);
  }
};

/**
 * @desc    Delete use case
 * @route   DELETE /api/use-cases/:id
 * @access  Private (Admin only)
 */
export const deleteUseCase = async (req, res, next) => {
  try {
    const useCase = await UseCase.findById(req.params.id);

    if (!useCase) {
      return res.status(404).json({
        success: false,
        message: 'Use case not found',
      });
    }

    // Check if use case is being used by any team
    const { CapstoneGroup } = await import('../models/index.js');
    const teamsUsingUseCase = await CapstoneGroup.countDocuments({
      selectedUseCaseId: useCase._id,
    });

    if (teamsUsingUseCase > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete use case. It is currently being used by ${teamsUsingUseCase} team(s)`,
      });
    }

    await useCase.deleteOne();

    logger.info(`Use case deleted: ${useCase.useCaseCode} by admin ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Use case deleted successfully',
    });
  } catch (error) {
    logger.error('Error in deleteUseCase:', error);
    next(error);
  }
};
