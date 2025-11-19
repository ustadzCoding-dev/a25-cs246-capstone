import { asyncHandler } from '../utils/errorHandler.js';
import Invitation from '../models/Invitation.js';
import User from '../models/User.js';
import CapstoneGroup from '../models/CapstoneGroup.js';
import EmailService from '../services/EmailService.js';

/**
 * Get pending invitations for current user
 * GET /api/invitations
 */
export const getPendingInvitations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const invitations = await Invitation.find({
    memberId: userId,
    status: 'pending'
  })
    .populate('leaderId', 'name email')
    .populate('teamId', 'teamName useCase')
    .sort({ createdAt: -1 });

  res.success(invitations, 'Pending invitations retrieved', 200);
});

/**
 * Get all invitations for a team (admin/leader only)
 * GET /api/invitations/team/:teamId
 */
export const getTeamInvitations = asyncHandler(async (req, res) => {
  const { teamId } = req.params;

  const invitations = await Invitation.find({ teamId })
    .populate('memberId', 'name email studentId learningPath')
    .populate('leaderId', 'name email')
    .sort({ createdAt: -1 });

  res.success(invitations, 'Team invitations retrieved', 200);
});

/**
 * Create invitation for team member
 * POST /api/invitations
 */
export const createInvitation = asyncHandler(async (req, res) => {
  const { memberId, teamId } = req.body;
  const leaderId = req.user._id;

  // Validate inputs
  if (!memberId || !teamId) {
    return res.error('memberId and teamId are required', 400);
  }

  // Check if member exists
  const member = await User.findById(memberId);
  if (!member) {
    return res.error('Member not found', 404);
  }

  // Check if team exists
  const team = await CapstoneGroup.findById(teamId);
  if (!team) {
    return res.error('Team not found', 404);
  }

  // Check if invitation already exists
  const existingInvitation = await Invitation.findOne({
    memberId,
    teamId,
    status: 'pending'
  });

  if (existingInvitation) {
    return res.error('Invitation already exists for this member', 409);
  }

  // Create invitation
  const invitation = new Invitation({
    leaderId,
    memberId,
    teamId,
    status: 'pending'
  });

  await invitation.save();

  // Populate references
  await invitation.populate('leaderId', 'name email');
  await invitation.populate('teamId', 'teamName useCase');

  // Send invitation email
  const leader = await User.findById(leaderId);
  await EmailService.sendInvitationEmail({
    memberEmail: member.email,
    memberName: member.name,
    teamName: team.teamName,
    useCaseName: team.useCase?.title || 'Unknown Use Case',
    leaderName: leader.name,
    invitationId: invitation._id
  });

  res.success(invitation, 'Invitation created successfully', 201);
});

/**
 * Accept invitation
 * PUT /api/invitations/:id/accept
 */
export const acceptInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  const invitation = await Invitation.findById(id);

  if (!invitation) {
    return res.error('Invitation not found', 404);
  }

  // Verify this is for the current user
  if (invitation.memberId.toString() !== userId.toString()) {
    return res.error('Unauthorized', 403);
  }

  // Check if already accepted/rejected
  if (invitation.status !== 'pending') {
    return res.error(`Invitation already ${invitation.status}`, 400);
  }

  // Update invitation status
  invitation.status = 'accepted';
  await invitation.save();

  // Add member to team
  const team = await CapstoneGroup.findById(invitation.teamId);
  if (team && !team.members.includes(userId)) {
    team.members.push(userId);
    await team.save();
  }

  await invitation.populate('leaderId', 'name email');
  await invitation.populate('teamId', 'teamName useCase');

  res.success(invitation, 'Invitation accepted successfully', 200);
});

/**
 * Reject invitation
 * PUT /api/invitations/:id/reject
 */
export const rejectInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const userId = req.user._id;

  const invitation = await Invitation.findById(id);

  if (!invitation) {
    return res.error('Invitation not found', 404);
  }

  // Verify this is for the current user
  if (invitation.memberId.toString() !== userId.toString()) {
    return res.error('Unauthorized', 403);
  }

  // Check if already accepted/rejected
  if (invitation.status !== 'pending') {
    return res.error(`Invitation already ${invitation.status}`, 400);
  }

  // Update invitation status
  invitation.status = 'rejected';
  if (reason) {
    invitation.rejectionReason = reason;
  }
  await invitation.save();

  await invitation.populate('leaderId', 'name email');
  await invitation.populate('teamId', 'teamName useCase');

  res.success(invitation, 'Invitation rejected successfully', 200);
});

/**
 * Delete invitation (admin/leader only)
 * DELETE /api/invitations/:id
 */
export const deleteInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const invitation = await Invitation.findByIdAndDelete(id);

  if (!invitation) {
    return res.error('Invitation not found', 404);
  }

  res.success(null, 'Invitation deleted successfully', 200);
});

export default {
  getPendingInvitations,
  getTeamInvitations,
  createInvitation,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation
};
