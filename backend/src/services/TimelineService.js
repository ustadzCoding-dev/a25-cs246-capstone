import Timeline from '../models/Timeline.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errorHandler.js';

/**
 * Timeline Service
 * Handles all business logic related to timelines
 */
export class TimelineService {
  /**
   * Create a new timeline
   * @param {Object} timelineData - Timeline data
   * @param {string} timelineData.title - Timeline title
   * @param {string} timelineData.description - Timeline description
   * @param {string} timelineData.type - Timeline type (milestone/deadline/review/submission)
   * @param {Date} timelineData.startDate - Start date
   * @param {Date} timelineData.endDate - End date
   * @param {string} timelineData.priority - Priority (low/medium/high)
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} Created timeline
   * @throws {ValidationError} If validation fails
   * @throws {ConflictError} If title already exists
   */
  async createTimeline(timelineData, adminId) {
    // 1. Validate input
    this.validateTimelineData(timelineData);

    // 2. Check title uniqueness
    await this.checkTitleUniqueness(timelineData.title);

    // 3. Calculate status and days remaining
    const now = new Date();
    const startDate = new Date(timelineData.startDate);
    const endDate = new Date(timelineData.endDate);

    let status = 'upcoming';
    let daysRemaining = 0;
    let isOverdue = false;

    if (now >= startDate && now <= endDate) {
      status = 'ongoing';
      daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    } else if (now > endDate) {
      status = 'overdue';
      isOverdue = true;
      daysRemaining = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24));
    } else {
      daysRemaining = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
    }

    // 4. Create timeline
    const timeline = await Timeline.create({
      title: timelineData.title.trim(),
      description: timelineData.description.trim(),
      type: timelineData.type,
      startDate,
      endDate,
      priority: timelineData.priority,
      status,
      daysRemaining,
      isOverdue,
      createdBy: adminId
    });

    return timeline;
  }

  /**
   * Get all timelines with filters
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Timeline status
   * @param {string} filters.type - Timeline type
   * @param {string} filters.priority - Timeline priority
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @returns {Promise<Object>} Timelines and pagination info
   */
  async getAllTimelines(filters = {}) {
    const {
      status,
      type,
      priority,
      page = 1,
      limit = 10
    } = filters;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (priority) {
      query.priority = priority;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const timelines = await Timeline.find(query)
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v')
      .lean();

    const total = await Timeline.countDocuments(query);

    return {
      data: timelines,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get timeline by ID
   * @param {string} timelineId - Timeline ID
   * @returns {Promise<Object>} Timeline data
   * @throws {NotFoundError} If timeline not found
   */
  async getTimelineById(timelineId) {
    const timeline = await Timeline.findById(timelineId);

    if (!timeline) {
      throw new NotFoundError('Timeline not found');
    }

    return timeline;
  }

  /**
   * Update timeline
   * @param {string} timelineId - Timeline ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated timeline
   * @throws {NotFoundError} If timeline not found
   */
  async updateTimeline(timelineId, updateData) {
    const timeline = await Timeline.findById(timelineId);

    if (!timeline) {
      throw new NotFoundError('Timeline not found');
    }

    // Validate update data
    this.validateTimelineUpdateData(updateData);

    // Update fields
    const allowedFields = ['title', 'description', 'type', 'startDate', 'endDate', 'priority'];
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        timeline[field] = updateData[field];
      }
    });

    // Recalculate status and days remaining
    const now = new Date();
    const startDate = new Date(timeline.startDate);
    const endDate = new Date(timeline.endDate);

    if (now >= startDate && now <= endDate) {
      timeline.status = 'ongoing';
      timeline.daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      timeline.isOverdue = false;
    } else if (now > endDate) {
      timeline.status = 'overdue';
      timeline.isOverdue = true;
      timeline.daysRemaining = Math.ceil((now - endDate) / (1000 * 60 * 60 * 24));
    } else {
      timeline.status = 'upcoming';
      timeline.daysRemaining = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
      timeline.isOverdue = false;
    }

    await timeline.save();
    return timeline;
  }

  /**
   * Delete timeline
   * @param {string} timelineId - Timeline ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} If timeline not found
   */
  async deleteTimeline(timelineId) {
    const timeline = await Timeline.findByIdAndDelete(timelineId);

    if (!timeline) {
      throw new NotFoundError('Timeline not found');
    }
  }

  /**
   * Update timeline statuses (called periodically)
   * @returns {Promise<void>}
   */
  async updateTimelineStatuses() {
    const now = new Date();

    // Update ongoing timelines
    await Timeline.updateMany(
      {
        status: { $ne: 'completed' },
        startDate: { $lte: now },
        endDate: { $gte: now }
      },
      {
        status: 'ongoing',
        isOverdue: false
      }
    );

    // Update overdue timelines
    await Timeline.updateMany(
      {
        status: { $ne: 'completed' },
        endDate: { $lt: now }
      },
      {
        status: 'overdue',
        isOverdue: true
      }
    );
  }

  /**
   * Get timeline statistics
   * @returns {Promise<Object>} Timeline stats
   */
  async getTimelineStats() {
    const stats = await Timeline.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          byStatus: {
            $push: {
              status: '$status',
              count: 1
            }
          },
          byType: {
            $push: {
              type: '$type',
              count: 1
            }
          },
          byPriority: {
            $push: {
              priority: '$priority',
              count: 1
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        total: 0,
        byStatus: [],
        byType: [],
        byPriority: []
      };
    }

    return stats[0];
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Validate timeline data
   * @private
   */
  validateTimelineData(timelineData) {
    if (!timelineData.title || typeof timelineData.title !== 'string') {
      throw new ValidationError('Timeline title is required and must be a string');
    }

    if (timelineData.title.length < 3 || timelineData.title.length > 200) {
      throw new ValidationError('Timeline title must be 3-200 characters');
    }

    if (!timelineData.description || typeof timelineData.description !== 'string') {
      throw new ValidationError('Timeline description is required');
    }

    if (timelineData.description.length < 10 || timelineData.description.length > 1000) {
      throw new ValidationError('Timeline description must be 10-1000 characters');
    }

    if (!timelineData.type) {
      throw new ValidationError('Timeline type is required');
    }

    const validTypes = ['milestone', 'deadline', 'review', 'submission'];
    if (!validTypes.includes(timelineData.type)) {
      throw new ValidationError(`Type must be one of: ${validTypes.join(', ')}`);
    }

    if (!timelineData.startDate || !timelineData.endDate) {
      throw new ValidationError('Start date and end date are required');
    }

    const startDate = new Date(timelineData.startDate);
    const endDate = new Date(timelineData.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ValidationError('Invalid date format');
    }

    if (startDate >= endDate) {
      throw new ValidationError('Start date must be before end date');
    }

    if (!timelineData.priority) {
      throw new ValidationError('Timeline priority is required');
    }

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(timelineData.priority)) {
      throw new ValidationError(`Priority must be one of: ${validPriorities.join(', ')}`);
    }
  }

  /**
   * Validate timeline update data
   * @private
   */
  validateTimelineUpdateData(updateData) {
    if (updateData.title && (updateData.title.length < 3 || updateData.title.length > 200)) {
      throw new ValidationError('Timeline title must be 3-200 characters');
    }

    if (updateData.type) {
      const validTypes = ['milestone', 'deadline', 'review', 'submission'];
      if (!validTypes.includes(updateData.type)) {
        throw new ValidationError(`Type must be one of: ${validTypes.join(', ')}`);
      }
    }

    if (updateData.priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(updateData.priority)) {
        throw new ValidationError(`Priority must be one of: ${validPriorities.join(', ')}`);
      }
    }

    if (updateData.startDate && updateData.endDate) {
      const startDate = new Date(updateData.startDate);
      const endDate = new Date(updateData.endDate);

      if (startDate >= endDate) {
        throw new ValidationError('Start date must be before end date');
      }
    }
  }

  /**
   * Check title uniqueness
   * @private
   */
  async checkTitleUniqueness(title) {
    const existing = await Timeline.findOne({ title: title.trim() });

    if (existing) {
      throw new ConflictError('Timeline title already exists');
    }
  }
}

export default new TimelineService();
