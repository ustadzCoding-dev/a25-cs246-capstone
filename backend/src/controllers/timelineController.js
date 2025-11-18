import { asyncHandler } from '../utils/errorHandler.js';
import TimelineService from '../services/TimelineService.js';

/**
 * Get all timelines with filters and pagination
 * GET /api/timelines
 */
export const getAllTimelines = asyncHandler(async (req, res) => {
  const { status, type, priority, page, limit, sortBy, sortOrder } = req.query;

  const result = await TimelineService.getAllTimelines({
    status,
    type,
    priority,
    page,
    limit,
    sortBy,
    sortOrder
  });

  res.success(result.data, 'Timelines retrieved successfully', 200, result.pagination);
});

/**
 * Get timeline by ID
 * GET /api/timeline/:id
 */
export const getTimelineById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const timeline = await TimelineService.getTimelineById(id);

  res.success(timeline, 'Timeline retrieved successfully', 200);
});

/**
 * Create a new timeline
 * POST /api/timeline/add
 */
export const addTimeline = asyncHandler(async (req, res) => {
  const timelineData = req.validatedBody;
  const adminId = req.user._id;

  const timeline = await TimelineService.createTimeline(timelineData, adminId);

  res.success(timeline, 'Timeline created successfully', 201);
});

/**
 * Update a timeline
 * PUT /api/timeline/:id
 */
export const updateTimeline = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.validatedBody;

  const timeline = await TimelineService.updateTimeline(id, updateData);

  res.success(timeline, 'Timeline updated successfully', 200);
});

/**
 * Delete a timeline
 * DELETE /api/timeline/:id
 */
export const deleteTimeline = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await TimelineService.deleteTimeline(id);

  res.success(null, 'Timeline deleted successfully', 200);
});

/**
 * Get timeline statistics
 * GET /api/timeline/stats
 */
export const getTimelineStats = asyncHandler(async (req, res) => {
  const stats = await TimelineService.getTimelineStats();

  res.success(stats, 'Timeline statistics retrieved successfully', 200);
});
