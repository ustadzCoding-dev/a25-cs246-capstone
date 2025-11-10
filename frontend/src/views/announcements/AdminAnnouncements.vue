<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kelola Pengumuman</h1>
          <p class="mt-2 text-gray-600">Buat dan kelola pengumuman untuk siswa</p>
        </div>
        
        <BaseButton
          variant="primary"
          @click="showCreateModal = true"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Buat Pengumuman
        </BaseButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Pengumuman"
          :value="stats.total"
          icon="chart"
          color="primary"
        />
        <StatsCard
          label="Pengumuman Penting"
          :value="stats.important"
          icon="chart"
          color="danger"
        />
        <StatsCard
          label="Bulan Ini"
          :value="stats.thisMonth"
          icon="chart"
          color="success"
        />
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseSearch
            v-model="searchQuery"
            placeholder="Cari pengumuman..."
          />
          
          <BaseSelect
            v-model="filterPriority"
            :options="priorityOptions"
            placeholder="Semua Prioritas"
          />
        </div>
      </div>

      <!-- Announcements List -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Daftar Pengumuman</h2>
        </div>

        <div v-if="loading" class="p-12">
          <BaseSpinner centered size="lg" label="Memuat pengumuman..." />
        </div>

        <div v-else-if="filteredAnnouncements.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Belum ada pengumuman</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <AnnouncementCard
            v-for="announcement in filteredAnnouncements"
            :key="announcement._id"
            :title="announcement.title"
            :content="announcement.content"
            :date="announcement.date"
            :priority="announcement.priority"
            :can-delete="true"
            @delete="handleDelete(announcement)"
            class="!border-0 !shadow-none"
          />
        </div>
      </div>
    </div>

    <!-- Create/Edit Announcement Modal -->
    <BaseModal
      v-model="showCreateModal"
      :title="editingAnnouncement ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'"
      size="lg"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <BaseInput
          v-model="form.title"
          label="Judul Pengumuman"
          placeholder="Masukkan judul pengumuman"
          :error="errors.title"
          required
        />

        <BaseTextarea
          v-model="form.content"
          label="Isi Pengumuman"
          placeholder="Masukkan isi pengumuman"
          :rows="6"
          :max-length="500"
          :error="errors.content"
          required
        />

        <BaseSelect
          v-model="form.priority"
          label="Prioritas"
          :options="priorityOptions"
          :error="errors.priority"
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
            {{ editingAnnouncement ? 'Simpan Perubahan' : 'Buat Pengumuman' }}
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
          Apakah Anda yakin ingin menghapus pengumuman <strong>{{ selectedAnnouncement?.title }}</strong>?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700">
            Tindakan ini tidak dapat dibatalkan.
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
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import AnnouncementCard from '../../components/display/AnnouncementCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const loading = ref(false)
const submitting = ref(false)
const deleting = ref(false)
const error = ref('')

const searchQuery = ref('')
const filterPriority = ref('')

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const editingAnnouncement = ref(null)
const selectedAnnouncement = ref(null)

const form = reactive({
  title: '',
  content: '',
  priority: 'normal'
})

const errors = reactive({
  title: '',
  content: '',
  priority: ''
})

const stats = ref({
  total: 12,
  important: 3,
  thisMonth: 8
})

const announcements = ref([
  {
    _id: '1',
    title: 'Deadline Submission Minggu 3',
    content: 'Harap submit laporan kemajuan minggu 3 sebelum tanggal 15 November 2025. Pastikan semua dokumen lengkap.',
    date: '2025-11-10',
    priority: 'important'
  },
  {
    _id: '2',
    title: 'Sesi Mentoring Pekan Ini',
    content: 'Sesi mentoring akan diadakan pada hari Rabu, 13 November 2025 pukul 19:00 WIB. Link Zoom akan dikirimkan via email.',
    date: '2025-11-09',
    priority: 'normal'
  },
  {
    _id: '3',
    title: 'Update Template Laporan',
    content: 'Template laporan akhir telah diperbarui. Silakan download versi terbaru dari halaman Dokumen.',
    date: '2025-11-08',
    priority: 'normal'
  }
])

const priorityOptions = [
  { value: '', label: 'Semua Prioritas' },
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Penting' }
]

const adminMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
  { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
  { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
  { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] }
]

const filteredAnnouncements = computed(() => {
  let result = announcements.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.content.toLowerCase().includes(query)
    )
  }

  if (filterPriority.value) {
    result = result.filter(a => a.priority === filterPriority.value)
  }

  return result
})

const validateForm = () => {
  errors.title = ''
  errors.content = ''
  errors.priority = ''

  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Judul wajib diisi'
    isValid = false
  }

  if (!form.content.trim()) {
    errors.content = 'Isi pengumuman wajib diisi'
    isValid = false
  }

  if (!form.priority) {
    errors.priority = 'Prioritas wajib dipilih'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  error.value = ''

  try {
    // TODO: Call API
    console.log('Submitting announcement:', form)

    await new Promise(resolve => setTimeout(resolve, 1000))

    if (editingAnnouncement.value) {
      // Update existing
      const index = announcements.value.findIndex(a => a._id === editingAnnouncement.value._id)
      announcements.value[index] = {
        ...editingAnnouncement.value,
        ...form,
        date: new Date().toISOString().split('T')[0]
      }
    } else {
      // Create new
      announcements.value.unshift({
        _id: Date.now().toString(),
        ...form,
        date: new Date().toISOString().split('T')[0]
      })
      stats.value.total++
      if (form.priority === 'important') stats.value.important++
    }

    closeModal()

  } catch (err) {
    error.value = err.message || 'Gagal menyimpan pengumuman'
  } finally {
    submitting.value = false
  }
}

const handleDelete = (announcement) => {
  selectedAnnouncement.value = announcement
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleting.value = true

  try {
    // TODO: Call API
    console.log('Deleting announcement:', selectedAnnouncement.value._id)

    await new Promise(resolve => setTimeout(resolve, 1000))

    announcements.value = announcements.value.filter(a => a._id !== selectedAnnouncement.value._id)
    stats.value.total--
    if (selectedAnnouncement.value.priority === 'important') stats.value.important--

    showDeleteModal.value = false

  } catch (err) {
    console.error('Failed to delete:', err)
  } finally {
    deleting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  editingAnnouncement.value = null
  form.title = ''
  form.content = ''
  form.priority = 'normal'
  error.value = ''
  Object.keys(errors).forEach(key => errors[key] = '')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  loading.value = true
  try {
    // TODO: Fetch announcements
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
})
</script>
