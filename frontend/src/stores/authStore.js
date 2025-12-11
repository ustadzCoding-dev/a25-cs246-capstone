import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '../services/authService'

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
   * Login user (LOCAL)
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

  // ========== GOOGLE OAUTH ACTIONS ==========

  /**
   * Login with Google OAuth
   * Redirects to backend Google OAuth endpoint
   */
  function loginWithGoogle() {
    loading.value = true
    error.value = null

    try {
      // Redirect to backend Google OAuth
      authService.initiateGoogleLogin()
    } catch (err) {
      loading.value = false
      error.value = err.message || 'Google login failed'
      throw err
    }
  }

  /**
   * Handle Google OAuth Callback
   * Called from AuthCallback.vue after redirect
   * @param {string} accessToken - Access token from URL
   */
  async function handleGoogleCallback(accessToken) {
    loading.value = true
    error.value = null

    try {
      const data = await authService.handleGoogleCallback(accessToken)

      user.value = data.user
      token.value = data.token

      // NOTE: We no longer fetch fresh user data here as it might override
      // role changes made by the router guard for admin-by-email users
      // The user data from the callback should be sufficient

      return data
    } catch (err) {
      error.value = err.message || 'Failed to complete Google login'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ========== NEW: PROFILE COMPLETION ACTION ==========

  /**
   * Complete profile for Google OAuth users
   * @param {Object} profileData - { learningPath, university }
   */
  async function completeProfile(profileData) {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 Calling completeProfile API with:', profileData)

      const response = await authService.completeProfile(profileData)

      console.log('✅ Profile completion response:', response)

      // Update user data in store and localStorage
      // authService returns { user: userData }
      if (response?.user) {
        user.value = response.user
        localStorage.setItem('user', JSON.stringify(response.user))

        console.log('✅ User data updated in store:', {
          email: user.value.email,
          dicodingId: user.value.dicodingId,
          learningPath: user.value.learningPath,
          university: user.value.university,
        })
      }

      return response
    } catch (err) {
      console.error('❌ Complete profile error:', err)
      error.value = err.message || 'Failed to complete profile'
      throw err
    } finally {
      loading.value = false
    }
  }

  // ========== EXISTING ACTIONS ==========

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
      // authService.getProfile now returns a flat user object
      user.value = data
      // Ensure token in store is still consistent with localStorage
      token.value = token.value || localStorage.getItem('token')
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

  // ========== CRITICAL: RETURN ALL FUNCTIONS ==========
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
    loginWithGoogle,
    handleGoogleCallback,
    completeProfile,
    register,
    logout,
    fetchProfile,
    updateProfile,
    clearError,
    initAuth,
  }
})
