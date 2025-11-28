import CapstoneGroup from '../models/CapstoneGroup.js';
import User from '../models/User.js';
import UseCase from '../models/UseCase.js';
import EmailService from './EmailService.js';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errorHandler.js';

/**
 * Team Service
 * Handles all business logic related to capstone teams
 */
export class TeamService {
  /**
   * Create a new capstone team
   * @param {Object} teamData - Team data
   * @param {string} teamData.teamName - Team name
   * @param {Array<string>} teamData.membersUserId - Array of member user IDs
   * @param {string} teamData.useCaseId - Use case ID
   * @param {string} userId - Creator user ID
   * @returns {Promise<Object>} Created team
   * @throws {ValidationError} If validation fails
   * @throws {ConflictError} If team name already exists
   * @throws {NotFoundError} If member or use case not found
   */
  async createTeam(teamData, userId) {
    console.log('[createTeam] Input data:', {
      teamName: teamData.teamName,
      useCaseId: teamData.useCaseId,
      membersCount: teamData.membersUserId?.length,
      members: teamData.membersUserId
    });

    // 1. Validate input
    this.validateTeamData(teamData);

    // 2. Check team name uniqueness
    await this.checkTeamNameUniqueness(teamData.teamName);

    // 3. Validate members and convert emails to ObjectIds
    console.log('[createTeam] Validating members...');
    const members = await this.validateMembers(teamData.membersUserId);
    const memberIds = members.map((m) => m._id);
    console.log('[createTeam] Members converted to IDs:', memberIds);

    // 4. Validate use case first (to get composition requirements)
    console.log('[createTeam] Validating use case...');
    const useCase = await this.validateUseCase(teamData.useCaseId);
    console.log('[createTeam] Use case validated:', useCase._id);

    // 5. Validate team composition against use case requirements
    console.log('[createTeam] Validating team composition...');
    await this.validateTeamComposition(memberIds, useCase);
    console.log('[createTeam] Team composition validated!');

    // 6. Check members not in other team
    console.log('[createTeam] Checking members availability...');
    await this.checkMembersAvailability(memberIds);
    console.log('[createTeam] Members availability checked!');

    // 7. Create team
    console.log('[createTeam] Creating team...');
    let team;
    try {
      team = await CapstoneGroup.create({
        teamName: teamData.teamName.trim(),
        membersUserId: memberIds,
        useCaseId: teamData.useCaseId,
        status: 'pending',
        submittedAt: new Date(),
        createdBy: userId
      });
      console.log('[createTeam] Team created:', team._id);
    } catch (err) {
      console.error('[createTeam] Error creating team:', err.message);
      if (err.name === 'CastError') {
        throw new ValidationError('Invalid use case ID format');
      }
      throw err;
    }

    // 8. Update members
    console.log('[createTeam] Updating members team ID...');
    await this.updateMembersTeamId(memberIds, team._id);
    console.log('[createTeam] Members team ID updated!');

    // 9. Update use case
    console.log('[createTeam] Updating use case slots...');
    await this.updateUseCaseSlots(teamData.useCaseId);
    console.log('[createTeam] Use case slots updated!');

    // 10. Create invitations for team members (except leader)
    console.log('[createTeam] Creating invitations...');
    const Invitation = (await import('../models/Invitation.js')).default;
    const otherMembers = memberIds.filter((memberId) => memberId.toString() !== userId.toString());
    console.log('[createTeam] Other members for invitations:', otherMembers.length);

    const leader = await User.findById(userId);

    for (const memberId of otherMembers) {
      const invitation = await Invitation.create({
        leaderId: userId,
        memberId: memberId,
        teamId: team._id,
        status: 'pending'
      });

      // Send invitation email
      try {
        const member = await User.findById(memberId);
        console.log('[createTeam] Sending invitation email to:', member.email);
        await EmailService.sendInvitationEmail({
          memberEmail: member.email,
          memberName: member.name,
          teamName: team.teamName,
          useCaseName: useCase.title || 'Unknown Use Case',
          leaderName: leader.name,
          invitationId: invitation._id
        });
        console.log('[createTeam] Email sent to:', member.email);
      } catch (emailErr) {
        console.error('[createTeam] Email error for', memberId, ':', emailErr.message);
        // Don't throw - continue with other members even if email fails
      }
    }
    console.log('[createTeam] Invitations created!');

    console.log('[createTeam] ✅ TEAM REGISTRATION COMPLETE!');
    return team;
  }

