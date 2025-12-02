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
    // API interceptor returns response.data which is: { success, data: [...teams], meta: { pagination } }
    return response
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get team by ID
 * @param {string} id - Team ID
 * @returns {Promise} Team data
 */
export const getTeamById = async id => {
  try {
    const response = await api.get(`/capstone-group/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get current user's team (Student only)
 * @returns {Promise} Current team data or null if no team
 */
export const getCurrentTeam = async () => {
  try {
    const response = await api.get('/capstone-group/current')
    return response.data
  } catch (error) {
    // If no team found, return success with null data
    if (error.response?.status === 404) {
      return { success: true, data: null }
    }
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
export const createTeam = async teamData => {
  try {
    console.log('[teamService.createTeam] Sending request:', teamData)
    const response = await api.post('/capstone-group/register', teamData)
    // API interceptor returns response.data directly
    // response = { success, message, data, requestId, timestamp }
    console.log('[teamService.createTeam] Response:', response)
    return response
  } catch (error) {
    console.error('[teamService.createTeam] Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.details,
    })

    // Error is already formatted by API interceptor
    // Just re-throw it so it propagates to the component
    throw error
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
 * Edit pending team (Leader only)
 * @param {string} id - Team ID
 * @param {Object} teamData - Team data to update
 * @param {string} teamData.teamName - Team name (optional)
 * @param {Array<string>} teamData.membersUserId - New members list
 * @returns {Promise} Updated team with changes summary
 */
export const editTeam = async (id, teamData) => {
  try {
    console.log('[teamService.editTeam] Sending request:', { id, teamData })
    const response = await api.put(`/capstone-group/${id}/edit`, teamData)
    console.log('[teamService.editTeam] Response:', response.data)
    return response.data
  } catch (error) {
    console.error('[teamService.editTeam] Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      requestData: teamData,
    })

    // Extract meaningful error message
    const errorData = error.response?.data
    if (errorData) {
      const errorMessage = errorData.error?.message || errorData.message || 'Failed to edit team'
      const err = new Error(errorMessage)
      err.code = errorData.error?.code || 'EDIT_TEAM_ERROR'
      err.details = errorData.error?.details || []
      err.status = error.response?.status
      throw err
    }
    throw error
  }
}

/**
 * Delete team (Admin only)
 * @param {string} id - Team ID
 * @returns {Promise} Success message
 */
export const deleteTeam = async id => {
  try {
    const response = await api.delete(`/capstone-group/${id}`)
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
    // API interceptor returns response.data directly
    // If response is array, wrap it in success object
    if (Array.isArray(response)) {
      return { success: true, data: response }
    }
    // If response already has success field, return as is
    return response
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get use case by ID
 * @param {string} id - Use case ID
 * @returns {Promise} Use case data
 */
export const getUseCaseById = async id => {
  try {
    const response = await api.get(`/usecase/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Remove team member (Admin only)
 * @param {string} teamId - Team ID
 * @param {string} memberId - Member ID to remove
 * @returns {Promise} Updated team data
 */
export const removeTeamMember = async (teamId, memberId) => {
  try {
    console.log('[teamService.removeTeamMember] Removing member:', { teamId, memberId })
    const response = await api.put(`/capstone-group/${teamId}/remove-member`, { memberId })
    console.log('[teamService.removeTeamMember] Response:', response)
    return response
  } catch (error) {
    console.error('[teamService.removeTeamMember] Error:', error)
    throw error
  }
}

/**
 * Replace team member (Admin only)
 * @param {string} teamId - Team ID
 * @param {string} oldMemberId - Member ID to replace
 * @param {string} newMemberId - New member ID
 * @returns {Promise} Updated team data
 */
export const replaceTeamMember = async (teamId, oldMemberId, newMemberId) => {
  try {
    console.log('[teamService.replaceTeamMember] Replacing member:', { teamId, oldMemberId, newMemberId })
    const response = await api.put(`/capstone-group/${teamId}/replace-member`, {
      oldMemberId,
      newMemberId
    })
    console.log('[teamService.replaceTeamMember] Response:', response)
    return response
  } catch (error) {
    console.error('[teamService.replaceTeamMember] Error:', error)
    throw error
  }
}

/**
 * Bulk approve teams (Admin only)
 * @param {Array} teamIds - Array of team IDs
 * @returns {Promise} Result data
 */
export const bulkApproveTeams = async (teamIds) => {
  try {
    console.log('[teamService.bulkApproveTeams] Approving teams:', teamIds)
    const response = await api.post('/capstone-group/bulk-approve', { teamIds })
    console.log('[teamService.bulkApproveTeams] Response:', response)
    return response
  } catch (error) {
    console.error('[teamService.bulkApproveTeams] Error:', error)
    throw error
  }
}

/**
 * Bulk reject teams (Admin only)
 * @param {Array} teamIds - Array of team IDs
 * @param {string} reason - Rejection reason
 * @returns {Promise} Result data
 */
export const bulkRejectTeams = async (teamIds, reason) => {
  try {
    console.log('[teamService.bulkRejectTeams] Rejecting teams:', { teamIds, reason })
    const response = await api.post('/capstone-group/bulk-reject', { teamIds, reason })
    console.log('[teamService.bulkRejectTeams] Response:', response)
    return response
  } catch (error) {
    console.error('[teamService.bulkRejectTeams] Error:', error)
    throw error
  }
}

/**
 * Bulk delete teams (Admin only)
 * @param {Array} teamIds - Array of team IDs
 * @returns {Promise} Result data
 */
export const bulkDeleteTeams = async (teamIds) => {
  try {
    console.log('[teamService.bulkDeleteTeams] Deleting teams:', teamIds)
    const response = await api.post('/capstone-group/bulk-delete', { teamIds })
    console.log('[teamService.bulkDeleteTeams] Response:', response)
    return response
  } catch (error) {
    console.error('[teamService.bulkDeleteTeams] Error:', error)
    throw error
  }
}

/**
 * Export teams to CSV (Admin only)
 * @param {Object} filters - Filter options
 * @returns {Promise} CSV file blob
 */
export const exportTeamsCSV = async (filters = {}) => {
  try {
    console.log('[teamService.exportTeamsCSV] Exporting with filters:', filters)
    const response = await api.get('/capstone-group/export-csv', { params: filters })
    console.log('[teamService.exportTeamsCSV] Response received')
    return response
  } catch (error) {
    console.error('[teamService.exportTeamsCSV] Error:', error)
    throw error
  }
}

export default {
  getAllTeams,
  getTeamById,
  getCurrentTeam,
  createTeam,
  updateTeam,
  approveTeam,
  rejectTeam,
  editTeam,
  deleteTeam,
  getAllUseCases,
  getUseCaseById,
  removeTeamMember,
  replaceTeamMember,
  bulkApproveTeams,
  bulkRejectTeams,
  bulkDeleteTeams,
  exportTeamsCSV,
}
