import { defineStore } from 'pinia'
import * as teamService from '../services/teamService'
import { useBaseStore } from './baseStore'

export const useTeamStore = defineStore('team', {
  state: () => ({
    // Teams data
    teams: [],
    currentTeam: null,
    useCases: [],

    // Pagination
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },

    // Loading states
    loading: false,
    teamsLoading: false,
    useCasesLoading: false,
    actionLoading: null, // Track which action is loading

    // Error handling
    error: null,
    errorCode: null,
    errorDetails: [],
    lastError: null, // Store last error for debugging
    successMessage: null,
  }),

  getters: {
    // Get teams by status
    pendingTeams: state => state.teams.filter(team => team.status === 'pending'),
    approvedTeams: state => state.teams.filter(team => team.status === 'approved'),
    rejectedTeams: state => state.teams.filter(team => team.status === 'rejected'),

    // Check if user has a team
    hasTeam: state => state.currentTeam !== null,

    // Get team status
    teamStatus: state => state.currentTeam?.status || null,
  },

  actions: {
    /**
     * Fetch all teams (Admin)
     */
    async fetchTeams(params = {}) {
      this.teamsLoading = true
      this.error = null

      try {
        const response = await teamService.getAllTeams(params)

        if (response.success) {
          // Backend returns: { success, data: [teams], meta: { pagination: {...} } }
          const teamsData = response.data
          this.teams = Array.isArray(teamsData) ? teamsData : []

          // Update pagination if available (it's in response.meta.pagination)
          if (response.meta && response.meta.pagination) {
            this.pagination = response.meta.pagination
          }
        } else {
          this.teams = []
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch teams'
        throw error
      } finally {
        this.teamsLoading = false
      }
    },

    /**
     * Fetch team by ID
     */
    async fetchTeamById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.getTeamById(id)

        if (response.success) {
          this.currentTeam = response.data
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch current user's team (Student)
     */
    async fetchCurrentTeam() {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.getCurrentTeam()

        if (response.success) {
          this.currentTeam = response.data
        }

        return response
      } catch (error) {
        // It's okay if student doesn't have a team yet
        this.currentTeam = null
        return { success: true, data: null }
      } finally {
        this.loading = false
      }
    },

    /**
     * Create new team
     */
    async createTeam(teamData) {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.createTeam(teamData)

        if (response.success) {
          this.currentTeam = response.data
          this.teams.push(response.data)
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to create team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update team
     */
    async updateTeam(id, teamData) {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.updateTeam(id, teamData)

        if (response.success) {
          // Update current team if it's the same
          if (this.currentTeam?.id === id) {
            this.currentTeam = response.data
          }

          // Update in teams list
          const index = this.teams.findIndex(team => team.id === id)
          if (index !== -1) {
            this.teams[index] = response.data
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to update team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Approve team (Admin)
     */
    async approveTeam(id, reason = '') {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.approveTeam(id, reason)

        if (response.success) {
          // Update team status in list
          const index = this.teams.findIndex(team => team.id === id)
          if (index !== -1) {
            this.teams[index].status = 'approved'
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to approve team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Reject team (Admin)
     */
    async rejectTeam(id, reason) {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.rejectTeam(id, reason)

        if (response.success) {
          // Update team status in list
          const index = this.teams.findIndex(team => team.id === id)
          if (index !== -1) {
            this.teams[index].status = 'rejected'
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to reject team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete team (Admin)
     */
    async deleteTeam(id) {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.deleteTeam(id)

        if (response.success) {
          // Remove from teams list
          this.teams = this.teams.filter(team => team.id !== id)

          // Clear current team if it's the same
          if (this.currentTeam?.id === id) {
            this.currentTeam = null
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to delete team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update team (Admin)
     */
    async updateTeam(id, updateData) {
      this.loading = true
      this.error = null

      try {
        const response = await teamService.updateTeam(id, updateData)

        if (response.success) {
          // Update team in list
          const index = this.teams.findIndex(team => team._id === id || team.id === id)
          if (index !== -1) {
            this.teams[index] = { ...this.teams[index], ...updateData }
          }

          // Update current team if it's the same
          if (this.currentTeam?.id === id || this.currentTeam?._id === id) {
            this.currentTeam = { ...this.currentTeam, ...updateData }
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to update team'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Edit pending team (Leader only)
     */
    async editTeam(id, teamData) {
      this.loading = true
      this.error = null

      try {
        console.log('[teamStore.editTeam] Starting edit for team:', id)
        console.log('[teamStore.editTeam] Team data:', JSON.stringify(teamData, null, 2))

        if (!id) {
          console.error('[teamStore.editTeam] No team ID provided')
          throw new Error('Team ID is required')
        }

        if (!teamData || !teamData.membersUserId) {
          console.error('[teamStore.editTeam] Invalid team data:', teamData)
          throw new Error('Team data and members are required')
        }

        console.log('[teamStore.editTeam] Calling teamService.editTeam...')
        const response = await teamService.editTeam(id, teamData)
        console.log('[teamStore.editTeam] Raw response:', response)
        console.log('[teamStore.editTeam] Response type:', typeof response)
        console.log('[teamStore.editTeam] Response success:', response?.success)

        if (response && response.success !== false) {
          console.log('[teamStore.editTeam] Updating local state...')
          // Update current team with new data
          if (this.currentTeam?.id === id || this.currentTeam?._id === id) {
            const updatedTeam = response.data?.team || response.team || response
            this.currentTeam = updatedTeam
            console.log('[teamStore.editTeam] Updated current team:', this.currentTeam)
          }

          // Update team in list
          const index = this.teams.findIndex(team => team._id === id || team.id === id)
          if (index !== -1) {
            const updatedTeam = response.data?.team || response.team || response
            this.teams[index] = updatedTeam
            console.log('[teamStore.editTeam] Updated team in list at index:', index)
          }
        }

        console.log('[teamStore.editTeam] Edit completed successfully')
        return response
      } catch (error) {
        console.error('[teamStore.editTeam] Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          stack: error.stack,
        })

        let errorMessage = 'Failed to edit team'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        } else if (error.message) {
          errorMessage = error.message
        }

        this.error = errorMessage
        console.error('[teamStore.editTeam] Setting error:', errorMessage)
        throw error
      } finally {
        this.loading = false
        console.log('[teamStore.editTeam] Loading state cleared')
      }
    },

    /**
     * Fetch all use cases
     */
    async fetchUseCases() {
      this.useCasesLoading = true
      this.error = null

      try {
        console.log('[fetchUseCases] Starting fetch...')
        const response = await teamService.getAllUseCases()
        console.log('[fetchUseCases] Response:', response)

        if (response.success) {
          this.useCases = response.data
          console.log('[fetchUseCases] useCases set to:', this.useCases)
        } else {
          console.log('[fetchUseCases] Response not successful:', response)
        }

        return response
      } catch (error) {
        console.error('[fetchUseCases] Error:', error)
        this.error = error.message || 'Failed to fetch use cases'
        throw error
      } finally {
        this.useCasesLoading = false
      }
    },

    /**
     * Handle error with detailed tracking
     */
    setError(error, actionName = 'unknown') {
      // Handle both string and error object inputs
      if (typeof error === 'string') {
        this.error = error
        this.errorCode = 'UNKNOWN_ERROR'
        this.errorDetails = []
      } else {
        this.error = error?.message || 'An error occurred'
        this.errorCode = error?.code || 'UNKNOWN_ERROR'
        this.errorDetails = error?.details || []
      }

      this.lastError = {
        action: actionName,
        error: error,
        timestamp: new Date().toISOString(),
      }

      // Auto-clear error message after 8 seconds
      setTimeout(() => {
        this.error = null
      }, 8000)
    },

    /**
     * Set success message
     */
    setSuccess(message) {
      this.successMessage = message
      this.error = null
      setTimeout(() => {
        this.successMessage = null
      }, 3000)
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null
      this.errorCode = null
      this.errorDetails = []
    },

    /**
     * Clear success message
     */
    clearSuccess() {
      this.successMessage = null
    },

    /**
     * Reset store
     */
    reset() {
      this.teams = []
      this.currentTeam = null
      this.useCases = []
      this.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }
      this.loading = false
      this.teamsLoading = false
      this.useCasesLoading = false
      this.actionLoading = null
      this.error = null
      this.errorCode = null
      this.errorDetails = []
      this.lastError = null
      this.successMessage = null
    },
  },
})
