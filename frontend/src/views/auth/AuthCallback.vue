<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <!-- Loading Spinner -->
      <div v-if="loading" class="space-y-4">
        <div
          class="inline-block animate-spin rounded-full h-16 w-16 border-4 border-primary-500 border-t-transparent"
        ></div>
        <p class="text-lg text-gray-700">Memproses login Google...</p>
        <p class="text-sm text-gray-500">Mohon tunggu sebentar</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="space-y-4">
        <div class="bg-danger-50 rounded-full p-4 inline-block">
          <svg
            class="w-16 h-16 text-danger-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Login Gagal</h2>
        <p class="text-gray-600 max-w-md">{{ error }}</p>
        <div class="pt-4">
          <router-link
            to="/login"
            class="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Kembali ke Login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref("");

onMounted(async () => {
  try {
    // Get token from URL query parameter
    const token = route.query.token;

    if (!token) {
      throw new Error("Token tidak ditemukan. Silakan coba login lagi.");
    }

    // Handle Google callback in store
    await authStore.handleGoogleCallback(token);

    // Redirect based on user role
    const redirectPath = authStore.isAdmin ? "/admin/dashboard" : "/dashboard";

    // Small delay for better UX
    setTimeout(() => {
      router.replace(redirectPath);
    }, 500);
  } catch (err) {
    console.error("Google callback error:", err);
    error.value = err.message || "Terjadi kesalahan saat login dengan Google";
    loading.value = false;
  }
});
</script>
