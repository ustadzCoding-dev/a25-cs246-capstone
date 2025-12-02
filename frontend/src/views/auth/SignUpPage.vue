<template>
  <AuthLayout>
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Daftar</h2>
        <p class="mt-2 text-sm text-gray-600">Buat akun baru untuk memulai</p>
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

      <!-- Google Sign Up (Prioritas di atas) -->
      <div class="mb-6">
        <GoogleButton
          text="Daftar dengan Google"
          :loading="googleLoading"
          @click="handleGoogleSignUp"
        />
        <p class="mt-2 text-xs text-center text-gray-500">
          Daftar cepat dengan akun Google Anda
        </p>
      </div>

      <!-- Divider -->
      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500"
            >Atau daftar dengan email</span
          >
        </div>
      </div>

      <!-- Sign Up Form -->
      <form @submit.prevent="handleSignUp" class="space-y-6">
        <!-- Name -->
        <BaseInput
          v-model="form.name"
          type="text"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          :error="errors.name"
          required
        />

        <!-- Email -->
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="nama@example.com"
          :error="errors.email"
          required
        />

        <!-- Learning Path -->
        <BaseSelect
          v-model="form.learningPath"
          label="Learning Path"
          :options="learningPathOptions"
          placeholder="Pilih learning path"
          :error="errors.learningPath"
          required
        />

        <!-- University -->
        <BaseInput
          v-model="form.university"
          type="text"
          label="Universitas"
          placeholder="Nama universitas"
          :error="errors.university"
          required
        />

        <!-- Password -->
        <BasePasswordInput
          v-model="form.password"
          label="Password"
          placeholder="Minimal 6 karakter"
          :error="errors.password"
          hint="Password minimal 6 karakter"
          required
        />

        <!-- Confirm Password -->
        <BasePasswordInput
          v-model="form.confirmPassword"
          label="Konfirmasi Password"
          placeholder="Ulangi password"
          :error="errors.confirmPassword"
          required
        />

        <!-- Terms & Conditions -->
        <BaseCheckbox
          v-model="form.agreeToTerms"
          label="Saya setuju dengan syarat dan ketentuan"
          :required="true"
        />
        <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-danger-500">
          {{ errors.agreeToTerms }}
        </p>

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          :disabled="loading"
          full-width
        >
          {{ loading ? "Memproses..." : "Daftar" }}
        </BaseButton>

        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600">
          Sudah punya akun?
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Masuk sekarang
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
import BaseSelect from "../../components/base/BaseSelect.vue";
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
  name: "",
  email: "",
  learningPath: "",
  university: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
});

const errors = reactive({
  name: "",
  email: "",
  learningPath: "",
  university: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: "",
});

const learningPathOptions = [
  {
    value: "Front-End Web & Back-End with AI",
    label: "Front-End Web & Back-End with AI",
  },
  { value: "React & Back-End with AI", label: "React & Back-End with AI" },
  { value: "Machine Learning", label: "Machine Learning" },
];

// Check for OAuth errors in URL
onMounted(() => {
  if (route.query.error) {
    oauthError.value = route.query.error;
    // Clean URL without reload
    router.replace({ name: "signup" });
  }
});

const getOAuthErrorMessage = (errorCode) => {
  const errorMessages = {
    auth_failed: "Pendaftaran dengan Google gagal. Silakan coba lagi.",
    email_already_exists:
      "Email sudah terdaftar dengan metode lain. Gunakan form login.",
    oauth_failed: "Autentikasi Google gagal. Silakan coba lagi.",
  };
  return errorMessages[errorCode] || "Terjadi kesalahan. Silakan coba lagi.";
};

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach((key) => (errors[key] = ""));

  let isValid = true;

  if (!form.name.trim()) {
    errors.name = "Nama wajib diisi";
    isValid = false;
  }

  if (!form.email) {
    errors.email = "Email wajib diisi";
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Format email tidak valid";
    isValid = false;
  }

  if (!form.learningPath) {
    errors.learningPath = "Learning path wajib dipilih";
    isValid = false;
  }

  if (!form.university.trim()) {
    errors.university = "Universitas wajib diisi";
    isValid = false;
  }

  if (!form.password) {
    errors.password = "Password wajib diisi";
    isValid = false;
  } else if (form.password.length < 6) {
    errors.password = "Password minimal 6 karakter";
    isValid = false;
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Konfirmasi password wajib diisi";
    isValid = false;
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = "Password tidak cocok";
    isValid = false;
  }

  if (!form.agreeToTerms) {
    errors.agreeToTerms = "Anda harus menyetujui syarat dan ketentuan";
    isValid = false;
  }

  return isValid;
};

const handleSignUp = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";
  oauthError.value = "";

  try {
    const response = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      learningPath: form.learningPath,
      university: form.university,
    });

    // Check if user is admin (first user) - check from response data
    const userRole = response?.user?.role || authStore.userRole;
    console.log('[SignUp] User role:', userRole, 'Response:', response);

    if (userRole === 'admin') {
      // Show success message
      alert("Anda adalah admin pertama! Selamat datang.");
      // Redirect to admin dashboard
      await router.push("/admin/dashboard");
    } else {
      // Student: redirect to dashboard (route guard will handle profile completion if needed)
      await router.push("/dashboard");
    }
  } catch (err) {
    error.value = err.message || "Pendaftaran gagal. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignUp = async () => {
  googleLoading.value = true;
  error.value = "";
  oauthError.value = "";

  try {
    // Redirect to backend Google OAuth endpoint
    // Note: Fungsinya sama dengan loginWithGoogle karena Google OAuth
    // otomatis register user baru jika belum ada
    authStore.loginWithGoogle();
    // Note: Page will redirect, so loading state doesn't need to be reset
  } catch (err) {
    googleLoading.value = false;
    error.value = err.message || "Google Sign Up gagal";
  }
};
</script>
