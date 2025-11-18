import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as announcementService from '../services/announcementService'

export const useAnnouncementStore = defineStore('announcement', () => {
  // State
  const announcements = ref([])
  const currentAnnouncement = ref(null)
  const announcementsLoading = ref(false)
  const loading = ref(false)
  const actionLoading = ref(null)

  // Pagination
  const pagination = ref({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0
  })

  // Error handling
  const error = ref(null)
  const errorCode = ref(null)
  const errorDetails = ref([])
  const lastError = ref(null)
  const successMessage = ref(null)

  // Getters
  const importantAnnouncements = computed(() =>
    announcements.value.filter(a => a.priority === 'important')
  )

  const normalAnnouncements = computed(() =>
    announcements.value.filter(a => a.priority === 'normal')
  )

  const unreadAnnouncements = computed(() =>
    announcements.value.filter(a => !a.isRead)
  )

  // Actions
  const fetchAnnouncements = async (params = {}) => {
    announcementsLoading.value = true
    error.value = null

    try {
      const response = await announcementService.getAnnouncements(params)
      announcements.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      announcementsLoading.value = false
    }
  }

  const fetchAnnouncementById = async (id) => {
    announcementsLoading.value = true
    error.value = null

    try {
      const response = await announcementService.getAnnouncementById(id)
      currentAnnouncement.value = response.data
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      announcementsLoading.value = false
    }
  }

  const createAnnouncement = async (announcementData) => {
    error.value = null

    try {
      const response = await announcementService.createAnnouncement(announcementData)
      announcements.value.unshift(response.data)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateAnnouncement = async (id, announcementData) => {
    error.value = null

    try {
      const response = await announcementService.updateAnnouncement(id, announcementData)
      const index = announcements.value.findIndex(a => a._id === id || a.id === id)
      if (index !== -1) {
        announcements.value[index] = response.data
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const deleteAnnouncement = async (id) => {
    error.value = null

    try {
      const response = await announcementService.deleteAnnouncement(id)
      announcements.value = announcements.value.filter(a => a._id !== id && a.id !== id)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const markAsRead = async (id) => {
    error.value = null

    try {
      const response = await announcementService.markAnnouncementAsRead(id)
      const index = announcements.value.findIndex(a => a._id === id || a.id === id)
      if (index !== -1) {
        announcements.value[index].isRead = true
      }
      return response
    } catch (err) {
      setError(err, 'markAsRead')
      throw err
    }
  }

  // Helper methods for error handling
  const setError = (err, actionName = 'unknown') => {
    error.value = err.message || 'An error occurred'
    errorCode.value = err.code || 'UNKNOWN_ERROR'
    errorDetails.value = err.details || []
    lastError.value = {
      action: actionName,
      error: err,
      timestamp: new Date().toISOString()
    }
  }

  const setSuccess = (message) => {
    successMessage.value = message
    error.value = null
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  }

  const clearError = () => {
    error.value = null
    errorCode.value = null
    errorDetails.value = []
  }

  const clearSuccess = () => {
    successMessage.value = null
  }

  const reset = () => {
    announcements.value = []
    currentAnnouncement.value = null
    announcementsLoading.value = false
    loading.value = false
    actionLoading.value = null
    pagination.value = {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    }
    error.value = null
    errorCode.value = null
    errorDetails.value = []
    lastError.value = null
    successMessage.value = null
  }

  return {
    // State
    announcements,
    currentAnnouncement,
    announcementsLoading,
    loading,
    actionLoading,
    pagination,
    error,
    errorCode,
    errorDetails,
    lastError,
    successMessage,

    // Getters
    importantAnnouncements,
    normalAnnouncements,
    unreadAnnouncements,

    // Actions
    fetchAnnouncements,
    fetchAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    markAsRead,

    // Helper methods
    setError,
    setSuccess,
    clearError,
    clearSuccess,
    reset
  }
})
