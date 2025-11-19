import api from "./api";

const authService = {
  /**
   * Login user (LOCAL - UPDATED UNTUK SISTEM BARU)
   * @param {Object} credentials - { email, password }
   * @returns {Promise<Object>} - { user, token }
   */
  async login(credentials) {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.success && response.data) {
        // ⭐ UBAH: Backend sekarang return 'accessToken' bukan 'token'
        const token = response.data.accessToken || response.data.token;
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        console.log('[AUTH] Login successful:', {
          email: response.data.user.email,
          name: response.data.user.name,
          role: response.data.user.role,
          provider: response.data.user.provider
        });

        return {
          user: response.data.user,
          token: token,
        };
      }

      throw new Error("Login failed");
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, learningPath, university }
   * @returns {Promise<Object>} - { user, token }
   */
  async register(userData) {
    try {
      const response = await api.post("/auth/register", userData);

      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        return response.data;
      }

      throw new Error("Registration failed");
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // ========== GOOGLE OAUTH FUNCTIONS ==========

  /**
   * Initiate Google OAuth Login
   * Redirects user to backend Google OAuth endpoint
   */
  initiateGoogleLogin() {
    const googleAuthUrl =
      import.meta.env.VITE_GOOGLE_AUTH_URL ||
      "http://localhost:8000/api/auth/google";
    window.location.href = googleAuthUrl;
  },

  /**
   * Handle Google OAuth Callback
   * Called after redirect from backend with token in URL
   * @param {string} token - Access token from URL query
   * @returns {Promise<Object>} - User data
   */
  async handleGoogleCallback(token) {
    try {
      // Store token
      localStorage.setItem("token", token);

      // Fetch user profile using the token
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        const userData = response.data.user || response.data;

        // Store user data
        localStorage.setItem("user", JSON.stringify(userData));

        return {
          user: userData,
          token: token,
        };
      }

      throw new Error("Failed to fetch user profile");
    } catch (error) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      throw error.response?.data || error;
    }
  },

  // ========== NEW: PROFILE COMPLETION FUNCTION ==========

  /**
   * Complete profile for Google OAuth users
   * @param {Object} profileData - { learningPath, university }
   * @returns {Promise<Object>} - Updated user data
   */
  async completeProfile(profileData) {
    try {
      console.log("📤 Sending complete profile request:", profileData);

      const response = await api.post("/auth/complete-profile", profileData);

      console.log("📥 Complete profile response:", response);

      if (response.success && response.data) {
        const userData = response.data.user;

        // Update user in localStorage
        localStorage.setItem("user", JSON.stringify(userData));

        return {
          user: userData,
        };
      }

      throw new Error(response.message || "Failed to complete profile");
    } catch (error) {
      console.error("❌ Complete profile service error:", error);

      // Better error handling
      if (error.response?.data) {
        throw new Error(
          error.response.data.message || "Failed to complete profile"
        );
      }

      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} - User object or null
   */
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  },

  /**
   * Get auth token from localStorage
   * @returns {string|null} - Token or null
   */
  getToken() {
    return localStorage.getItem("token");
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.getToken();
  },

  /**
   * Check if user is admin
   * @returns {boolean}
   */
  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  },

  /**
   * Check if user is student
   * @returns {boolean}
   */
  isStudent() {
    const user = this.getCurrentUser();
    return user?.role === "student";
  },

  /**
   * Get user profile
   * @returns {Promise<Object>} - User profile
   */
  async getProfile() {
    try {
      const response = await api.get("/user/profile");

      if (response.success && response.data) {
        // Update localStorage with fresh data
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }

      throw new Error("Failed to fetch profile");
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} - Updated user
   */
  async updateProfile(userData) {
    try {
      const response = await api.put("/user/profile/update", userData);

      if (response.success && response.data) {
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }

      throw new Error("Failed to update profile");
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default authService;
