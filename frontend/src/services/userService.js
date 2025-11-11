import api from './api'

/**
 * User Service
 * Handles all user-related API calls
 */

/**
 * Get all users (Admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.role - Filter by role
 * @param {string} params.learningPath - Filter by learning path
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Users list with pagination
 */
export const getAllUsers = async (params = {}) => {
  try {
    const response = await api.get('/users', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get current user profile
 * @returns {Promise} User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @param {string} profileData.name - User name
 * @param {string} profileData.learningPath - Learning path
 * @param {string} profileData.university - University name
 * @returns {Promise} Updated profile data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/user/profile/update', profileData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Change password
 * @param {Object} passwordData - Password data
 * @param {string} passwordData.currentPassword - Current password
 * @param {string} passwordData.newPassword - New password
 * @returns {Promise} Success message
 */
export const changePassword = async (passwordData) => {
  try {
    const response = await api.put('/user/password/change', passwordData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Upload avatar
 * @param {FormData} formData - Form data with avatar file
 * @returns {Promise} Updated user data with avatar URL
 */
export const uploadAvatar = async (formData) => {
  try {
    const response = await api.post('/user/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export default {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  changePassword,
  uploadAvatar
}
