import { defineStore } from 'pinia'
import * as timelineService from '../services/timelineService'

export const useTimelineStore = defineStore('timeline', {
  state: () => ({
    // Timelines data
    timelines: [],
    upcomingTimelines: [],
    overdueTimelines: [],
    
    // Loading states
    loading: false,
    timelinesLoading: false,
    
    // Error handling
    error: null
  }),

  getters: {
    // Get timelines by status
    completedTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.status === 'completed')
    },
    
    ongoingTimelines: (state) => {
      return state.timelines.filter(timeline => timeline.status === 'ongoing')
    },
    
    // Sort timelines by date
    sortedTimelines: (state) => {
      return [...state.timelines].sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
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
     * Fetch upcoming timelines
     */
    async fetchUpcomingTimelines() {
      this.loading = true
      this.error = null
      
      try {
        const response = await timelineService.getUpcomingTimelines()
        
        if (response.success) {
          this.upcomingTimelines = response.data
        }
        
        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch upcoming timelines'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch overdue timelines
     */
    async fetchOverdueTimelines() {
      this.loading = true
      this.error = null
      
      try {
        const response = await timelineService.getOverdueTimelines()
        
        if (response.success) {
          this.overdueTimelines = response.data
        }
        
        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch overdue timelines'
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
     * Clear error
     */
    clearError() {
      this.error = null
    },

    /**
     * Reset store
     */
    reset() {
      this.timelines = []
      this.upcomingTimelines = []
      this.overdueTimelines = []
      this.loading = false
      this.timelinesLoading = false
      this.error = null
    }
  }
})
