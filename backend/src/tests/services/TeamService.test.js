import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TeamService from '../../services/TeamService.js';
import CapstoneGroup from '../../models/CapstoneGroup.js';
import User from '../../models/User.js';
import UseCase from '../../models/UseCase.js';
import { ValidationError, NotFoundError, ConflictError } from '../../utils/errorHandler.js';

// Mock models
vi.mock('../../models/CapstoneGroup.js');
vi.mock('../../models/User.js');
vi.mock('../../models/UseCase.js');

// Helper to create chainable mock
const createChainableMock = (resolveValue = null) => {
  const chain = {
    populate: vi.fn(function() { return this; }),
    lean: vi.fn(function() { return this; }),
    exec: vi.fn().mockResolvedValue(resolveValue),
    sort: vi.fn(function() { return this; }),
    skip: vi.fn(function() { return this; }),
    limit: vi.fn(function() { return this; }),
    then: function(onFulfilled) {
      return Promise.resolve(resolveValue).then(onFulfilled);
    }
  };
  // Make chain thenable
  return Object.assign(Promise.resolve(resolveValue), chain);
};

describe('TeamService', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup chainable mocks for CapstoneGroup
    CapstoneGroup.findById = vi.fn().mockReturnValue(createChainableMock());
    CapstoneGroup.find = vi.fn().mockReturnValue(createChainableMock());
    CapstoneGroup.findOne = vi.fn();
    CapstoneGroup.countDocuments = vi.fn();
    CapstoneGroup.create = vi.fn();
    CapstoneGroup.findByIdAndDelete = vi.fn();
    CapstoneGroup.findByIdAndUpdate = vi.fn();
  });

  describe('createTeam', () => {
    it('should create a new team successfully', async () => {
      const teamData = {
        teamName: 'Team Alpha',
        membersUserId: ['user1', 'user2', 'user3'],
        useCaseId: 'usecase1'
      };

      const mockUsers = [
        { _id: 'user1', dicodingId: 'user1', learningPath: 'Front-End Web & Back-End with AI', capstoneGroupId: null },
        { _id: 'user2', dicodingId: 'user2', learningPath: 'React & Back-End with AI', capstoneGroupId: null },
        { _id: 'user3', dicodingId: 'user3', learningPath: 'Machine Learning', capstoneGroupId: null }
      ];

      const createdTeam = { _id: 'team1', ...teamData, status: 'pending' };

      // Mock User.find to return different results based on query
      User.find.mockImplementation((query) => {
        if (query.capstoneGroupId) {
          // checkMembersAvailability query - return empty (no members in team)
          return Promise.resolve([]);
        }
        // validateMembers query - return all users
        return Promise.resolve(mockUsers);
      });

      CapstoneGroup.findOne.mockResolvedValue(null);
      UseCase.findById.mockResolvedValue({ _id: 'usecase1', status: 'open', totalSlots: 10 });
      CapstoneGroup.create.mockResolvedValue(createdTeam);
      User.updateMany.mockResolvedValue({});
      UseCase.findByIdAndUpdate.mockResolvedValue({});

      const result = await TeamService.createTeam(teamData, 'admin1');

      expect(result).toBeDefined();
      expect(result.teamName).toBe('Team Alpha');
      expect(User.find).toHaveBeenCalled();
    });

    it('should throw ValidationError if members count is invalid', async () => {
      const teamData = {
        teamName: 'Team Alpha',
        membersUserId: ['user1'], // Only 1 member
        useCaseId: 'usecase1'
      };

      const mockUsers = [{ _id: 'user1', dicodingId: 'user1' }];
      User.find.mockResolvedValue(mockUsers);

      await expect(TeamService.createTeam(teamData, 'admin1')).rejects.toThrow(ValidationError);
    });

    it('should throw ConflictError if team name already exists', async () => {
      const teamData = {
        teamName: 'Team Alpha',
        membersUserId: ['user1', 'user2', 'user3'],
        useCaseId: 'usecase1'
      };

      CapstoneGroup.findOne.mockResolvedValue({ teamName: 'Team Alpha' });

      await expect(TeamService.createTeam(teamData, 'admin1')).rejects.toThrow(ConflictError);
    });
  });

  describe('approveTeam', () => {
    it('should approve a pending team', async () => {
      const teamId = 'team1';
      const adminId = 'admin1';

      const mockTeam = {
        _id: teamId,
        status: 'pending',
        save: vi.fn().mockResolvedValue({
          _id: teamId,
          status: 'approved',
          validatedBy: adminId,
          validatedAt: new Date()
        })
      };

      const chainMock = createChainableMock(mockTeam);

      CapstoneGroup.findById.mockReturnValue(chainMock);

      const result = await TeamService.approveTeam(teamId, adminId);

      expect(result.status).toBe('approved');
      expect(result.validatedBy).toBe(adminId);
      expect(mockTeam.save).toHaveBeenCalled();
    });

    it('should throw NotFoundError if team does not exist', async () => {
      const chainMock = createChainableMock(null);

      CapstoneGroup.findById.mockReturnValue(chainMock);

      await expect(TeamService.approveTeam('invalid', 'admin1')).rejects.toThrow(NotFoundError);
    });

    it('should throw ValidationError if team is not pending', async () => {
      const mockTeam = {
        _id: 'team1',
        status: 'approved'
      };

      const chainMock = createChainableMock(mockTeam);
      CapstoneGroup.findById.mockReturnValue(chainMock);

      await expect(TeamService.approveTeam('team1', 'admin1')).rejects.toThrow(ValidationError);
    });
  });

  describe('rejectTeam', () => {
    it('should reject a pending team with reason', async () => {
      const teamId = 'team1';
      const adminId = 'admin1';
      const reason = 'Invalid team composition';

      const mockTeam = {
        _id: teamId,
        status: 'pending',
        membersUserId: ['user1', 'user2'],
        useCaseId: 'usecase1',
        save: vi.fn().mockResolvedValue({
          _id: teamId,
          status: 'rejected',
          rejectionReason: reason,
          validatedBy: adminId
        })
      };

      const chainMock = createChainableMock(mockTeam);

      CapstoneGroup.findById.mockReturnValue(chainMock);
      User.updateMany.mockResolvedValue({});
      UseCase.findByIdAndUpdate.mockResolvedValue({});

      const result = await TeamService.rejectTeam(teamId, adminId, reason);

      expect(result.status).toBe('rejected');
      expect(result.rejectionReason).toBe(reason);
      expect(mockTeam.save).toHaveBeenCalled();
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      const teamId = 'team1';
      const mockTeam = {
        _id: teamId,
        status: 'pending',
        membersUserId: ['user1', 'user2'],
        useCaseId: 'usecase1'
      };

      const chainMock = createChainableMock(mockTeam);

      CapstoneGroup.findById.mockReturnValue(chainMock);
      User.updateMany.mockResolvedValue({});
      UseCase.findByIdAndUpdate.mockResolvedValue({});
      CapstoneGroup.findByIdAndDelete.mockResolvedValue({ _id: teamId });

      await TeamService.deleteTeam(teamId);

      expect(CapstoneGroup.findByIdAndDelete).toHaveBeenCalledWith(teamId);
    });

    it('should throw NotFoundError if team does not exist', async () => {
      const chainMock = createChainableMock();
      chainMock.populate.mockReturnThis();
      chainMock.exec = vi.fn().mockResolvedValue(null);

      CapstoneGroup.findById.mockReturnValue(chainMock);

      await expect(TeamService.deleteTeam('invalid')).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAllTeams', () => {
    it('should return paginated teams', async () => {
      const mockTeams = [
        { _id: 'team1', teamName: 'Team A', status: 'pending' },
        { _id: 'team2', teamName: 'Team B', status: 'approved' }
      ];

      const chainMock = createChainableMock();
      chainMock.sort.mockReturnThis();
      chainMock.skip.mockReturnThis();
      chainMock.limit.mockReturnThis();
      chainMock.populate.mockReturnThis();
      chainMock.lean.mockResolvedValue(mockTeams);

      CapstoneGroup.find.mockReturnValue(chainMock);
      CapstoneGroup.countDocuments.mockResolvedValue(2);

      const result = await TeamService.getAllTeams({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(2);
    });
  });
});
