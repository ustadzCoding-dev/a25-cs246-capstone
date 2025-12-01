<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">Tim Saya</h1>
        <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
          Kelola informasi tim dan lihat undangan yang masuk di halaman ini.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-12">
        <BaseSpinner centered size="lg" label="Memuat data tim..." />
      </div>

      <!-- Pending Invitations -->
      <div
        v-if="pendingInvitations.length > 0"
        class="bg-blue-50 border border-blue-200 rounded-lg p-6"
      >
        <div class="flex items-start mb-4">
          <svg
            class="w-6 h-6 text-blue-600 mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <div>
            <h3 class="text-base font-semibold text-blue-900">Undangan Tim Tertunda</h3>
            <p class="text-sm text-blue-700">
              Anda memiliki {{ pendingInvitations.length }} undangan tim yang menunggu respons Anda
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="invitation in pendingInvitations"
            :key="invitation._id"
            class="bg-white rounded-lg p-4 flex items-center justify-between"
          >
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">{{ invitation.teamId.teamName }}</h4>
              <p class="text-sm text-gray-600">Use Case: {{ invitation.teamId.useCaseId?.title || 'Unknown' }}</p>
              <p class="text-sm text-gray-500">Dari: {{ invitation.leaderId.name }}</p>
            </div>
            <div class="flex gap-2">
              <BaseButton
                variant="success"
                size="sm"
                @click="acceptInvitation(invitation._id)"
                :loading="acceptingInvitation === invitation._id"
              >
                Terima
              </BaseButton>
              <BaseButton
                variant="danger"
                size="sm"
                @click="promptRejectInvitation(invitation._id)"
                :loading="rejectingInvitation === invitation._id"
              >
                Tolak
              </BaseButton>
            </div>
          </div>
        </div>
      </div>

      <!-- No Team State -->
      <div v-else-if="!hasTeam && !hasPendingTeam" class="bg-white rounded-lg shadow p-12">
        <div class="text-center">
          <svg
            class="mx-auto h-16 w-16 text-gray-400 mb-4"
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
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Belum Ada Tim</h3>
          <p class="text-gray-600 mb-6">
            Anda belum terdaftar di tim manapun. Buat tim baru atau tunggu undangan dari tim lain.
          </p>
          <BaseButton variant="primary" @click="$router.push('/team/register')">
            Buat Tim Baru
          </BaseButton>
        </div>
      </div>

      <!-- Pending Team State -->
      <div v-else-if="hasPendingTeam && !hasTeam">
        <div class="bg-warning-50 border border-warning-200 rounded-lg p-6">
          <div class="flex items-start">
            <svg
              class="w-6 h-6 text-warning-600 mr-3 flex-shrink-0"
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
            <div class="flex-1">
              <h3 class="text-base font-semibold text-warning-900">Tim Menunggu Persetujuan</h3>
              <p class="mt-1 text-sm text-warning-700">
                Tim Anda sedang menunggu persetujuan dari admin. Anda akan menerima notifikasi
                setelah tim disetujui.
              </p>
            </div>
          </div>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="teamStore.error" class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div class="flex items-start justify-between">
            <div class="flex">
              <svg
                class="h-5 w-5 text-red-400 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <p class="text-sm font-medium text-red-800">
                  {{ teamStore.error }}
                </p>
              </div>
            </div>
            <button @click="teamStore.clearError()" class="ml-4 text-red-500 hover:text-red-700">
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          v-if="teamStore.successMessage"
          class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div class="flex items-start justify-between">
            <div class="flex">
              <svg
                class="h-5 w-5 text-green-400 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <p class="text-sm font-medium text-green-800">
                  {{ teamStore.successMessage }}
                </p>
              </div>
            </div>
            <button
              @click="teamStore.successMessage = null"
              class="ml-4 text-green-500 hover:text-green-700"
            >
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Pending Team Info -->
        <div class="bg-white rounded-lg shadow p-6 mt-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Informasi Tim (Pending)</h2>
          <TeamInfoCard :team="pendingTeam" />
          <!-- Replacement slots for leader to fill rejected/invited seats -->
          <!-- Show for leader OR if team has vacancies (temporary fix) -->
          <div v-if="isLeader || vacancies > 0" class="mt-6">
            <div class="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 class="text-sm font-semibold text-yellow-900 mb-2">Isi Slot Kosong</h3>
              <p class="text-sm text-yellow-700 mb-3">
                Jika ada anggota yang menolak undangan, Anda dapat menambahkan pengganti di sini
                agar komposisi tim terpenuhi.
              </p>

              <div class="space-y-3">
                <div
                  v-for="(m, idx) in acceptedMembers"
                  :key="`acc-${idx}`"
                  class="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
                >
                  <div>
                    <p class="text-sm font-medium">{{ m.name || m.studentId || m }}</p>
                    <p v-if="m.learningPath" class="text-xs text-gray-500">{{ m.learningPath }}</p>
                  </div>
                  <span class="text-xs text-green-700">Diterima</span>
                </div>

                <div
                  v-for="(ph, idx) in placeholders"
                  :key="`ph-${idx}`"
                  class="flex items-center gap-3 bg-white p-3 rounded border border-gray-200"
                >
                  <div class="flex-1">
                    <p class="text-sm text-gray-700">
                      Placeholder: {{ ph || 'Undangan belum diterima' }}
                    </p>
                  </div>
                  <button
                    class="px-3 py-1 text-sm text-red-600 border rounded"
                    @click="removePlaceholder(idx)"
                  >
                    Hapus Placeholder
                  </button>
                </div>

                <div v-if="vacancies > 0" class="space-y-2">
                  <p class="text-sm text-gray-700">Kosong: {{ vacancies }} slot</p>
                  <div v-for="n in vacancies" :key="n" class="flex gap-2">
                    <input
                      v-model="replacementInputs[n - 1]"
                      type="text"
                      placeholder="ID siswa / Email pengganti"
                      class="flex-1 px-3 py-2 border rounded"
                    />
                    <button
                      class="px-3 py-2 bg-primary-600 text-white rounded disabled:bg-gray-400"
                      @click="addReplacement(n - 1)"
                      :disabled="!replacementInputs[n - 1] || addingReplacement[n - 1]"
                    >
                      <span v-if="addingReplacement[n - 1]">
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Menambahkan...
                      </span>
                      <span v-else> Tambah </span>
                    </button>
                  </div>
                </div>

                <div
                  v-if="vacancies === 0 && placeholders.length === 0"
                  class="text-sm text-gray-600"
                >
                  Tidak ada slot kosong saat ini.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Team State -->
      <div v-else-if="hasTeam && activeTeam">
        <!-- Team Status -->
        <TeamStatusCard
          :team-name="activeTeam.teamName"
          :leader-name="activeTeam.leader?.name"
          :use-case="activeTeam.useCase"
          :status="activeTeam.status"
          :members="activeTeam.members"
        />

        <!-- Team Details -->
        <div v-if="activeTeam" class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Detail Tim</h2>
            <BaseBadge :variant="statusVariant" size="lg">
              {{ activeTeam.status }}
            </BaseBadge>
          </div>

          <TeamInfoCard :team="activeTeam" />

          <!-- Edit Team Button (if leader and pending) -->
          <div v-if="isLeader && hasPendingTeam" class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-start space-x-3">
              <svg
                class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-900">Edit Tim</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Ubah nama tim atau tambah/hapus anggota tim. Anda dapat mengganti anggota yang
                  menolak undangan di sini.
                </p>
                <BaseButton variant="primary" size="sm" class="mt-3" @click="showEditModal = true">
                  Edit Tim
                </BaseButton>
              </div>
            </div>
          </div>

          <!-- Leave Team Button (if not leader) -->
          <div v-if="!isLeader" class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-start space-x-3">
              <svg
                class="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5"
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
                <h3 class="text-sm font-semibold text-gray-900">Keluar dari Tim</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Jika Anda keluar dari tim, Anda perlu membuat tim baru atau bergabung dengan tim
                  lain.
                </p>
                <BaseButton
                  variant="danger"
                  size="sm"
                  class="mt-3"
                  @click="showLeaveConfirm = true"
                >
                  Keluar dari Tim
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Team Invitations (Deprecated - use Pending Invitations above) -->
      <!-- Removed: This section is replaced by Pending Invitations section above -->
    </div>

    <!-- Leave Team Confirmation Modal -->
    <BaseModal v-model="showLeaveConfirm" title="Konfirmasi Keluar dari Tim" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin keluar dari tim <strong>{{ activeTeam?.teamName }}</strong
          >?
        </p>
        <div class="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <p class="text-sm text-warning-700">
            Setelah keluar, Anda perlu membuat tim baru atau menunggu undangan dari tim lain untuk
            melanjutkan program capstone.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showLeaveConfirm = false"> Batal </BaseButton>
          <BaseButton variant="danger" :loading="leavingTeam" @click="handleLeaveTeam">
            Ya, Keluar dari Tim
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Reject Invitation Confirmation Modal -->
    <BaseModal v-model="showRejectConfirm" title="Konfirmasi Tolak Undangan" size="md">
      <div class="space-y-4">
        <p class="text-gray-700">Apakah Anda yakin ingin menolak undangan ini?</p>
        <div class="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <p class="text-sm text-warning-700">
            Tindakan ini akan menghapus undangan dari daftar Anda dan memberi tahu leader bahwa Anda
            menolak.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="cancelReject">Batal</BaseButton>
          <BaseButton
            variant="danger"
            :loading="rejectingInvitation === selectedRejectInvitation"
            @click="confirmReject"
            >Ya, Tolak</BaseButton
          >
        </div>
      </template>
    </BaseModal>

    <!-- Edit Team Modal -->
    <EditTeamModal
      v-model="showEditModal"
      :team="activeTeam"
      :use-cases="teamStore.useCases"
      @submit="handleEditTeam"
    />
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import { useStudentMenu } from '../../composables/useStudentMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import TeamStatusCard from '../../components/display/TeamStatusCard.vue'
import TeamInfoCard from '../../components/display/TeamInfoCard.vue'
import InvitationCard from '../../components/display/InvitationCard.vue'
import EditTeamModal from '../../components/modals/EditTeamModal.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'
import api from '../../services/api'
import { apiCallWithRetry } from '../../utils/apiRetry'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const user = computed(() => authStore.user)
const leavingTeam = ref(false)
const showLeaveConfirm = ref(false)
const showEditModal = ref(false)
const editingTeam = ref(false)
const pendingInvitations = ref([])
const acceptingInvitation = ref(null)
const rejectingInvitation = ref(null)
const showRejectConfirm = ref(false)
const selectedRejectInvitation = ref(null)

