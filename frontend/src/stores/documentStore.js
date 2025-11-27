import { defineStore } from 'pinia'
import * as documentService from '../services/documentService'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    // Documents data
    documents: [],
    currentDocument: null,

    // Pagination
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    },

    // Loading states
    loading: false,
    documentsLoading: false,
    uploadLoading: false,
    downloadLoading: false,
    actionLoading: null,

    // Error handling
    error: null,
    errorCode: null,
    errorDetails: [],
    lastError: null,
    successMessage: null,
  }),

  getters: {
    // Get documents by category
    getDocumentsByCategory: state => category => {
      return state.documents.filter(doc => doc.category === category)
    },

    // Get documents by status
    getDocumentsByStatus: state => status => {
      return state.documents.filter(doc => doc.status === status)
    },

    // Document categories
    categories: state => {
      const cats = state.documents.map(doc => doc.category)
      return [...new Set(cats)]
    },
  },

  actions: {
    /**
     * Fetch all documents
     */
    async fetchDocuments(params = {}) {
      this.documentsLoading = true
      this.error = null

      try {
        const response = await documentService.getAllDocuments(params)
        console.log('=== fetchDocuments response ===', response)

        if (response.success) {
          this.documents = response.data
          console.log('Documents updated:', this.documents)
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch documents'
        console.error('fetchDocuments error:', error)
        throw error
      } finally {
        this.documentsLoading = false
      }
    },

    /**
     * Fetch document by ID
     */
    async fetchDocumentById(id) {
      this.loading = true
      this.error = null

      try {
        const response = await documentService.getDocumentById(id)

        if (response.success) {
          this.currentDocument = response.data
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch document'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Upload new document (Admin)
     */
    async uploadDocument(formData) {
      this.uploadLoading = true
      this.error = null
      this.errorDetails = []

      try {
        const response = await documentService.uploadDocument(formData)

        if (response.success) {
          this.documents.unshift(response.data)
        }

        return response
      } catch (error) {
        // Handle validation errors from backend
        if (error.error?.details) {
          this.errorDetails = error.error.details
          this.error = error.error.message || 'Validation failed'
        } else {
          this.error = error.message || 'Failed to upload document'
        }
        throw error
      } finally {
        this.uploadLoading = false
      }
    },

    /**
     * Update document (Admin)
     */
    async updateDocument(id, updateData) {
      this.loading = true
      this.error = null

      try {
        const response = await documentService.updateDocumentAPI(id, updateData)

        if (response.success) {
          // Update in documents list
          const index = this.documents.findIndex(doc => doc.id === id || doc._id === id)
          if (index !== -1) {
            this.documents[index] = response.data
          }

          // Update current document if it's the same
          if (this.currentDocument?.id === id || this.currentDocument?._id === id) {
            this.currentDocument = response.data
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to update document'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Delete document (Admin)
     */
    async deleteDocument(id) {
      this.loading = true
      this.error = null

      try {
        const response = await documentService.deleteDocument(id)

        if (response.success) {
          // Remove from documents list
          this.documents = this.documents.filter(doc => doc.id !== id)

          // Clear current document if it's the same
          if (this.currentDocument?.id === id) {
            this.currentDocument = null
          }
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to delete document'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Restore a deleted document (Admin)
     */
    async restoreDocument(id) {
      this.loading = true
      this.error = null

      try {
        const response = await documentService.restoreDocument(id)

        if (response.success) {
          // Add restored document back to list
          this.documents.unshift(response.data)
        }

        return response
      } catch (error) {
        this.error = error.message || 'Failed to restore document'
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Download document
     */
    async downloadDocument(id, filename) {
      this.downloadLoading = true
      this.error = null

      try {
        // If `id` looks like a Mongo ObjectId, fetch the document first to obtain
        // the canonical `fileUrl`/`fileName` stored on the server. This avoids
        // requesting an incorrect static path when the frontend has stale data.
        const isObjectId = typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)

        if (isObjectId) {
          try {
            const docResp = await documentService.getDocumentById(id)
            if (docResp?.success && docResp.data) {
              const doc = docResp.data
              const fileUrl = doc.fileUrl || null
              const fileName = doc.fileName || filename

              if (fileUrl) {
                await documentService.triggerDownload(fileUrl, fileName)
                return { success: true, message: 'Document downloaded successfully' }
              }
            }
          } catch (err) {
            // If fetching document failed, fall back to direct trigger
            console.warn('Failed to fetch document record for download fallback', err)
          }
        }

        await documentService.triggerDownload(id, filename)
        return { success: true, message: 'Document downloaded successfully' }
      } catch (error) {
        this.error = error.message || 'Failed to download document'
        throw error
      } finally {
        this.downloadLoading = false
      }
    },

    /**
     * Handle error with detailed tracking
     */
    setError(error, actionName = 'unknown') {
      this.error = error.message || 'An error occurred'
      this.errorCode = error.code || 'UNKNOWN_ERROR'
      this.errorDetails = error.details || []
      this.lastError = {
        action: actionName,
        error: error,
        timestamp: new Date().toISOString(),
      }
    },

    /**
     * Set success message
     */
    setSuccess(message) {
      this.successMessage = message
      this.error = null
      setTimeout(() => {
        this.successMessage = null
      }, 3000)
    },

    /**
     * Clear error
     */
    clearError() {
      this.error = null
      this.errorCode = null
      this.errorDetails = []
    },

    /**
     * Clear success message
     */
    clearSuccess() {
      this.successMessage = null
    },

    /**
     * Reset store
     */
    reset() {
      this.documents = []
      this.currentDocument = null
      this.pagination = {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      }
      this.loading = false
      this.documentsLoading = false
      this.uploadLoading = false
      this.downloadLoading = false
      this.actionLoading = null
      this.error = null
      this.errorCode = null
      this.errorDetails = []
      this.lastError = null
      this.successMessage = null
    },
  },
})
