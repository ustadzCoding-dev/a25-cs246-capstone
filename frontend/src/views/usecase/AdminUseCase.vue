<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Kelola Use Case</h1>
        <p class="mt-2 text-gray-600">Manage use cases dan set team composition requirements</p>
      </div>

      <!-- Add Use Case Button -->
      <div class="flex justify-end">
        <button
          @click="showCreateModal = true"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          + Tambah Use Case
        </button>
      </div>

      <!-- Use Cases List -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Daftar Use Case</h2>
        </div>

        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>

        <div v-else-if="useCases.length === 0" class="p-12 text-center">
          <p class="text-gray-500">Belum ada use case</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="useCase in useCases"
            :key="useCase.id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <h3 class="text-lg font-semibold text-gray-900">{{ useCase.title }}</h3>
                  <span
                    class="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2.5 py-0.5 rounded"
                  >
                    {{ useCase.usecaseId }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ useCase.description }}</p>

                <!-- Current Composition -->
                <div class="mt-4 bg-gray-50 rounded p-3">
                  <p class="text-sm font-medium text-gray-700 mb-2">Komposisi Tim Saat Ini:</p>
                  <div
                    v-if="useCase.teamComposition && useCase.teamComposition.length > 0"
                    class="space-y-1"
                  >
                    <div
                      v-for="comp in useCase.teamComposition"
                      :key="comp.learningPathId || comp.learningPath"
                      class="text-sm text-gray-600"
                    >
                      • {{ comp.count }} orang dari {{ comp.learningPathName || comp.learningPath }}
                    </div>
                    <p class="text-sm font-semibold text-gray-700 mt-2">
                      Total: {{ useCase.totalTeamSize }} anggota
                    </p>
                  </div>
                  <p v-else class="text-sm text-gray-500 italic">Belum ada komposisi yang di-set</p>
                </div>
              </div>

              <div class="ml-4 flex space-x-2">
                <button
                  @click="openCompositionModal(useCase)"
                  class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Set Komposisi
                </button>
                <button
                  @click="deleteUseCase(useCase)"
                  class="px-4 py-2 bg-danger-600 text-white rounded-lg hover:bg-danger-700 transition-colors text-sm font-medium"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Use Case Modal -->
      <div
        v-if="showCreateModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Tambah Use Case Baru</h3>
          </div>

          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Use Case ID <span class="text-danger-500">*</span>
              </label>
              <input
                v-model="createForm.usecaseId"
                type="text"
                placeholder="e.g., DC-01"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Judul <span class="text-danger-500">*</span>
              </label>
              <input
                v-model="createForm.title"
                type="text"
                placeholder="e.g., E-Commerce Platform"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi <span class="text-danger-500">*</span>
              </label>
              <textarea
                v-model="createForm.description"
                placeholder="Deskripsi use case..."
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"> Partner </label>
              <input
                v-model="createForm.partner"
                type="text"
                placeholder="e.g., PT ABC"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Total Slots <span class="text-danger-500">*</span>
                </label>
                <input
                  v-model.number="createForm.totalSlots"
                  type="number"
                  min="1"
                  placeholder="e.g., 10"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"> Difficulty </label>
                <select
                  v-model="createForm.difficulty"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex space-x-3">
            <button
              @click="closeCreateModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              @click="saveUseCase"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Composition Modal -->
      <div
        v-if="showCompositionModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Set Team Composition</h3>
            <p class="text-sm text-gray-600 mt-1">{{ selectedUseCase?.title }}</p>
          </div>

          <div class="p-6 space-y-4">
            <!-- Learning Path Inputs -->
            <div v-for="(comp, index) in compositionForm" :key="index" class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Learning Path {{ index + 1 }}
              </label>
              <select
                v-model="comp.learningPathId"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="" disabled>Pilih Learning Path</option>
                <option v-for="lp in learningPaths" :key="lp._id" :value="lp._id">
                  {{ lp.name }}
                </option>
              </select>

              <label class="block text-sm font-medium text-gray-700"> Jumlah Anggota </label>
              <input
                v-model.number="comp.count"
                type="number"
                min="1"
                placeholder="e.g., 3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />

              <button
                v-if="compositionForm.length > 1"
                @click="removeCompositionRow(index)"
                class="text-sm text-danger-600 hover:text-danger-700"
              >
                Hapus
              </button>
            </div>

            <!-- Add Row Button -->
            <button
              @click="addCompositionRow"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              + Tambah Learning Path
            </button>

            <!-- Total Team Size -->
            <div class="bg-blue-50 border border-blue-200 rounded p-3">
              <p class="text-sm text-blue-700">
                <span class="font-semibold">Total Tim:</span> {{ totalTeamSize }} anggota
              </p>
            </div>
          </div>

          <div class="px-6 py-4 border-t border-gray-200 flex space-x-3">
            <button
              @click="closeCompositionModal"
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Batal
            </button>
            <button
              @click="saveComposition"
              :disabled="saving"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
            >
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const loading = ref(false)
const saving = ref(false)
const useCases = ref([])
const learningPaths = ref([])
const showCreateModal = ref(false)
const showCompositionModal = ref(false)
const selectedUseCase = ref(null)
const compositionForm = ref([])

