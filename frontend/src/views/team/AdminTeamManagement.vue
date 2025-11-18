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
        <StatsCard label="Total Tim" :value="stats.totalTeams" icon="team" color="primary" />
        <StatsCard label="Tim Pending" :value="stats.pendingTeams" icon="clock" color="warning" />
        <StatsCard label="Tim Disetujui" :value="stats.approvedTeams" icon="team" color="success" />
        <StatsCard label="Tim Ditolak" :value="stats.rejectedTeams" icon="team" color="danger" />
      </div>

      <!-- Error Alert -->
      <div v-if="teamStore.error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-1">
            <h3 class="text-sm font-medium text-danger-800">Error</h3>
            <p class="mt-1 text-sm text-danger-700">{{ teamStore.error }}</p>
            <p v-if="teamStore.errorDetails.length > 0" class="mt-2 text-xs text-danger-600">
              <span v-for="(detail, idx) in teamStore.errorDetails" :key="idx" class="block">
                • {{ detail.field }}: {{ detail.message }}
              </span>
            </p>
          </div>
          <button @click="teamStore.clearError()" class="text-danger-400 hover:text-danger-600">
            ✕
          </button>
        </div>
      </div>

      <!-- Success Alert -->
      <div v-if="teamStore.successMessage" class="bg-success-50 border border-success-200 rounded-lg p-4">
        <div class="flex items-start">
          <div class="flex-1">
            <p class="text-sm text-success-700">{{ teamStore.successMessage }}</p>
          </div>
          <button @click="teamStore.clearSuccess()" class="text-success-400 hover:text-success-600">
            ✕
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <BaseSearch v-model="searchQuery" placeholder="Cari nama tim atau ketua..." />

          <BaseSelect v-model="filterStatus" :options="statusOptions" placeholder="Semua Status" />

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
              <p class="text-sm text-gray-500">Status: {{ getStatusLabel(row.status) }}</p>
            </div>
          </template>

          <!-- ID Tim Column -->
          <template #cell-capstoneGroupId="{ row }">
            <span class="text-sm text-gray-900 font-mono">{{ row.capstoneGroupId }}</span>
          </template>

          <!-- Jumlah Anggota Column -->
          <template #cell-membersUserId="{ row }">
            <span class="text-sm text-gray-900">{{ row.membersUserId?.length || 0 }} anggota</span>
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
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>

              <button
                v-if="row.status === 'pending'"
                @click="approveTeam(row)"
                class="text-success-600 hover:text-success-700"
                title="Setujui"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                v-if="row.status === 'pending'"
                @click="rejectTeam(row)"
                class="text-danger-600 hover:text-danger-700"
                title="Tolak"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>

              <button
                @click="deleteTeam(row)"
                class="text-gray-400 hover:text-danger-600"
                title="Hapus"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </template>
        </BaseTable>
      </div>
    </div>

    <!-- Team Details Modal -->
    <BaseModal v-model="showDetailsModal" title="Detail Tim" size="lg">
      <div v-if="selectedTeam" class="space-y-4">
        <TeamInfoCard :team="selectedTeam" />

        <div v-if="selectedTeam.status === 'pending'" class="flex space-x-3 pt-4">
          <BaseButton variant="success" class="flex-1" @click="approveTeam(selectedTeam)">
            Setujui Tim
          </BaseButton>
          <BaseButton variant="danger" class="flex-1" @click="rejectTeam(selectedTeam)">
            Tolak Tim
          </BaseButton>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <BaseButton variant="outline" @click="showDetailsModal = false"> Tutup </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Reject Confirmation Modal -->
    <BaseModal v-model="showRejectModal" title="Konfirmasi Penolakan" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menolak tim <strong>{{ selectedTeam?.teamName }}</strong
          >?
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
          <BaseButton variant="outline" @click="showRejectModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="processing" @click="confirmReject">
            Ya, Tolak Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal v-model="showDeleteModal" title="Konfirmasi Hapus" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus tim <strong>{{ selectedTeam?.teamName }}</strong
          >?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700">
            Tindakan ini tidak dapat dibatalkan. Semua data tim akan dihapus permanen.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="processing" @click="confirmDelete">
            Ya, Hapus Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const user = computed(() => authStore.user)
const processing = ref(false)

const searchQuery = ref('')
const filterStatus = ref('')
const filterUseCase = ref('')

