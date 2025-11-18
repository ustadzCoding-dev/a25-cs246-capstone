import api from './api'

/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

/**
 * Get admin dashboard statistics
 * @returns {Promise} Dashboard stats data
 */
export const getAdminDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/stats')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get student dashboard statistics
 * @returns {Promise} Student dashboard stats data
 */
export const getStudentDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard/student-stats')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export default {
  getAdminDashboardStats,
  getStudentDashboardStats
}
