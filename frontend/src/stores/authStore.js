import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isStudent = computed(() => user.value?.role === 'student')
  const userRole = computed(() => user.value?.role || null)
  const userName = computed(() => user.value?.name || '')
  const userEmail = computed(() => user.value?.email || '')

  // Actions
  
  /**
   * Initialize auth state from localStorage
   */
  function initAuth() {
    const storedUser = authService.getCurrentUser()
    const storedToken = authService.getToken()
    
    if (storedUser && storedToken) {
      user.value = storedUser
      token.value = storedToken
    }
  }

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   */
  async function login(credentials) {
    loading.value = true
    error.value = null
    
    try {
      const data = await authService.login(credentials)
      
      user.value = data.user
      token.value = data.token
      
      return data
    } catch (err) {
      error.value = err.message || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, learningPath, university }
   */
  async function register(userData) {
    loading.value = true
    error.value = null
    
    try {
      const data = await authService.register(userData)
      
      user.value = data.user
      token.value = data.token
      
      return data
    } catch (err) {
      error.value = err.message || 'Registration failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Logout user
   */
  function logout() {
    authService.logout()
    user.value = null
    token.value = null
    error.value = null
  }

  /**
   * Get user profile
   */
  async function fetchProfile() {
    loading.value = true
    error.value = null
    
    try {
      const data = await authService.getProfile()
      user.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  async function updateProfile(userData) {
    loading.value = true
    error.value = null
    
    try {
      const data = await authService.updateProfile(userData)
      user.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Failed to update profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Clear error
   */
  function clearError() {
    error.value = null
  }

  // Initialize on store creation
  initAuth()

  return {
    // State
    user,
    token,
    loading,
    error,
    
    // Getters
    isAuthenticated,
    isAdmin,
    isStudent,
    userRole,
    userName,
    userEmail,
    
    // Actions
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearError,
    initAuth
  }
})
