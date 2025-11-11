import api from './api'

/**
 * Timeline Service
 * Handles all timeline-related API calls
 */

/**
 * Get all timelines
 * @returns {Promise} Timelines list
 */
export const getAllTimelines = async () => {
  try {
    const response = await api.get('/timelines')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get upcoming timelines
 * @returns {Promise} Upcoming timelines list
 */
export const getUpcomingTimelines = async () => {
  try {
    const response = await api.get('/timelines/upcoming')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get overdue timelines
 * @returns {Promise} Overdue timelines list
 */
export const getOverdueTimelines = async () => {
  try {
    const response = await api.get('/timelines/overdue')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new timeline (Admin only)
 * @param {Object} timelineData - Timeline data
 * @param {string} timelineData.title - Timeline title
 * @param {string} timelineData.description - Timeline description
 * @param {string} timelineData.date - Timeline date
 * @param {string} timelineData.type - Timeline type
 * @returns {Promise} Created timeline data
 */
export const createTimeline = async (timelineData) => {
  try {
    const response = await api.post('/timeline/add', timelineData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update timeline (Admin only)
 * @param {string} id - Timeline ID
 * @param {Object} timelineData - Updated timeline data
 * @returns {Promise} Updated timeline data
 */
export const updateTimeline = async (id, timelineData) => {
  try {
    const response = await api.put(`/timeline/update/${id}`, timelineData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete timeline (Admin only)
 * @param {string} id - Timeline ID
 * @returns {Promise} Success message
 */
export const deleteTimeline = async (id) => {
  try {
    const response = await api.delete(`/timeline/${id}/delete`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export default {
  getAllTimelines,
  getUpcomingTimelines,
  getOverdueTimelines,
  createTimeline,
  updateTimeline,
  deleteTimeline
}
