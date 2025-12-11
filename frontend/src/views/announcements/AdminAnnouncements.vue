<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div
        class="pb-4 bg-white p-5 rounded-lg shadow-md flex justify-start items-start flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
            Manage Announcements
          </h1>
          <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
            Buat dan kelola pengumuman untuk peserta
          </p>
        </div>
        <BaseButton variant="primary" @click="showCreateModal = true">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Buat Pengumuman
        </BaseButton>
      </div>

      <div class="p-6 bg-white shadow-md rounded-lg flex flex-col gap-5">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard label="Total Pengumuman" :value="stats.total" icon="chart" color="primary" />
          <StatsCard
            label="Pengumuman Penting"
            :value="stats.important"
            icon="chart"
            color="danger"
          />
          <StatsCard label="Bulan Ini" :value="stats.thisMonth" icon="chart" color="success" />
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-2">
              <BaseSearch v-model="searchQuery" placeholder="Cari pengumuman..." />
            </div>

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
            <h2 class="lg:text-lg md:text-base sm:text-base text-sm font-semibold text-gray-900">
              Daftar Pengumuman
            </h2>
          </div>

          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else-if="filteredAnnouncements.length === 0" class="p-12 text-center">
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
                d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
              />
            </svg>
            <p class="mt-2 text-sm text-gray-500">Belum ada pengumuman</p>
          </div>

          <div v-else class="divide-y divide-gray-200 space-y-3">
            <AnnouncementCard
              v-for="announcement in filteredAnnouncements"
              :key="announcement._id"
              :title="announcement.title"
              :content="announcement.content"
              :date="announcement.date"
              :priority="announcement.priority"
              :can-delete="true"
              @edit="editAnnouncement(announcement)"
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
            <BaseButton variant="outline" @click="closeModal"> Batal </BaseButton>
            <BaseButton variant="primary" :loading="submitting" @click="handleSubmit">
              {{ editingAnnouncement ? 'Simpan Perubahan' : 'Buat Pengumuman' }}
            </BaseButton>
          </div>
        </template>
      </BaseModal>

      <!-- Delete Confirmation Modal -->
      <BaseModal v-model="showDeleteModal" title="Konfirmasi Hapus" size="md">
        <div class="space-y-4">
          <p class="text-gray-700">
            Apakah Anda yakin ingin menghapus pengumuman
            <strong>{{ selectedAnnouncement?.title }}</strong
            >?
          </p>
          <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <p class="text-sm text-danger-700">Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <BaseButton variant="outline" @click="showDeleteModal = false"> Batal </BaseButton>
            <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">
              Ya, Hapus
            </BaseButton>
          </div>
        </template>
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAnnouncementStore } from '../../stores/announcementStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
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
const announcementStore = useAnnouncementStore()

// Redirect non-admin users to student announcements
if (!authStore.isAdmin) {
  console.log('Non-admin user accessing admin announcements, redirecting to student announcements')
  router.push('/announcements')
}

console.log('User role:', authStore.user?.role)
console.log('Is admin:', authStore.isAdmin)

const user = computed(() => authStore.user)
const loading = computed(() => announcementStore.announcementsLoading)
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
  priority: 'normal',
})

const errors = reactive({
  title: '',
  content: '',
  priority: '',
})

const stats = computed(() => {
  const list = announcements.value
  const total = list.length
  const important = list.filter(a => a.priority === 'important').length

  const now = new Date()
  const thisMonth = list.filter(a => {
    const d = new Date(a.createdAt || a.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return {
    total,
    important,
    thisMonth,
  }
})

const announcements = computed(() => {
  return (announcementStore.announcements || []).map(a => ({
    ...a,
    date: a.date || a.createdAt,
  }))
})

const priorityOptions = [
  { value: '', label: 'Semua Prioritas' },
  { value: 'normal', label: 'Normal' },
  { value: 'important', label: 'Penting' },
]

const { adminMenuItems } = useAdminMenu()

const filteredAnnouncements = computed(() => {
  let result = announcements.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      a => a.title.toLowerCase().includes(query) || a.content.toLowerCase().includes(query)
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
    if (editingAnnouncement.value) {
      await announcementStore.updateAnnouncement(
        editingAnnouncement.value._id || editingAnnouncement.value.id,
        { ...form }
      )
    } else {
      await announcementStore.createAnnouncement({ ...form })
    }

    await announcementStore.fetchAnnouncements()
    closeModal()
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan pengumuman'
  } finally {
    submitting.value = false
  }
}

const editAnnouncement = announcement => {
  editingAnnouncement.value = announcement
  form.title = announcement.title
  form.content = announcement.content
  form.priority = announcement.priority
  showCreateModal.value = true
}

const handleDelete = announcement => {
  selectedAnnouncement.value = announcement
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleting.value = true

  try {
    await announcementStore.deleteAnnouncement(
      selectedAnnouncement.value._id || selectedAnnouncement.value.id
    )

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
  Object.keys(errors).forEach(key => (errors[key] = ''))
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    // TODO: Fetch announcements
    await announcementStore.fetchAnnouncements()
  } catch (err) {
    console.error('Failed to fetch announcements:', err)
  }
})
</script>
