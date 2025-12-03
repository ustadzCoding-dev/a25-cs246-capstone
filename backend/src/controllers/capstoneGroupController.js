import { asyncHandler } from '../utils/errorHandler.js';
import TeamService from '../services/TeamService.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Register a new capstone team
 * POST /api/capstone-group/register
 */
export const registerTeam = asyncHandler(async (req, res) => {
  const { teamName, membersUserId, useCaseId } = req.validatedBody;
  const userId = req.user._id;

  const team = await TeamService.createTeam({ teamName, membersUserId, useCaseId }, userId);

  res.success(team, 'Team registered successfully', 201);
});

/**
 * Edit a pending capstone team (Leader only)
 * PUT /api/capstone-group/:id/edit
 */
export const editTeam = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { teamName, membersUserId, useCaseId } = req.validatedBody;
  const leaderId = req.user._id;

  const editData = {
    teamName,
    membersUserId
  };

  // Only include useCaseId if provided
  if (useCaseId) {
    editData.useCaseId = useCaseId;
  }

  const result = await TeamService.editTeam(id, leaderId, editData);

  res.success(result, 'Team edited successfully', 200);
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

  res.success(result.data, 'Teams retrieved successfully', 200, { pagination: result.pagination });
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

  res.success({ id }, 'Team deleted successfully', 200);
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

/**
 * Get current user's team (Student)
 * GET /api/capstone-group/current
 */
export const getCurrentCapstoneGroup = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('[getCurrentCapstoneGroup] userId:', userId);

  try {
    const team = await TeamService.getCurrentTeamByUserId(userId);
    console.log('[getCurrentCapstoneGroup] team found:', !!team);

    if (!team) {
      return res.success(null, 'No team found for current user', 200);
    }

    res.success(team, 'Current team retrieved successfully', 200);
  } catch (err) {
    console.error('[getCurrentCapstoneGroup] Error:', err.message);
    throw err;
  }
});

/**
 * Update capstone team (Admin)
 * PUT /api/capstone-group/:id/update
 */
export const updateCapstoneGroup = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!updateData || Object.keys(updateData).length === 0) {
    return res.error('No data to update', 400);
  }

  const team = await TeamService.updateTeam(id, updateData);

  res.success(team, 'Team updated successfully', 200);
});

/**
 * Set team composition requirements for a use case (Admin)
 * PUT /api/usecase/:usecaseId/team-composition
 */
export const setTeamComposition = asyncHandler(async (req, res) => {
  const { usecaseId } = req.params;
  const { teamComposition } = req.body;

  if (!teamComposition) {
    return res.error('Team composition is required', 400);
  }

  const useCase = await TeamService.setTeamComposition(usecaseId, teamComposition);

  res.success(useCase, 'Team composition updated successfully', 200);
});

/**
 * Get unregistered students (Admin)
 * GET /api/admin/students/unregistered
 */
export const getUnregisteredStudents = asyncHandler(async (req, res) => {
  const { learningPathId } = req.query;

  const students = await TeamService.getUnregisteredStudents({ learningPathId });

  res.success(students, 'Unregistered students retrieved successfully', 200);
});

/**
 * Auto-create teams for unregistered students (Admin)
 * POST /api/admin/teams/auto-create
 */
export const autoCreateTeams = asyncHandler(async (req, res) => {
  const { useCaseId, teamSize } = req.body;
  const adminId = req.user._id;

  if (!useCaseId) {
    return res.error('Use case ID is required', 400);
  }

  const result = await TeamService.autoCreateTeams({
    useCaseId,
    teamSize: teamSize || 4,
    adminId
  });

  res.success(result, result.message, 201);
});

/**
 * FIX CASE 31: Remove member from approved team (Admin)
 * PUT /api/capstone-group/:id/remove-member
 */
export const removeTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { memberId } = req.body;
  const adminId = req.user._id;

  console.log('[removeTeamMember] Controller called with:', { id, memberId, adminId });

  if (!memberId) {
    console.log('[removeTeamMember] Error: memberId is required');
    return res.error('Member ID is required', 400);
  }

  try {
    console.log('[removeTeamMember] Calling TeamService.removeTeamMember');
    const team = await TeamService.removeTeamMember(id, memberId, adminId);
    console.log('[removeTeamMember] Success, team:', team._id);
    res.success(team, 'Member removed from team successfully', 200);
  } catch (error) {
    console.error('[removeTeamMember] Error caught:', error.message);
    console.error('[removeTeamMember] Error stack:', error.stack);
    throw error;
  }
});

/**
 * FIX CASE 31: Replace member in approved team (Admin)
 * PUT /api/capstone-group/:id/replace-member
 */
