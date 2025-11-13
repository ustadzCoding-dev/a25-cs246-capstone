<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Tim Saya</h1>
          <p class="mt-2 text-gray-600">Kelola tim capstone Anda</p>
        </div>
        
        <BaseButton
          v-if="!hasTeam && !hasPendingTeam"
          variant="primary"
          @click="$router.push('/team/register')"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Buat Tim Baru
        </BaseButton>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-12">
        <BaseSpinner centered size="lg" label="Memuat data tim..." />
      </div>

      <!-- No Team State -->
      <div v-else-if="!hasTeam && !hasPendingTeam" class="bg-white rounded-lg shadow p-12">
        <div class="text-center">
          <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
            <svg class="w-6 h-6 text-warning-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-warning-900">Tim Menunggu Persetujuan</h3>
              <p class="mt-1 text-sm text-warning-700">
                Tim Anda sedang menunggu persetujuan dari admin. Anda akan menerima notifikasi setelah tim disetujui.
              </p>
            </div>
          </div>
        </div>

        <!-- Pending Team Info -->
        <div class="bg-white rounded-lg shadow p-6 mt-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Informasi Tim (Pending)</h2>
          <TeamInfoCard :team="pendingTeam" />
        </div>
      </div>

      <!-- Active Team State -->
      <div v-else-if="hasTeam">
        <!-- Team Status -->
        <TeamStatusCard
          :team-name="activeTeam.teamName"
          :leader-name="activeTeam.leader.name"
          :use-case="activeTeam.useCase"
          :status="activeTeam.status"
          :members="activeTeam.members"
        />

        <!-- Team Details -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Detail Tim</h2>
            <BaseBadge :variant="statusVariant" size="lg">
              {{ activeTeam.status }}
            </BaseBadge>
          </div>

          <TeamInfoCard :team="activeTeam" />

          <!-- Leave Team Button (if not leader) -->
          <div v-if="!isLeader" class="mt-6 pt-6 border-t border-gray-200">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div class="flex-1">
                <h3 class="text-sm font-semibold text-gray-900">Keluar dari Tim</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Jika Anda keluar dari tim, Anda perlu membuat tim baru atau bergabung dengan tim lain.
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

      <!-- Team Invitations -->
      <div v-if="invitations.length > 0" class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Undangan Tim</h2>
        <div class="space-y-4">
          <InvitationCard
            v-for="invitation in invitations"
            :key="invitation._id"
            :invitation="invitation"
            @accept="handleAcceptInvitation(invitation._id)"
            @reject="handleRejectInvitation(invitation._id)"
          />
        </div>
      </div>
    </div>

    <!-- Leave Team Confirmation Modal -->
    <BaseModal
      v-model="showLeaveConfirm"
      title="Konfirmasi Keluar dari Tim"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin keluar dari tim <strong>{{ activeTeam?.teamName }}</strong>?
        </p>
        <div class="bg-warning-50 border border-warning-200 rounded-lg p-4">
          <p class="text-sm text-warning-700">
            Setelah keluar, Anda perlu membuat tim baru atau menunggu undangan dari tim lain untuk melanjutkan program capstone.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showLeaveConfirm = false">
            Batal
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="leavingTeam"
            @click="handleLeaveTeam"
          >
            Ya, Keluar dari Tim
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
import { useTeamStore } from '../../stores/teamStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import TeamStatusCard from '../../components/display/TeamStatusCard.vue'
import TeamInfoCard from '../../components/display/TeamInfoCard.vue'
import InvitationCard from '../../components/display/InvitationCard.vue'
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
const invitations = ref([]) // TODO: Implement invitations API

// Get data from store
const loading = computed(() => teamStore.loading)
const activeTeam = computed(() => teamStore.currentTeam)
const hasTeam = computed(() => teamStore.hasTeam && activeTeam.value?.status === 'approved')
const hasPendingTeam = computed(() => teamStore.hasTeam && activeTeam.value?.status === 'pending')

const studentMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
  { name: 'Tim Saya', icon: 'team', path: '/team', roles: ['student'] },
  { name: 'Dokumen', icon: 'document', path: '/documents', roles: ['student'] },
  { name: 'Timeline', icon: 'timeline', path: '/timeline', roles: ['student'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/announcements', roles: ['student'] }
]

const isLeader = computed(() => {
  return activeTeam.value?.leader?.email === user.value?.email
})

const statusVariant = computed(() => {
  const variants = {
    'approved': 'success',
    'pending': 'warning',
    'rejected': 'danger'
  }
  return variants[activeTeam.value?.status] || 'secondary'
})

const pendingTeam = computed(() => {
  return hasPendingTeam.value ? activeTeam.value : null
})

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

const handleAcceptInvitation = async (invitationId) => {
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

const handleRejectInvitation = async (invitationId) => {
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
    // Fetch user's team data
    // For now, we'll use mock data until backend implements "my team" endpoint
    // TODO: Replace with actual API call when available
    // await teamStore.fetchTeamById(userId)
    
    console.log('Fetching team data...')
    
  } catch (err) {
    console.error('Failed to fetch team data:', err)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(() => {
  fetchTeamData()
})
</script>