const showDetailsModal = ref(false)
const showRejectModal = ref(false)
const showDeleteModal = ref(false)
const selectedTeam = ref(null)
const rejectReason = ref('')

// Get data from store
const loading = computed(() => teamStore.teamsLoading)
const teams = computed(() => teamStore.teams)
const pagination = computed(() => teamStore.pagination)

// Calculate stats from teams
const stats = computed(() => ({
  totalTeams: teams.value.length,
  pendingTeams: teamStore.pendingTeams.length,
  approvedTeams: teamStore.approvedTeams.length,
  rejectedTeams: teamStore.rejectedTeams.length,
}))

const tableColumns = [
  { key: 'teamName', label: 'Nama Tim', sortable: true },
  { key: 'capstoneGroupId', label: 'ID Tim', sortable: false },
  { key: 'membersUserId', label: 'Jumlah Anggota', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'submittedAt', label: 'Tanggal Daftar', sortable: true },
]

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Disetujui' },
  { value: 'rejected', label: 'Ditolak' },
]

const useCaseOptions = [
  { value: '', label: 'Semua Use Case' },
  { value: 'DC-01', label: 'DC-01' },
  { value: 'DC-02', label: 'DC-02' },
  { value: 'DC-09', label: 'DC-09' },
  { value: 'DC-10', label: 'DC-10' },
]

const adminMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
  { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
  { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
  { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] },
]

const filteredTeams = computed(() => {
  let result = teams.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      team =>
        team.teamName.toLowerCase().includes(query) ||
        team.capstoneGroupId.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value) {
    result = result.filter(team => team.status === filterStatus.value)
  }

  return result
})

const getStatusVariant = status => {
  const variants = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger',
  }
  return variants[status] || 'secondary'
}

const getStatusLabel = status => {
  const labels = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  }
  return labels[status] || status
}

const viewTeamDetails = team => {
  selectedTeam.value = team
  showDetailsModal.value = true
}

const approveTeam = async team => {
  processing.value = true
  teamStore.clearError()

  try {
    await teamStore.approveTeam(team._id || team.id)
    teamStore.setSuccess('Tim berhasil disetujui')
    showDetailsModal.value = false

    // Refresh teams list
    await fetchTeams()
  } catch (err) {
    teamStore.setError(err, 'approveTeam')
    console.error('Failed to approve team:', err)
  } finally {
    processing.value = false
  }
}

const rejectTeam = team => {
  selectedTeam.value = team
  showRejectModal.value = true
  showDetailsModal.value = false
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    teamStore.setError(
      { message: 'Alasan penolakan tidak boleh kosong' },
      'confirmReject'
    )
    return
  }

  processing.value = true
  teamStore.clearError()

  try {
    await teamStore.rejectTeam(selectedTeam.value._id || selectedTeam.value.id, rejectReason.value)
    teamStore.setSuccess('Tim berhasil ditolak')
    showRejectModal.value = false
    rejectReason.value = ''

    // Refresh teams list
    await fetchTeams()
  } catch (err) {
    teamStore.setError(err, 'confirmReject')
    console.error('Failed to reject team:', err)
  } finally {
    processing.value = false
  }
}

const deleteTeam = team => {
  selectedTeam.value = team
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  processing.value = true
  teamStore.clearError()

  try {
    await teamStore.deleteTeam(selectedTeam.value._id || selectedTeam.value.id)
    teamStore.setSuccess('Tim berhasil dihapus')
    showDeleteModal.value = false

    // Refresh teams list
    await fetchTeams()
  } catch (err) {
    teamStore.setError(err, 'confirmDelete')
    console.error('Failed to delete team:', err)
  } finally {
    processing.value = false
  }
}

const handleSort = ({ key, order }) => {
  console.log('Sort:', key, order)
  // TODO: Implement sorting
}

const handlePageChange = page => {
  pagination.value.page = page
  // TODO: Fetch data for new page
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchTeams = async () => {
  try {
    const params = {
      status: filterStatus.value,
      search: searchQuery.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
    }

    await teamStore.fetchTeams(params)
  } catch (err) {
    console.error('Failed to fetch teams:', err)
  }
}

// Watch filters and refetch
watch([searchQuery, filterStatus, filterUseCase], () => {
  fetchTeams()
})

onMounted(() => {
  fetchTeams()
})
</script>
