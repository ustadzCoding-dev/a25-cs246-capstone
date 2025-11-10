<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kelola Tim</h1>
          <p class="mt-2 text-gray-600">Kelola semua tim capstone</p>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatsCard
          label="Total Tim"
          :value="stats.totalTeams"
          icon="team"
          color="primary"
        />
        <StatsCard
          label="Tim Pending"
          :value="stats.pendingTeams"
          icon="clock"
          color="warning"
        />
        <StatsCard
          label="Tim Disetujui"
          :value="stats.approvedTeams"
          icon="team"
          color="success"
        />
        <StatsCard
          label="Tim Ditolak"
          :value="stats.rejectedTeams"
          icon="team"
          color="danger"
        />
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseSearch
            v-model="searchQuery"
            placeholder="Cari nama tim atau ketua..."
          />
          
          <BaseSelect
            v-model="filterStatus"
            :options="statusOptions"
            placeholder="Semua Status"
          />
          
          <BaseSelect
            v-model="filterUseCase"
            :options="useCaseOptions"
            placeholder="Semua Use Case"
          />
        </div>
      </div>

      <!-- Teams Table -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Daftar Tim</h2>
        </div>

        <BaseTable
          :columns="tableColumns"
          :data="filteredTeams"
          :loading="loading"
          :pagination="pagination"
          empty-message="Tidak ada tim ditemukan"
          @sort="handleSort"
          @page-change="handlePageChange"
        >
          <!-- Team Name Column -->
          <template #cell-teamName="{ row }">
            <div>
              <p class="font-medium text-gray-900">{{ row.teamName }}</p>
              <p class="text-sm text-gray-500">{{ row.useCase }}</p>
            </div>
          </template>

          <!-- Leader Column -->
          <template #cell-leader="{ row }">
            <div>
              <p class="text-sm text-gray-900">{{ row.leader.name }}</p>
              <p class="text-xs text-gray-500">{{ row.leader.id }}</p>
            </div>
          </template>

          <!-- Members Column -->
          <template #cell-members="{ row }">
            <span class="text-sm text-gray-900">{{ row.members.length }} anggota</span>
          </template>

          <!-- Status Column -->
          <template #cell-status="{ row }">
            <BaseBadge :variant="getStatusVariant(row.status)">
              {{ getStatusLabel(row.status) }}
            </BaseBadge>
          </template>

          <!-- Actions Column -->
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="viewTeamDetails(row)"
                class="text-primary-600 hover:text-primary-700"
                title="Lihat Detail"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <button
                v-if="row.status === 'pending'"
                @click="approveTeam(row)"
                class="text-success-600 hover:text-success-700"
                title="Setujui"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                v-if="row.status === 'pending'"
                @click="rejectTeam(row)"
                class="text-danger-600 hover:text-danger-700"
                title="Tolak"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>

              <button
                @click="deleteTeam(row)"
                class="text-gray-400 hover:text-danger-600"
                title="Hapus"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>

    <!-- Team Details Modal -->
    <BaseModal
      v-model="showDetailsModal"
      title="Detail Tim"
      size="lg"
    >
      <div v-if="selectedTeam" class="space-y-4">
        <TeamInfoCard :team="selectedTeam" />

        <div v-if="selectedTeam.status === 'pending'" class="flex space-x-3 pt-4">
          <BaseButton
            variant="success"
            class="flex-1"
            @click="approveTeam(selectedTeam)"
          >
            Setujui Tim
          </BaseButton>
          <BaseButton
            variant="danger"
            class="flex-1"
            @click="rejectTeam(selectedTeam)"
          >
            Tolak Tim
          </BaseButton>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <BaseButton variant="outline" @click="showDetailsModal = false">
            Tutup
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Reject Confirmation Modal -->
    <BaseModal
      v-model="showRejectModal"
      title="Konfirmasi Penolakan"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menolak tim <strong>{{ selectedTeam?.teamName }}</strong>?
        </p>
        <BaseTextarea
          v-model="rejectReason"
          label="Alasan Penolakan (Opsional)"
          placeholder="Masukkan alasan penolakan..."
          :rows="4"
        />
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showRejectModal = false">
            Batal
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="processing"
            @click="confirmReject"
          >
            Ya, Tolak Tim
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
          Apakah Anda yakin ingin menghapus tim <strong>{{ selectedTeam?.teamName }}</strong>?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700">
            Tindakan ini tidak dapat dibatalkan. Semua data tim akan dihapus permanen.
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
            :loading="processing"
            @click="confirmDelete"
          >
            Ya, Hapus Tim
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
import TeamInfoCard from '../../components/display/TeamInfoCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseTable from '../../components/base/BaseTable.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'

const router = useRouter()
const authStore = useAuthStore()

const user = computed(() => authStore.user)
const loading = ref(false)
const processing = ref(false)

