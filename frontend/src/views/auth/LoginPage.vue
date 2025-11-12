<template>
  <AuthLayout>
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Masuk</h2>
        <p class="mt-2 text-sm text-gray-600">
          Masuk ke akun Anda untuk melanjutkan
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
      >
        <p class="text-sm text-danger-700">{{ error }}</p>
      </div>

      <!-- OAuth Error from URL -->
      <div
        v-if="oauthError"
        class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
      >
        <p class="text-sm text-danger-700">
          {{ getOAuthErrorMessage(oauthError) }}
        </p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Email -->
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="nama@example.com"
          :error="errors.email"
          required
        />

        <!-- Password -->
        <BasePasswordInput
          v-model="form.password"
          label="Password"
          placeholder="Masukkan password"
          :error="errors.password"
          required
        />

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <BaseCheckbox v-model="form.rememberMe" label="Ingat saya" />
          <a
            href="#"
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Lupa password?
          </a>
        </div>

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          :disabled="loading"
          full-width
        >
          {{ loading ? "Memproses..." : "Masuk" }}
        </BaseButton>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Atau masuk dengan</span>
          </div>
        </div>

        <!-- Google Sign In -->
        <GoogleButton
          text="Masuk dengan Google"
          :loading="googleLoading"
          @click="handleGoogleLogin"
        />

        <!-- Sign Up Link -->
        <p class="text-center text-sm text-gray-600">
          Belum punya akun?
          <router-link
            to="/signup"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Daftar sekarang
          </router-link>
        </p>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/authStore";
import AuthLayout from "../../components/layout/AuthLayout.vue";
import BaseInput from "../../components/base/BaseInput.vue";
import BasePasswordInput from "../../components/base/BasePasswordInput.vue";
import BaseCheckbox from "../../components/base/BaseCheckbox.vue";
import BaseButton from "../../components/base/BaseButton.vue";
import GoogleButton from "../../components/display/GoogleButton.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const loading = ref(false);
const googleLoading = ref(false);
const error = ref("");
const oauthError = ref("");

const form = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const errors = reactive({
  email: "",
  password: "",
});

// Check for OAuth errors in URL
onMounted(() => {
  if (route.query.error) {
    oauthError.value = route.query.error;
    // Clean URL without reload
    router.replace({ name: "login" });
  }
});

const getOAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    auth_failed: "Login dengan Google gagal. Silakan coba lagi.",
    email_already_exists:
      "Email sudah terdaftar dengan metode login lain. Gunakan password untuk login.",
    oauth_failed: "Autentikasi Google gagal. Silakan coba lagi.",
  };
  return errorMessages[errorCode] || "Terjadi kesalahan. Silakan coba lagi.";
};

const validateForm = () => {
  errors.email = "";
  errors.password = "";

  if (!form.email) {
    errors.email = "Email wajib diisi";
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Format email tidak valid";
    return false;
  }

  if (!form.password) {
    errors.password = "Password wajib diisi";
    return false;
  }

  if (form.password.length < 6) {
    errors.password = "Password minimal 6 karakter";
    return false;
  }

  return true;
};

const handleLogin = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";
  oauthError.value = "";

  try {
    await authStore.login({
      email: form.email,
      password: form.password,
    });

    // Redirect to intended page or dashboard
    const redirect =
      route.query.redirect ||
      (authStore.isAdmin ? "/admin/dashboard" : "/dashboard");
    router.push(redirect);
  } catch (err) {
    error.value =
      err.message || "Login gagal. Periksa email dan password Anda.";
  } finally {
    loading.value = false;
  }
};

const handleGoogleLogin = async () => {
  googleLoading.value = true;
  error.value = "";
  oauthError.value = "";

  try {
    // Redirect to backend Google OAuth endpoint
    authStore.loginWithGoogle();
    // Note: Page will redirect, so loading state doesn't need to be reset
  } catch (err) {
    googleLoading.value = false;
    error.value = err.message || "Google Sign In gagal";
  }
};
</script>