// Get data from store
const loading = computed(() => teamStore.loading)
const activeTeam = computed(() => teamStore.currentTeam)
const hasTeam = computed(() => teamStore.hasTeam && activeTeam.value?.status === 'approved')
const hasPendingTeam = computed(() => teamStore.hasTeam && activeTeam.value?.status === 'pending')

const { studentMenuItems } = useStudentMenu()

const isLeader = computed(() => {
  // Check multiple ways to determine if current user is the leader
  const team = activeTeam.value
  const currentUser = user.value

  if (!team || !currentUser) return false

  // Method 1: Check leader object email
  if (team.leader?.email === currentUser.email) return true

  // Method 2: Check if current user is first member in membersUserId
  const members = team.membersUserId || []
  if (members.length > 0) {
    const firstMember = members[0]
    if (typeof firstMember === 'object' && firstMember !== null) {
      if (firstMember._id === currentUser._id || firstMember.email === currentUser.email) {
        return true
      }
    }
  }

  // Method 3: Check leaderId field
  if (team.leaderId) {
    if (typeof team.leaderId === 'object') {
      return team.leaderId._id === currentUser._id || team.leaderId.email === currentUser.email
    }
    return team.leaderId === currentUser._id
  }

  return false
})

const statusVariant = computed(() => {
  const variants = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger',
  }
  return variants[activeTeam.value?.status] || 'secondary'
})

