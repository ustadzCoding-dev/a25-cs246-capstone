<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <!-- Loading State -->
      <div v-if="loading" class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">Memproses undangan Anda...</p>
      </div>

      <!-- Success State -->
      <div v-else-if="success" class="text-center">
        <div class="mb-4">
          <svg
            v-if="isAccepting"
            class="w-16 h-16 text-green-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <svg
            v-else
            class="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2m8-8a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">
          {{ isAccepting ? '✅ Undangan Diterima!' : '❌ Undangan Ditolak' }}
        </h2>
        <p class="text-gray-600 mb-6">
          {{
            isAccepting
              ? 'Anda telah berhasil bergabung dengan tim. Selamat!'
              : 'Anda telah menolak undangan ini.'
          }}
        </p>
        <button
          @click="redirectToTeam"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Kembali ke Tim Saya
        </button>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center">
        <div class="mb-4">
          <svg
            class="w-16 h-16 text-red-500 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4v2m0 4v2M7.08 6.06A9 9 0 1020.94 19.94M7.08 6.06l11.86 11.88"
            ></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">⚠️ Terjadi Kesalahan</h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button
          @click="redirectToTeam"
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Kembali ke Tim Saya
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const success = ref(false)
const error = ref(null)
const isAccepting = ref(false)

onMounted(async () => {
  try {
    const invitationId = route.params.id
    const isAccept = route.path.includes('/accept')

    isAccepting.value = isAccept

    // Check if user is authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      // Store the invitation action and redirect to login
      sessionStorage.setItem('pendingInvitationId', invitationId)
      sessionStorage.setItem('pendingInvitationAction', isAccept ? 'accept' : 'reject')
      error.value = 'Silakan login terlebih dahulu untuk memproses undangan'
      loading.value = false

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push({
          name: 'login',
          query: { redirect: route.fullPath },
        })
      }, 2000)
      return
    }

    // Use axios `api` wrapper so token refresh / interceptors are applied
    const endpoint = isAccept
      ? `/invitations/${invitationId}/accept`
      : `/invitations/${invitationId}/reject`

    console.log('[InvitationResponse] Processing (api):', endpoint)
    console.log('[InvitationResponse] Token present:', token ? 'yes' : 'no')

    try {
      // api.put returns response.data because interceptor unwraps
      await api.put(endpoint, {})

      success.value = true
      // Redirect after 3 seconds
      setTimeout(() => {
        redirectToTeam()
      }, 3000)
    } catch (err) {
      console.error('[InvitationResponse] API error:', err)
      error.value = err.message || 'Gagal memproses undangan'
    }
  } catch (err) {
    error.value = err.message || 'Terjadi kesalahan saat memproses undangan'
    console.error('Invitation error:', err)
  } finally {
    loading.value = false
  }
})

const redirectToTeam = () => {
  router.push({ name: 'student-team' })
}
</script>

<style scoped>
/* Animations */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
