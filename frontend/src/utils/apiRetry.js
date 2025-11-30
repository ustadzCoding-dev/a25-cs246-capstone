/**
 * Retry utility for API calls with exponential backoff
 */

/**
 * Retry an async function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delay - Initial delay in ms
 * @param {Function} shouldRetry - Function to determine if retry should be attempted
 * @returns {Promise<any>} - Result of the function call
 */
export async function retryWithBackoff(fn, retries = 3, delay = 1000, shouldRetry = () => true) {
  let lastError;

  for (let i = 0; i <= retries; i++) {
    try {
      const result = await fn();
      return result;
    } catch (error) {
      lastError = error;

      // If this is the last attempt or shouldRetry returns false, don't retry
      if (i === retries || !shouldRetry(error)) {
        throw error;
      }

      // Exponential backoff with jitter
      const backoffDelay = delay * Math.pow(2, i) + Math.random() * 1000;
      console.log(`Attempt ${i + 1} failed. Retrying in ${backoffDelay}ms...`, error.message);

      await new Promise(resolve => setTimeout(resolve, backoffDelay));
    }
  }

  throw lastError;
}

/**
 * Default retry condition - retry on network errors and 5xx server errors
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether to retry the request
 */
export function shouldRetryRequest(error) {
  // Network errors (no response)
  if (!error.response) {
    return true;
  }

  // Server errors (5xx)
  if (error.response.status >= 500 && error.response.status < 600) {
    return true;
  }

  // Gateway errors
  if (error.response.status === 408 || error.response.status === 429) {
    return true;
  }

  return false;
}

/**
 * Enhanced API call with automatic retry
 * @param {Function} apiCall - The API call function (e.g., api.get, api.post)
 * @param {any[]} args - Arguments to pass to the API call
 * @param {Object} options - Retry options
 * @returns {Promise<any>} - Result of the API call
 */
export async function apiCallWithRetry(apiCall, args, options = {}) {
  const {
    retries = 3,
    delay = 1000,
    shouldRetry = shouldRetryRequest
  } = options;

  return retryWithBackoff(
    () => apiCall(...args),
    retries,
    delay,
    shouldRetry
  );
}
