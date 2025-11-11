import api from './api'

/**
 * Learning Group Service
 * Handles all learning group-related API calls
 */

/**
 * Get all learning groups
 * @returns {Promise} Learning groups list
 */
export const getAllLearningGroups = async () => {
  try {
    const response = await api.get('/learning-groups')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get learning group by ID
 * @param {string} id - Learning group ID
 * @returns {Promise} Learning group data
 */
export const getLearningGroupById = async (id) => {
  try {
    const response = await api.get(`/learning-group/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new learning group (Admin only)
 * @param {Object} groupData - Learning group data
 * @returns {Promise} Created learning group data
 */
export const createLearningGroup = async (groupData) => {
  try {
    const response = await api.post('/learning-group/add', groupData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update learning group (Admin only)
 * @param {string} id - Learning group ID
 * @param {Object} groupData - Updated learning group data
 * @returns {Promise} Updated learning group data
 */
export const updateLearningGroup = async (id, groupData) => {
  try {
    const response = await api.put(`/learning-group/update/${id}`, groupData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete learning group (Admin only)
 * @param {string} id - Learning group ID
 * @returns {Promise} Success message
 */
export const deleteLearningGroup = async (id) => {
  try {
    const response = await api.delete(`/learning-group/${id}/delete`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export default {
  getAllLearningGroups,
  getLearningGroupById,
  createLearningGroup,
  updateLearningGroup,
  deleteLearningGroup
}