  /**
   * Update team data (Admin)
   * @param {string} teamId - Team ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated team
   * @throws {NotFoundError} If team not found
   */
  async updateTeam(teamId, updateData) {
    const team = await this.findTeamById(teamId);

    // Check if capstoneGroupId is being assigned for the first time
    const isAssigningId = updateData.capstoneGroupId && !team.capstoneGroupId;

    // Update allowed fields
    const allowedFields = ['capstoneGroupId', 'teamName', 'status'];
    for (const field of allowedFields) {
      if (field in updateData) {
        team[field] = updateData[field];
      }
    }

    await team.save();

    // Send ID assignment notification if capstoneGroupId is being assigned
    if (isAssigningId) {
      try {
        const { default: EmailService } = await import('./EmailService.js');
        const populatedTeam = await this.findTeamById(teamId);

        if (populatedTeam.membersUserId && populatedTeam.membersUserId.length > 0) {
          const memberEmails = populatedTeam.membersUserId
            .map((member) => member.email)
            .filter((email) => email);

          if (memberEmails.length > 0) {
            await EmailService.sendTeamIdAssignmentNotification(
              memberEmails,
              populatedTeam.teamName,
              updateData.capstoneGroupId
            );
          }
        }
      } catch (error) {
        console.error('[updateTeam] Failed to send ID assignment notification:', error.message);
        // Don't throw error - update should succeed even if email fails
      }
    }

    return team;
  }

