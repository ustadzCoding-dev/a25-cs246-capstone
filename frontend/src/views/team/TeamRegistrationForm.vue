<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Daftar Tim Capstone</h1>
        <p class="mt-2 text-gray-600">
          Buat tim capstone baru dengan mengisi form di bawah ini
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-danger-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-danger-700">{{ error }}</p>
        </div>
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-success-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-success-700">{{ success }}</p>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-lg shadow p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Team Name -->
          <BaseInput
            v-model="form.teamName"
            label="Nama Tim"
            placeholder="Contoh: Team Alpha"
            :error="errors.teamName"
            hint="Nama tim harus unik dan mudah diingat"
            required
          />

          <!-- Use Case Selection -->
          <BaseSelect
            v-model="form.useCase"
            label="Use Case"
            :options="useCaseOptions"
            placeholder="Pilih use case"
            :error="errors.useCase"
            hint="Pilih use case yang akan dikerjakan tim Anda"
            required
          />

          <!-- Leader Info (Auto-filled) -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Informasi Ketua Tim</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Nama:</span>
                <span class="font-medium text-gray-900">{{ user?.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Email:</span>
                <span class="font-medium text-gray-900">{{ user?.email }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Learning Path:</span>
                <span class="font-medium text-gray-900">{{ user?.learningPath }}</span>
              </div>
            </div>
          </div>

          <!-- Team Members -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Anggota Tim <span class="text-danger-500">*</span>
            </label>
            <p class="text-sm text-gray-500 mb-3">
              Masukkan Dicoding ID anggota tim (minimal 1, maksimal 3 anggota)
            </p>

            <DynamicInputList
              v-model="form.members"
              placeholder="Contoh: A25-CS246-XXXX"
              add-button-text="+ Tambah Anggota"
              :max-items="3"
              :error="errors.members"
            />
          </div>

          <!-- Learning Paths -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Learning Path Anggota
            </label>
            <p class="text-sm text-gray-500 mb-3">
              Masukkan learning path untuk setiap anggota (urutan sesuai dengan email di atas)
            </p>

            <DynamicInputList
              v-model="form.learningPaths"
              placeholder="Contoh: Front-End Web & Back-End with AI"
              add-button-text="+ Tambah Learning Path"
              :max-items="3"
              :error="errors.learningPaths"
            />
          </div>

          <!-- Team Composition Info -->
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-blue-700">
                <p class="font-semibold mb-1">Ketentuan Komposisi Tim:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li>Tim terdiri dari 2-4 orang (1 ketua + 1-3 anggota)</li>
                  <li>Minimal 1 orang dari learning path Front-End atau Back-End</li>
                  <li>Semua anggota harus terdaftar di sistem</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <BaseCheckbox
            v-model="form.agreeToTerms"
            label="Saya menyetujui bahwa informasi yang diberikan adalah benar dan semua anggota telah setuju untuk bergabung dalam tim ini"
            required
          />
          <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-danger-500">
            {{ errors.agreeToTerms }}
          </p>

          <!-- Action Buttons -->
          <div class="flex space-x-4 pt-4">
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="loading"
              :disabled="loading"
              class="flex-1"
            >
              {{ loading ? 'Memproses...' : 'Daftar Tim' }}
            </BaseButton>

            <BaseButton
              type="button"
              variant="outline"
              size="lg"
              @click="handleCancel"
              :disabled="loading"
            >
              Batal
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseCheckbox from '../../components/base/BaseCheckbox.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import DynamicInputList from '../../components/display/DynamicInputList.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const user = computed(() => authStore.user)
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  teamName: '',
  useCase: '',
  members: [''], // Start with one empty field
  learningPaths: [''],
  agreeToTerms: false
})

const errors = reactive({
  teamName: '',
  useCase: '',
  members: '',
  learningPaths: '',
  agreeToTerms: ''
})

// Use case options (fetch from backend)
const useCaseOptions = ref([])
const loadingUseCases = ref(false)

const studentMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
  { name: 'Tim Saya', icon: 'team', path: '/team', roles: ['student'] },
  { name: 'Dokumen', icon: 'document', path: '/documents', roles: ['student'] },
  { name: 'Timeline', icon: 'timeline', path: '/timeline', roles: ['student'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/announcements', roles: ['student'] }
]

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  // Team name validation
  if (!form.teamName.trim()) {
    errors.teamName = 'Nama tim wajib diisi'
    isValid = false
  } else if (form.teamName.length < 3) {
    errors.teamName = 'Nama tim minimal 3 karakter'
    isValid = false
  }

  // Use case validation
  if (!form.useCase) {
    errors.useCase = 'Use case wajib dipilih'
    isValid = false
  }

  // Members validation
  const validMembers = form.members.filter(m => m.trim() !== '')
  if (validMembers.length === 0) {
    errors.members = 'Minimal 1 anggota tim harus diisi'
    isValid = false
  } else if (validMembers.length > 3) {
    errors.members = 'Maksimal 3 anggota tim'
    isValid = false
  }

  // Learning paths validation
  const validPaths = form.learningPaths.filter(p => p.trim() !== '')
  if (validPaths.length !== validMembers.length) {
    errors.learningPaths = 'Jumlah learning path harus sama dengan jumlah anggota'
    isValid = false
  }

  if (!errors.learningPaths && validPaths.length > 0) {
    const hasTechnicalPath = validPaths.some(path =>
      path.includes('Front-End Web & Back-End with AI') ||
      path.includes('React & Back-End with AI')
    )

    if (!hasTechnicalPath) {
      errors.learningPaths = 'Minimal 1 anggota dari learning path Front-End Web & Back-End with AI atau React & Back-End with AI'
      isValid = false
    }
  }

  // Terms validation
  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'Anda harus menyetujui pernyataan di atas'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Filter out empty members and paths
    const validMembers = form.members.filter(m => m.trim() !== '')
    const validPaths = form.learningPaths.filter(p => p.trim() !== '')

    // Prepare team data
    const teamData = {
      teamName: form.teamName,
      useCaseId: form.useCase, // Backend expects useCaseId
      membersUserId: validMembers
    }

    // Call API to create team
    const response = await teamStore.createTeam(teamData)

    if (response.success) {
      success.value = 'Tim berhasil didaftarkan! Menunggu persetujuan admin.'

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/team')
      }, 2000)
    }

  } catch (err) {
    error.value = err.message || 'Gagal mendaftarkan tim. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/team')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchUseCases = async () => {
  loadingUseCases.value = true
  try {
    const response = await teamStore.fetchUseCases()
    useCaseOptions.value = response.data.map(uc => ({
      value: uc._id || uc.id,
      label: `${uc.code} - ${uc.title || uc.name}`
    }))
  } catch (err) {
    console.error('Failed to fetch use cases:', err)
    // Fallback to default options if API fails
    useCaseOptions.value = [
      { value: 'DC-01', label: 'DC-01 - E-Commerce Platform' },
      { value: 'DC-02', label: 'DC-02 - Learning Management System' },
      { value: 'DC-09', label: 'DC-09 - Event Management System' },
      { value: 'DC-10', label: 'DC-10 - Job Portal' }
    ]
  } finally {
    loadingUseCases.value = false
  }
}

onMounted(() => {
  fetchUseCases()
})
</script>
