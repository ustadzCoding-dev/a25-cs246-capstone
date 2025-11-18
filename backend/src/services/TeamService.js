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

    // 4. Validate team composition
    this.validateTeamComposition(teamData.membersUserId);

    // 5. Check members not in other team
    await this.checkMembersAvailability(teamData.membersUserId);

    // 6. Validate use case
    const useCase = await this.validateUseCase(teamData.useCaseId);

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
   * Validate team composition (2-4 members, at least 1 technical)
   * @private
   */
  validateTeamComposition(memberIds) {
    // Check team size
    if (memberIds.length < 2 || memberIds.length > 4) {
      throw new ValidationError('Team must have 2-4 members');
    }

    // Check for duplicates
    const uniqueIds = new Set(memberIds);
    if (uniqueIds.size !== memberIds.length) {
      throw new ValidationError('Duplicate members not allowed');
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
