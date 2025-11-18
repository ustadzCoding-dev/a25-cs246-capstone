import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Base Store Mixin untuk semua stores
 * Menyediakan common state management untuk loading, error, dan retry logic
 */

export const useBaseStore = () => {
  // Loading states
  const loading = ref(false)
  const loadingMessage = ref('')

  // Error states
  const error = ref(null)
  const errorCode = ref(null)
  const errorDetails = ref([])

  // Retry logic
  const retryCount = ref(0)
  const maxRetries = ref(3)

  /**
   * Set loading state
   */
  const setLoading = (isLoading, message = '') => {
    loading.value = isLoading
    loadingMessage.value = message
  }

  /**
   * Set error state
   */
  const setError = (errorMessage, code = 'UNKNOWN_ERROR', details = []) => {
    error.value = errorMessage
    errorCode.value = code
    errorDetails.value = details
  }

  /**
   * Clear error state
   */
  const clearError = () => {
    error.value = null
    errorCode.value = null
    errorDetails.value = []
  }

  /**
   * Handle API error response
   */
  const handleError = (errorResponse) => {
    if (errorResponse.error) {
      setError(
        errorResponse.error.message,
        errorResponse.error.code,
        errorResponse.error.details || []
      )
    } else if (errorResponse.message) {
      setError(errorResponse.message)
    } else {
      setError('An unexpected error occurred')
    }
  }

  /**
   * Retry logic untuk failed requests
   */
  const canRetry = computed(() => retryCount.value < maxRetries.value)

  const incrementRetry = () => {
    retryCount.value++
  }

  const resetRetry = () => {
    retryCount.value = 0
  }

  /**
   * Async action wrapper dengan error handling
   */
  const executeAction = async (action, actionName = 'Action') => {
    try {
      setLoading(true, `${actionName}...`)
      clearError()
      resetRetry()

      const result = await action()

      setLoading(false)
      return result
    } catch (err) {
      handleError(err.response?.data || err)
      setLoading(false)
      throw err
    }
  }

  return {
    // State
    loading,
    loadingMessage,
    error,
    errorCode,
    errorDetails,
    retryCount,
    maxRetries,

    // Methods
    setLoading,
    setError,
    clearError,
    handleError,
    incrementRetry,
    resetRetry,
    executeAction,

    // Computed
    canRetry
  }
}
