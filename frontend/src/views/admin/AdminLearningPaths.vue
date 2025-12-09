<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md flex justify-between items-center">
        <div>
          <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
            Manage Learning Paths
          </h1>
          <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
            Kelola learning paths yang tersedia untuk program capstone
          </p>
        </div>
        <BaseButton variant="primary" @click="showAddForm = true">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Tambah Learning Path
        </BaseButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Learning Paths"
          :value="stats.total"
          icon="settings"
          color="primary"
        />
        <StatsCard
          label="Learning Paths Aktif"
          :value="stats.active"
          icon="check"
          color="success"
        />
        <StatsCard
          label="Learning Paths Nonaktif"
          :value="stats.inactive"
          icon="x"
          color="warning"
        />
      </div>

      <!-- Add/Edit Form Modal -->
      <BaseModal
        v-model="showAddForm"
        @close="closeForm"
        :title="editingId ? 'Edit Learning Path' : 'Tambah Learning Path'"
      >
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Learning Path Name *
            </label>
            <input
              v-model="form.name"
              type="text"
              placeholder="e.g., Front-End Web & Back-End with AI"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
          </div>

          <!-- Code -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Code * </label>
            <input
              v-model="form.code"
              type="text"
              placeholder="e.g., FE_BE_AI"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p class="text-gray-500 text-xs mt-1">Akan dikonversi ke uppercase</p>
            <p v-if="errors.code" class="text-red-500 text-sm mt-1">{{ errors.code }}</p>
          </div>

          <!-- Dicoding ID Prefix -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Dicoding ID Prefix *
            </label>
            <input
              v-model="form.dicodingIdPrefix"
              type="text"
              placeholder="e.g., FEBE"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <p class="text-gray-500 text-xs mt-1">
              Prefix untuk generate student ID (e.g., FEBE00001)
            </p>
            <p v-if="errors.dicodingIdPrefix" class="text-red-500 text-sm mt-1">
              {{ errors.dicodingIdPrefix }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"> Deskripsi </label>
            <textarea
              v-model="form.description"
              placeholder="Deskripsi opsional"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input
              v-model="form.isActive"
              type="checkbox"
              id="isActive"
              class="w-4 h-4 text-primary-600"
            />
            <label for="isActive" class="ml-2 text-sm text-gray-700">
              Aktif (terlihat di dropdown siswa)
            </label>
          </div>

          <!-- Error Message -->
          <p v-if="errors.submit" class="text-red-500 text-sm">{{ errors.submit }}</p>

          <!-- Buttons -->
          <div class="flex gap-2 pt-4">
            <BaseButton variant="secondary" @click="closeForm"> Batal </BaseButton>
            <BaseButton variant="primary" type="submit" :disabled="loading">
              {{ loading ? 'Menyimpan...' : 'Simpan' }}
            </BaseButton>
          </div>
        </form>
      </BaseModal>

      <!-- Learning Paths Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <button
              @click="showInactive = false"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                !showInactive
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              Aktif
            </button>
            <button
              @click="showInactive = true"
              :class="[
                'px-4 py-2 rounded-lg font-medium transition-colors',
                showInactive
                  ? 'bg-warning-100 text-warning-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
              ]"
            >
              Nonaktif
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <div v-else-if="filteredPaths.length === 0" class="p-12 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p class="mt-4 text-gray-500">Tidak ada learning paths</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  Nama
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  Kode
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  Deskripsi
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="path in filteredPaths" :key="path._id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ path.name }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  <span class="bg-gray-100 px-2 py-1 rounded text-xs font-mono">{{
                    path.code
                  }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ path.description || '-' }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs font-semibold',
                      path.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ path.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm space-x-3">
                  <div class="flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                    <button
                      @click="router.push(`/admin/learning-paths/${path._id}`)"
                      class="text-primary-600 hover:text-primary-700 p-2"
                      title="Lihat Detail"
                    >
                      <svg class="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="toggleStatus(path._id)"
                      :disabled="loading"
                      class="text-blue-600 hover:text-blue-900 disabled:opacity-50 font-medium"
                    >
                      {{ path.isActive ? 'Nonaktifkan' : 'Aktifkan' }}
                    </button>
                    </div>

                    <div class="flex items-center gap-2">
                    <button
                      @click="editPath(path)"
                      class="text-warning-600 hover:text-warning-700 p-2"
                      title="Edit"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>

                    <button
                      @click="deletePath(path._id)"
                      class="text-danger-600 hover:text-danger-700 p-2"
                      title="Hapus"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import { useAuthStore } from '../../stores/authStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import StatsCard from '../../components/display/StatsCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const { adminMenuItems } = useAdminMenu()

