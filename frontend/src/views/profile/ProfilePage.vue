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
          <svg
            class="w-5 h-5 text-success-600 mr-2 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
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
          <div class="flex items-start space-x-6">
            <div class="flex-shrink-0">
              <div
                class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden"
              >
                <img
                  v-if="user?.profilePicture"
                  :src="user.profilePicture"
                  :alt="user?.name || 'avatar'"
                  class="w-full h-full object-cover rounded-full"
                />
                <div
                  v-else
                  class="w-full h-full flex items-center justify-center text-white text-xl font-semibold"
                  :class="user?.role === 'admin' ? 'bg-primary-500' : 'bg-gray-500'"
                >
                  {{ initials }}
                </div>
              </div>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-medium text-gray-900">
                {{ profileForm.name }}
              </h3>
              <p class="text-sm text-gray-500">{{ user?.email }}</p>
              <p class="text-sm text-gray-500 mt-1">
                <BaseBadge :variant="user?.role === 'admin' ? 'primary' : 'success'">
                  {{ user?.role === 'admin' ? 'Administrator' : 'Siswa' }}
                </BaseBadge>
              </p>
              <div class="mt-4 flex space-x-2">
                <div class="relative">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleProfilePictureSelect"
                  />
                  <BaseButton
                    type="button"
                    variant="secondary"
                    size="sm"
                    @click="$refs.fileInput?.click()"
                    :loading="uploadingProfilePicture"
                    :disabled="uploadingProfilePicture"
                  >
                    Pilih Foto
                  </BaseButton>
                </div>
                <BaseButton
                  v-if="user?.profilePicture"
                  type="button"
                  variant="danger"
                  size="sm"
                  @click="handleDeleteProfilePicture"
                  :loading="deletingProfilePicture"
                  :disabled="deletingProfilePicture"
                >
                  Hapus Foto
                </BaseButton>
              </div>
              <p v-if="profilePictureError" class="text-sm text-danger-600 mt-2">
                {{ profilePictureError }}
              </p>
              <p v-if="profilePictureSuccess" class="text-sm text-success-600 mt-2">
                {{ profilePictureSuccess }}
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
          <BaseInput
            :model-value="profileForm.learningPath"
            label="Learning Path"
            :disabled="true"
            hint="Learning path otomatis dari sistem"
          />

          <!-- University -->
          <BaseInput
            :model-value="profileForm.university"
            label="Universitas"
            :disabled="true"
            hint="Universitas otomatis dari sistem"
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
      <div v-if="user?.provider === 'local'" class="bg-white rounded-lg shadow">
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

      <!-- OAuth Info Alert -->
      <div v-else class="bg-white rounded-lg shadow p-6">
        <div class="flex items-start">
          <svg
            class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Keamanan Akun</h3>
            <p class="text-sm text-gray-600 mb-3">
              Akun Anda menggunakan login Google untuk keamanan maksimal. Password dikelola langsung
              oleh Google.
            </p>
            <a
              href="https://myaccount.google.com/security"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Kelola Akun Google Anda
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
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
      <div
        v-if="user?.role === 'admin'"
        class="bg-white rounded-lg shadow border-2 border-danger-200"
      >
        <div class="px-6 py-4 bg-danger-50 border-b border-danger-200">
          <h2 class="text-xl font-semibold text-danger-900">Zona Berbahaya</h2>
        </div>

        <div class="p-6">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-semibold text-gray-900">Hapus Akun</h3>
              <p class="mt-1 text-sm text-gray-600">
                Menghapus akun akan menghapus semua data Anda secara permanen. Tindakan ini tidak
                dapat dibatalkan.
              </p>
            </div>
            <BaseButton variant="danger" @click="showDeleteModal = true"> Hapus Akun </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <BaseModal v-model="showDeleteModal" title="Konfirmasi Hapus Akun" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">Apakah Anda yakin ingin menghapus akun Anda?</p>
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
          <BaseButton variant="outline" @click="showDeleteModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="deletingAccount" @click="handleDeleteAccount">
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
import * as userService from '../../services/userService'
import * as profilePictureService from '../../services/profilePictureService'
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
const uploadingProfilePicture = ref(false)
const deletingProfilePicture = ref(false)
const profilePictureError = ref('')
const profilePictureSuccess = ref('')
const fileInput = ref(null)

const profileForm = reactive({
  name: '',
  learningPath: '',
  university: '',
})

const profileErrors = reactive({
  name: '',
})

const profileError = ref('')

const initials = computed(() => {
  const name = user.value?.name || ''
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  const first = parts[0].charAt(0)
  const last = parts[parts.length - 1].charAt(0)
  return (first + last).toUpperCase()
})

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordError = ref('')