const createForm = reactive({
  usecaseId: '',
  title: '',
  description: '',
  partner: '',
  totalSlots: 10,
  difficulty: 'medium',
})

const { adminMenuItems } = useAdminMenu()

const totalTeamSize = computed(() => {
  return compositionForm.value.reduce((sum, comp) => sum + (comp.count || 0), 0)
})

const fetchLearningPaths = async () => {
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiBaseUrl}/admin/learning-paths`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await response.json()
    learningPaths.value = data.data || []
    console.log('Learning paths loaded:', learningPaths.value.length)
  } catch (err) {
    console.error('Failed to fetch learning paths:', err)
  }
}

const fetchUseCases = async () => {
  loading.value = true
  try {
    // Fetch use cases from API
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiBaseUrl}/usecases`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
    const data = await response.json()
    useCases.value = data.data || []
  } catch (err) {
    console.error('Failed to fetch use cases:', err)
  } finally {
    loading.value = false
  }
}

const openCompositionModal = useCase => {
  selectedUseCase.value = useCase
  compositionForm.value =
    useCase.teamComposition && useCase.teamComposition.length > 0
      ? JSON.parse(JSON.stringify(useCase.teamComposition))
      : [{ learningPathId: '', count: 1 }]
  showCompositionModal.value = true
}

const closeCompositionModal = () => {
  showCompositionModal.value = false
  selectedUseCase.value = null
  compositionForm.value = []
}

const addCompositionRow = () => {
  compositionForm.value.push({ learningPathId: '', count: 1 })
}

const removeCompositionRow = index => {
  compositionForm.value.splice(index, 1)
}

const saveComposition = async () => {
  if (!selectedUseCase.value) return

  // Validate
  if (compositionForm.value.some(comp => !comp.learningPathId || comp.count < 1)) {
    Swal.fire({
      icon: 'warning',
      title: 'Perhatian',
      text: 'Semua field harus diisi dengan benar',
    })
    return
  }

  saving.value = true
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const response = await fetch(
      `${apiBaseUrl}/usecase/${selectedUseCase.value.id || selectedUseCase.value._id}/team-composition`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          teamComposition: compositionForm.value,
        }),
      }
    )

    if (response.ok) {
      const data = await response.json()
      // Update local state
      const index = useCases.value.findIndex(
        uc => (uc.id || uc._id) === (selectedUseCase.value.id || selectedUseCase.value._id)
      )
      if (index !== -1) {
        useCases.value[index] = data.data
      }
      closeCompositionModal()
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Komposisi tim berhasil disimpan!' })
    } else {
      const errorData = await response.json()
      console.error('Error response:', errorData)
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal menyimpan komposisi tim: ${errorData.message || response.statusText}`,
      })
    }
  } catch (err) {
    console.error('Failed to save composition:', err)
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: `Gagal menyimpan komposisi tim: ${err.message}`,
    })
  } finally {
    saving.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  createForm.usecaseId = ''
  createForm.title = ''
  createForm.description = ''
  createForm.partner = ''
  createForm.totalSlots = 10
  createForm.difficulty = 'medium'
}

const saveUseCase = async () => {
  // Validate
  if (
    !createForm.usecaseId ||
    !createForm.title ||
    !createForm.description ||
    !createForm.totalSlots
  ) {
    Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Semua field wajib diisi' })
    return
  }

  saving.value = true
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const response = await fetch(`${apiBaseUrl}/usecases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        usecaseId: createForm.usecaseId,
        title: createForm.title,
        description: createForm.description,
        partner: createForm.partner,
        totalSlots: createForm.totalSlots,
        difficulty: createForm.difficulty,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      useCases.value.push(data.data)
      closeCreateModal()
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Use case berhasil ditambahkan!' })
    } else {
      const errorData = await response.json()
      console.error('Error response:', errorData)
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: `Gagal menambahkan use case: ${errorData.message || response.statusText}`,
      })
    }
  } catch (err) {
    console.error('Failed to create use case:', err)
    Swal.fire({ icon: 'error', title: 'Gagal', text: `Gagal menambahkan use case: ${err.message}` })
  } finally {
    saving.value = false
  }
}

const deleteUseCase = async useCase => {
  const result = await Swal.fire({
    title: `Yakin hapus use case "${useCase.title}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626' /* red-600 */,
    cancelButtonColor: '#6b7280' /* gray-500 */,
  })

  if (!result.isConfirmed) return

  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
    const response = await fetch(
      `${apiBaseUrl}/usecases/${useCase.id || useCase._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    )

    if (response.ok) {
      useCases.value = useCases.value.filter(
        uc => (uc.id || uc._id) !== (useCase.id || useCase._id)
      )
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Use case berhasil dihapus!' })
    } else {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus use case' })
    }
  } catch (err) {
    console.error('Failed to delete use case:', err)
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus use case' })
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchLearningPaths()
  fetchUseCases()
})
</script>