  /**
   * Edit team members (Leader only, team must be pending)
   * @param {string} teamId - Team ID
   * @param {string} leaderId - Leader user ID
   * @param {Object} editData - Edit data
   * @param {string} editData.teamName - New team name (optional)
   * @param {Array<string>} editData.membersUserId - New members list
   * @returns {Promise<Object>} Updated team with changes summary
   * @throws {ValidationError} If validation fails
   * @throws {NotFoundError} If team not found
   */
  async editTeam(teamId, leaderId, editData) {
    console.log('[editTeam] Starting edit for team:', teamId);
    console.log('[editTeam] New members:', editData.membersUserId);
    console.log('[editTeam] Edit data received:', editData);

    // 1. Find team
    const team = await this.findTeamById(teamId);
    console.log('[editTeam] Team found:', team.teamName);
    console.log('[editTeam] Current team members:', team.membersUserId);

    // 2. Verify leader owns this team
    const isLeader = team.membersUserId.some((m) => m._id.toString() === leaderId.toString());
    if (!isLeader) {
      throw new ValidationError('Only team leader can edit team');
    }
    console.log('[editTeam] Leader verified');

    // 3. Check team is pending
    if (team.status !== 'pending') {
      throw new ValidationError('Only pending teams can be edited');
    }
    console.log('[editTeam] Team status is pending');

    // 4. Validate new members and convert emails to ObjectIds
    console.log('[editTeam] Validating new members...');
    console.log('[editTeam] Members to validate:', editData.membersUserId);
    const newMembers = await this.validateMembers(editData.membersUserId);
    const newMemberIds = newMembers.map((m) => m._id);
    console.log('[editTeam] New members converted to IDs:', newMemberIds);
    console.log(
      '[editTeam] New members details:',
      newMembers.map((m) => ({ id: m._id, email: m.email, name: m.name }))
    );

    // 5. Validate team composition
    console.log('[editTeam] Validating team composition...');
    const useCaseIdToUse = editData.useCaseId || team.useCaseId;
    const useCase = await this.validateUseCase(useCaseIdToUse);
    console.log('[editTeam] Use case requirements:', {
      totalTeamSize: useCase.totalTeamSize,
      teamComposition: useCase.teamComposition,
      availableSlots: useCase.availableSlots
    });
    await this.validateTeamComposition(newMemberIds, useCase);
    console.log('[editTeam] Team composition validated!');

    // 6. Identify changes
    const oldMemberIds = team.membersUserId.map((m) => m._id || m);
    const addedMemberIds = newMemberIds.filter(
      (id) => !oldMemberIds.some((oldId) => oldId.toString() === id.toString())
    );
    const removedMemberIds = oldMemberIds.filter(
      (id) => !newMemberIds.some((newId) => newId.toString() === id.toString())
    );
    const keptMemberIds = newMemberIds.filter((id) =>
      oldMemberIds.some((oldId) => oldId.toString() === id.toString())
    );

    console.log('[editTeam] Changes identified:');
    console.log('[editTeam] Added:', addedMemberIds.length, 'members');
    console.log('[editTeam] Removed:', removedMemberIds.length, 'members');
    console.log('[editTeam] Kept:', keptMemberIds.length, 'members');

    // 7. Check added members availability
    if (addedMemberIds.length > 0) {
      console.log('[editTeam] Checking added members availability...');
      await this.checkMembersAvailability(addedMemberIds);
      console.log('[editTeam] Added members availability checked!');
    }

    // 8. Handle removed members - clear capstoneGroupId and restore slots
    if (removedMemberIds.length > 0) {
      console.log('[editTeam] Clearing capstoneGroupId from removed members...');
      await User.updateMany(
        { _id: { $in: removedMemberIds } },
        { $set: { capstoneGroupId: null } }
      );
      console.log('[editTeam] Removed members cleared!');

      // Restore use case slots for removed members
      console.log('[editTeam] Restoring use case slots for removed members...');
      await UseCase.findByIdAndUpdate(team.useCaseId, {
        $inc: { availableSlots: removedMemberIds.length }
      });
      console.log('[editTeam] Use case slots restored!');
    }

    // 9. Handle added members - set capstoneGroupId
    if (addedMemberIds.length > 0) {
      console.log('[editTeam] Setting capstoneGroupId for added members...');
      await User.updateMany(
        { _id: { $in: addedMemberIds } },
        { $set: { capstoneGroupId: team._id } }
      );
      console.log('[editTeam] Added members updated!');

      // Reduce use case slots for added members
      console.log('[editTeam] Reducing use case slots for added members...');
      await UseCase.findByIdAndUpdate(team.useCaseId, {
        $inc: { availableSlots: -addedMemberIds.length }
      });
      console.log('[editTeam] Use case slots reduced!');
    }

    // 10. Update team members and other fields
    console.log('[editTeam] Updating team...');
    team.membersUserId = newMemberIds;
    if (editData.teamName) {
      team.teamName = editData.teamName;
    }
    if (editData.useCaseId && editData.useCaseId !== team.useCaseId.toString()) {
      team.useCaseId = editData.useCaseId;
    }
    await team.save();
    console.log('[editTeam] Team updated!');

    // 11. Create invitations for added members
    if (addedMemberIds.length > 0) {
      console.log('[editTeam] Creating invitations for added members...');
      const Invitation = (await import('../models/Invitation.js')).default;
      const leader = await User.findById(leaderId);

      for (const memberId of addedMemberIds) {
        const invitation = await Invitation.create({
          leaderId: leaderId,
          memberId: memberId,
          teamId: team._id,
          status: 'pending'
        });
        console.log('[editTeam] Invitation created for:', memberId);

        // Send invitation email
        try {
          const member = await User.findById(memberId);
          const populatedTeam = await this.findTeamById(team._id);

          if (member && leader) {
            console.log('[editTeam] Sending invitation email to:', member.email);
            await EmailService.sendInvitationEmail({
              memberEmail: member.email,
              memberName: member.name,
              teamName: populatedTeam.teamName,
              useCaseName: populatedTeam.useCaseId?.title || 'Unknown',
              leaderName: leader.name,
              acceptLink: `${process.env.FRONTEND_URL}/invitations/${invitation._id}/accept`,
              rejectLink: `${process.env.FRONTEND_URL}/invitations/${invitation._id}/reject`
            });
            console.log('[editTeam] Email sent to:', member.email);
          }
        } catch (emailErr) {
          console.error('[editTeam] Error sending invitation email:', emailErr.message);
        }
      }
      console.log('[editTeam] Invitations created!');
    }

    // 12. Delete invitations for removed members
    if (removedMemberIds.length > 0) {
      console.log('[editTeam] Deleting invitations for removed members...');
      const Invitation = (await import('../models/Invitation.js')).default;
      await Invitation.deleteMany({
        teamId: team._id,
        memberId: { $in: removedMemberIds }
      });
      console.log('[editTeam] Invitations deleted!');
    }

    console.log('[editTeam] ✅ TEAM EDIT COMPLETE!');
    return {
      team,
      changes: {
        added: addedMemberIds,
        removed: removedMemberIds,
        kept: keptMemberIds
      }
    };
  }