const menuItems = computed(() => {
  if (user.value?.role === 'admin') {
    return [
      {
        name: 'Dashboard',
        icon: 'dashboard',
        path: '/admin/dashboard',
        roles: ['admin'],
      },
      {
        name: 'Kelola Tim',
        icon: 'team',
        path: '/admin/teams',
        roles: ['admin'],
      },
      {
        name: 'Dokumen',
        icon: 'document',
        path: '/admin/documents',
        roles: ['admin'],
      },
      {
        name: 'Timeline',
        icon: 'timeline',
        path: '/admin/timeline',
        roles: ['admin'],
      },
      {
        name: 'Pengumuman',
        icon: 'announcement',
        path: '/admin/announcements',
        roles: ['admin'],
      },
    ]
  }
  return [
    {
      name: 'Dashboard',
      icon: 'dashboard',
      path: '/dashboard',
      roles: ['student'],
    },
    { name: 'Tim Saya', icon: 'team', path: '/team', roles: ['student'] },
    {
      name: 'Dokumen',
      icon: 'document',
      path: '/documents',
      roles: ['student'],
    },
    {
      name: 'Timeline',
      icon: 'timeline',
      path: '/timeline',
      roles: ['student'],
    },
    {
      name: 'Pengumuman',
      icon: 'announcement',
      path: '/announcements',
      roles: ['student'],
    },
    { name: 'Profil', icon: 'profile', path: '/profile', roles: ['student'] },
  ]
})

const profilePicture = ref(null)

const fetchUser = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users/me`)
    const data = await response.json()
    profilePicture.value = data
  } catch (error) {
    console.error('Gagal mengambil data user:', error)
  }
}

// onMounted(() => {
//   fetchUser()
// })

const validateProfileForm = () => {
  profileErrors.name = ''

  let isValid = true

  if (!profileForm.name.trim()) {
    profileErrors.name = 'Nama wajib diisi'
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
    const profileData = {
      name: profileForm.name,
    }

    const response = await userService.updateUserProfile(profileData)

    if (response.success) {
      // Update user in auth store
      await authStore.fetchProfile()
      success.value = 'Profil berhasil diperbarui!'
    }

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
    const passwordData = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    }

    const response = await userService.changePassword(passwordData)

    // Handle response - bisa berformat { success, message } atau { data, success, message }
    const isSuccess = response.success === true || response?.data?.success === true

    if (isSuccess) {
      success.value = response.message || 'Password berhasil diubah!'

      // Reset form
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      passwordError.value = response.message || 'Gagal mengubah password'
    }
  } catch (err) {
    // Handle error response
    const errorMessage = err.message || err?.data?.message || 'Gagal mengubah password'
    passwordError.value = errorMessage
    console.error('Error changing password:', err)
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

const handleProfilePictureSelect = async event => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    profilePictureError.value = 'Ukuran file maksimal 5MB'
    profilePictureSuccess.value = ''
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    profilePictureError.value = 'Hanya file gambar (JPEG, PNG, GIF, WebP) yang diperbolehkan'
    profilePictureSuccess.value = ''
    return
  }

  uploadingProfilePicture.value = true
  profilePictureError.value = ''
  profilePictureSuccess.value = ''

  try {
    const response = await profilePictureService.uploadProfilePicture(file)

    if (response.success) {
      profilePictureSuccess.value = 'Foto profil berhasil diperbarui!'

      // If API returned updated user object, persist it immediately so it survives logout/login
      const returnedUser = response.data?.user || response.user || null
      if (returnedUser) {
        // Update auth store and localStorage
        authStore.user = returnedUser
        localStorage.setItem('user', JSON.stringify(returnedUser))
      } else {
        // Fallback: refresh from server
        await authStore.fetchProfile()
      }
    } else {
      profilePictureError.value = response.message || 'Gagal mengunggah foto'
    }
  } catch (err) {
    profilePictureError.value = err.message || 'Gagal mengunggah foto'
    console.error('Error uploading profile picture:', err)
  } finally {
    uploadingProfilePicture.value = false
    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

const handleDeleteProfilePicture = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) {
    return
  }

  deletingProfilePicture.value = true
  profilePictureError.value = ''
  profilePictureSuccess.value = ''

  try {
    const response = await profilePictureService.deleteProfilePicture()
    if (response.success) {
      profilePictureSuccess.value = 'Foto profil berhasil dihapus!'

      const returnedUser = response.data?.user || response.user || null
      if (returnedUser) {
        authStore.user = returnedUser
        localStorage.setItem('user', JSON.stringify(returnedUser))
      } else {
        await authStore.fetchProfile()
      }
    } else {
      profilePictureError.value = response.message || 'Gagal menghapus foto'
    }
  } catch (err) {
    profilePictureError.value = err.message || 'Gagal menghapus foto'
    console.error('Error deleting profile picture:', err)
  } finally {
    deletingProfilePicture.value = false
  }
}

const formatDate = date => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchUser()
  // Initialize form with user data
  if (user.value) {
    profileForm.name = user.value.name || ''
    profileForm.learningPath = user.value.learningPathName || user.value.learningPath || ''
    profileForm.university = user.value.university || ''
  }
})
</script>
