<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p class="mt-2 text-gray-600">Selamat datang kembali, {{ user?.name }}!</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Tim"
          :value="stats.totalTeams"
          icon="team"
          color="primary"
          :change="stats.teamChange"
          trend="up"
        />
        <StatsCard
          label="Tim Pending"
          :value="stats.pendingTeams"
          icon="clock"
          color="warning"
        />
        <StatsCard
          label="Total Dokumen"
          :value="stats.totalDocuments"
          icon="document"
          color="success"
        />
        <StatsCard
          label="Total Siswa"
          :value="stats.totalStudents"
          icon="team"
          color="primary"
        />
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseButton
            variant="primary"
            @click="$router.push('/admin/teams')"
            class="flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Kelola Tim
          </BaseButton>
          
          <BaseButton
            variant="success"
            @click="showAddDocumentModal = true"
            class="flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Dokumen
          </BaseButton>
          
          <BaseButton
            variant="warning"
            @click="showAddAnnouncementModal = true"
            class="flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Buat Pengumuman
          </BaseButton>
        </div>
      </div>

      <!-- Pending Teams -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">Tim Menunggu Persetujuan</h2>
            <router-link
              to="/admin/teams"
              class="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Lihat Semua
            </router-link>
          </div>
        </div>
        
        <div v-if="loading" class="p-12">
          <BaseSpinner centered size="lg" label="Memuat data..." />
        </div>
        
        <div v-else-if="pendingTeams.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Tidak ada tim yang menunggu persetujuan</p>
        </div>
        
        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="team in pendingTeams"
            :key="team._id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-900">{{ team.teamName }}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Ketua: {{ team.leader.name }} ({{ team.leader.dicodingId }})
                </p>
                <p class="text-sm text-gray-600">
                  Use Case: {{ team.useCase }} | Anggota: {{ team.members.length }}
                </p>
              </div>
              <div class="flex space-x-2">
                <BaseButton
                  variant="success"
                  size="sm"
                  @click="approveTeam(team._id)"
                >
                  Setujui
                </BaseButton>
                <BaseButton
                  variant="danger"
                  size="sm"
                  @click="rejectTeam(team._id)"
                >
                  Tolak
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h2>
        <div class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-900">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals (placeholder) -->
    <BaseModal v-model="showAddDocumentModal" title="Tambah Dokumen" size="lg">
      <p class="text-gray-600">Form tambah dokumen akan ditambahkan di sini.</p>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showAddDocumentModal = false">
            Batal
          </BaseButton>
          <BaseButton variant="primary">
            Simpan
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <BaseModal v-model="showAddAnnouncementModal" title="Buat Pengumuman" size="lg">
      <p class="text-gray-600">Form buat pengumuman akan ditambahkan di sini.</p>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showAddAnnouncementModal = false">
            Batal
          </BaseButton>
          <BaseButton variant="primary">
            Kirim
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const loading = ref(false)
const showAddDocumentModal = ref(false)
const showAddAnnouncementModal = ref(false)

// Mock data - will be replaced with API calls
const stats = ref({
  totalTeams: 24,
  teamChange: 12,
  pendingTeams: 5,
  totalDocuments: 48,
  totalStudents: 96
})

const pendingTeams = ref([
  {
    _id: '1',
    teamName: 'Team Alpha',
    leader: { name: 'John Doe', dicodingId: 'F123456' },
    useCase: 'DC-09',
    members: [{ name: 'Jane Doe' }, { name: 'Bob Smith' }]
  },
  {
    _id: '2',
    teamName: 'Team Beta',
    leader: { name: 'Alice Johnson', dicodingId: 'F234567' },
    useCase: 'DC-10',
    members: [{ name: 'Charlie Brown' }]
  }
])

const recentActivities = ref([
  { id: 1, message: 'Team Alpha mengajukan pendaftaran', time: '5 menit yang lalu' },
  { id: 2, message: 'Dokumen "Panduan Capstone" ditambahkan', time: '1 jam yang lalu' },
  { id: 3, message: 'Timeline "Minggu 3" diperbarui', time: '2 jam yang lalu' },
  { id: 4, message: 'Pengumuman baru dipublikasikan', time: '3 jam yang lalu' }
])

const adminMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
  { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
  { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
  { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] }
]

const approveTeam = async (teamId) => {
  // TODO: Implement approve team API call
  console.log('Approve team:', teamId)
}

const rejectTeam = async (teamId) => {
  // TODO: Implement reject team API call
  console.log('Reject team:', teamId)
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  // TODO: Fetch dashboard data from API
  loading.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
})
</script>