  /**
   * Approve a pending team
   * @param {string} teamId - Team ID
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} Updated team
   * @throws {NotFoundError} If team not found
   * @throws {ValidationError} If team not pending
   */
  async approveTeam(teamId, adminId) {
    const team = await this.findTeamById(teamId);

    if (team.status !== 'pending') {
      throw new ValidationError('Team is not in pending status');
    }

    team.status = 'approved';
    team.validatedBy = adminId;
    team.validatedAt = new Date();

    await team.save();

    // Send approval notification to all team members
    try {
      const { default: EmailService } = await import('./EmailService.js');
      const populatedTeam = await this.findTeamById(teamId);

      if (populatedTeam.membersUserId && populatedTeam.membersUserId.length > 0) {
        const memberEmails = populatedTeam.membersUserId
          .map((member) => member.email)
          .filter((email) => email);

        if (memberEmails.length > 0) {
          await EmailService.sendTeamApprovalNotification(
            memberEmails,
            populatedTeam.teamName,
            populatedTeam.useCaseId?.title || 'Unknown Use Case'
          );
        }
      }
    } catch (error) {
      console.error('[approveTeam] Failed to send approval notification:', error.message);
      // Don't throw error - approval should succeed even if email fails
    }

    return team;
  }

  /**
   * Reject a pending team
   * @param {string} teamId - Team ID
   * @param {string} adminId - Admin user ID
   * @param {string} reason - Rejection reason
   * @returns {Promise<Object>} Updated team
   * @throws {NotFoundError} If team not found
   * @throws {ValidationError} If team not pending
   */
  async rejectTeam(teamId, adminId, reason) {
    const team = await this.findTeamById(teamId);

    if (team.status !== 'pending') {
      throw new ValidationError('Team is not in pending status');
    }

    console.log('[rejectTeam] Starting rejection for team:', teamId);

    // Remove team ID from members
    console.log('[rejectTeam] Clearing capstoneGroupId from members');
    await User.updateMany(
      { _id: { $in: team.membersUserId } },
      { $set: { capstoneGroupId: null } }
    );

    // Restore use case slots
    console.log('[rejectTeam] Restoring use case slots');
    await UseCase.findByIdAndUpdate(team.useCaseId, {
      $inc: { availableSlots: 1 },
      $pull: { capstoneGroup: team._id }
    });

    // Send rejection notification to all team members BEFORE deleting
    try {
      const { default: EmailService } = await import('./EmailService.js');

      if (team.membersUserId && team.membersUserId.length > 0) {
        const memberEmails = team.membersUserId
          .map((member) => member.email)
          .filter((email) => email);

        if (memberEmails.length > 0) {
          console.log(
            '[rejectTeam] Sending rejection notification to',
            memberEmails.length,
            'members'
          );
          // Send individual rejection emails to each member
          for (const memberEmail of memberEmails) {
            try {
              await EmailService.sendTeamRejectionNotification(
                memberEmail,
                team.teamName,
                reason || 'Tim Anda tidak memenuhi kriteria yang diperlukan'
              );
            } catch (emailErr) {
              console.error(
                '[rejectTeam] Failed to send rejection email to',
                memberEmail,
                ':',
                emailErr.message
              );
            }
          }
          console.log('[rejectTeam] Rejection notifications sent');
        }
      }
    } catch (error) {
      console.error('[rejectTeam] Failed to send rejection notification:', error.message);
      // Don't throw error - rejection should succeed even if email fails
    }

    // Delete all invitations for this team
    try {
      const { default: Invitation } = await import('../models/Invitation.js');
      const deleteInvResult = await Invitation.deleteMany({ teamId: teamId });
      console.log('[rejectTeam] Deleted', deleteInvResult.deletedCount, 'invitations');
    } catch (invErr) {
      console.error('[rejectTeam] Error deleting invitations:', invErr.message);
    }

    // Delete the team from database (rejected teams are not kept)
    console.log('[rejectTeam] Deleting rejected team from database');
    await CapstoneGroup.findByIdAndDelete(teamId);
    console.log('[rejectTeam] Team deleted successfully');

    return team;
  }