const pendingTeam = computed(() => {
  return hasPendingTeam.value ? activeTeam.value : null
})

// Helper computed values for replacements
const totalTeamSize = computed(() => {
  return (
    activeTeam.value?.useCaseId?.totalTeamSize || activeTeam.value?.useCaseId?.totalTeamSize || 2
  )
})

const acceptedMembers = computed(() => {
  const members = activeTeam.value?.membersUserId || []
  return members.filter(m => typeof m === 'object' && (m.name || m.learningPath))
})

const placeholders = computed(() => {
  const members = activeTeam.value?.membersUserId || []
  return members.filter(m => !(typeof m === 'object' && (m.name || m.learningPath)))
})

const vacancies = computed(() => {
  // vacancies computed relative to accepted members (leader included if in list)
  const acc = acceptedMembers.value.length
  return Math.max(0, totalTeamSize.value - acc)
})

const replacementInputs = ref([])
const addingReplacement = ref({})

// Helper to normalize useCaseId to string if component holds full object
const normalizeUseCaseId = uc => {
  if (!uc) return null
  if (typeof uc === 'object') return uc._id || uc.id || null
  return uc
}

// Keep replacementInputs in sync with vacancies
watch(vacancies, v => {
  replacementInputs.value = Array(v).fill('')
})