export const replaceTeamMember = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { removeMemberId, addMemberId } = req.body;
  const adminId = req.user._id;

  if (!removeMemberId || !addMemberId) {
    return res.error('Both removeMemberId and addMemberId are required', 400);
  }

  const team = await TeamService.replaceTeamMember(id, removeMemberId, addMemberId, adminId);

  res.success(team, 'Member replaced successfully', 200);
});

/**
 * PRIORITY 2.2: Bulk approve multiple teams (Admin)
 * POST /api/capstone-group/bulk-approve
 */
export const bulkApproveTeams = asyncHandler(async (req, res) => {
  const { teamIds } = req.body;
  const adminId = req.user._id;

  if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
    return res.error('teamIds array is required and must not be empty', 400);
  }

  const result = await TeamService.bulkApproveTeams(teamIds, adminId);

  res.success(result, `Approved ${result.approved.length}/${result.totalRequested} teams`, 200);
});

/**
 * PRIORITY 2.3: Bulk reject multiple teams (Admin)
 * POST /api/capstone-group/bulk-reject
 */
export const bulkRejectTeams = asyncHandler(async (req, res) => {
  const { teamIds, reason } = req.body;
  const adminId = req.user._id;

  if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
    return res.error('teamIds array is required and must not be empty', 400);
  }

  const result = await TeamService.bulkRejectTeams(teamIds, reason || 'Tim tidak memenuhi kriteria', adminId);

  res.success(result, `Rejected ${result.rejected.length}/${result.totalRequested} teams`, 200);
});

/**
 * PRIORITY 2.3: Bulk delete multiple teams (Admin)
 * POST /api/capstone-group/bulk-delete
 */
export const bulkDeleteTeams = asyncHandler(async (req, res) => {
  const { teamIds } = req.body;
  const adminId = req.user._id;

  if (!teamIds || !Array.isArray(teamIds) || teamIds.length === 0) {
    return res.error('teamIds array is required and must not be empty', 400);
  }

  const result = await TeamService.bulkDeleteTeams(teamIds, adminId);

  res.success(result, `Deleted ${result.deleted.length}/${result.totalRequested} teams`, 200);
});

/**
 * PRIORITY 3.1: Export teams to CSV (Admin)
 * GET /api/capstone-group/export-csv
 * NOTE: Not using asyncHandler because we need to send raw CSV data
 */
export const exportTeamsCSV = async (req, res) => {
  console.log('[exportTeamsCSV] CONTROLLER CALLED - Starting export');
  try {
    console.log('[exportTeamsCSV] Starting export');

    // Get token from header (no middleware, so manual auth)
    const authHeader = req.headers.authorization;
    console.log('[exportTeamsCSV] Auth header present:', !!authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[exportTeamsCSV] No token provided');
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided'
        }
      });
    }

    // Extract and verify token
    const token = authHeader.split(' ')[1];
    let userId;

    try {
      // Try to verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
      console.log('[exportTeamsCSV] Token verified, userId:', userId);
    } catch (tokenErr) {
      console.error('[exportTeamsCSV] Token verification failed:', tokenErr.message);
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid or expired token'
        }
      });
    }

    // Fetch user from database
    const user = await User.findById(userId);

    if (!user) {
      console.log('[exportTeamsCSV] User not found');
      return res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
    }

    console.log('[exportTeamsCSV] User:', { id: user._id, role: user.role });

    // Check admin role
    if (user.role !== 'admin') {
      console.log('[exportTeamsCSV] User is not admin:', user.role);
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'This action requires admin role'
        }
      });
    }

    console.log('[exportTeamsCSV] Admin check passed');

    const { status, useCaseId } = req.query;
    console.log('[exportTeamsCSV] Export filters:', { status, useCaseId });

    // Generate CSV
    let csv;
    try {
      csv = await TeamService.exportTeamsCSV({ status, useCaseId });
      console.log('[exportTeamsCSV] CSV generated successfully, length:', csv.length);
    } catch (serviceErr) {
      console.error('[exportTeamsCSV] Service error:', serviceErr.message);
      console.error('[exportTeamsCSV] Service error stack:', serviceErr.stack);
      throw serviceErr;
    }

    // Check if response is still writable
    if (res.writableEnded) {
      console.error('[exportTeamsCSV] Response already ended!');
      return;
    }

    console.log('[exportTeamsCSV] Setting headers and sending CSV');

    // Send CSV as downloadable file using Express download method
    // This properly handles the response without middleware interference
    const filename = 'teams-export.csv';

    // Write CSV to response
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', csv.length);

    // Send data and end response
    return res.end(csv, 'utf8');

    // Note: return statement ensures no further middleware runs
  } catch (err) {
    console.error('[exportTeamsCSV] Caught error:', err.message);
    console.error('[exportTeamsCSV] Error stack:', err.stack);

    // Only send error response if response hasn't been sent yet
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to export teams',
          code: 'EXPORT_ERROR',
          details: err.message
        }
      });
    }
  }
};
