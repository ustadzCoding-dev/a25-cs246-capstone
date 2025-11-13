import api from './api'

/**
 * Announcement Service
 * Handles all announcement-related API calls
 */

// ========== GET ANNOUNCEMENTS ==========

/**
 * Get all announcements with optional filters
 * @param {Object} params - Query parameters (priority, search, page, limit)
 * @returns {Promise} Response with announcements array
 */
export const getAnnouncements = async (params = {}) => {
  try {
    const response = await api.get('/announcements', { params })
    return {
      success: true,
      data: response.data.data || []
    }
  } catch (error) {
    console.error('Get announcements error:', error)
    throw error
  }
}

/**
 * Get single announcement by ID
 * @param {String} id - Announcement ID
 * @returns {Promise} Response with announcement data
 */
export const getAnnouncementById = async (id) => {
  try {
    const response = await api.get(`/announcements/${id}`)
    return {
      success: true,
      data: response.data.data
    }
  } catch (error) {
    console.error('Get announcement by ID error:', error)
    throw error
  }
}

// ========== CREATE ANNOUNCEMENT ==========

/**
 * Create new announcement (admin only)
 * @param {Object} announcementData - { title, content, priority }
 * @returns {Promise} Response with created announcement
 */
export const createAnnouncement = async (announcementData) => {
  try {
    const response = await api.post('/announcements', announcementData)
    return {
      success: true,
      data: response.data.data,
      message: 'Pengumuman berhasil dibuat'
    }
  } catch (error) {
    console.error('Create announcement error:', error)
    throw error
  }
}

// ========== UPDATE ANNOUNCEMENT ==========

/**
 * Update announcement (admin only)
 * @param {String} id - Announcement ID
 * @param {Object} announcementData - Updated data
 * @returns {Promise} Response with updated announcement
 */
export const updateAnnouncement = async (id, announcementData) => {
  try {
    const response = await api.put(`/announcements/${id}`, announcementData)
    return {
      success: true,
      data: response.data.data,
      message: 'Pengumuman berhasil diperbarui'
    }
  } catch (error) {
    console.error('Update announcement error:', error)
    throw error
  }
}

// ========== DELETE ANNOUNCEMENT ==========

/**
 * Delete announcement (admin only)
 * @param {String} id - Announcement ID
 * @returns {Promise} Response
 */
export const deleteAnnouncement = async (id) => {
  try {
    await api.delete(`/announcements/${id}`)
    return {
      success: true,
      message: 'Pengumuman berhasil dihapus'
    }
  } catch (error) {
    console.error('Delete announcement error:', error)
    throw error
  }
}

// ========== MARK AS READ ==========

/**
 * Mark announcement as read (student)
 * @param {String} id - Announcement ID
 * @returns {Promise} Response
 */
export const markAnnouncementAsRead = async (id) => {
  try {
    const response = await api.post(`/announcements/${id}/read`)
    return {
      success: true,
      data: response.data.data
    }
  } catch (error) {
    console.error('Mark announcement as read error:', error)
    throw error
  }
}