  /**
   * Delete a team
   * @param {string} teamId - Team ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} If team not found
   */
  async deleteTeam(teamId) {
    console.log('[deleteTeam] Starting delete for team:', teamId);

    // Try to find team, but don't throw error if not found (might be already deleted)
    let team;
    try {
      team = await this.findTeamById(teamId);
      console.log('[deleteTeam] Team found:', team._id);
    } catch (err) {
      console.log('[deleteTeam] Team not found (might be already deleted):', err.message);
      // If team not found, just return - it's already deleted
      return;
    }

    // Remove team ID from members
    console.log('[deleteTeam] Clearing capstoneGroupId from members:', team.membersUserId);
    const updateResult = await User.updateMany(
      { _id: { $in: team.membersUserId } },
      { $set: { capstoneGroupId: null } }
    );
    console.log('[deleteTeam] Members updated:', updateResult.modifiedCount, 'members');

    // Restore use case slots for all statuses
    console.log('[deleteTeam] Restoring use case slots for:', team.useCaseId);
    await UseCase.findByIdAndUpdate(team.useCaseId, {
      $inc: { availableSlots: 1 },
      $pull: { capstoneGroup: team._id }
    });

    // Delete all invitations for this team
    try {
      const { default: Invitation } = await import('../models/Invitation.js');
      const deleteInvResult = await Invitation.deleteMany({ teamId: teamId });
      console.log('[deleteTeam] Deleted', deleteInvResult.deletedCount, 'invitations');
    } catch (invErr) {
      console.error('[deleteTeam] Error deleting invitations:', invErr.message);
    }

    // Delete team
    console.log('[deleteTeam] Deleting team document');
    const deleteResult = await CapstoneGroup.findByIdAndDelete(teamId);
    console.log('[deleteTeam] Team deleted:', deleteResult ? 'SUCCESS' : 'FAILED');
  }

