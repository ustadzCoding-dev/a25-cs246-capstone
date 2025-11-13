import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as announcementService from '../services/announcementService'

export const useAnnouncementStore = defineStore('announcement', () => {
  // State
  const announcements = ref([])
  const currentAnnouncement = ref(null)
  const announcementsLoading = ref(false)
  const error = ref(null)

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
      error.value = err.message
      throw err
    }
  }

  return {
    // State
    announcements,
    currentAnnouncement,
    announcementsLoading,
    error,
    
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
    markAsRead
  }
})