const removePlaceholder = async index => {
  // Remove a placeholder locally and send edit request to backend
  try {
    const members = Array.from(activeTeam.value.membersUserId || [])
    // find placeholder index in original members list
    let phCount = -1
    let removeIndex = -1
    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      if (!(typeof m === 'object' && (m.name || m.learningPath))) {
        phCount++
        if (phCount === index) {
          removeIndex = i
          break
        }
      }
    }
    if (removeIndex === -1) return

    members.splice(removeIndex, 1)

    // Normalize members to strings (prefer _id, then id, then email, then studentId)
    const normalizedMembers = members
      .map(m => {
        if (typeof m === 'object' && m !== null) {
          return m._id || m.id || m.email || m.studentId || null
        }
        return m
      })
      .filter(Boolean)

    // Prevent removing if team would become smaller than minimum (2)
    if (normalizedMembers.length < 2) {
      teamStore.setError(
        {
          message:
            'Tidak dapat menghapus placeholder: tim harus memiliki minimal 2 anggota. Tambahkan pengganti terlebih dahulu.',
        },
        'removePlaceholder'
      )
      return
    }

    // Call store editTeam to update membersUserId (include required fields)
    await teamStore.editTeam(activeTeam.value._id || activeTeam.value.id, {
      teamName: activeTeam.value.teamName,
      useCaseId: activeTeam.value.useCaseId?._id || activeTeam.value.useCaseId || null,
      membersUserId: normalizedMembers,
    })
    await fetchTeamData()
    teamStore.setSuccess('Placeholder berhasil dihapus')
  } catch (err) {
    console.error('Failed to remove placeholder:', err)
    teamStore.setError(err, 'removePlaceholder')
  }
}

