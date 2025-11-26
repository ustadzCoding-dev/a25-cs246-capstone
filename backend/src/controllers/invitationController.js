import { asyncHandler } from '../utils/errorHandler.js';
import Invitation from '../models/Invitation.js';
import User from '../models/User.js';
import CapstoneGroup from '../models/CapstoneGroup.js';
import UseCase from '../models/UseCase.js';
import EmailService from '../services/EmailService.js';

/**
 * Get pending invitations for current user
 * GET /api/invitations
 */
export const getPendingInvitations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  console.log('[getPendingInvitations] userId:', userId);

  try {
    const invitations = await Invitation.find({
      memberId: userId,
      status: 'pending'
    })
      .populate('leaderId', 'name email')
      .populate('teamId', 'teamName useCase')
      .sort({ createdAt: -1 });

    console.log('[getPendingInvitations] found:', invitations.length);
    res.success(invitations, 'Pending invitations retrieved', 200);
  } catch (err) {
    console.error('[getPendingInvitations] Error:', err.message);
    throw err;
  }
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
  console.log('[createInvitation] Sending email to:', member.email);
  try {
    const emailResult = await EmailService.sendInvitationEmail({
      memberEmail: member.email,
      memberName: member.name,
      teamName: team.teamName,
      useCaseName: team.useCase?.title || 'Unknown Use Case',
      leaderName: leader.name,
      invitationId: invitation._id
    });
    console.log('[createInvitation] Email sent result:', emailResult);
  } catch (emailErr) {
    console.error('[createInvitation] Email error:', emailErr.message);
  }

  res.success(invitation, 'Invitation created successfully', 201);
});

/**
 * Accept invitation
 * PUT /api/invitations/:id/accept
 */
export const acceptInvitation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  console.log('[acceptInvitation] Starting...');
  console.log('[acceptInvitation] Invitation ID:', id);
  console.log('[acceptInvitation] User ID:', userId);

  const invitation = await Invitation.findById(id);

  if (!invitation) {
    console.log('[acceptInvitation] Invitation not found');
    return res.error('Invitation not found', 404);
  }

  console.log('[acceptInvitation] Invitation found:', invitation);
  console.log('[acceptInvitation] Invitation memberId:', invitation.memberId);
  console.log('[acceptInvitation] Current userId:', userId);

  // Verify this is for the current user
  if (invitation.memberId.toString() !== userId.toString()) {
    console.log('[acceptInvitation] Unauthorized - memberId mismatch');
    return res.error('Unauthorized', 403);
  }

  // Check if already accepted/rejected
  if (invitation.status !== 'pending') {
    console.log('[acceptInvitation] Invitation already', invitation.status);
    return res.error(`Invitation already ${invitation.status}`, 400);
  }

  // Update invitation status
  invitation.status = 'accepted';
  await invitation.save();
  console.log('[acceptInvitation] Invitation status updated to accepted');

  // Add member to team
  try {
    const team = await CapstoneGroup.findById(invitation.teamId);
    console.log('[acceptInvitation] Team found:', team ? 'yes' : 'no');
    if (team && !team.members.includes(userId)) {
      team.members.push(userId);
      await team.save();
      console.log('[acceptInvitation] Member added to team');
    }
  } catch (teamErr) {
    console.error('[acceptInvitation] Error adding member to team:', teamErr.message);
  }

  try {
    await invitation.populate('leaderId', 'name email');
    console.log('[acceptInvitation] Populated leaderId');
    await invitation.populate('teamId', 'teamName useCase');
    console.log('[acceptInvitation] Populated teamId');
  } catch (popErr) {
    console.error('[acceptInvitation] Error populating:', popErr.message);
  }

  console.log('[acceptInvitation] Success!');
  console.log('[acceptInvitation] Final invitation:', invitation);
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

  console.log('[rejectInvitation] Starting...');
  console.log('[rejectInvitation] Invitation ID:', id);
  console.log('[rejectInvitation] User ID:', userId);

  const invitation = await Invitation.findById(id);

  if (!invitation) {
    console.log('[rejectInvitation] Invitation not found');
    return res.error('Invitation not found', 404);
  }

  // Verify this is for the current user
  if (invitation.memberId.toString() !== userId.toString()) {
    console.log('[rejectInvitation] Unauthorized - memberId mismatch');
    return res.error('Unauthorized', 403);
  }

  // Check if already accepted/rejected
  if (invitation.status !== 'pending') {
    console.log('[rejectInvitation] Invitation already', invitation.status);
    return res.error(`Invitation already ${invitation.status}`, 400);
  }

  // Update invitation status
  invitation.status = 'rejected';
  if (reason) {
    invitation.rejectionReason = reason;
  }
  await invitation.save();
  console.log('[rejectInvitation] Invitation status updated to rejected');

  // Remove member from team
  try {
    const team = await CapstoneGroup.findById(invitation.teamId);
    if (team) {
      console.log('[rejectInvitation] Team found:', team.teamName);
      // Remove member from team.membersUserId array (correct field name)
      team.membersUserId = team.membersUserId.filter(memberId => memberId.toString() !== userId.toString());
      await team.save();
      console.log('[rejectInvitation] Member removed from team');

      // Clear capstoneGroupId from user
      await User.findByIdAndUpdate(userId, { capstoneGroupId: null });
      console.log('[rejectInvitation] Cleared capstoneGroupId from user');

      // Restore use case slot
      await UseCase.findByIdAndUpdate(
        team.useCaseId,
        {
          $inc: { availableSlots: 1 },
          $pull: { capstoneGroup: team._id }
        }
      );
      console.log('[rejectInvitation] Use case slot restored');
    }
  } catch (teamErr) {
    console.error('[rejectInvitation] Error removing member from team:', teamErr.message);
  }

  // Send rejection notification to leader
  try {
    const leader = await User.findById(invitation.leaderId);
    const member = await User.findById(userId);
    const team = await CapstoneGroup.findById(invitation.teamId);

    if (leader && member && team) {
      console.log('[rejectInvitation] Sending rejection notification to leader...');
      await EmailService.sendRejectionNotificationEmail({
        memberName: member.name,
        teamName: team.teamName,
        leaderName: leader.name,
        leaderEmail: leader.email
      });
      console.log('[rejectInvitation] Rejection notification sent');
    }
  } catch (emailErr) {
    console.error('[rejectInvitation] Error sending rejection notification:', emailErr.message);
  }

  await invitation.populate('leaderId', 'name email');
  await invitation.populate('teamId', 'teamName useCase');

  console.log('[rejectInvitation] Success!');
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
