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
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Get document by ID
 * @param {string} id - Document ID
 * @returns {Promise} Document data
 */
export const getDocumentById = async id => {
  try {
    const response = await api.get(`/document/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Upload new document (Admin only)
 * @param {FormData} formData - Form data with file and metadata
 * @returns {Promise} Created document data
 */
export const uploadDocument = async formData => {
  try {
    const response = await api.post('/document/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 120000, // 2 minutes for large file uploads to Cloudinary
    })
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Update document (Admin only)
 * @param {string} id - Document ID
 * @param {Object} updateData - Data to update
 * @returns {Promise} Updated document data
 */
export const updateDocumentAPI = async (id, updateData) => {
  try {
    const response = await api.put(`/document/${id}`, updateData)
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Delete document (Admin only)
 * @param {string} id - Document ID
 * @returns {Promise} Success message
 */
export const deleteDocument = async id => {
  try {
    const response = await api.delete(`/document/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Restore a deleted document
 * @param {string} id - Document ID
 * @returns {Promise} Restored document data
 */
export const restoreDocument = async id => {
  try {
    const response = await api.put(`/document/${id}/restore`)
    return response
  } catch (error) {
    throw error
  }
}

/**
 * Download document
 * @param {string} id - Document ID or URL
 * @returns {Promise<string>} File URL
 */
export const downloadDocument = async id => {
  try {
    // If id is already a Cloudinary URL, return it directly
    if (typeof id === 'string' && id.startsWith('http')) {
      return id
    }

    // If id looks like a static file URL (starts with /uploads), return absolute URL
    if (typeof id === 'string' && id.startsWith('/uploads')) {
      const absoluteUrl = `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${id}`
      return absoluteUrl
    }

    // If id is a document ID, fetch the download URL from backend
    // Backend returns JSON with fileUrl
    const response = await api.get(`/document/${id}/download`)

    if (response.data && response.data.fileUrl) {
      return response.data.fileUrl
    }

    throw new Error('No fileUrl in response')
  } catch (error) {
    throw error
  }
}

/**
 * Helper function to trigger file download
 * @param {string} id - Document ID
 * @param {string} filename - File name
 */
export const triggerDownload = async (id, filename) => {
  try {
    // If id is already a Cloudinary URL, open directly without calling downloadDocument again
    if (typeof id === 'string' && id.startsWith('http')) {
      window.open(id, '_blank', 'noopener,noreferrer')
      return
    }

    // If id looks like a static file URL (starts with /uploads), handle it
    if (typeof id === 'string' && id.startsWith('/uploads')) {
      const absoluteUrl = `${api.defaults.baseURL.replace(/\/api\/?$/, '')}${id}`
      const link = document.createElement('a')
      link.href = absoluteUrl
      if (filename) link.setAttribute('download', filename)
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // If id is a document ID, fetch the download URL from backend
    const result = await downloadDocument(id)

    // If result is a URL string (Cloudinary), open in new tab
    if (typeof result === 'string' && result.startsWith('http')) {
      window.open(result, '_blank', 'noopener,noreferrer')
      return
    }

    // Otherwise treat as blob
    const blob = result
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
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
  updateDocumentAPI,
  deleteDocument,
  restoreDocument,
  downloadDocument,
  triggerDownload,
}
