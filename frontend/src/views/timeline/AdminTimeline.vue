<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kelola Timeline</h1>
          <p class="mt-2 text-gray-600">Kelola timeline dan deadline capstone project</p>
        </div>
        
        <BaseButton
          variant="primary"
          @click="showCreateModal = true"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Timeline
        </BaseButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          label="Total Timeline"
          :value="stats.total"
          icon="timeline"
          color="primary"
        />
        <StatsCard
          label="Aktif"
          :value="stats.active"
          icon="timeline"
          color="success"
        />
        <StatsCard
          label="Mendatang"
          :value="stats.upcoming"
          icon="clock"
          color="warning"
        />
        <StatsCard
          label="Selesai"
          :value="stats.completed"
          icon="timeline"
          color="secondary"
        />
      </div>

      <!-- Timeline List -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Daftar Timeline</h2>
        </div>

        <div v-if="loading" class="p-12">
          <BaseSpinner centered size="lg" label="Memuat timeline..." />
        </div>

        <div v-else-if="timelineItems.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Belum ada timeline</p>
        </div>

        <div v-else class="p-6">
          <div class="space-y-8">
            <div
              v-for="(item, index) in timelineItems"
              :key="item._id"
              class="relative"
            >
              <!-- Timeline Line -->
              <div
                v-if="index < timelineItems.length - 1"
                class="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200"
              ></div>

              <!-- Timeline Item -->
              <div class="flex items-start space-x-4">
                <!-- Icon -->
                <div
                  :class="[
                    'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center z-10',
                    getStatusColor(item.status)
                  ]"
                >
                  <svg v-if="item.status === 'completed'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-3">
                        <h3 class="text-base font-semibold text-gray-900">{{ item.title }}</h3>
                        <BaseBadge :variant="getStatusVariant(item.status)">
                          {{ getStatusLabel(item.status) }}
                        </BaseBadge>
                      </div>
                      <p class="mt-1 text-sm text-gray-600">{{ item.description }}</p>
                      <div class="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                        <span>{{ formatDateRange(item.startDate, item.endDate) }}</span>
                        <span v-if="item.status === 'active'" class="text-warning-600 font-medium">
                          • {{ getDaysRemaining(item.endDate) }} hari tersisa
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center space-x-2 ml-4">
                      <button
                        @click="editTimeline(item)"
                        class="text-gray-600 hover:text-gray-700 p-2"
                        title="Edit"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        @click="deleteTimeline(item)"
                        class="text-danger-600 hover:text-danger-700 p-2"
                        title="Hapus"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Timeline Modal -->
    <BaseModal
      v-model="showCreateModal"
      :title="editingTimeline ? 'Edit Timeline' : 'Tambah Timeline Baru'"
      size="lg"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Judul"
          placeholder="Contoh: Minggu 3 - Development Sprint"
          :error="errors.title"
          required
        />

        <BaseTextarea
          v-model="form.description"
          label="Deskripsi"
          placeholder="Deskripsi detail timeline"
          :rows="3"
          :error="errors.description"
          required
        />

        <div class="grid grid-cols-2 gap-4">
          <BaseDatePicker
            v-model="form.startDate"
            label="Tanggal Mulai"
            :error="errors.startDate"
            required
          />

          <BaseDatePicker
            v-model="form.endDate"
            label="Tanggal Selesai"
            :min="form.startDate"
            :error="errors.endDate"
            required
          />
        </div>

        <BaseSelect
          v-model="form.status"
          label="Status"
          :options="statusOptions"
          :error="errors.status"
          required
        />

        <div v-if="error" class="p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <p class="text-sm text-danger-700">{{ error }}</p>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="closeModal">
            Batal
          </BaseButton>
          <BaseButton
            variant="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ editingTimeline ? 'Simpan Perubahan' : 'Tambah Timeline' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Konfirmasi Hapus"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus timeline <strong>{{ selectedTimeline?.title }}</strong>?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700">
            Timeline yang dihapus tidak dapat dikembalikan.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false">
            Batal
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deleting"
            @click="confirmDelete"
          >
            Ya, Hapus
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
import { useTimelineStore } from '../../stores/timelineStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseDatePicker from '../../components/base/BaseDatePicker.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const timelineStore = useTimelineStore()

