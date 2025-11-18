import { ref } from 'vue'

/**
 * Composable untuk handle async actions dengan loading dan error states
 * @param {Function} asyncFn - Async function to execute
 * @param {Object} options - Configuration options
 * @returns {Object} - Loading, error, execute function
 */
export const useAsyncAction = (asyncFn, options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    resetErrorDelay = 5000
  } = options

  const loading = ref(false)
  const error = ref(null)
  const errorCode = ref(null)
  const errorDetails = ref([])
  const data = ref(null)

  const execute = async (...args) => {
    loading.value = true
    error.value = null
    errorCode.value = null
    errorDetails.value = []

    try {
      const result = await asyncFn(...args)
      data.value = result

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      error.value = err.message || 'An error occurred'
      errorCode.value = err.code || 'UNKNOWN_ERROR'
      errorDetails.value = err.details || []

      if (onError) {
        onError(err)
      }

      // Auto-clear error after delay
      if (resetErrorDelay > 0) {
        setTimeout(() => {
          error.value = null
          errorCode.value = null
          errorDetails.value = []
        }, resetErrorDelay)
      }

      throw err
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
    errorCode.value = null
    errorDetails.value = []
  }

  const reset = () => {
    loading.value = false
    error.value = null
    errorCode.value = null
    errorDetails.value = []
    data.value = null
  }

  return {
    loading,
    error,
    errorCode,
    errorDetails,
    data,
    execute,
    clearError,
    reset
  }
}

export default useAsyncAction