const searchQuery = ref('')
const filterStatus = ref('')
const filterUseCase = ref('')

const showDetailsModal = ref(false)
const showRejectModal = ref(false)
const showDeleteModal = ref(false)
const selectedTeam = ref(null)
const rejectReason = ref('')

// Mock data
const stats = ref({
  totalTeams: 24,
  pendingTeams: 5,
  approvedTeams: 18,
  rejectedTeams: 1
})

const teams = ref([
  {
    _id: '1',
    teamName: 'Team Alpha',
    useCase: 'DC-09',
    status: 'pending',
    leader: { name: 'John Doe', id: 'F123456', email: 'john@example.com', learningPath: 'Front-End' },
    members: [
      { name: 'Jane Doe', id: 'F234567', learningPath: 'Back-End' },
      { name: 'Bob Smith', id: 'F345678', learningPath: 'ML' }
    ],
    learningPath: 'Front-End Web & Back-End with AI',
    createdAt: '2025-11-10'
  },
  {
    _id: '2',
    teamName: 'Team Beta',
    useCase: 'DC-10',
    status: 'approved',
    leader: { name: 'Alice Johnson', id: 'F456789', email: 'alice@example.com', learningPath: 'Android' },
    members: [
      { name: 'Charlie Brown', id: 'F567890', learningPath: 'Android' }
    ],
    learningPath: 'Android Development',
    createdAt: '2025-11-09'
  }
])

const pagination = ref({
  page: 1,
  limit: 10,
  total: 24
})

const tableColumns = [
  { key: 'teamName', label: 'Nama Tim', sortable: true },
  { key: 'leader', label: 'Ketua', sortable: true },
  { key: 'members', label: 'Anggota', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Tanggal Daftar', sortable: true }
]

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' }
]

const useCaseOptions = [
  { value: '', label: 'Semua Use Case' },
  { value: 'DC-01', label: 'DC-01' },
  { value: 'DC-02', label: 'DC-02' },
  { value: 'DC-09', label: 'DC-09' },
  { value: 'DC-10', label: 'DC-10' }
]

const adminMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
  { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
  { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
  { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] }
]

const filteredTeams = computed(() => {
  let result = teams.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(team =>
      team.teamName.toLowerCase().includes(query) ||
      team.leader.name.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    result = result.filter(team => team.status === filterStatus.value)
  }

  // Filter by use case
  if (filterUseCase.value) {
    result = result.filter(team => team.useCase === filterUseCase.value)
  }

  return result
})

const getStatusVariant = (status) => {
  const variants = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return variants[status] || 'secondary'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': 'Pending',
    'approved': 'Disetujui',
    'rejected': 'Ditolak'
  }
  return labels[status] || status
}

const viewTeamDetails = (team) => {
  selectedTeam.value = team
  showDetailsModal.value = true
}

const approveTeam = async (team) => {
  processing.value = true

  try {
    // TODO: Call API to approve team
    console.log('Approving team:', team._id)

    await new Promise(resolve => setTimeout(resolve, 1000))

    team.status = 'approved'
    showDetailsModal.value = false

    stats.value.pendingTeams--
    stats.value.approvedTeams++

  } catch (err) {
    console.error('Failed to approve team:', err)
  } finally {
    processing.value = false
  }
}

const rejectTeam = (team) => {
  selectedTeam.value = team
  showRejectModal.value = true
  showDetailsModal.value = false
}

const confirmReject = async () => {
  processing.value = true

  try {
    // TODO: Call API to reject team
    console.log('Rejecting team:', selectedTeam.value._id, rejectReason.value)

    await new Promise(resolve => setTimeout(resolve, 1000))

    selectedTeam.value.status = 'rejected'
    showRejectModal.value = false
    rejectReason.value = ''

    stats.value.pendingTeams--
    stats.value.rejectedTeams++

  } catch (err) {
    console.error('Failed to reject team:', err)
  } finally {
    processing.value = false
  }
}

const deleteTeam = (team) => {
  selectedTeam.value = team
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  processing.value = true

  try {
    // TODO: Call API to delete team
    console.log('Deleting team:', selectedTeam.value._id)

    await new Promise(resolve => setTimeout(resolve, 1000))

    teams.value = teams.value.filter(t => t._id !== selectedTeam.value._id)
    showDeleteModal.value = false

    stats.value.totalTeams--

  } catch (err) {
    console.error('Failed to delete team:', err)
  } finally {
    processing.value = false
  }
}

const handleSort = ({ key, order }) => {
  console.log('Sort:', key, order)
  // TODO: Implement sorting
}

const handlePageChange = (page) => {
  pagination.value.page = page
  // TODO: Fetch data for new page
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  loading.value = true
  try {
    // TODO: Fetch teams data
    await new Promise(resolve => setTimeout(resolve, 500))
  } finally {
    loading.value = false
  }
})
</script>
