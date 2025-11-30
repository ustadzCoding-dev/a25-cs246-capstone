import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTeamStore } from '../stores/teamStore'
import * as teamService from '../services/teamService'

// Mock the team service
vi.mock('../services/teamService', () => ({
  getAllTeams: vi.fn(),
  getTeamById: vi.fn(),
  createTeam: vi.fn(),
  updateTeam: vi.fn(),
  approveTeam: vi.fn(),
  rejectTeam: vi.fn(),
  deleteTeam: vi.fn(),
  getAllUseCases: vi.fn(),
}))

describe('Team Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('State Initialization', () => {
    it('should initialize with empty state', () => {
      const store = useTeamStore()

      expect(store.teams).toEqual([])
      expect(store.currentTeam).toBeNull()
      expect(store.useCases).toEqual([])
      expect(store.loading).toBe(false)
      expect(store.error).toBeNull()
    })
  })

  describe('Getters', () => {
    it('should filter pending teams', () => {
      const store = useTeamStore()
      store.teams = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'approved' },
        { id: '3', status: 'pending' },
      ]

      expect(store.pendingTeams).toHaveLength(2)
      expect(store.pendingTeams[0].status).toBe('pending')
    })

    it('should filter approved teams', () => {
      const store = useTeamStore()
      store.teams = [
        { id: '1', status: 'pending' },
        { id: '2', status: 'approved' },
        { id: '3', status: 'approved' },
      ]

      expect(store.approvedTeams).toHaveLength(2)
      expect(store.approvedTeams[0].status).toBe('approved')
    })

    it('should check if user has team', () => {
      const store = useTeamStore()

      expect(store.hasTeam).toBe(false)

      // Test with pending team
      store.currentTeam = { id: '1', name: 'Test Team', status: 'pending' }
      expect(store.hasTeam).toBe(true)

      // Test with approved team
      store.currentTeam = { id: '1', name: 'Test Team', status: 'approved' }
      expect(store.hasTeam).toBe(true)

      // Test with rejected team (should be false)
      store.currentTeam = { id: '1', name: 'Test Team', status: 'rejected' }
      expect(store.hasTeam).toBe(false)
    })
  })

  describe('Actions - Create Team', () => {
    it('should create team successfully', async () => {
      const store = useTeamStore()
      const mockTeamData = {
        teamName: 'Test Team',
        useCaseId: 'DC-09',
        membersUserId: ['A25-CS246-001', 'A25-CS246-002']
      }

      const mockResponse = {
        success: true,
        data: {
          id: '1',
          ...mockTeamData,
          status: 'pending'
        }
      }

      teamService.createTeam.mockResolvedValue(mockResponse)

      const result = await store.createTeam(mockTeamData)

      expect(teamService.createTeam).toHaveBeenCalledWith(mockTeamData)
      expect(store.currentTeam).toEqual(mockResponse.data)
      expect(store.teams).toContainEqual(mockResponse.data)
      expect(result.success).toBe(true)
    })

    it('should handle team creation error', async () => {
      const store = useTeamStore()
      const errorMessage = 'Team name already exists'

      teamService.createTeam.mockRejectedValue(new Error(errorMessage))

      await expect(store.createTeam({})).rejects.toThrow(errorMessage)
      expect(store.error).toBe(errorMessage)
    })
  })

  describe('Actions - Fetch Teams', () => {
    it('should fetch all teams successfully', async () => {
      const store = useTeamStore()
      const mockTeams = [
        { id: '1', name: 'Team A', status: 'pending' },
        { id: '2', name: 'Team B', status: 'approved' },
      ]

      const mockResponse = {
        success: true,
        data: {
          teams: mockTeams,
          pagination: {
            currentPage: 1,
            totalItems: 2,
            limit: 10
          }
        }
      }

      teamService.getAllTeams.mockResolvedValue(mockResponse)

      await store.fetchTeams()

      expect(store.teams).toEqual(mockTeams)
      expect(store.pagination.totalItems).toBe(2)
      expect(store.teamsLoading).toBe(false)
    })
  })

  describe('Actions - Approve/Reject Team', () => {
    it('should approve team successfully', async () => {
      const store = useTeamStore()
      store.teams = [
        { id: '1', status: 'pending' },
      ]

      const mockResponse = {
        success: true,
        data: { status: 'approved' }
      }

      teamService.approveTeam.mockResolvedValue(mockResponse)

      await store.approveTeam('1')

      expect(store.teams[0].status).toBe('approved')
      expect(teamService.approveTeam).toHaveBeenCalledWith('1', '')
    })

    it('should reject team successfully', async () => {
      const store = useTeamStore()
      store.teams = [
        { id: '1', status: 'pending' },
      ]

      const mockResponse = {
        success: true,
        data: { status: 'rejected' }
      }

      teamService.rejectTeam.mockResolvedValue(mockResponse)

      await store.rejectTeam('1', 'Invalid composition')

      expect(store.teams[0].status).toBe('rejected')
      expect(teamService.rejectTeam).toHaveBeenCalledWith('1', 'Invalid composition')
    })
  })

  describe('Actions - Delete Team', () => {
    it('should delete team successfully', async () => {
      const store = useTeamStore()
      store.teams = [
        { id: '1', name: 'Team A' },
        { id: '2', name: 'Team B' },
      ]
      store.currentTeam = { id: '1', name: 'Team A' }

      const mockResponse = { success: true }
      teamService.deleteTeam.mockResolvedValue(mockResponse)

      await store.deleteTeam('1')

      expect(store.teams).toHaveLength(1)
      expect(store.teams[0].id).toBe('2')
      expect(store.currentTeam).toBeNull()
    })
  })
})
