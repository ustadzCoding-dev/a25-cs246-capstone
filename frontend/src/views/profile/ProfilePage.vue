<template>
  <DashboardLayout :user="user" :menu-items="menuItems" @logout="handleLogout">
    <div class="max-w-4xl mx-auto space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Profil Saya</h1>
        <p class="mt-2 text-gray-600">Kelola informasi profil dan keamanan akun Anda</p>
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="p-4 bg-success-50 border border-success-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-success-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-success-700">{{ success }}</p>
        </div>
      </div>

      <!-- Profile Information -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Informasi Profil</h2>
        </div>
        
        <form @submit.prevent="handleUpdateProfile" class="p-6 space-y-6">
          <!-- Profile Picture -->
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ profileForm.name }}</h3>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <BaseBadge :variant="user?.role === 'admin' ? 'primary' : 'success'">
                  {{ user?.role === 'admin' ? 'Administrator' : 'Siswa' }}
                </BaseBadge>
              </p>
            </div>
          </div>

          <!-- Name -->
          <BaseInput
            v-model="profileForm.name"
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            :error="profileErrors.name"
            required
          />

          <!-- Email (Read-only) -->
          <BaseInput
            :model-value="user?.email"
            label="Email"
            type="email"
            :disabled="true"
            hint="Email tidak dapat diubah"
          />

          <!-- Dicoding ID (Read-only) -->
          <BaseInput
            :model-value="user?.dicodingId || 'N/A'"
            label="Dicoding ID"
            :disabled="true"
            hint="ID otomatis dari sistem"
          />

          <!-- Learning Path -->
          <BaseSelect
            v-model="profileForm.learningPath"
            label="Learning Path"
            :options="learningPathOptions"
            :error="profileErrors.learningPath"
            required
          />

          <!-- University -->
          <BaseInput
            v-model="profileForm.university"
            label="Universitas"
            placeholder="Nama universitas"
            :error="profileErrors.university"
            required
          />

          <!-- Error Alert -->
          <div v-if="profileError" class="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p class="text-sm text-danger-700">{{ profileError }}</p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="updatingProfile"
              :disabled="updatingProfile"
            >
              Simpan Perubahan
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Change Password -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Ubah Password</h2>
        </div>
        
        <form @submit.prevent="handleChangePassword" class="p-6 space-y-6">
          <!-- Current Password -->
          <BasePasswordInput
            v-model="passwordForm.currentPassword"
            label="Password Saat Ini"
            placeholder="Masukkan password saat ini"
            :error="passwordErrors.currentPassword"
            required
          />

          <!-- New Password -->
          <BasePasswordInput
            v-model="passwordForm.newPassword"
            label="Password Baru"
            placeholder="Minimal 6 karakter"
            :error="passwordErrors.newPassword"
            hint="Password minimal 6 karakter"
            required
          />

          <!-- Confirm New Password -->
          <BasePasswordInput
            v-model="passwordForm.confirmPassword"
            label="Konfirmasi Password Baru"
            placeholder="Ulangi password baru"
            :error="passwordErrors.confirmPassword"
            required
          />

          <!-- Error Alert -->
          <div v-if="passwordError" class="p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <p class="text-sm text-danger-700">{{ passwordError }}</p>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end">
            <BaseButton
              type="submit"
              variant="primary"
              :loading="changingPassword"
              :disabled="changingPassword"
            >
              Ubah Password
            </BaseButton>
          </div>
        </form>
      </div>

      <!-- Account Information -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Informasi Akun</h2>
        <div class="space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Status Akun:</span>
            <BaseBadge variant="success">Aktif</BaseBadge>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Tanggal Bergabung:</span>
            <span class="font-medium text-gray-900">{{ formatDate(user?.createdAt) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Terakhir Login:</span>
            <span class="font-medium text-gray-900">{{ formatDate(new Date()) }}</span>
          </div>
        </div>
      </div>

      <!-- Danger Zone (Admin Only) -->
      <div v-if="user?.role === 'admin'" class="bg-white rounded-lg shadow border-2 border-danger-200">
        <div class="px-6 py-4 bg-danger-50 border-b border-danger-200">
          <h2 class="text-xl font-semibold text-danger-900">Zona Berbahaya</h2>
        </div>
        
        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900">Hapus Akun</h3>
              <p class="mt-1 text-sm text-gray-600">
                Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <BaseButton
              variant="danger"
              @click="showDeleteModal = true"
            >
              Hapus Akun
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Konfirmasi Hapus Akun"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus akun Anda?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700 font-semibold mb-2">
            Peringatan: Tindakan ini tidak dapat dibatalkan!
          </p>
          <ul class="text-sm text-danger-700 list-disc list-inside space-y-1">
            <li>Semua data profil akan dihapus</li>
            <li>Anda akan keluar dari semua tim</li>
            <li>Riwayat aktivitas akan hilang</li>
          </ul>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false">
            Batal
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deletingAccount"
            @click="handleDeleteAccount"
          >
            Ya, Hapus Akun Saya
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BasePasswordInput from '../../components/base/BasePasswordInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const success = ref('')
const updatingProfile = ref(false)
const changingPassword = ref(false)
const deletingAccount = ref(false)
const showDeleteModal = ref(false)

const profileForm = reactive({
  name: '',
  learningPath: '',
  university: ''
})

const profileErrors = reactive({
  name: '',
  learningPath: '',
  university: ''
})

const profileError = ref('')

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordError = ref('')

const learningPathOptions = [
  { value: 'Front-End Web & Back-End with AI', label: 'Front-End Web & Back-End with AI' },
  { value: 'Android Development', label: 'Android Development' },
  { value: 'iOS Development', label: 'iOS Development' },
  { value: 'Machine Learning', label: 'Machine Learning' },
  { value: 'Cloud Computing', label: 'Cloud Computing' },
  { value: 'DevOps', label: 'DevOps' }
]

const menuItems = computed(() => {
  if (user.value?.role === 'admin') {
    return [
      { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
      { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
      { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
      { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
      { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] }
    ]
  }
  return [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
    { name: 'Tim Saya', icon: 'team', path: '/team', roles: ['student'] },
    { name: 'Dokumen', icon: 'document', path: '/documents', roles: ['student'] },
    { name: 'Timeline', icon: 'timeline', path: '/timeline', roles: ['student'] },
    { name: 'Pengumuman', icon: 'announcement', path: '/announcements', roles: ['student'] },
    { name: 'Profil', icon: 'profile', path: '/profile', roles: ['student'] }
  ]
})

const validateProfileForm = () => {
  profileErrors.name = ''
  profileErrors.learningPath = ''
  profileErrors.university = ''

  let isValid = true

  if (!profileForm.name.trim()) {
    profileErrors.name = 'Nama wajib diisi'
    isValid = false
  }

  if (!profileForm.learningPath) {
    profileErrors.learningPath = 'Learning path wajib dipilih'
    isValid = false
  }

  if (!profileForm.university.trim()) {
    profileErrors.university = 'Universitas wajib diisi'
    isValid = false
  }

  return isValid
}

const validatePasswordForm = () => {
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''

  let isValid = true

  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = 'Password saat ini wajib diisi'
    isValid = false
  }

  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = 'Password baru wajib diisi'
    isValid = false
  } else if (passwordForm.newPassword.length < 6) {
    passwordErrors.newPassword = 'Password minimal 6 karakter'
    isValid = false
  }

  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Konfirmasi password wajib diisi'
    isValid = false
  } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = 'Password tidak cocok'
    isValid = false
  }

  return isValid
}

const handleUpdateProfile = async () => {
  if (!validateProfileForm()) return

  updatingProfile.value = true
  profileError.value = ''
  success.value = ''

  try {
    // TODO: Call API to update profile
    console.log('Updating profile:', profileForm)

    await new Promise(resolve => setTimeout(resolve, 1000))

    success.value = 'Profil berhasil diperbarui!'
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (err) {
    profileError.value = err.message || 'Gagal memperbarui profil'
  } finally {
    updatingProfile.value = false
  }
}

const handleChangePassword = async () => {
  if (!validatePasswordForm()) return

  changingPassword.value = true
  passwordError.value = ''
  success.value = ''

  try {
    // TODO: Call API to change password
    console.log('Changing password')

    await new Promise(resolve => setTimeout(resolve, 1000))

    success.value = 'Password berhasil diubah!'
    
    // Reset form
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (err) {
    passwordError.value = err.message || 'Gagal mengubah password'
  } finally {
    changingPassword.value = false
  }
}

const handleDeleteAccount = async () => {
  deletingAccount.value = true

  try {
    // TODO: Call API to delete account
    console.log('Deleting account')

    await new Promise(resolve => setTimeout(resolve, 1000))

    // Logout and redirect
    authStore.logout()
    router.push('/login')

  } catch (err) {
    console.error('Failed to delete account:', err)
  } finally {
    deletingAccount.value = false
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  // Initialize form with user data
  if (user.value) {
    profileForm.name = user.value.name || ''
    profileForm.learningPath = user.value.learningPath || ''
    profileForm.university = user.value.university || ''
  }
})
</script>
