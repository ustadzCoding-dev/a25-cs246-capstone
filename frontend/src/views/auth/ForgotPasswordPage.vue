<template>
  <AuthLayout>
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Lupa Password?</h1>
        <p class="mt-2 text-gray-500">
          Masukkan email Anda dan kami akan mengirimkan link untuk mereset password
        </p>
      </div>

      <!-- Success Alert -->
      <div
        v-if="successMessage"
        class="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg"
      >
        <p class="text-sm text-success-700">{{ successMessage }}</p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="error"
        class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg"
      >
        <p class="text-sm text-danger-700">{{ error }}</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email -->
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="nama@example.com"
          :error="errors.email"
          required
        />

        <!-- Submit Button -->
        <BaseButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="loading"
          :disabled="loading"
          full-width
        >
          {{ loading ? "Mengirim..." : "Kirim Link Reset" }}
        </BaseButton>

        <!-- Back to Login -->
        <p class="text-center text-sm text-gray-600">
          Ingat password Anda?
          <router-link
            to="/login"
            class="font-medium text-primary-600 hover:text-primary-500"
          >
            Kembali ke Login
          </router-link>
        </p>
      </form>

      <!-- Info Box -->
      <div class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-700">
          <strong>💡 Tip:</strong> Periksa folder spam/junk jika Anda tidak menerima email dalam beberapa menit.
        </p>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "../../components/layout/AuthLayout.vue";
import BaseInput from "../../components/base/BaseInput.vue";
import BaseButton from "../../components/base/BaseButton.vue";

const router = useRouter();

const loading = ref(false);
const error = ref("");
const successMessage = ref("");

const form = reactive({
  email: ""
});

const errors = reactive({
  email: ""
});

const validateForm = () => {
  errors.email = "";

  if (!form.email) {
    errors.email = "Email wajib diisi";
    return false;
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = "Format email tidak valid";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const response = await fetch("http://localhost:8000/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email
      })
    });

    const data = await response.json();

    if (response.ok) {
      successMessage.value = data.message || "Link reset password telah dikirim ke email Anda";
      form.email = "";

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } else {
      error.value = data.message || "Gagal mengirim link reset password";
    }
  } catch (err) {
    error.value = err.message || "Terjadi kesalahan. Silakan coba lagi.";
  } finally {
    loading.value = false;
  }
};
</script>