  /**
   * Get all teams with filters
   * @param {Object} filters - Filter options
   * @param {string} filters.status - Team status
   * @param {string} filters.search - Search query
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.sortBy - Sort field
   * @param {string} filters.sortOrder - Sort order (asc/desc)
   * @returns {Promise<Object>} Teams and pagination info
   */
  async getAllTeams(filters = {}) {
    const {
      status,
      search,
      page = 1,
      limit = 10,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = filters;

    console.log('[getAllTeams] Filters:', { status, search, page, limit });

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { teamName: { $regex: search, $options: 'i' } },
        { capstoneGroupId: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('[getAllTeams] Query:', JSON.stringify(query));

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const teams = await CapstoneGroup.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('membersUserId', 'name email learningPathId learningPathName')
      .populate('useCaseId', 'usecaseId title partner')
      .lean();

    const total = await CapstoneGroup.countDocuments(query);

    console.log('[getAllTeams] Found teams:', teams.length, 'Total:', total);

    return {
      data: teams,
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
   * Get team by ID
   * @param {string} teamId - Team ID
   * @returns {Promise<Object>} Team data
   * @throws {NotFoundError} If team not found
   */
  async findTeamById(teamId) {
    const team = await CapstoneGroup.findById(teamId)
      .populate('membersUserId', 'name email learningPath')
      .populate('useCaseId', 'title partner description');

    if (!team) {
      throw new NotFoundError('Team not found');
    }

    return team;
  }

  /**
   * Get current user's team (Student)
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} Team data or null if no team
   */
  async getCurrentTeamByUserId(userId) {
    const team = await CapstoneGroup.findOne({ membersUserId: userId })
      .populate('membersUserId', 'name email learningPath')
      .populate('useCaseId', 'title partner description');

    return team || null;
  }

  /**
   * Set team composition requirements for a use case
   * @param {string} useCaseId - Use case ID
   * @param {Array<Object>} teamComposition - Team composition requirements
   * @returns {Promise<Object>} Updated use case
   * @throws {NotFoundError} If use case not found
   * @throws {ValidationError} If composition is invalid
   */
  async setTeamComposition(useCaseId, teamComposition) {
    // Validate composition
    if (!Array.isArray(teamComposition) || teamComposition.length === 0) {
      throw new ValidationError('Team composition must be a non-empty array');
    }

    // Import LearningPath model
    const LearningPath = (await import('../models/LearningPath.js')).default;

    // Validate each composition entry and fetch learning path names
    let totalTeamSize = 0;
    const processedComposition = [];

    for (const comp of teamComposition) {
      if (!comp.learningPathId || !comp.count) {
        throw new ValidationError('Each composition entry must have learningPathId and count');
      }
      if (comp.count < 1) {
        throw new ValidationError('Count must be at least 1');
      }

      // Fetch learning path to get name
      const learningPath = await LearningPath.findById(comp.learningPathId);
      if (!learningPath) {
        throw new NotFoundError(`Learning path with ID ${comp.learningPathId} not found`);
      }

      processedComposition.push({
        learningPathId: comp.learningPathId,
        learningPathName: learningPath.name,
        count: comp.count
      });

      totalTeamSize += comp.count;
    }

    // Update use case
    const useCase = await UseCase.findByIdAndUpdate(
      useCaseId,
      {
        teamComposition: processedComposition,
        totalTeamSize
      },
      { new: true }
    );

    if (!useCase) {
      throw new NotFoundError('Use case not found');
    }

    return useCase;
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Validate team data
   * @private
   */
  validateTeamData(teamData) {
    if (!teamData.teamName || typeof teamData.teamName !== 'string') {
      throw new ValidationError('Team name is required and must be a string');
    }

    if (!Array.isArray(teamData.membersUserId) || teamData.membersUserId.length === 0) {
      throw new ValidationError('Members list is required');
    }

    if (!teamData.useCaseId) {
      throw new ValidationError('Use case is required');
    }
  }

  /**
   * Check team name uniqueness
   * @private
   */
  async checkTeamNameUniqueness(teamName) {
    const existing = await CapstoneGroup.findOne({ teamName: teamName.trim() });

    if (existing) {
      throw new ConflictError('Team name already exists');
    }
  }

  /**
   * Validate members exist and convert emails to IDs
   * @private
   */
  async validateMembers(memberIds) {
    console.log('[validateMembers] Input memberIds:', memberIds);

    // memberIds can be either emails or ObjectIds
    // Try to find users by email or _id
    try {
      const members = await User.find({
        $or: [{ _id: { $in: memberIds } }, { email: { $in: memberIds } }]
      });

      console.log('[validateMembers] Found members:', members.length);

      if (members.length !== memberIds.length) {
        throw new NotFoundError('One or more members not found');
      }

      // Return members for later use (to get their actual IDs)
      return members;
    } catch (err) {
      if (err.name === 'CastError') {
        console.log('[validateMembers] CastError - trying email-only search');
        // If CastError, it means some memberIds are not valid ObjectIds
        // Try searching by email only
        const members = await User.find({
          email: { $in: memberIds }
        });

        if (members.length !== memberIds.length) {
          throw new NotFoundError('One or more members not found');
        }

        return members;
      }
      throw err;
    }
  }

  /**
   * Validate team composition against use case requirements
   * @private
   */
  async validateTeamComposition(memberIds, useCase) {
    // Check for duplicates
    const uniqueIds = new Set(memberIds);
    if (uniqueIds.size !== memberIds.length) {
      console.log('[validateTeamComposition] Duplicate members detected:', memberIds);
      throw new ValidationError('Duplicate members not allowed');
    }

    console.log(
      '[validateTeamComposition] Validating composition for:',
      memberIds.length,
      'members'
    );

    // If use case has custom composition requirements
    if (useCase.teamComposition && useCase.teamComposition.length > 0) {
      // Fetch members with their learning paths
      const members = await User.find({ _id: { $in: memberIds } });

      // Debug: log members learning path fields
      console.log(
        '[validateTeamComposition] Members fetched for composition check:',
        members.map((m) => ({
          id: m._id,
          learningPathId: m.learningPathId,
          learningPathName: m.learningPathName
        }))
      );

      // Helper to normalize learning path names for robust matching
      const normalizeName = (s) => (s || '').toString().toLowerCase().replace(/\s+/g, ' ').trim();

      // For each requirement, count members that match by ID OR (missing ID and matching normalized name)
      for (const requirement of useCase.teamComposition) {
        const reqId = requirement.learningPathId?.toString();
        const reqName = requirement.learningPathName || requirement.learningPath;
        const normalizedReqName = normalizeName(reqName);

        let actualCount = 0;

        for (const member of members) {
          const memberPathId = member.learningPathId?.toString();
          const memberPathName = normalizeName(member.learningPathName || member.learningPath);

          // Count if member has matching learningPathId
          if (reqId && memberPathId && memberPathId === reqId) {
            actualCount += 1;
            continue;
          }

          // Otherwise, if member lacks an ID but name matches, count as fallback
          if (!memberPathId && normalizedReqName && memberPathName === normalizedReqName) {
            actualCount += 1;
            continue;
          }
        }

        console.log(
          `[validateTeamComposition] Requirement "${requirement.learningPathName}": expected ${requirement.count}, got ${actualCount}`
        );

        if (actualCount !== requirement.count) {
          throw new ValidationError(
            `Team composition mismatch. Expected ${requirement.count} member(s) from "${requirement.learningPathName}", got ${actualCount}`
          );
        }
      }

      // Check total team size matches
      console.log(
        `[validateTeamComposition] Total size check: expected ${useCase.totalTeamSize}, got ${memberIds.length}`
      );
      if (memberIds.length !== useCase.totalTeamSize) {
        throw new ValidationError(
          `Team must have exactly ${useCase.totalTeamSize} members, got ${memberIds.length}`
        );
      }
    } else {
      // Default validation: 2-4 members with same learning path
      console.log(`[validateTeamComposition] Default validation: ${memberIds.length} members`);
      if (memberIds.length < 2 || memberIds.length > 4) {
        throw new ValidationError('Team must have 2-4 members');
      }

      // Fetch members and check learning path consistency
      const members = await User.find({ _id: { $in: memberIds } });
      const learningPathIds = members.map((m) => m.learningPathId?.toString()).filter(Boolean);
      const uniquePaths = new Set(learningPathIds);

      if (uniquePaths.size > 1) {
        throw new ValidationError('All team members must have the same learning path');
      }
    }
  }

  /**
   * Check members not in other team
   * @private
   */
  async checkMembersAvailability(memberIds) {
    const membersInTeam = await User.find({
      _id: { $in: memberIds },
      capstoneGroupId: { $exists: true, $ne: null }
    });

    console.log(
      '[checkMembersAvailability] Members with capstoneGroupId:',
      membersInTeam.map((m) => ({
        id: m._id,
        email: m.email,
        capstoneGroupId: m.capstoneGroupId
      }))
    );

    if (membersInTeam.length > 0) {
      throw new ValidationError('One or more members already in another team');
    }
  }

  /**
   * Validate use case
   * @private
   */
  async validateUseCase(useCaseId) {
    try {
      const useCase = await UseCase.findById(useCaseId);

      if (!useCase) {
        throw new NotFoundError('Use case not found');
      }

      if (useCase.status === 'closed' || useCase.availableSlots <= 0) {
        throw new ValidationError('Use case is not available');
      }

      return useCase;
    } catch (err) {
      if (err.name === 'CastError') {
        throw new ValidationError('Invalid use case ID format');
      }
      throw err;
    }
  }

  /**
   * Update members team ID
   * @private
   */
  async updateMembersTeamId(memberIds, teamId) {
    await User.updateMany({ _id: { $in: memberIds } }, { capstoneGroupId: teamId });
  }

  /**
   * Update use case slots
   * @private
   */
  async updateUseCaseSlots(useCaseId) {
    const useCase = await UseCase.findByIdAndUpdate(
      useCaseId,
      {
        $inc: { availableSlots: -1 }
      },
      { new: true }
    );

    // If no slots left, close use case
    if (useCase.availableSlots <= 0) {
      await UseCase.findByIdAndUpdate(useCaseId, { status: 'closed' });
    }
  }
}

export default new TeamService();
