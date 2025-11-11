import { defineStore } from 'pinia'
import * as documentService from '../services/documentService'

export const useDocumentStore = defineStore('document', {
  state: () => ({
    // Documents data
    documents: [],
    currentDocument: null,
    
    // Loading states
    loading: false,
    documentsLoading: false,
    uploadLoading: false,
    downloadLoading: false,
    
    // Error handling
    error: null
  }),

  getters: {
    // Get documents by category
    getDocumentsByCategory: (state) => (category) => {
      return state.documents.filter(doc => doc.category === category)
    },
    
    // Get documents by status
    getDocumentsByStatus: (state) => (status) => {
      return state.documents.filter(doc => doc.status === status)
    },
    
    // Document categories
    categories: (state) => {
      const cats = state.documents.map(doc => doc.category)
      return [...new Set(cats)]
    }
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
        
        if (response.success) {
          this.documents = response.data
        }
        
        return response
      } catch (error) {
        this.error = error.message || 'Failed to fetch documents'
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
      
      try {
        const response = await documentService.uploadDocument(formData)
        
        if (response.success) {
          this.documents.unshift(response.data)
        }
        
        return response
      } catch (error) {
        this.error = error.message || 'Failed to upload document'
        throw error
      } finally {
        this.uploadLoading = false
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
     * Download document
     */
    async downloadDocument(id, filename) {
      this.downloadLoading = true
      this.error = null
      
      try {
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
     * Clear error
     */
    clearError() {
      this.error = null
    },

    /**
     * Reset store
     */
    reset() {
      this.documents = []
      this.currentDocument = null
      this.loading = false
      this.documentsLoading = false
      this.uploadLoading = false
      this.downloadLoading = false
      this.error = null
    }
  }
})
