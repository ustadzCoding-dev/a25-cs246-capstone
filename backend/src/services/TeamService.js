import CapstoneGroup from '../models/CapstoneGroup.js';
import User from '../models/User.js';
import UseCase from '../models/UseCase.js';
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
    // 1. Validate input
    this.validateTeamData(teamData);

    // 2. Check team name uniqueness
    await this.checkTeamNameUniqueness(teamData.teamName);

    // 3. Validate members
    await this.validateMembers(teamData.membersUserId);

    // 4. Validate use case first (to get composition requirements)
    const useCase = await this.validateUseCase(teamData.useCaseId);

    // 5. Validate team composition against use case requirements
    await this.validateTeamComposition(teamData.membersUserId, useCase);

    // 6. Check members not in other team
    await this.checkMembersAvailability(teamData.membersUserId);

    // 7. Create team
    const team = await CapstoneGroup.create({
      teamName: teamData.teamName.trim(),
      membersUserId: teamData.membersUserId,
      useCaseId: teamData.useCaseId,
      status: 'pending',
      submittedAt: new Date(),
      createdBy: userId
    });

    // 8. Update members
    await this.updateMembersTeamId(teamData.membersUserId, team._id);

    // 9. Update use case
    await this.updateUseCaseSlots(teamData.useCaseId);

    // 10. Create invitations for team members (except leader)
    const Invitation = (await import('../models/Invitation.js')).default;
    const otherMembers = teamData.membersUserId.filter(memberId => memberId !== userId);

    for (const memberId of otherMembers) {
      await Invitation.create({
        leaderId: userId,
        memberId: memberId,
        teamId: team._id,
        status: 'pending'
      });
    }

    return team;
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

    // Update team status
    team.status = 'rejected';
    team.rejectionReason = reason;
    team.validatedBy = adminId;
    team.validatedAt = new Date();

    await team.save();

    // Remove team ID from members
    await User.updateMany(
      { _id: { $in: team.membersUserId } },
      { $unset: { capstoneGroupId: 1 } }
    );

    // Restore use case slots
    await UseCase.findByIdAndUpdate(
      team.useCaseId,
      {
        $inc: { availableSlots: 1 },
        $pull: { capstoneGroup: team._id }
      }
    );

    return team;
  }

  /**
   * Delete a team
   * @param {string} teamId - Team ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} If team not found
   */
  async deleteTeam(teamId) {
    const team = await this.findTeamById(teamId);

    // Remove team ID from members
    await User.updateMany(
      { _id: { $in: team.membersUserId } },
      { $unset: { capstoneGroupId: 1 } }
    );

    // Restore use case slots
    if (team.status === 'pending') {
      await UseCase.findByIdAndUpdate(
        team.useCaseId,
        {
          $inc: { availableSlots: 1 },
          $pull: { capstoneGroup: team._id }
        }
      );
    }

    // Delete team
    await CapstoneGroup.findByIdAndDelete(teamId);
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

    // Calculate pagination
    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Execute query
    const teams = await CapstoneGroup.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('membersUserId', 'name email learningPath')
      .populate('useCaseId', 'title partner')
      .lean();

    const total = await CapstoneGroup.countDocuments(query);

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

    // Validate each composition entry
    let totalTeamSize = 0;
    for (const comp of teamComposition) {
      if (!comp.learningPath || !comp.count) {
        throw new ValidationError('Each composition entry must have learningPath and count');
      }
      if (comp.count < 1) {
        throw new ValidationError('Count must be at least 1');
      }
      totalTeamSize += comp.count;
    }

    // Update use case
    const useCase = await UseCase.findByIdAndUpdate(
      useCaseId,
      {
        teamComposition,
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
   * Validate members exist
   * @private
   */
  async validateMembers(memberIds) {
    const members = await User.find({ _id: { $in: memberIds } });

    if (members.length !== memberIds.length) {
      throw new NotFoundError('One or more members not found');
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
      throw new ValidationError('Duplicate members not allowed');
    }

    // If use case has custom composition requirements
    if (useCase.teamComposition && useCase.teamComposition.length > 0) {
      // Fetch members with their learning paths
      const members = await User.find({ _id: { $in: memberIds } });

      // Count members by learning path
      const compositionCount = {};
      members.forEach(member => {
        const path = member.learningPath;
        compositionCount[path] = (compositionCount[path] || 0) + 1;
      });

      // Validate against required composition
      for (const requirement of useCase.teamComposition) {
        const actualCount = compositionCount[requirement.learningPath] || 0;
        if (actualCount !== requirement.count) {
          throw new ValidationError(
            `Team composition mismatch. Expected ${requirement.count} member(s) from "${requirement.learningPath}", got ${actualCount}`
          );
        }
      }

      // Check total team size matches
      if (memberIds.length !== useCase.totalTeamSize) {
        throw new ValidationError(
          `Team must have exactly ${useCase.totalTeamSize} members, got ${memberIds.length}`
        );
      }
    } else {
      // Default validation: 2-4 members with same learning path
      if (memberIds.length < 2 || memberIds.length > 4) {
        throw new ValidationError('Team must have 2-4 members');
      }

      // Fetch members and check learning path consistency
      const members = await User.find({ _id: { $in: memberIds } });
      const learningPaths = members.map(m => m.learningPath);
      const uniquePaths = new Set(learningPaths);

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

    if (membersInTeam.length > 0) {
      throw new ValidationError('One or more members already in another team');
    }
  }

  /**
   * Validate use case
   * @private
   */
  async validateUseCase(useCaseId) {
    const useCase = await UseCase.findById(useCaseId);

    if (!useCase) {
      throw new NotFoundError('Use case not found');
    }

    if (useCase.status === 'closed' || useCase.availableSlots <= 0) {
      throw new ValidationError('Use case is not available');
    }

    return useCase;
  }

  /**
   * Update members team ID
   * @private
   */
  async updateMembersTeamId(memberIds, teamId) {
    await User.updateMany(
      { _id: { $in: memberIds } },
      { capstoneGroupId: teamId }
    );
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
