<template>
  <AuthLayout>
    <div class="bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Daftar</h2>
        <p class="mt-2 text-sm text-gray-600">
          Buat akun baru untuk memulai
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
        <p class="text-sm text-danger-700">{{ error }}</p>
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
          {{ loading ? 'Memproses...' : 'Daftar' }}
        </BaseButton>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Atau daftar dengan</span>
          </div>
        </div>

        <!-- Google Sign Up -->
        <GoogleButton
          text="Daftar dengan Google"
          :loading="googleLoading"
          @click="handleGoogleSignUp"
        />

        <!-- Login Link -->
        <p class="text-center text-sm text-gray-600">
          Sudah punya akun?
          <router-link to="/login" class="font-medium text-primary-600 hover:text-primary-500">
            Masuk sekarang
          </router-link>
        </p>
      </form>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import AuthLayout from '../../components/layout/AuthLayout.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BasePasswordInput from '../../components/base/BasePasswordInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseCheckbox from '../../components/base/BaseCheckbox.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import GoogleButton from '../../components/display/GoogleButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const googleLoading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  learningPath: '',
  university: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  learningPath: '',
  university: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: ''
})

const learningPathOptions = [
  { value: 'Front-End Web & Back-End with AI', label: 'Front-End Web & Back-End with AI' },
  { value: 'Android Development', label: 'Android Development' },
  { value: 'iOS Development', label: 'iOS Development' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'DevOps', label: 'DevOps' }
]

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')
  
  let isValid = true
  
  if (!form.name.trim()) {
    errors.name = 'Nama wajib diisi'
    isValid = false
  }
  
  if (!form.email) {
    errors.email = 'Email wajib diisi'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.email = 'Format email tidak valid'
    isValid = false
  }
  
  if (!form.learningPath) {
    errors.learningPath = 'Learning path wajib dipilih'
    isValid = false
  }
  
  if (!form.university.trim()) {
    errors.university = 'Universitas wajib diisi'
    isValid = false
  }
  
  if (!form.password) {
    errors.password = 'Password wajib diisi'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = 'Password minimal 6 karakter'
    isValid = false
  }
  
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password wajib diisi'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Password tidak cocok'
    isValid = false
  }
  
  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan'
    isValid = false
  }
  
  return isValid
}

const handleSignUp = async () => {
  if (!validateForm()) return
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      learningPath: form.learningPath,
      university: form.university
    })
    
    // Redirect to dashboard
    router.push(authStore.isAdmin ? '/admin/dashboard' : '/dashboard')
  } catch (err) {
    error.value = err.message || 'Pendaftaran gagal. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const handleGoogleSignUp = async () => {
  googleLoading.value = true
  error.value = ''
  
  try {
    // TODO: Implement Google OAuth
    error.value = 'Google Sign Up belum tersedia. Gunakan form pendaftaran.'
  } catch (err) {
    error.value = err.message || 'Google Sign Up gagal'
  } finally {
    googleLoading.value = false
  }
}
</script>
