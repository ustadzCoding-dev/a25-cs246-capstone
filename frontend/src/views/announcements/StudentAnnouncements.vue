<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-900">Pengumuman</h1>
        <p class="text-gray-600 text-lg">Lihat pengumuman terbaru dari admin</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col gap-5">
        <div>
          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2">
              <BaseSearch v-model="searchQuery" placeholder="Cari pengumuman..." />
            </div>
            <div class="col-span-1">
              <BaseSelect
                v-model="filterPriority"
                :options="priorityOptions"
                placeholder="Semua Prioritas"
              />
            </div>
          </div>
        </div>

        <!-- Important Announcements Banner -->
        <div
          v-if="importantAnnouncements.length > 0"
          class="bg-danger-50 border-l-4 border-danger-500 p-6 rounded-lg"
        >
          <div class="flex items-start">
            <svg
              class="w-6 h-6 text-danger-600 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-danger-900 mb-2">
                Pengumuman Penting ({{ importantAnnouncements.length }})
              </h3>
              <p class="text-sm text-danger-700">
                Ada {{ importantAnnouncements.length }} pengumuman penting yang perlu Anda
                perhatikan.
              </p>
            </div>
          </div>
        </div>

        <!-- Announcements List -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-gray-900">Semua Pengumuman</h2>
              <span class="text-md text-gray-500"
                >{{ filteredAnnouncements.length }} pengumuman</span
              >
            </div>
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
            <p class="mt-2 text-sm text-gray-500">
              {{
                searchQuery || filterPriority
                  ? 'Tidak ada pengumuman yang sesuai'
                  : 'Belum ada pengumuman'
              }}
            </p>
          </div>

          <div v-else class="divide-y divide-gray-200">
            <div
              v-for="announcement in filteredAnnouncements"
              :key="announcement.id || announcement._id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <AnnouncementCard
                :title="announcement.title"
                :content="announcement.content"
                :date="announcement.date"
                :priority="announcement.priority"
                :can-delete="false"
                @read="markAsRead(announcement.id || announcement._id)"
                class="!bg-transparent !border-0 !shadow-none !p-0"
              />
            </div>
          </div>
        </div>

        <!-- Pagination (if needed) -->
        <div v-if="totalPages > 1" class="flex justify-center">
          <nav class="inline-flex rounded-md shadow-sm -space-x-px">
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-4 py-2 border text-sm font-medium',
                page === currentPage
                  ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </nav>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAnnouncementStore } from '../../stores/announcementStore'
import { useStudentMenu } from '../../composables/useStudentMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import AnnouncementCard from '../../components/display/AnnouncementCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const announcementStore = useAnnouncementStore()

// Ensure this is the student announcements page
console.log('Loading student announcements page')
console.log('User role:', authStore.user?.role)
console.log('Is admin:', authStore.isAdmin)

const user = computed(() => authStore.user)
const loading = computed(() => announcementStore.announcementsLoading)

const searchQuery = ref('')
const filterPriority = ref('')
const currentPage = ref(1)
const itemsPerPage = 10

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

const { studentMenuItems } = useStudentMenu()

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

  // Sort by date (newest first)
  result = result.sort((a, b) => new Date(b.date) - new Date(a.date))

  return result
})

const importantAnnouncements = computed(() => {
  return announcements.value.filter(a => a.priority === 'important' && !a.isRead)
})

const totalPages = computed(() => {
  return Math.ceil(filteredAnnouncements.value.length / itemsPerPage)
})

const markAsRead = async announcementId => {
  try {
    await announcementStore.markAsRead(announcementId)
  } catch (err) {
    console.error('Failed to mark announcement as read:', err)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    await announcementStore.fetchAnnouncements()
  } catch (err) {
    console.error('Failed to fetch announcements:', err)
  }
})
</script>
