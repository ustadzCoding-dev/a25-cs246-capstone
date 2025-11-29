import { defineStore } from 'pinia'
import axios from 'axios'
import api from '../services/api'

export const useWorksheetStore = defineStore('worksheet', {
  state: () => ({
    // Periods
    periods: [],
    currentPeriod: null,

    // User worksheets
    myWorksheets: [],
    currentWorksheet: null,

    // Admin: worksheets by period
    periodWorksheets: [],
    validationStats: null,

    // Loading states
    loading: false,
    submitting: false,
    uploading: false,

    // Error state
    error: null,
  }),

  getters: {
    // Get active period
    activePeriod: state => {
      return state.periods.find(p => p.status === 'active')
    },

    // Get periods sorted by period number
    sortedPeriods: state => {
      return [...state.periods].sort((a, b) => a.periodNumber - b.periodNumber)
    },

    // Check if user can submit for current period
    canSubmitWorksheet: state => {
      if (!state.currentPeriod) return false
      if (state.currentPeriod.status !== 'active') return false
      if (state.currentWorksheet?.isSubmitted) return false
      return true
    },

    // Get worksheet by period ID
    getWorksheetByPeriod: state => periodId => {
      const item = state.myWorksheets.find(w => w.period?.id === periodId)
      return item?.worksheet || null
    },

    // Get period by ID
    getPeriodById: state => periodId => {
      return state.periods.find(p => p.id === periodId || p._id === periodId)
    },

    // Count worksheets by status (for admin)
    worksheetStatusCounts: state => {
      const counts = {
        total: state.periodWorksheets.length,
        pending: 0,
        completed: 0,
        completed_late: 0,
        incomplete: 0,
        submitted: 0,
        notSubmitted: 0,
      }

      state.periodWorksheets.forEach(w => {
        if (w.validationStatus) {
          counts[w.validationStatus] = (counts[w.validationStatus] || 0) + 1
        }
        if (w.isSubmitted) {
          counts.submitted++
        } else {
          counts.notSubmitted++
        }
      })

      return counts
    },
  },

  actions: {
    // ==================== PERIODS ====================

    /**
     * Fetch all periods
     */
    async fetchPeriods() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/worksheet/periods')
        this.periods = response.data || []
        return this.periods
      } catch (error) {
        this.error = error.message || 'Failed to fetch periods'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch period by ID
     */
    async fetchPeriodById(periodId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/worksheet/periods/${periodId}`)
        this.currentPeriod = response.data
        return this.currentPeriod
      } catch (error) {
        this.error = error.message || 'Failed to fetch period'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Create new period (Admin)
     */
    async createPeriod(periodData) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.post('/worksheet/periods', periodData)
        const newPeriod = response.data
        this.periods.push(newPeriod)
        return newPeriod
      } catch (error) {
        this.error = error.message || 'Failed to create period'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Update period (Admin)
     */
    async updatePeriod(periodId, updateData) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.put(`/worksheet/periods/${periodId}`, updateData)
        const updatedPeriod = response.data

        // Update in local state
        const index = this.periods.findIndex(p => p.id === periodId || p._id === periodId)
        if (index !== -1) {
          this.periods[index] = updatedPeriod
        }

        return updatedPeriod
      } catch (error) {
        this.error = error.message || 'Failed to update period'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Delete period (Admin)
     */
    async deletePeriod(periodId) {
      this.submitting = true
      this.error = null

      try {
        await api.delete(`/worksheet/periods/${periodId}`)

        // Remove from local state
        this.periods = this.periods.filter(p => p.id !== periodId && p._id !== periodId)

        return true
      } catch (error) {
        this.error = error.message || 'Failed to delete period'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Activate period (Admin)
     */
    async activatePeriod(periodId) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.put(`/worksheet/periods/${periodId}/activate`)
        const updatedPeriod = response.data

        // Update in local state
        const index = this.periods.findIndex(p => p.id === periodId || p._id === periodId)
        if (index !== -1) {
          this.periods[index] = updatedPeriod
        }

        return updatedPeriod
      } catch (error) {
        this.error = error.message || 'Failed to activate period'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Close period (Admin)
     */
    async closePeriod(periodId) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.put(`/worksheet/periods/${periodId}/close`)
        const updatedPeriod = response.data

        // Update in local state
        const index = this.periods.findIndex(p => p.id === periodId || p._id === periodId)
        if (index !== -1) {
          this.periods[index] = updatedPeriod
        }

        return updatedPeriod
      } catch (error) {
        this.error = error.message || 'Failed to close period'
        throw error
      } finally {
        this.submitting = false
      }
    },

    // ==================== STUDENT WORKSHEETS ====================

    /**
     * Fetch my worksheets (all periods)
     */
    async fetchMyWorksheets() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/worksheet/my-worksheets')
        this.myWorksheets = response.data || []
        return this.myWorksheets
      } catch (error) {
        this.error = error.message || 'Failed to fetch worksheets'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch my worksheet for a specific period
     */
    async fetchMyWorksheetByPeriod(periodId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/worksheet/my-worksheets/${periodId}`)
        this.currentWorksheet = response.data
        return this.currentWorksheet
      } catch (error) {
        this.error = error.message || 'Failed to fetch worksheet'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Save worksheet draft
     */
    async saveWorksheetDraft(periodId, activityDescription) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.post(`/worksheet/save-draft/${periodId}`, {
          activityDescription,
        })
        this.currentWorksheet = response.data

        // Update in myWorksheets array
        const index = this.myWorksheets.findIndex(w => w.period?.id === periodId)
        if (index !== -1) {
          this.myWorksheets[index].worksheet = response.data
        }

        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to save draft'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Submit worksheet
     */
    async submitWorksheet(periodId, activityDescription) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.post(`/worksheet/submit/${periodId}`, {
          activityDescription,
        })
        this.currentWorksheet = response.data

        // Update in myWorksheets array
        const index = this.myWorksheets.findIndex(w => w.period?.id === periodId)
        if (index !== -1) {
          this.myWorksheets[index].worksheet = response.data
        }

        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to submit worksheet'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Upload evidence files
     */
    async uploadEvidence(periodId, files) {
      this.uploading = true
      this.error = null

      try {
        const formData = new FormData()
        files.forEach(file => {
          formData.append('evidence', file)
        })

        // Use raw axios for file upload to avoid Content-Type override from api interceptor
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
        const token = localStorage.getItem('token')

        const response = await axios.post(
          `${baseURL}/worksheet/upload-evidence/${periodId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              // Let browser set Content-Type with boundary automatically
            },
          }
        )

        this.currentWorksheet = response.data?.data || response.data
        return this.currentWorksheet
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          error.message ||
          'Failed to upload evidence'
        this.error = errorMessage
        throw new Error(errorMessage)
      } finally {
        this.uploading = false
      }
    },

    /**
     * Remove evidence file
     */
    async removeEvidence(periodId, evidenceId) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.delete(`/worksheet/evidence/${periodId}/${evidenceId}`)
        this.currentWorksheet = response.data
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to remove evidence'
        throw error
      } finally {
        this.submitting = false
      }
    },

    // ==================== ADMIN ACTIONS ====================

    /**
     * Fetch worksheets by period (Admin)
     */
    async fetchWorksheetsByPeriod(periodId, filters = {}) {
      this.loading = true
      this.error = null

      try {
        const params = new URLSearchParams()
        if (filters.status) params.append('status', filters.status)
        if (filters.submitted !== undefined) params.append('submitted', filters.submitted)

        const url = `/worksheet/admin/period/${periodId}${params.toString() ? '?' + params.toString() : ''}`
        const response = await api.get(url)
        this.periodWorksheets = response.data || []
        return this.periodWorksheets
      } catch (error) {
        this.error = error.message || 'Failed to fetch worksheets'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Fetch validation statistics (Admin)
     */
    async fetchValidationStats(periodId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/worksheet/admin/period/${periodId}/stats`)
        this.validationStats = response.data
        return this.validationStats
      } catch (error) {
        this.error = error.message || 'Failed to fetch statistics'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Get worksheet detail (Admin)
     */
    async fetchWorksheetDetail(worksheetId) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/worksheet/admin/detail/${worksheetId}`)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to fetch worksheet detail'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Validate worksheet (Admin)
     */
    async validateWorksheet(worksheetId, status, notes = null) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.put(`/worksheet/admin/validate/${worksheetId}`, {
          status,
          notes,
        })

        // Update in periodWorksheets array
        const index = this.periodWorksheets.findIndex(
          w => w.id === worksheetId || w._id === worksheetId
        )
        if (index !== -1) {
          this.periodWorksheets[index] = response.data
        }

        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to validate worksheet'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Run auto-validation for a period (Admin)
     */
    async runAutoValidation(periodId) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.post(`/worksheet/admin/period/${periodId}/auto-validate`)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to run auto-validation'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Send reminder notifications (Admin)
     */
    async sendReminderNotifications(periodId) {
      this.submitting = true
      this.error = null

      try {
        const response = await api.post(`/worksheet/admin/period/${periodId}/send-reminders`)
        return response.data
      } catch (error) {
        this.error = error.message || 'Failed to send reminders'
        throw error
      } finally {
        this.submitting = false
      }
    },

    /**
     * Export worksheet data as JSON
     */
    async exportWorksheetJSON(periodId) {
      try {
        const response = await api.get(`/worksheet/admin/period/${periodId}/export`, {
          responseType: 'blob',
        })

        // Create download link
        const blob = new Blob([response], { type: 'application/json' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `worksheet_period_${periodId}_${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return true
      } catch (error) {
        this.error = error.message || 'Failed to export data'
        throw error
      }
    },

    /**
     * Export worksheet data as CSV
     */
    async exportWorksheetCSV(periodId) {
      try {
        const response = await api.get(`/worksheet/admin/period/${periodId}/export-csv`, {
          responseType: 'blob',
        })

        // Create download link
        const blob = new Blob([response], { type: 'text/csv;charset=utf-8' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `worksheet_period_${periodId}_${Date.now()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        return true
      } catch (error) {
        this.error = error.message || 'Failed to export CSV'
        throw error
      }
    },

    // ==================== UTILITY ====================

    /**
     * Clear error state
     */
    clearError() {
      this.error = null
    },

    /**
     * Reset store state
     */
    $reset() {
      this.periods = []
      this.currentPeriod = null
      this.myWorksheets = []
      this.currentWorksheet = null
      this.periodWorksheets = []
      this.validationStats = null
      this.loading = false
      this.submitting = false
      this.uploading = false
      this.error = null
    },
  },
})
