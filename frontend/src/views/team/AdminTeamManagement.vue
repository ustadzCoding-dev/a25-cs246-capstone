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
      <div
        v-if="teamStore.successMessage"
        class="bg-success-50 border border-success-200 rounded-lg p-4"
      >
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

        <!-- Teams List -->
        <div v-if="loading" class="p-12 text-center">
          <BaseSpinner centered size="lg" label="Memuat data..." />
        </div>

        <div v-else-if="filteredTeams.length === 0" class="p-12 text-center">
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Tidak ada tim ditemukan</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="team in filteredTeams"
            :key="team._id"
            class="p-6 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-900">{{ team.teamName }}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  ID Tim: {{ team.capstoneGroupId || '(Belum di-assign)' }}
                </p>
                <p class="text-sm text-gray-600">
                  Anggota: {{ team.membersUserId?.length || 0 }} | Status:
                  {{ getStatusLabel(team.status) }}
                </p>
              </div>
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="viewTeamDetails(team)"
                  class="text-primary-600 hover:text-primary-700 p-2"
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
                  v-if="team.status === 'pending'"
                  @click="approveTeam(team)"
                  class="text-success-600 hover:text-success-700 p-2"
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
                  v-if="team.status === 'pending'"
                  @click="rejectTeam(team)"
                  class="text-danger-600 hover:text-danger-700 p-2"
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
                  @click="deleteTeam(team)"
                  class="text-gray-400 hover:text-danger-600 p-2"
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Team Details Modal -->
    <BaseModal v-model="showDetailsModal" title="Detail Tim" size="lg">
      <div v-if="selectedTeam" class="space-y-4">
        <!-- Team Info -->
        <div class="bg-gray-100 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ selectedTeam.teamName }}</h3>

          <div class="space-y-3">
            <div>
              <p class="text-sm font-medium text-gray-700">ID Tim</p>
              <div v-if="selectedTeam.capstoneGroupId" class="text-sm text-gray-600">
                {{ selectedTeam.capstoneGroupId }}
              </div>
              <div v-else class="flex gap-2">
                <input
                  v-model="newCapstoneGroupId"
                  type="text"
                  placeholder="Masukkan ID Tim (contoh: A25-CS246)"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  @click="assignCapstoneGroupId"
                  class="px-4 py-2 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                >
                  Assign
                </button>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">Status</p>
              <p class="text-sm text-gray-600">{{ selectedTeam.status }}</p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">Use Case</p>
              <p class="text-sm text-gray-600">
                <span class="font-medium">{{
                  selectedTeam.useCaseId?.title || selectedTeam.useCaseId?.name || 'N/A'
                }}</span>
                <span
                  v-if="selectedUseCase?.usecaseId || selectedTeam.useCaseId?.usecaseId"
                  class="ml-2 text-xs text-gray-500"
                  >(
                  {{ selectedUseCase?.usecaseId || selectedTeam.useCaseId?.usecaseId }}
                  )</span
                >
              </p>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700">
                Anggota ({{ selectedTeam.membersUserId?.length || 0 }})
              </p>
              <ul class="text-sm text-gray-600 space-y-1 mt-2">
                <li v-for="(member, idx) in selectedTeam.membersUserId" :key="idx">
                  •
                  <span class="font-medium">{{
                    typeof member === 'object' ? member.name || member.studentId : member
                  }}</span>
                  <span
                    v-if="
                      typeof member === 'object' && (member.learningPathName || member.learningPath)
                    "
                    class="ml-2 text-xs text-gray-500"
                    >— {{ member.learningPathName || member.learningPath }}</span
                  >
                </li>
              </ul>
            </div>

            <!-- Show use case composition requirements and actual composition -->
            <div
              v-if="
                selectedUseCase &&
                selectedUseCase.teamComposition &&
                selectedUseCase.teamComposition.length > 0
              "
            >
              <p class="text-sm font-medium text-gray-700">Komposisi Tim (Diperlukan)</p>
              <ul class="text-sm text-gray-600 space-y-1 mt-2">
                <li v-for="(req, idx) in selectedUseCase.teamComposition" :key="idx">
                  • <span class="font-medium">{{ req.learningPathName }}</span
                  >: diperlukan {{ req.count }} — terdapat
                  {{ actualCompositionCounts[req.learningPathName] || 0 }}
                </li>
              </ul>
            </div>

            <div v-if="selectedTeam.submittedAt">
              <p class="text-sm font-medium text-gray-700">Terdaftar</p>
              <p class="text-sm text-gray-600">
                {{ new Date(selectedTeam.submittedAt).toLocaleDateString('id-ID') }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="selectedTeam.status === 'pending'" class="flex space-x-3 pt-4">
          <BaseButton variant="success" class="flex-1" @click="approveTeam(selectedTeam)">
            Setujui Tim
          </BaseButton>
          <BaseButton variant="danger" class="flex-1" @click="rejectTeam(selectedTeam)">
            Tolak Tim
          </BaseButton>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">Tidak ada data tim yang dipilih</div>

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
import Swal from 'sweetalert2'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
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
const newCapstoneGroupId = ref('')

// Default generation settings (ubah jika perlu)
const defaultBatch = ref(25) // Angkatan (contoh: 25 -> A25)
const defaultProgram = ref('CS') // Program/Prodi (contoh: CS -> Computer Science)

/**
 * Try to infer batch (two-digit) from team members' studentId, fallback to default
 */
const inferBatchFromMembers = team => {
  if (!team || !team.membersUserId) return null
  for (const m of team.membersUserId) {
    if (typeof m === 'object' && m.studentId) {
      const sid = String(m.studentId)
      // match patterns like 'A25', '25', or starting with two digits
      const aMatch = sid.match(/A(\d{2})/i)
      if (aMatch) return Number(aMatch[1])
      const numMatch = sid.match(/^(\d{2})/) // e.g. '25xxxx'
      if (numMatch) return Number(numMatch[1])
    }
  }
  return null
}

/**
 * Try to infer program code from members' learningPath or learningPathName
 */
const inferProgramFromMembers = team => {
  if (!team || !team.membersUserId) return null
  for (const m of team.membersUserId) {
    if (typeof m === 'object') {
      const lp = (m.learningPathName || m.learningPath || '').toString().toLowerCase()
      if (!lp) continue
      if (lp.includes('computer') || lp.includes('cs') || lp.includes('computer science'))
        return 'CS'
      if (lp.includes('information') && lp.includes('systems')) return 'IS'
    }
  }
  return null
}

const generateCapstoneGroupId = (batch, program) => {
  const b = String(batch)
  const p = String(program).toUpperCase()
  const pattern = new RegExp(`^A${b}-${p}(\\d+)$`, 'i')
  let max = 0
  ;(teamStore.teams || []).forEach(t => {
    if (!t.capstoneGroupId) return
    const m = String(t.capstoneGroupId).toUpperCase().match(pattern)
    if (m && m[1]) {
      const num = parseInt(m[1], 10)
      if (!Number.isNaN(num) && num > max) max = num
    }
  })
  const next = String(max + 1).padStart(3, '0')
  return `A${b}-${p}${next}`
}

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

const { adminMenuItems } = useAdminMenu()

// Generate use case options from store
const useCaseOptions = computed(() => {
  const options = [{ value: '', label: 'Semua Use Case' }]

  console.log('[useCaseOptions] teamStore.useCases:', teamStore.useCases)

  if (teamStore.useCases && teamStore.useCases.length > 0) {
    teamStore.useCases.forEach(useCase => {
      options.push({
        value: useCase.usecaseId || useCase._id,
        label: `${useCase.title} (${useCase.usecaseId})`,
      })
    })
  }

  console.log('[useCaseOptions] final options:', options)
  return options
})

const filteredTeams = computed(() => {
  let result = teams.value || []

  console.log('[filteredTeams] Initial teams:', result)
  console.log('[filteredTeams] filterUseCase.value:', filterUseCase.value)

  // Filter by search query
  if (searchQuery.value && searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      team =>
        team.teamName?.toLowerCase().includes(query) ||
        team.capstoneGroupId?.toLowerCase().includes(query)
    )
  }

  // Filter by status
  if (filterStatus.value && filterStatus.value.trim()) {
    result = result.filter(team => team.status === filterStatus.value)
  }

  // Filter by use case
  if (filterUseCase.value && filterUseCase.value.trim()) {
    console.log('[filteredTeams] Filtering by use case, before filter count:', result.length)
    result = result.filter(team => {
      // team.useCaseId is an object with usecaseId property
      const teamUseCaseId = team.useCaseId?.usecaseId
      console.log('[filteredTeams] Team:', {
        name: team.teamName,
        useCaseId: team.useCaseId,
        teamUseCaseId: teamUseCaseId,
        filterValue: filterUseCase.value,
        match: teamUseCaseId === filterUseCase.value,
      })
      return teamUseCaseId === filterUseCase.value
    })
    console.log('[filteredTeams] After filter count:', result.length)
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

  // If team belum punya capstoneGroupId, prefill input dengan ID yang digenerate
  if (!team.capstoneGroupId) {
    const inferredBatch = inferBatchFromMembers(team) || defaultBatch.value
    const inferredProgram = inferProgramFromMembers(team) || defaultProgram.value
    try {
      newCapstoneGroupId.value = generateCapstoneGroupId(inferredBatch, inferredProgram)
    } catch (e) {
      // fallback ke format dasar jika error
      newCapstoneGroupId.value = `A${inferredBatch}-${inferredProgram}001`
    }
  } else {
    newCapstoneGroupId.value = ''
  }
}

// Compute selected use case details from store (full object with composition)
const selectedUseCase = computed(() => {
  if (!selectedTeam.value) return null
  const ucId =
    selectedTeam.value.useCaseId?._id ||
    selectedTeam.value.useCaseId?.id ||
    selectedTeam.value.useCaseId
  if (!ucId) return null
  // Try to find in store by _id or id or usecaseId code
  const found = teamStore.useCases.find(
    uc =>
      uc._id === ucId || uc.id === ucId || uc.usecaseId === selectedTeam.value.useCaseId?.usecaseId
  )
  return found || selectedTeam.value.useCaseId || null
})

// Compute actual composition counts by learningPathName
const actualCompositionCounts = computed(() => {
  const counts = {}
  if (!selectedTeam.value || !selectedTeam.value.membersUserId) return counts
  selectedTeam.value.membersUserId.forEach(member => {
    if (typeof member === 'object') {
      const name = member.learningPathName || member.learningPath || 'Unknown'
      counts[name] = (counts[name] || 0) + 1
    }
  })
  return counts
})

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
    teamStore.setError({ message: 'Alasan penolakan tidak boleh kosong' }, 'confirmReject')
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

const assignCapstoneGroupId = async () => {
  if (!newCapstoneGroupId.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Masukkan ID Tim terlebih dahulu' })
    return
  }

  try {
    // Call API to update team with capstoneGroupId
    await teamStore.updateTeam(selectedTeam.value._id, {
      capstoneGroupId: newCapstoneGroupId.value,
    })

    // Update selectedTeam
    selectedTeam.value.capstoneGroupId = newCapstoneGroupId.value
    newCapstoneGroupId.value = ''

    // Refresh teams list
    await fetchTeams()

    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'ID Tim berhasil di-assign!' })
  } catch (err) {
    console.error('Failed to assign capstoneGroupId:', err)
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal assign ID Tim: ' + err.message })
  }
}

onMounted(() => {
  // Fetch use cases for filter dropdown
  teamStore.fetchUseCases()

  // Fetch teams
  fetchTeams()
})
</script>
