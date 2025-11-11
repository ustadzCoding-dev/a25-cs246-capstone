import api from './api'

/**
 * Team Service
 * Handles all team-related API calls
 */

/**
 * Get all teams (Admin only)
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (pending, approved, rejected)
 * @param {string} params.search - Search by team name
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @returns {Promise} Teams data with pagination
 */
export const getAllTeams = async (params = {}) => {
  try {
    const response = await api.get('/capstone-groups', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get team by ID
 * @param {string} id - Team ID
 * @returns {Promise} Team data
 */
export const getTeamById = async (id) => {
  try {
    const response = await api.get(`/capstone-group/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new team (Student only)
 * @param {Object} teamData - Team data
 * @param {string} teamData.teamName - Team name
 * @param {string} teamData.useCaseId - Use case ID
 * @param {Array} teamData.members - Array of team members
 * @returns {Promise} Created team data
 */
export const createTeam = async (teamData) => {
  try {
    const response = await api.post('/capstone-group/add', teamData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update team
 * @param {string} id - Team ID
 * @param {Object} teamData - Updated team data
 * @returns {Promise} Updated team data
 */
export const updateTeam = async (id, teamData) => {
  try {
    const response = await api.put(`/capstone-group/update/${id}`, teamData)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Approve team (Admin only)
 * @param {string} id - Team ID
 * @param {string} reason - Approval reason (optional)
 * @returns {Promise} Updated team data
 */
export const approveTeam = async (id, reason = '') => {
  try {
    const response = await api.put(`/capstone-group/${id}/approve`, { reason })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Reject team (Admin only)
 * @param {string} id - Team ID
 * @param {string} reason - Rejection reason
 * @returns {Promise} Updated team data
 */
export const rejectTeam = async (id, reason) => {
  try {
    const response = await api.put(`/capstone-group/${id}/reject`, { reason })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete team (Admin only)
 * @param {string} id - Team ID
 * @returns {Promise} Success message
 */
export const deleteTeam = async (id) => {
  try {
    const response = await api.delete(`/capstone-group/${id}/delete`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get all use cases
 * @returns {Promise} Use cases list
 */
export const getAllUseCases = async () => {
  try {
    const response = await api.get('/usecases')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get use case by ID
 * @param {string} id - Use case ID
 * @returns {Promise} Use case data
 */
export const getUseCaseById = async (id) => {
  try {
    const response = await api.get(`/usecase/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export default {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  approveTeam,
  rejectTeam,
  deleteTeam,
  getAllUseCases,
  getUseCaseById
}