const user = computed(() => authStore.user)
const submitting = ref(false)
const deleting = ref(false)
const error = ref('')

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingTimeline = ref(null)
const selectedTimeline = ref(null)

const form = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: 'upcoming'
})

const errors = reactive({
  title: '',
  description: '',
  startDate: '',
  endDate: '',
  status: ''
})

// Get data from store
const loading = computed(() => timelineStore.timelinesLoading)
const timelineItems = computed(() => timelineStore.sortedTimelines)

// Calculate stats
const stats = computed(() => ({
  total: timelineItems.value.length,
  active: timelineStore.ongoingTimelines.length,
  upcoming: timelineItems.value.filter(t => t.status === 'upcoming').length,
  completed: timelineStore.completedTimelines.length
}))

const statusOptions = [
  { value: 'upcoming', label: 'Mendatang' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Selesai' }
]

const adminMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
  { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
  { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
  { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] }
]

const getStatusColor = (status) => {
  const colors = {
    'upcoming': 'bg-gray-400',
    'active': 'bg-warning-500',
    'completed': 'bg-success-500'
  }
  return colors[status] || 'bg-gray-400'
}

const getStatusVariant = (status) => {
  const variants = {
    'upcoming': 'secondary',
    'active': 'warning',
    'completed': 'success'
  }
  return variants[status] || 'secondary'
}

const getStatusLabel = (status) => {
  const labels = {
    'upcoming': 'Mendatang',
    'active': 'Aktif',
    'completed': 'Selesai'
  }
  return labels[status] || status
}

const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  const endDate = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${startDate} - ${endDate}`
}

const getDaysRemaining = (endDate) => {
  const today = new Date()
  const end = new Date(endDate)
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

const validateForm = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Judul wajib diisi'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Deskripsi wajib diisi'
    isValid = false
  }

  if (!form.startDate) {
    errors.startDate = 'Tanggal mulai wajib diisi'
    isValid = false
  }

  if (!form.endDate) {
    errors.endDate = 'Tanggal selesai wajib diisi'
    isValid = false
  } else if (new Date(form.endDate) < new Date(form.startDate)) {
    errors.endDate = 'Tanggal selesai harus setelah tanggal mulai'
    isValid = false
  }

  if (!form.status) {
    errors.status = 'Status wajib dipilih'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  error.value = ''

  try {
    const timelineData = {
      title: form.title,
      description: form.description,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status
    }

    if (editingTimeline.value) {
      await timelineStore.updateTimeline(editingTimeline.value._id || editingTimeline.value.id, timelineData)
    } else {
      await timelineStore.createTimeline(timelineData)
    }

    closeModal()
    await fetchTimelines()
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan timeline'
  } finally {
    submitting.value = false
  }
}

const editTimeline = (item) => {
  editingTimeline.value = item
  form.title = item.title
  form.description = item.description
  form.startDate = item.startDate
  form.endDate = item.endDate
  form.status = item.status
  showCreateModal.value = true
}

const deleteTimeline = (item) => {
  selectedTimeline.value = item
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await timelineStore.deleteTimeline(selectedTimeline.value._id || selectedTimeline.value.id)
    showDeleteModal.value = false
    await fetchTimelines()
  } finally {
    deleting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingTimeline.value = null
  form.title = ''
  form.description = ''
  form.startDate = ''
  form.endDate = ''
  form.status = 'upcoming'
  error.value = ''
  Object.keys(errors).forEach(key => errors[key] = '')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchTimelines = async () => {
  try {
    await timelineStore.fetchTimelines()
  } catch (err) {
    console.error('Failed to fetch timelines:', err)
  }
}

onMounted(() => {
  fetchTimelines()
})
</script>
