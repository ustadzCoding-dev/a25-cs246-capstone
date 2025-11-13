<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="mt-2 text-gray-600">Selamat datang kembali, {{ user?.name }}!</p>
      </div>

      <!-- Team Status Card -->
      <TeamStatusCard
        v-if="hasTeam"
        :team-name="teamInfo.teamName"
        :leader-name="teamInfo.leaderName"
        :use-case="teamInfo.useCase"
        :status="teamInfo.status"
        :members="teamInfo.members"
      />

      <!-- No Team Alert -->
      <div v-else class="bg-warning-50 border border-warning-200 rounded-lg p-6">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-warning-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-base font-semibold text-warning-900">Anda Belum Terdaftar di Tim</h3>
            <p class="mt-1 text-sm text-warning-700">
              Silakan bergabung dengan tim atau buat tim baru untuk melanjutkan program capstone.
            </p>
            <div class="mt-4">
              <BaseButton
                variant="warning"
                @click="$router.push('/team')"
              >
                Kelola Tim
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Dokumen Tersedia"
          :value="stats.totalDocuments"
          icon="document"
          color="primary"
        />
        <StatsCard
          label="Timeline Aktif"
          :value="stats.activeTimelines"
          icon="clock"
          color="success"
        />
        <StatsCard
          label="Pengumuman Baru"
          :value="stats.newAnnouncements"
          icon="chart"
          color="warning"
        />
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Akses Cepat</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            to="/team"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <svg class="w-8 h-8 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Tim Saya</span>
          </router-link>

          <router-link
            to="/documents"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <svg class="w-8 h-8 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Dokumen</span>
          </router-link>

          <router-link
            to="/timeline"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <svg class="w-8 h-8 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Timeline</span>
          </router-link>

          <router-link
            to="/announcements"
            class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
          >
            <svg class="w-8 h-8 text-primary-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span class="text-sm font-medium text-gray-900">Pengumuman</span>
          </router-link>
        </div>
      </div>

      <!-- Recent Documents -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Dokumen Terbaru</h2>
            <router-link
              to="/documents"
              class="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Lihat Semua
            </router-link>
          </div>
        </div>
        
        <div v-if="loading" class="p-12">
          <BaseSpinner centered size="lg" label="Memuat data..." />
        </div>
        
        <div v-else-if="recentDocuments.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Belum ada dokumen tersedia</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <DocumentCard
            v-for="doc in recentDocuments"
            :key="doc.id"
            :title="doc.title"
            :description="doc.description"
            :date="doc.date"
            :link="doc.link"
            class="!border-0 !shadow-none hover:bg-gray-50"
          />
        </div>
      </div>

      <!-- Recent Announcements -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Pengumuman Terbaru</h2>
          <router-link
            to="/announcements"
            class="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Lihat Semua
          </router-link>
        </div>
        
        <div v-if="recentAnnouncements.length === 0" class="text-center py-8">
          <p class="text-sm text-gray-500">Belum ada pengumuman</p>
        </div>
        
        <div v-else class="space-y-4">
          <AnnouncementCard
            v-for="announcement in recentAnnouncements"
            :key="announcement.id"
            :title="announcement.title"
            :content="announcement.content"
            :date="announcement.date"
            :priority="announcement.priority"
            :can-delete="false"
          />
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import { useDocumentStore } from '../../stores/documentStore'
import { useTimelineStore } from '../../stores/timelineStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import TeamStatusCard from '../../components/display/TeamStatusCard.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import DocumentCard from '../../components/display/DocumentCard.vue'
import AnnouncementCard from '../../components/display/AnnouncementCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()
const documentStore = useDocumentStore()
const timelineStore = useTimelineStore()

const user = computed(() => authStore.user)

// Get data from stores
const loading = computed(() => 
  teamStore.loading || documentStore.documentsLoading || timelineStore.timelinesLoading
)

const hasTeam = computed(() => teamStore.hasTeam)
const teamInfo = computed(() => {
  const team = teamStore.currentTeam
  if (!team) return null
  
  return {
    teamName: team.teamName,
    leaderName: team.leader?.name || team.leader?.email,
    useCase: team.useCase?.code || team.useCase,
    status: team.status,
    members: team.members || []
  }
})

const stats = computed(() => ({
  totalDocuments: documentStore.documents.length,
  activeTimelines: timelineStore.ongoingTimelines.length,
  newAnnouncements: 0 // TODO: Add announcement store
}))

const recentDocuments = computed(() => 
  documentStore.documents.slice(0, 2)
)

const recentAnnouncements = ref([
  {
    id: 1,
    title: 'Deadline Submission Minggu 3',
    content: 'Harap submit laporan kemajuan minggu 3 sebelum tanggal 15 November 2025.',
    date: '2025-11-10',
    priority: 'important'
  }
])

const studentMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
  { name: 'Tim Saya', icon: 'team', path: '/team', roles: ['student'] },
  { name: 'Dokumen', icon: 'document', path: '/documents', roles: ['student'] },
  { name: 'Timeline', icon: 'timeline', path: '/timeline', roles: ['student'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/announcements', roles: ['student'] },
  { name: 'Profil', icon: 'profile', path: '/profile', roles: ['student'] }
]

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    // Fetch all dashboard data in parallel
    await Promise.all([
      teamStore.fetchCurrentTeam(),
      documentStore.fetchDocuments({ limit: 5 }),
      timelineStore.fetchTimelines()
    ])
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  }
})
</script>
