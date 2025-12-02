<template>
  <AuthLayout>
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Reset Password</h1>
        <p class="mt-2 text-gray-500">Masukkan password baru Anda</p>
      </div>

      <!-- Success Alert -->
      <div v-if="successMessage" class="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
        <p class="text-sm text-success-700">{{ successMessage }}</p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
        <p class="text-sm text-danger-700">{{ error }}</p>
      </div>

      <!-- Form -->
      <form v-if="!successMessage" @submit.prevent="handleSubmit" class="space-y-6">
        <!-- New Password -->
        <BasePasswordInput
          v-model="form.password"
          label="Password Baru"
          placeholder="Masukkan password baru"
          :error="errors.password"
          required
        />

        <!-- Confirm Password -->
        <BasePasswordInput
          v-model="form.passwordConfirm"
          label="Konfirmasi Password"
          placeholder="Masukkan ulang password"
          :error="errors.passwordConfirm"
          required
        />

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          :disabled="loading || !form.password || !form.passwordConfirm"
          full-width
        >
          {{ loading ? "Memproses..." : "Reset Password" }}
        </BaseButton>

        <!-- Back to Login -->
        <p class="text-center text-sm text-gray-600">
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Kembali ke Login
          </router-link>
        </p>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AuthLayout from "../../components/layout/AuthLayout.vue";
import BasePasswordInput from "../../components/base/BasePasswordInput.vue";
import BaseButton from "../../components/base/BaseButton.vue";

const router = useRouter();
const route = useRoute();

const loading = ref(false);
const error = ref("");
const successMessage = ref("");

const form = reactive({
  password: "",
  passwordConfirm: ""
});

const errors = reactive({
  password: "",
  passwordConfirm: ""
});

const validateForm = () => {
  errors.password = "";
  errors.passwordConfirm = "";

  if (!form.password) {
    errors.password = "Password wajib diisi";
    return false;
  }

  if (form.password.length < 6) {
    errors.password = "Password minimal 6 karakter";
    return false;
  }

  if (!form.passwordConfirm) {
    errors.passwordConfirm = "Konfirmasi password wajib diisi";
    return false;
  }

  if (form.password !== form.passwordConfirm) {
    errors.passwordConfirm = "Password tidak cocok";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";

  try {
    const token = route.params.token;

    const response = await fetch("http://localhost:8000/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: token,
        password: form.password,
        passwordConfirm: form.passwordConfirm
      })
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = data.message || "Password berhasil direset!";

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      error.value = data.message || "Gagal mereset password";
    }
  } catch (err) {
    error.value = err.message || "Terjadi kesalahan. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (!route.params.token) {
    error.value = "Link reset password tidak valid";
  }
});
</script>
