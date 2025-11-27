import axios from 'axios'
import api from './api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/**
 * Upload profile picture ke server
 * @param {File} file - File object dari input
 * @returns {Promise<Object>} - Response dari server dengan URL foto
 */
export const uploadProfilePicture = async file => {
  const formData = new FormData()
  formData.append('profilePicture', file)

  try {
    // use shared `api` instance so Authorization header and refresh logic applies
    const response = await api.post(`/user/profile-picture/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message }
  }
}

/**
 * Delete profile picture dari server
 * @returns {Promise<Object>} - Response dari server
 */
export const deleteProfilePicture = async () => {
  try {
    // Use shared api instance to include Authorization header
    const response = await api.delete(`/user/profile-picture/delete`)
    return response
  } catch (error) {
    throw error.response?.data || { success: false, message: error.message }
  }
}
