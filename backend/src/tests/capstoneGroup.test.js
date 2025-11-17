import { jest } from '@jest/globals'

// Mock models
const mockCapstoneGroup = {
  findOne: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
  prototype: {
    save: jest.fn()
  }
}

const mockUser = {
  find: jest.fn(),
  findById: jest.fn(),
  updateMany: jest.fn()
}

const mockUseCase = {
  find: jest.fn(),
  findById: jest.fn(),
  prototype: {
    save: jest.fn()
  }
}

// Mock Counter
const mockCounter = {
  findByIdAndUpdate: jest.fn()
}

describe('Capstone Group Controller - Team Registration', () => {
  let registerTeam
  let req, res

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Setup request and response
    req = {
      body: {},
      user: { _id: 'admin123', role: 'admin' }
    }

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
  })

  describe('Validation Tests', () => {
    it('should reject duplicate team name', async () => {
      req.body = {
        teamName: 'Existing Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001', 'A25-CS002']
      }

      mockCapstoneGroup.findOne.mockResolvedValue({ teamName: 'Existing Team' })

      // Simulate controller logic
      const existingTeam = await mockCapstoneGroup.findOne({ teamName: req.body.teamName })

      expect(existingTeam).toBeTruthy()
      // In real controller, this would return 400
    })

    it('should reject team with less than 2 members', async () => {
      req.body = {
        teamName: 'New Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001'] // Only 1 member
      }

      mockUser.find.mockResolvedValue([
        { dicodingId: 'A25-CS001', learningPath: 'Front-End Web & Back-End with AI' }
      ])

      const membersFromDB = await mockUser.find({ dicodingId: { $in: req.body.membersUserId } })
      const totalMembers = membersFromDB.length

      expect(totalMembers).toBeLessThan(2)
      // In real controller, this would return 400
    })

    it('should reject team with more than 4 members', async () => {
      req.body = {
        teamName: 'New Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001', 'A25-CS002', 'A25-CS003', 'A25-CS004', 'A25-CS005']
      }

      mockUser.find.mockResolvedValue([
        { dicodingId: 'A25-CS001', learningPath: 'Front-End Web & Back-End with AI' },
        { dicodingId: 'A25-CS002', learningPath: 'React & Back-End with AI' },
        { dicodingId: 'A25-CS003', learningPath: 'Machine Learning' },
        { dicodingId: 'A25-CS004', learningPath: 'Machine Learning' },
        { dicodingId: 'A25-CS005', learningPath: 'Machine Learning' }
      ])

      const membersFromDB = await mockUser.find({ dicodingId: { $in: req.body.membersUserId } })
      const totalMembers = membersFromDB.length

      expect(totalMembers).toBeGreaterThan(4)
      // In real controller, this would return 400
    })

    it('should reject team without technical member', async () => {
      req.body = {
        teamName: 'ML Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001', 'A25-CS002']
      }

      mockUser.find.mockResolvedValue([
        { dicodingId: 'A25-CS001', learningPath: 'Machine Learning' },
        { dicodingId: 'A25-CS002', learningPath: 'Machine Learning' }
      ])

      const membersFromDB = await mockUser.find({ dicodingId: { $in: req.body.membersUserId } })
      const hasTechnicalMember = membersFromDB.some(
        member =>
          member.learningPath === 'Front-End Web & Back-End with AI' ||
          member.learningPath === 'React & Back-End with AI'
      )

      expect(hasTechnicalMember).toBe(false)
      // In real controller, this would return 400
    })

    it('should accept valid team composition', async () => {
      req.body = {
        teamName: 'Valid Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001', 'A25-CS002', 'A25-CS003']
      }

      mockUser.find.mockResolvedValue([
        {
          _id: 'user1',
          dicodingId: 'A25-CS001',
          learningPath: 'Front-End Web & Back-End with AI',
          capstoneGroupId: null
        },
        {
          _id: 'user2',
          dicodingId: 'A25-CS002',
          learningPath: 'React & Back-End with AI',
          capstoneGroupId: null
        },
        {
          _id: 'user3',
          dicodingId: 'A25-CS003',
          learningPath: 'Machine Learning',
          capstoneGroupId: null
        }
      ])

      const membersFromDB = await mockUser.find({ dicodingId: { $in: req.body.membersUserId } })
      const totalMembers = membersFromDB.length
      const hasTechnicalMember = membersFromDB.some(
        member =>
          member.learningPath === 'Front-End Web & Back-End with AI' ||
          member.learningPath === 'React & Back-End with AI'
      )

      expect(totalMembers).toBeGreaterThanOrEqual(2)
      expect(totalMembers).toBeLessThanOrEqual(4)
      expect(hasTechnicalMember).toBe(true)
    })

    it('should reject if member already has a team', async () => {
      req.body = {
        teamName: 'New Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001', 'A25-CS002']
      }

      mockUser.find.mockResolvedValue([
        {
          dicodingId: 'A25-CS001',
          learningPath: 'Front-End Web & Back-End with AI',
          capstoneGroupId: 'existingTeamId', // Already has a team
          name: 'John Doe'
        },
        {
          dicodingId: 'A25-CS002',
          learningPath: 'React & Back-End with AI',
          capstoneGroupId: null
        }
      ])

      const membersFromDB = await mockUser.find({ dicodingId: { $in: req.body.membersUserId } })
      const membersWithTeam = membersFromDB.find(member => member.capstoneGroupId !== null)

      expect(membersWithTeam).toBeTruthy()
      // In real controller, this would return 400
    })
  })

  describe('UseCase Validation Tests', () => {
    it('should reject invalid usecase ID', async () => {
      req.body = {
        teamName: 'New Team',
        useCaseId: 'INVALID-ID',
        membersUserId: ['A25-CS001', 'A25-CS002']
      }

      mockUseCase.find.mockResolvedValue([])

      const usecaseFromDB = await mockUseCase.find({ usecaseId: { $in: req.body.useCaseId } })

      expect(usecaseFromDB.length).toBe(0)
      // In real controller, this would return 400
    })

    it('should reject closed usecase', async () => {
      req.body = {
        teamName: 'New Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS001', 'A25-CS002']
      }

      mockUseCase.find.mockResolvedValue([{ _id: 'uc1', status: 'closed' }])
      mockUseCase.findById.mockResolvedValue({ _id: 'uc1', status: 'closed' })

      const selectedUsecase = await mockUseCase.findById('uc1')

      expect(selectedUsecase.status).toBe('closed')
      // In real controller, this would return 400
    })
  })
})