const addReplacement = async idx => {
  console.log(`[addReplacement] ===== FUNCTION CALLED =====`)
  console.log(`[addReplacement] Index: ${idx}`)
  console.log(`[addReplacement] Raw input value:`, replacementInputs.value[idx])

  const value = (replacementInputs.value[idx] || '').trim()
  console.log(`[addReplacement] Trimmed value: "${value}"`)
  console.log(`[addReplacement] Value length: ${value.length}`)

  if (!value) {
    console.log(`[addReplacement] Empty value - showing error`)
    teamStore.setError('Masukkan email atau student ID anggota pengganti', 'addReplacement')
    return
  }

  // Set loading state for this specific input
  console.log(`[addReplacement] Setting loading state for index ${idx}`)
  // Ensure addingReplacement is reactive
  if (!addingReplacement.value) {
    addingReplacement.value = {}
  }
  addingReplacement.value = { ...addingReplacement.value, [idx]: true }

  try {
    // Debug: Log activeTeam to understand its structure
    console.log('[addReplacement] activeTeam.value:', activeTeam.value)
    console.log('[addReplacement] teamStore.currentTeam:', teamStore.currentTeam)

    // Validate team data exists - check both _id and id
    const teamId = activeTeam.value?._id || activeTeam.value?.id
    if (!activeTeam.value || !teamId) {
      console.error('[addReplacement] Invalid team data:', {
        activeTeam: activeTeam.value,
        _id: activeTeam.value?._id,
        id: activeTeam.value?.id,
      })
      teamStore.setError('Data tim tidak valid. Silakan refresh halaman.', 'addReplacement')
      addingReplacement.value = { ...addingReplacement.value, [idx]: false }
      return
    }

    // Get current members list
    const currentMembers = Array.from(activeTeam.value.membersUserId || [])
    console.log('[addReplacement] Current members:', currentMembers)
    console.log('[addReplacement] Active team data:', {
      teamId: teamId,
      _id: activeTeam.value?._id,
      id: activeTeam.value?.id,
      teamName: activeTeam.value?.teamName,
      useCaseId: activeTeam.value?.useCaseId,
      membersUserId: activeTeam.value?.membersUserId,
    })
    console.log('[addReplacement] Total team size:', totalTeamSize.value)
    console.log('[addReplacement] Accepted members:', acceptedMembers.value)
    console.log('[addReplacement] Vacancies:', vacancies.value)

    // Check if team is at maximum capacity (4 members)
    if (currentMembers.length >= 4) {
      teamStore.setError('Tim sudah mencapai kapasitas maksimum (4 anggota)', 'addReplacement')
      addingReplacement.value = { ...addingReplacement.value, [idx]: false }
      return
    }

    // Try to resolve studentId/email to a valid identifier
    const resolveIdentifier = async val => {
      console.log('[resolveIdentifier] Looking up:', val)
      try {
        // Use the properly configured API service instead of raw fetch
        const response = await apiCallWithRetry(api.get, [`/students/lookup/${encodeURIComponent(val)}`])

        console.log('[resolveIdentifier] Response data:', response)

        if (response.success && response.data) {
          const resolvedData = {
            id: response.data.id || response.data._id,
            email: response.data.email,
            name: response.data.name,
            studentId: response.data.studentId,
          }
          console.log('[resolveIdentifier] Resolved data:', resolvedData)
          return resolvedData
        } else {
          const errorMsg = response.message || 'Student tidak ditemukan'
          console.log('[resolveIdentifier] Lookup failed:', errorMsg)
          throw new Error(errorMsg)
        }
      } catch (err) {
        console.error('[resolveIdentifier] Error:', err)
        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          throw new Error('Tidak dapat terhubung ke server')
        }
        throw new Error(err.message || `Tidak dapat menemukan student dengan ID/email: ${val}`)
      }
    }

    console.log('[addReplacement] Calling resolveIdentifier with:', value)
    const resolvedMember = await resolveIdentifier(value)
    if (!resolvedMember) {
      console.log('[addReplacement] No member resolved')
      teamStore.setError(`Student dengan ID/email "${value}" tidak ditemukan`, 'addReplacement')
      addingReplacement.value = { ...addingReplacement.value, [idx]: false }
      return
    }

    console.log('[addReplacement] Resolved member:', resolvedMember)

    // Check if member already exists in team
    const memberExists = currentMembers.some(m => {
      if (typeof m === 'object' && m !== null) {
        return (
          m._id === resolvedMember.id ||
          m.id === resolvedMember.id ||
          m.email === resolvedMember.email
        )
      }
      return m === resolvedMember.id || m === resolvedMember.email
    })

    if (memberExists) {
      teamStore.setError('Anggota sudah ada dalam tim', 'addReplacement')
      addingReplacement.value = { ...addingReplacement.value, [idx]: false }
      return
    }

    // Add the new member to the existing list
    console.log('[addReplacement] Adding member with id:', resolvedMember.id)
    const updatedMembers = [...currentMembers, resolvedMember.id]
    console.log('[addReplacement] Updated members before normalization:', updatedMembers)

    // Normalize members to strings (prefer _id, then id, then email)
    const normalizedMembers = updatedMembers
      .map(m => {
        if (typeof m === 'object' && m !== null) {
          const normalized = m._id || m.id || m.email || null
          console.log('[addReplacement] Normalizing object member:', m, '-> ', normalized)
          return normalized
        }
        console.log('[addReplacement] Member is already string:', m)
        return m
      })
      .filter(Boolean)

    console.log('[addReplacement] Normalized members (final):', normalizedMembers)
    console.log('[addReplacement] Normalized members count:', normalizedMembers.length)

    // Validate we have the required team data
    if (!activeTeam.value.teamName) {
      teamStore.setError('Nama tim tidak valid', 'addReplacement')
      addingReplacement.value = { ...addingReplacement.value, [idx]: false }
      return
    }

    // Send edit request - only send what we're changing
    const finalTeamId = activeTeam.value?._id || activeTeam.value?.id
    const editPayload = {
      teamName: activeTeam.value?.teamName,
      membersUserId: normalizedMembers,
    }
    console.log('[addReplacement] Sending edit request with:', { teamId: finalTeamId, editPayload })

    if (!finalTeamId) {
      throw new Error('Team ID tidak ditemukan')
    }

    const editResult = await teamStore.editTeam(finalTeamId, editPayload)
    console.log('[addReplacement] Edit team result:', editResult)

    console.log(`[addReplacement] About to call fetchTeamData...`)
    await fetchTeamData()
    console.log(`[addReplacement] fetchTeamData completed`)

    console.log(`[addReplacement] Setting success message...`)
    teamStore.setSuccess(`${resolvedMember.name} berhasil ditambahkan sebagai anggota pengganti`)

    console.log(`[addReplacement] Clearing input...`)
    replacementInputs.value[idx] = ''

    console.log(`[addReplacement] ===== SUCCESS COMPLETED =====`)
  } catch (err) {
    console.error(`[addReplacement] ===== ERROR OCCURRED =====`)
    console.error(`[addReplacement] Full error object:`, err)
    console.error(`[addReplacement] Error for index ${idx}:`, err)
    console.error(`[addReplacement] Error type:`, typeof err)
    console.error(`[addReplacement] Error name:`, err?.name)
    console.error(`[addReplacement] Error message:`, err?.message)
    console.error(`[addReplacement] Error response:`, err?.response)
    console.error(`[addReplacement] Error response data:`, err?.response?.data)
    console.error(`[addReplacement] Error stack:`, err?.stack)

    let errorMessage = 'Gagal menambahkan anggota pengganti'

    if (typeof err === 'string') {
      errorMessage = err
      console.log(`[addReplacement] Error is string:`, errorMessage)
    } else if (err?.response?.data?.error?.message) {
      errorMessage = err.response.data.error.message
      console.log(`[addReplacement] Using nested error message:`, errorMessage)
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message
      console.log(`[addReplacement] Using response error message:`, errorMessage)
    } else if (err?.message) {
      errorMessage = err.message
      console.log(`[addReplacement] Using error message:`, errorMessage)
    }

    console.log(`[addReplacement] Final error message:`, errorMessage)
    teamStore.setError(errorMessage, 'addReplacement')
  } finally {
    // Clear loading state
    console.log(`[addReplacement] Clearing loading state for index ${idx}`)
    addingReplacement.value = { ...addingReplacement.value, [idx]: false }
    console.log(`[addReplacement] ===== FUNCTION COMPLETED =====`)
  }
}

