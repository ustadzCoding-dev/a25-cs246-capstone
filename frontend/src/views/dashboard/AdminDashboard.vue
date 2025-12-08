<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
          Dashboard
        </h1>
        <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
          Selamat datang kembali,
          <span class="text-primary-600 font-semibold">{{ user?.name }}</span>
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="p-6 bg-white shadow-md flex flex-col gap-5 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            label="Total Tim"
            :value="stats.totalTeams"
            icon="team"
            color="primary"
            :change="stats.teamChange"
            trend="up"
          />
          <StatsCard label="Tim Pending" :value="stats.pendingTeams" icon="clock" color="warning" />
          <StatsCard
            label="Total Dokumen"
            :value="stats.totalDocuments"
            icon="document"
            color="success"
          />
          <StatsCard label="Total Siswa" :value="stats.totalStudents" icon="team" color="primary" />
        </div>

        <!-- Quick Actions - All Blue Theme -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Kelola Tim -->
          <div
            @click="$router.push('/admin/teams')"
            class="flex flex-col items-center p-4 border border-primary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
          >
            <svg
              class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="font-medium text-primary-600 mt-1 lg:text-sm md:text-sm sm:text-xs text-xs"
              >Kelola Tim</span
            >
          </div>

          <!-- Tambah Dokumen -->
          <div
            @click="$router.push('/admin/documents')"
            class="flex flex-col items-center p-4 border border-primary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
          >
            <svg
              class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
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
            <span class="font-medium text-primary-600 mt-1 lg:text-sm md:text-sm sm:text-xs text-xs"
              >Dokumen</span
            >
          </div>

          <!-- Buat Pengumuman -->
          <div
            @click="$router.push('/admin/announcements')"
            class="flex flex-col items-center p-4 border border-primary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
          >
            <svg
              class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
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
            <span class="font-medium text-primary-600 mt-1 lg:text-sm md:text-sm sm:text-xs text-xs"
              >Pengumuman</span
            >
          </div>

          <!-- Kelola User -->
          <div
            @click="$router.push('/admin/users')"
            class="flex flex-col items-center p-4 border border-primary-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 cursor-pointer"
          >
            <svg
              class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span class="font-medium text-primary-600 mt-1 lg:text-sm md:text-sm sm:text-xs text-xs"
              >User</span
            >
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="font-semibold text-gray-900 lg:text-lg md:text-base sm:text-base text-sm">
            Aktivitas Terbaru
          </h3>
          <div class="space-y-4 mt-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div class="flex-shrink-0">
                <div class="size-11 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg
                    class="size-7 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm lg:text-lg md:text-md sm:text-sm xs:text-sm text-gray-900">{{ activity.message }}</p>
                <p class="text-xs lg:text-md md:text-sm sm:text-xs xs:text-xs text-gray-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import { useDocumentStore } from '../../stores/documentStore'
import { useTimelineStore } from '../../stores/timelineStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import { getAdminDashboardStats } from '../../services/dashboardService'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()
const documentStore = useDocumentStore()
const timelineStore = useTimelineStore()

const user = computed(() => authStore.user)
const showAddDocumentModal = ref(false)
const showAddAnnouncementModal = ref(false)
const loading = ref(false)
const dashboardStats = ref(null)

// Get data from stores
const teamsLoading = computed(
  () => teamStore.teamsLoading || documentStore.documentsLoading || timelineStore.timelinesLoading
)

const stats = computed(() => {
  if (!dashboardStats.value) {
    return {
      totalTeams: 0,
      teamChange: 0,
      pendingTeams: 0,
      totalDocuments: 0,
      totalStudents: 0,
    }
  }

  return {
    totalTeams: dashboardStats.value.teams?.total || 0,
    teamChange: 0,
    pendingTeams: dashboardStats.value.teams?.pending || 0,
    totalDocuments: dashboardStats.value.documents?.total || 0,
    totalStudents: dashboardStats.value.users?.students || 0,
  }
})

const pendingTeams = computed(() => teamStore.pendingTeams.slice(0, 5))

const recentActivities = computed(() => {
  // Generate recent activities based on current data
  const activities = []

  if (stats.value.pendingTeams > 0) {
    activities.push({
      id: 1,
      message: `${stats.value.pendingTeams} tim menunggu persetujuan`,
      time: 'Baru saja',
    })
  }

  if (stats.value.totalDocuments > 0) {
    activities.push({
      id: 2,
      message: `Total ${stats.value.totalDocuments} dokumen tersedia`,
      time: 'Tersimpan',
    })
  }

  activities.push({
    id: 3,
    message: `${stats.value.totalTeams} tim terdaftar di sistem`,
    time: 'Update real-time',
  })

  return activities.length > 0
    ? activities
    : [{ id: 1, message: 'Sistem siap digunakan', time: 'Sekarang' }]
})

const { adminMenuItems } = useAdminMenu()

const approveTeam = async teamId => {
  try {
    await teamStore.approveTeam(teamId)
    // Refresh teams data
    await teamStore.fetchTeams()
  } catch (err) {
    console.error('Failed to approve team:', err)
  }
}

const rejectTeam = async teamId => {
  try {
    await teamStore.rejectTeam(teamId, 'Rejected by admin')
    // Refresh teams data
    await teamStore.fetchTeams()
  } catch (err) {
    console.error('Failed to reject team:', err)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  loading.value = true
  try {
    // Fetch dashboard stats from API
    const statsResponse = await getAdminDashboardStats()
    if (statsResponse.success) {
      dashboardStats.value = statsResponse.data
    }

    // Fetch all dashboard data in parallel
    await Promise.all([
      teamStore.fetchTeams(),
      documentStore.fetchDocuments({ limit: 10 }),
      timelineStore.fetchTimelines(),
    ])
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  } finally {
    loading.value = false
  }
})
</script>
