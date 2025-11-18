import { asyncHandler } from '../utils/errorHandler.js';
import TeamService from '../services/TeamService.js';

/**
 * Register a new capstone team
 * POST /api/capstone-group/register
 */
export const registerTeam = asyncHandler(async (req, res) => {
  const { teamName, membersUserId, useCaseId } = req.validatedBody;
  const userId = req.user._id;

  const team = await TeamService.createTeam(
    { teamName, membersUserId, useCaseId },
    userId
  );

  res.success(team, 'Team registered successfully', 201);
});

/**
 * Get all capstone teams with filters and pagination
 * GET /api/capstone-groups
 */
export const getAllCapstoneGroups = asyncHandler(async (req, res) => {
  const { page, limit, status, search, sortBy, sortOrder } = req.query;

  const result = await TeamService.getAllTeams({
    page,
    limit,
    status,
    search,
    sortBy,
    sortOrder
  });

  res.success(result.data, 'Teams retrieved successfully', 200, result.pagination);
});

/**
 * Approve a pending capstone team
 * PUT /api/capstone-group/:id/approve
 */
export const approveCapstoneGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;

  const team = await TeamService.approveTeam(id, adminId);

  res.success(team, 'Team approved successfully', 200);
});

/**
 * Reject a pending capstone team
 * PUT /api/capstone-group/:id/reject
 */
export const rejectCapstoneGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.validatedBody;
  const adminId = req.user._id;

  const team = await TeamService.rejectTeam(id, adminId, reason);

  res.success(team, 'Team rejected successfully', 200);
});

/**
 * Delete a capstone team
 * DELETE /api/capstone-group/:id
 */
export const deleteCapstoneGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await TeamService.deleteTeam(id);

  res.success(null, 'Team deleted successfully', 200);
});

/**
 * Get capstone team by ID
 * GET /api/capstone-group/:id
 */
export const getCapstoneGroupById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const team = await TeamService.findTeamById(id);

  res.success(team, 'Team retrieved successfully', 200);
});
