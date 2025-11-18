import { defineStore } from 'pinia'
import * as timelineService from '../services/timelineService'

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    // Timelines data
    timelines: [],
    currentTimeline: null,

    // Pagination
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    },

    // Loading states
    loading: false,
    timelinesLoading: false,
    actionLoading: null,

    // Error handling
    error: null,
    errorCode: null,
    errorDetails: [],
    lastError: null,
    successMessage: null
  }),

  getters: {
    // Get timelines by status
    completedTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.status === 'completed')
    },

    ongoingTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.status === 'ongoing')
    },

    upcomingTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.status === 'upcoming')
    },

    overdueTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.isOverdue === true)
    },

    // Sort timelines by date
    sortedTimelines: (state) => {
      return [...state.timelines].sort((a, b) => {
        return new Date(a.startDate) - new Date(b.startDate)
      })
    },

    // Get high priority timelines
    highPriorityTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.priority === 'high')
    }
  },

  actions: {
    /**
     * Fetch all timelines
     */
    async fetchTimelines() {
      this.timelinesLoading = true
      this.error = null

      try {
        const response = await timelineService.getAllTimelines()

        if (response.success) {
          this.timelines = response.data
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch timelines'
        throw error
      } finally {
        this.timelinesLoading = false
      }
    },

    /**
     * Fetch timeline by ID
     */
    async fetchTimelineById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await timelineService.getTimelineById(id)

        if (response.success) {
          this.currentTimeline = response.data
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch timeline'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Create new timeline (Admin)
     */
    async createTimeline(timelineData) {
      this.loading = true
      this.error = null

      try {
        const response = await timelineService.createTimeline(timelineData)

        if (response.success) {
          this.timelines.push(response.data)
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to create timeline'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Update timeline (Admin)
     */
    async updateTimeline(id, timelineData) {
      this.loading = true
      this.error = null

      try {
        const response = await timelineService.updateTimeline(id, timelineData)

        if (response.success) {
          // Update in timelines list
          const index = this.timelines.findIndex(timeline => timeline.id === id)
          if (index !== -1) {
            this.timelines[index] = response.data
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to update timeline'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete timeline (Admin)
     */
    async deleteTimeline(id) {
      this.loading = true
      this.error = null

      try {
        const response = await timelineService.deleteTimeline(id)

        if (response.success) {
          // Remove from timelines list
          this.timelines = this.timelines.filter(timeline => timeline.id !== id)
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to delete timeline'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Handle error with detailed tracking
     */
    setError(error, actionName = 'unknown') {
      this.error = error.message || 'An error occurred'
      this.errorCode = error.code || 'UNKNOWN_ERROR'
      this.errorDetails = error.details || []
      this.lastError = {
        action: actionName,
        error: error,
        timestamp: new Date().toISOString()
      }
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
      this.timelines = []
      this.currentTimeline = null
      this.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
      this.loading = false
      this.timelinesLoading = false
      this.actionLoading = null
      this.error = null
      this.errorCode = null
      this.errorDetails = []
      this.lastError = null
      this.successMessage = null
    }
  }
})
