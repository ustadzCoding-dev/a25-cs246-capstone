<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-900">Tim Saya</h1>
        <p class="text-gray-600 text-lg">
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
              <p class="text-sm text-gray-600">Use Case: {{ invitation.teamId.useCase }}</p>
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

        <!-- Pending Team Info -->
        <div class="bg-white rounded-lg shadow p-6 mt-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Informasi Tim (Pending)</h2>
          <TeamInfoCard :team="pendingTeam" />
          <!-- Replacement slots for leader to fill rejected/invited seats -->
          <div v-if="isLeader" class="mt-6">
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
                      class="px-3 py-2 bg-primary-600 text-white rounded"
                      @click="addReplacement(n - 1)"
                      :disabled="!replacementInputs[n - 1]"
                    >
                      Tambah
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
  return activeTeam.value?.leader?.email === user.value?.email
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
  const value = (replacementInputs.value[idx] || '').trim()
  if (!value) return

  try {
    const members = Array.from(activeTeam.value.membersUserId || [])
    // Try to resolve studentId/email to a valid identifier (prefer user _id or email)
    const resolveIdentifier = async val => {
      try {
        const lookup = await fetch(
          `http://localhost:8000/api/students/lookup/${encodeURIComponent(val)}`
        )
        if (lookup.ok) {
          const d = await lookup.json()
          // backend returns { id, studentId, name, email, ... }
          return d.data.id || d.data.email || val
        }
      } catch (err) {
        console.error('Lookup failed for', val, err)
      }
      // fallback to using the raw value (email or id) and let backend validate
      return val
    }

    const identifier = await resolveIdentifier(value)
    // Prefer to remove one placeholder if exists, otherwise just push
    const phIndex = members.findIndex(m => !(typeof m === 'object' && (m.name || m.learningPath)))
    if (phIndex !== -1) {
      members.splice(phIndex, 1, identifier)
    } else {
      members.push(identifier)
    }

    // Normalize members to strings (prefer _id, then id, then email, then studentId)
    const normalizedMembers = members
      .map(m => {
        if (typeof m === 'object' && m !== null) {
          return m._id || m.id || m.email || m.studentId || null
        }
        return m
      })
      .filter(Boolean)

    // Remove duplicates (keep first occurrence)
    const uniqueMembers = Array.from(new Set(normalizedMembers))

    // Include required fields for validation
    await teamStore.editTeam(activeTeam.value._id || activeTeam.value.id, {
      teamName: activeTeam.value.teamName,
      useCaseId: activeTeam.value.useCaseId?._id || activeTeam.value.useCaseId || null,
      membersUserId: uniqueMembers,
    })
    await fetchTeamData()
    teamStore.setSuccess('Pengganti berhasil ditambahkan')
    replacementInputs.value[idx] = ''
  } catch (err) {
    console.error('Failed to add replacement:', err)
    teamStore.setError(err, 'addReplacement')
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
    console.log('Fetching team data...')

    const response = await fetch('http://localhost:8000/api/capstone-group/current', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('Team data loaded:', data.data)
      // Update teamStore if needed
      if (data.data) {
        // Transform backend response to match component expectations
        const transformedTeam = {
          ...data.data,
          // keep useCaseId as full object for modals that rely on it
          useCaseId: data.data.useCaseId || null,
          // backend field is membersUserId; ensure modal sees the same
          membersUserId: data.data.membersUserId || [],
          leader: user.value, // Current user is the leader
        }
        // Store team data in teamStore (use consistent fields expected by other components)
        teamStore.currentTeam = transformedTeam
      }
    } else {
      console.log('No team found (404 or error)')
    }
  } catch (err) {
    console.error('Failed to fetch team data:', err)
  }
}

const fetchPendingInvitations = async () => {
  try {
    const response = await fetch('http://localhost:8000/api/invitations', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      pendingInvitations.value = data.data || []
      console.log('Pending invitations loaded:', pendingInvitations.value.length)
    }
  } catch (err) {
    console.error('Failed to fetch pending invitations:', err)
  }
}

const acceptInvitation = async invitationId => {
  acceptingInvitation.value = invitationId
  try {
    const response = await fetch(`http://localhost:8000/api/invitations/${invitationId}/accept`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    if (response.ok) {
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
    const response = await fetch(`http://localhost:8000/api/invitations/${invitationId}/reject`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    })

    if (response.ok) {
      // Remove from list
      pendingInvitations.value = pendingInvitations.value.filter(inv => inv._id !== invitationId)
      console.log('Invitation rejected')
    } else {
      const err = await response.json().catch(() => null)
      console.error('Reject API responded with error:', err || response.status)
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