const handleLeaveTeam = async () => {
  leavingTeam.value = true

  try {
    await teamStore.leaveTeam(activeTeam.value._id || activeTeam.value.id)
    showLeaveConfirm.value = false

    // Refresh team data
    await fetchTeamData()
  } catch (err) {
    console.error('Failed to leave team:', err)
  } finally {
    leavingTeam.value = false
  }
}

const handleEditTeam = async editData => {
  editingTeam.value = true

  try {
    await teamStore.editTeam(activeTeam.value._id || activeTeam.value.id, editData)
    showEditModal.value = false
    teamStore.setSuccess('Tim berhasil diperbarui')

    // Refresh team data
    await fetchTeamData()
  } catch (err) {
    console.error('Failed to edit team:', err)
    teamStore.setError(err, 'handleEditTeam')
  } finally {
    editingTeam.value = false
  }
}

const handleAcceptInvitation = async invitationId => {
  try {
    await teamStore.acceptInvitation(invitationId)

    // Remove from invitations list
    invitations.value = invitations.value.filter(inv => inv._id !== invitationId)

    // Refresh team data
    await fetchTeamData()
  } catch (err) {
    console.error('Failed to accept invitation:', err)
  }
}

const handleRejectInvitation = async invitationId => {
  try {
    await teamStore.rejectInvitation(invitationId)

    // Remove invitation from list
    invitations.value = invitations.value.filter(inv => inv._id !== invitationId)
  } catch (err) {
    console.error('Failed to reject invitation:', err)
  }
}

