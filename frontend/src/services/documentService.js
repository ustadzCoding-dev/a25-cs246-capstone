import api from './api'

/**
 * Document Service
 * Handles all document-related API calls
 */

/**
 * Get all documents
 * @param {Object} params - Query parameters
 * @param {string} params.category - Filter by category
 * @param {string} params.status - Filter by status
 * @param {string} params.search - Search by title
 * @returns {Promise} Documents list
 */
export const getAllDocuments = async (params = {}) => {
  try {
    const response = await api.get('/documents', { params })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise} Document data
 */
export const getDocumentById = async (id) => {
  try {
    const response = await api.get(`/document/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Upload new document (Admin only)
 * @param {FormData} formData - Form data with file and metadata
 * @returns {Promise} Created document data
 */
export const uploadDocument = async (formData) => {
  try {
    const response = await api.post('/document/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete document (Admin only)
 * @param {string} id - Document ID
 * @returns {Promise} Success message
 */
export const deleteDocument = async (id) => {
  try {
    const response = await api.delete(`/document/${id}/delete`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Download document
 * @param {string} id - Document ID
 * @returns {Promise} File blob
 */
export const downloadDocument = async (id) => {
  try {
    const response = await api.get(`/document/${id}/download`, {
      responseType: 'blob'
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Helper function to trigger file download
 * @param {string} id - Document ID
 * @param {string} filename - File name
 */
export const triggerDownload = async (id, filename) => {
  try {
    const blob = await downloadDocument(id)
    
    // Create blob URL
    const url = window.URL.createObjectURL(blob)
    
    // Create temporary link and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    throw error
  }
}

export default {
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
  downloadDocument,
  triggerDownload
}