const user = computed(() => authStore.user)

const paths = ref([])
const loading = ref(false)
const showAddForm = ref(false)
const showInactive = ref(false)
const editingId = ref(null)

const form = reactive({
  name: '',
  code: '',
  description: '',
  isActive: true,
  dicodingIdPrefix: '',
})

const errors = reactive({
  name: '',
  code: '',
  dicodingIdPrefix: '',
  submit: '',
})

const stats = computed(() => ({
  total: paths.value.length,
  active: paths.value.filter(p => p.isActive).length,
  inactive: paths.value.filter(p => !p.isActive).length,
}))

const filteredPaths = computed(() => {
  return showInactive.value
    ? paths.value.filter(p => !p.isActive)
    : paths.value.filter(p => p.isActive)
})

// Fetch all learning paths
const fetchLearningPaths = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:8000/api/admin/learning-paths', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      paths.value = data.data || []
      console.log('✅ Learning paths loaded:', paths.value.length)
    } else {
      errors.submit = 'Failed to load learning paths'
    }
  } catch (err) {
    console.error('Failed to fetch learning paths:', err)
    errors.submit = 'Failed to load learning paths'
  } finally {
    loading.value = false
  }
}

// Add/Edit learning path
const handleSubmit = async () => {
  errors.name = ''
  errors.code = ''
  errors.dicodingIdPrefix = ''
  errors.submit = ''

  // Validate
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    return
  }
  if (!form.code.trim()) {
    errors.code = 'Code is required'
    return
  }
  if (!form.dicodingIdPrefix.trim()) {
    errors.dicodingIdPrefix = 'Dicoding ID Prefix is required'
    return
  }

  loading.value = true
  try {
    const url = editingId.value
      ? `http://localhost:8000/api/admin/learning-paths/${editingId.value}`
      : 'http://localhost:8000/api/admin/learning-paths'

    const method = editingId.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: form.name.trim(),
        code: form.code.trim(),
        description: form.description.trim() || null,
        isActive: form.isActive,
        dicodingIdPrefix: form.dicodingIdPrefix.trim(),
      }),
    })

    if (response.ok) {
      console.log('✅ Learning path saved successfully')
      closeForm()
      await fetchLearningPaths()
    } else {
      const data = await response.json()
      errors.submit = data.message || 'Failed to save learning path'
    }
  } catch (err) {
    console.error('Error saving learning path:', err)
    errors.submit = 'Failed to save learning path'
  } finally {
    loading.value = false
  }
}

// Edit learning path
const editPath = path => {
  editingId.value = path._id
  form.name = path.name
  form.code = path.code
  form.description = path.description || ''
  form.isActive = path.isActive
  form.dicodingIdPrefix = path.dicodingIdPrefix
  showAddForm.value = true
}

// Toggle status
const toggleStatus = async id => {
  loading.value = true
  try {
    const response = await fetch(`http://localhost:8000/api/admin/learning-paths/${id}/toggle`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      console.log('✅ Learning path status toggled')
      await fetchLearningPaths()
    } else {
      errors.submit = 'Gagal mengubah status'
    }
  } catch (err) {
    console.error('Error toggling status:', err)
    errors.submit = 'Gagal mengubah status'
  } finally {
    loading.value = false
  }
}

// Delete learning path
const deletePath = async id => {
  const result = await Swal.fire({
    title: 'Hapus Learning Path',
    text: 'Apakah Anda yakin ingin menghapus learning path ini?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  })

  if (!result.isConfirmed) {
    return
  }

  loading.value = true
  try {
    const response = await fetch(`http://localhost:8000/api/admin/learning-paths/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      console.log('✅ Learning path deleted')
      await fetchLearningPaths()
    } else {
      const data = await response.json()
      errors.submit = data.message || 'Failed to delete learning path'
    }
  } catch (err) {
    console.error('Error deleting learning path:', err)
    errors.submit = 'Failed to delete learning path'
  } finally {
    loading.value = false
  }
}

// Close form
const closeForm = () => {
  showAddForm.value = false
  editingId.value = null
  form.name = ''
  form.code = ''
  form.description = ''
  form.isActive = true
  form.dicodingIdPrefix = ''
  errors.name = ''
  errors.code = ''
  errors.dicodingIdPrefix = ''
  errors.submit = ''
}

// Handle logout
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchLearningPaths()
})
</script>
