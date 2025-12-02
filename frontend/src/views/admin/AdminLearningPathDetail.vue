<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <router-link to="/admin/learning-paths" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
            ← Kembali ke Learning Paths
          </router-link>
          <h1 class="text-3xl font-bold text-gray-900 mt-2">{{ learningPath?.name || 'Loading...' }}</h1>
          <p class="mt-2 text-gray-600">Detail learning path dan member</p>
        </div>

        <BaseButton variant="primary" @click="showEditModal = true" v-if="learningPath">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <BaseSpinner centered size="lg" label="Memuat detail..." />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <p class="text-danger-700">{{ error }}</p>
        <BaseButton variant="outline" @click="fetchDetail" class="mt-4">
          Coba Lagi
        </BaseButton>
      </div>

      <!-- Content -->
      <div v-else-if="learningPath" class="space-y-6">
        <!-- Learning Path Info -->
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Informasi Learning Path</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama</label>
              <p class="mt-1 text-gray-900">{{ learningPath.name }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Kode</label>
              <p class="mt-1 text-gray-900">{{ learningPath.code }}</p>
            </div>

            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Deskripsi</label>
              <p class="mt-1 text-gray-900">{{ learningPath.description }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Status</label>
              <div class="mt-1">
                <BaseBadge :variant="learningPath.isActive ? 'success' : 'warning'">
                  {{ learningPath.isActive ? 'Aktif' : 'Nonaktif' }}
                </BaseBadge>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Dibuat</label>
              <p class="mt-1 text-gray-900">{{ formatDate(learningPath.createdAt) }}</p>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            label="Total Members"
            :value="stats.totalMembers"
            icon="team"
            color="primary"
          />
          <StatsCard
            label="Total Teams"
            :value="stats.totalTeams"
            icon="settings"
            color="success"
          />
          <StatsCard
            label="Completion Rate"
            :value="`${stats.completionRate}%`"
            icon="check"
            color="warning"
          />
        </div>

        <!-- Members List -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Members ({{ members.length }})</h2>
              <BaseInput
                v-model="searchQuery"
                placeholder="Cari member..."
                class="w-64"
              />
            </div>
          </div>

          <div v-if="members.length === 0" class="p-12 text-center">
            <p class="text-gray-500">Belum ada member dalam learning path ini</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Student ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Nama</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Team</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="member in filteredMembers" :key="member._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ member.dicodingId || '-' }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">{{ member.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ member.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ member.capstoneGroupId ? 'Sudah ada' : 'Belum ada' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <BaseModal v-model="showEditModal" title="Edit Learning Path" size="lg">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="editForm.name"
          label="Nama"
          :error="editErrors.name"
          required
        />

        <BaseInput
          v-model="editForm.code"
          label="Kode"
          :error="editErrors.code"
          required
        />

        <BaseTextarea
          v-model="editForm.description"
          label="Deskripsi"
          :error="editErrors.description"
          :rows="3"
        />

        <div class="flex items-center">
          <input
            type="checkbox"
            v-model="editForm.isActive"
            id="isActive"
            class="rounded"
          />
          <label for="isActive" class="ml-2 text-sm text-gray-700">Aktif</label>
        </div>

        <div v-if="editError" class="p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <p class="text-sm text-danger-700">{{ editError }}</p>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showEditModal = false">
            Batal
          </BaseButton>
          <BaseButton variant="primary" :loading="editSubmitting" @click="handleSubmit">
            Simpan Perubahan
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import api from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { adminMenuItems } = useAdminMenu()

const user = computed(() => authStore.user)

// State
const loading = ref(false)
const error = ref('')
const learningPath = ref(null)
const members = ref([])
const searchQuery = ref('')

const showEditModal = ref(false)
const editSubmitting = ref(false)
const editError = ref('')

const editForm = reactive({
  name: '',
  code: '',
  description: '',
  isActive: true
})

const editErrors = reactive({
  name: '',
  code: '',
  description: ''
})

// Computed
const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value

  const query = searchQuery.value.toLowerCase()
  return members.value.filter(m =>
    m.name.toLowerCase().includes(query) ||
    m.email.toLowerCase().includes(query) ||
    (m.dicodingId && m.dicodingId.toLowerCase().includes(query))
  )
})

const stats = computed(() => ({
  totalMembers: members.value.length,
  totalTeams: members.value.filter(m => m.capstoneGroupId).length,
  completionRate: members.value.length > 0
    ? Math.round((members.value.filter(m => m.capstoneGroupId).length / members.value.length) * 100)
    : 0
}))

// Methods
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const fetchDetail = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get(`/admin/learning-paths/${route.params.id}`)

    if (response.success) {
      learningPath.value = response.data
      editForm.name = response.data.name
      editForm.code = response.data.code
      editForm.description = response.data.description
      editForm.isActive = response.data.isActive

      // Get members from response data (already fetched by backend)
      members.value = response.data.members || []
      console.log('[AdminLearningPathDetail] Members loaded:', members.value.length, 'members:', members.value)
    } else {
      error.value = response.message || 'Gagal memuat detail learning path'
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat detail learning path'
    console.error('Error fetching learning path detail:', err)
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  // Validate
  editErrors.name = editForm.name ? '' : 'Nama harus diisi'
  editErrors.code = editForm.code ? '' : 'Kode harus diisi'

  if (editErrors.name || editErrors.code) return

  editSubmitting.value = true
  editError.value = ''

  try {
    const response = await api.put(`/admin/learning-paths/${route.params.id}`, {
      name: editForm.name,
      code: editForm.code,
      description: editForm.description,
      isActive: editForm.isActive
    })

    if (response.success) {
      learningPath.value = response.data
      showEditModal.value = false
    } else {
      editError.value = response.message || 'Gagal menyimpan perubahan'
    }
  } catch (err) {
    editError.value = err.message || 'Gagal menyimpan perubahan'
    console.error('Error updating learning path:', err)
  } finally {
    editSubmitting.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  fetchDetail()
})
</script>
