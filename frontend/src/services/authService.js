import api from './api'

const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { user, token }
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials)
      
      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return response.data
      }
      
      throw new Error('Login failed')
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, learningPath, university }
   * @returns {Promise<Object>} - { user, token }
   */
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData)
      
      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        
        return response.data
      }
      
      throw new Error('Registration failed')
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (error) {
        console.error('Error parsing user data:', error)
        return null
      }
    }
    return null
  },

  /**
   * Get auth token from localStorage
   * @returns {string|null} - Token or null
   */
  getToken() {
    return localStorage.getItem('token')
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken()
  },

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  },

  /**
   * Check if user is student
   * @returns {boolean}
   */
  isStudent() {
    const user = this.getCurrentUser()
    return user?.role === 'student'
  },

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile
   */
  async getProfile() {
    try {
      const response = await api.get('/auth/profile')
      
      if (response.success && response.data) {
        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
      
      throw new Error('Failed to fetch profile')
    } catch (error) {
      throw error.response?.data || error
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Updated user
   */
  async updateProfile(userData) {
    try {
      const response = await api.put('/auth/profile', userData)
      
      if (response.success && response.data) {
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data))
        return response.data
      }
      
      throw new Error('Failed to update profile')
    } catch (error) {
      throw error.response?.data || error
    }
  }
}

export default authService