const fetchTeamData = async () => {
  try {
    console.log('[fetchTeamData] Starting fetch...');

    // Ensure we have a valid token before making the request
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[fetchTeamData] No token found, redirecting to login');
      router.push('/login');
      return;
    }

    // Use the properly configured API service with retry mechanism
    const response = await apiCallWithRetry(api.get, ['/capstone-group/current']);

    console.log('[fetchTeamData] Response:', response);

    if (response.success && response.data) {
      // Transform backend response to match component expectations
      // Ensure _id is preserved for edit operations
      const transformedTeam = {
        ...response.data,
        _id: response.data._id || response.data.id, // Ensure _id is set
        id: response.data._id || response.data.id, // Also set id for compatibility
        // keep useCaseId as full object for modals that rely on it
        useCaseId: response.data.useCaseId || null,
        // backend field is membersUserId; ensure modal sees the same
        membersUserId: response.data.membersUserId || [],
        leader: user.value, // Current user is the leader
      };

      console.log('[fetchTeamData] Transformed team:', transformedTeam);
      console.log('[fetchTeamData] Team _id:', transformedTeam._id);
      console.log('[fetchTeamData] Team id:', transformedTeam.id);

      // Store team data in teamStore (use consistent fields expected by other components)
      teamStore.currentTeam = transformedTeam;

      console.log('[fetchTeamData] teamStore.currentTeam updated:', teamStore.currentTeam);
    } else {
      console.log('[fetchTeamData] No team data in response');
      teamStore.currentTeam = null;
    }
  } catch (err) {
    console.error('[fetchTeamData] Failed to fetch team data:', err);

    // Handle token expiration specifically
    if (err.status === 401) {
      console.log('[fetchTeamData] Token expired, clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }

    // Set currentTeam to null on error to ensure consistent state
    teamStore.currentTeam = null;
  }
};

const fetchPendingInvitations = async () => {
  try {
    // Ensure we have a valid token before making the request
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('[fetchPendingInvitations] No token found');
      return;
    }

    // Use the properly configured API service with retry mechanism
    const response = await apiCallWithRetry(api.get, ['/invitations'])

    if (response.success) {
      pendingInvitations.value = response.data || []
      console.log('Pending invitations loaded:', pendingInvitations.value.length)
    }
  } catch (err) {
    console.error('Failed to fetch pending invitations:', err)

    // Handle token expiration specifically
    if (err.status === 401) {
      console.log('[fetchPendingInvitations] Token expired, clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
  }
}

const acceptInvitation = async invitationId => {
  acceptingInvitation.value = invitationId
  try {
    // Use the properly configured API service with retry mechanism
    const response = await apiCallWithRetry(api.put, [`/invitations/${invitationId}/accept`])

    if (response.success) {
      // Remove from list
      pendingInvitations.value = pendingInvitations.value.filter(inv => inv._id !== invitationId)
      // Refresh team data
      await fetchTeamData()
      console.log('Invitation accepted')
    }
  } catch (err) {
    console.error('Failed to accept invitation:', err)
  } finally {
    acceptingInvitation.value = null
  }
}

const promptRejectInvitation = invitationId => {
  selectedRejectInvitation.value = invitationId
  showRejectConfirm.value = true
}

const rejectInvitation = async invitationId => {
  rejectingInvitation.value = invitationId
  try {
    // Use the properly configured API service with retry mechanism
    const response = await apiCallWithRetry(api.put, [`/invitations/${invitationId}/reject`, {}])

    if (response.success) {
      // Remove from list
      pendingInvitations.value = pendingInvitations.value.filter(inv => inv._id !== invitationId)
      console.log('Invitation rejected')
    } else {
      console.error('Reject API responded with error:', response)
    }
  } catch (err) {
    console.error('Failed to reject invitation:', err)
  } finally {
    rejectingInvitation.value = null
    showRejectConfirm.value = false
    selectedRejectInvitation.value = null
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const cancelReject = () => {
  showRejectConfirm.value = false
  selectedRejectInvitation.value = null
}

const confirmReject = async () => {
  if (!selectedRejectInvitation.value) return
  await rejectInvitation(selectedRejectInvitation.value)
}

onMounted(async () => {
  await fetchTeamData()
  await fetchPendingInvitations()
})
</script>
