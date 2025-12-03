import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 30000, // Increase timeout to 30 seconds for heavy operations like password hashing
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  isRefreshing = false
  failedQueue = []
}

// Request interceptor
api.interceptors.request.use(
  config => {
    // Add auth token if exists
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Set longer timeout for heavy operations like password hashing
    if (config.url?.includes('/password/change')) {
      config.timeout = 60000 // 60 seconds for password change (bcrypt hashing takes time)
    } else if (config.url?.includes('/upload') || config.url?.includes('/import')) {
      config.timeout = 120000 // 120 seconds for file uploads
    } else if (config.url?.includes('/capstone-group/register')) {
      config.timeout = 60000 // 60 seconds for team registration (includes email sending)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response interceptor dengan token refresh
api.interceptors.response.use(
  response => {
    // For blob responses (file downloads), return blob directly
    if (response.data instanceof Blob) {
      return response.data
    }
    return response.data
  },
  error => {
    const originalRequest = error.config

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = localStorage.getItem('refreshToken')

      if (refreshToken) {
        return api
          .post('/auth/refresh', { refreshToken })
          .then(({ data }) => {
            // Extract accessToken from data (new response format)
            const accessToken = data?.accessToken || data?.data?.accessToken
            if (!accessToken) {
              throw new Error('No access token in refresh response')
            }

            localStorage.setItem('token', accessToken)
            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
            processQueue(null, accessToken)
            return api(originalRequest)
          })
          .catch(err => {
            processQueue(err, null)
            // Redirect to login
            localStorage.removeItem('token')
            localStorage.removeItem('refreshToken')
            window.location.href = '/login'
            return Promise.reject(err)
          })
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    // Format error response
    const errorData = error.response?.data || {}
    const errorMessage = errorData.error?.message || errorData.message || error.message
    const errorCode = errorData.error?.code || 'UNKNOWN_ERROR'
    const errorDetails = errorData.error?.details || []

    // Create standardized error object
    const apiError = new Error(errorMessage)
    apiError.code = errorCode
    apiError.status = error.response?.status
    apiError.details = errorDetails
    apiError.originalError = error

    // Log error for debugging
    console.error('API Error:', {
      status: error.response?.status,
      code: errorCode,
      message: errorMessage,
      details: errorDetails,
      url: originalRequest.url,
      method: originalRequest.method,
    })

    return Promise.reject(apiError)
  }
)

export default api
