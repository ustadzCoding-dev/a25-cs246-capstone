<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <router-link
        to="/admin/timeline"
        class="text-primary-600 hover:text-primary-700 text-sm font-medium"
      >
        ← Kembali ke Manage Timelines
      </router-link>

      <!-- Page Header -->
      <div
        class="pb-4 bg-white p-5 rounded-lg shadow-md flex justify-start items-start flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
            Timeline Analytics
          </h1>
          <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
            Analisis dan statistik timeline capstone project
          </p>
        </div>
      </div>

      <div class="p-6 bg-white shadow-md rounded-lg flex flex-col gap-6">
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-danger-700">{{ error }}</p>
          <BaseButton variant="outline" @click="fetchStats" class="mt-4"> Coba Lagi </BaseButton>
        </div>

        <!-- Content -->
        <div v-else class="space-y-6">
          <!-- Key Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatsCard
              label="Total Timelines"
              :value="stats.totalTimelines"
              icon="timeline"
              color="primary"
            />
            <StatsCard label="Active" :value="stats.activeTimelines" icon="clock" color="warning" />
            <StatsCard
              label="Completed"
              :value="stats.completedTimelines"
              icon="check"
              color="success"
            />
            <StatsCard
              label="Overdue"
              :value="stats.overdueTimelines"
              icon="alert"
              color="danger"
            />
          </div>

          <!-- Performance Metrics -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 py-3 px-6 border border-gray-200">
              <h3 class="lg:text-md md:text-md sm:text-sm xs:text-sm text-sm uppercase text-gray-900">Completion Rate</h3>
              <div class="flex items-center justify-between">
                <div class="lg:text-4xl md:text-3xl sm:text-2xl xs:text-2xl text-2xl font-semibold text-primary-600">
                  {{ stats.completionRate }}%
                </div>
                <div class="lg:size-10 md:size-10 sm:size-8 xs:size-8 size-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    class="lg:size-7 md:size-7 sm:size-6 xs:size-6 size-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-500">
                {{ stats.completedTimelines }} dari {{ stats.totalTimelines }} selesai
              </p>
            </div>

            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 py-3 px-6 border border-gray-200">
              <h3 class="lg:text-base md:text-base sm:text-sm xs:text-sm text-sm uppercase text-gray-900">On-Time Rate</h3>
              <div class="flex items-center justify-between">
                <div class="lg:text-4xl md:text-3xl sm:text-2xl xs:text-2xl text-2xl font-semibold text-success-600">{{ stats.onTimeRate }}%</div>
                <div class="lg:size-10 md:size-10 sm:size-8 xs:size-8 size-8 rounded-full bg-success-100 flex items-center justify-center">
                  <svg
                    class="lg:size-7 md:size-7 sm:size-6 xs:size-6 size-6 text-success-600"
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
              <p class="mt-2 text-sm text-gray-500">Selesai tepat waktu</p>
            </div>

            <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 py-3 px-6 border border-gray-200">
              <h3 class="lg:text-md md:text-md sm:text-sm xs:text-sm text-sm uppercase text-gray-900">Avg Duration</h3>
              <div class="flex items-center justify-between">
                <div class="lg:text-4xl md:text-3xl sm:text-2xl xs:text-2xl text-2xl font-semibold text-warning-600">{{ stats.avgDuration }}</div>
                <div class="lg:size-10 md:size-10 sm:size-8 xs:size-8 size-8 rounded-full bg-warning-100 flex items-center justify-center">
                  <svg
                    class="lg:size-7 md:size-7 sm:size-6 xs:size-6 size-6 text-warning-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
              </div>
              <p class="mt-2 text-sm text-gray-500">hari rata-rata</p>
            </div>
          </div>

          <!-- Timeline Status Distribution -->
          <div class="my-5 border-t py-5 border-gray-300">
            <h2
              class="lg:text-lg md:text-base sm:text-base text-sm font-semibold text-gray-900 mb-4"
            >
              Timeline Status Distribution
            </h2>

            <div class="space-y-4">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Active</span>
                  <span class="text-sm font-semibold text-gray-900">{{
                    stats.activeTimelines
                  }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-warning-500 h-2 rounded-full"
                    :style="{ width: getPercentage(stats.activeTimelines) + '%' }"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Completed</span>
                  <span class="text-sm font-semibold text-gray-900">{{
                    stats.completedTimelines
                  }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-success-500 h-2 rounded-full"
                    :style="{ width: getPercentage(stats.completedTimelines) + '%' }"
                  ></div>
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm font-medium text-gray-700">Overdue</span>
                  <span class="text-sm font-semibold text-gray-900">{{
                    stats.overdueTimelines
                  }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-danger-500 h-2 rounded-full"
                    :style="{ width: getPercentage(stats.overdueTimelines) + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming Deadlines -->
          <div class="my-5 border-t py-5 border-gray-300">
            <h2 class="lg:text-lg md:text-base sm:text-base text-sm font-semibold text-gray-900 mb-4">
              Upcoming Deadlines (Next 7 Days)
            </h2>

            <div v-if="upcomingDeadlines.length === 0" class="text-center py-8">
              <p class="text-gray-500 lg:text-md md:text-md sm:text-sm xs:text-sm text-sm">Tidak ada deadline dalam 7 hari ke depan</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="deadline in upcomingDeadlines"
                :key="deadline._id"
                class="flex items-center justify-between p-4 border border-gray-200 bg-gray-100"
              >
                <div class="flex-1">
                  <h3 class="lg:text-md md:text-md sm:text-sm xs:text-sm text-sm font-medium text-gray-900">{{ deadline.title }}</h3>
                  <p class="lg:text-sm md:text-sm sm:text-xs xs:text-xs text-xs text-gray-600">{{ deadline.description }}</p>
                </div>
                <div class="text-right ml-4">
                  <p class="lg:text-md md:text-md sm:text-sm xs:text-sm text-sm font-semibold text-gray-900">{{ formatDate(deadline.endDate) }}</p>
                  <p class="lg:text-sm md:text-sm sm:text-xs xs:text-xs text-xs text-warning-600">
                    {{ daysUntil(deadline.endDate) }} hari lagi
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- At-Risk Timelines -->
          <div class="my-5 border-t py-5 border-gray-300">
            <h2 class="lg:text-lg md:text-base sm:text-base text-sm font-semibold text-gray-900 mb-4">
              At-Risk Timelines (>80% Duration Used)
            </h2>

            <div v-if="atRiskTimelines.length === 0" class="text-center py-8">
              <p class="text-gray-500 lg:text-md md:text-md sm:text-sm xs:text-sm text-sm">Tidak ada timeline yang berisiko</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="timeline in atRiskTimelines"
                :key="timeline._id"
                class="flex items-center justify-between p-4 border border-danger-200 bg-danger-50 rounded-lg"
              >
                <div class="flex-1">
                  <h3 class=" lg:text-md md:text-md sm:text-sm xs:text-sm text-sm font-medium text-gray-900">{{ timeline.title }}</h3>
                  <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-danger-500 h-2 rounded-full"
                      :style="{ width: timeline.progress + '%' }"
                    ></div>
                  </div>
                  <p class="text-xs text-gray-600 mt-1">{{ timeline.progress }}% selesai</p>
                </div>
                <div class="text-right ml-4">
                  <p class="font-semibold text-danger-600">
                    {{ daysUntil(timeline.endDate) }} hari
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import api from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const { adminMenuItems } = useAdminMenu()

const user = computed(() => authStore.user)

// State
const loading = ref(false)
const error = ref('')
const stats = ref({
  totalTimelines: 0,
  activeTimelines: 0,
  completedTimelines: 0,
  overdueTimelines: 0,
  completionRate: 0,
  onTimeRate: 0,
  avgDuration: 0,
})
const upcomingDeadlines = ref([])
const atRiskTimelines = ref([])

// Methods
const formatDate = date => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const daysUntil = date => {
  if (!date) return 0
  const today = new Date()
  const deadline = new Date(date)
  const diff = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

const getPercentage = value => {
  if (stats.value.totalTimelines === 0) return 0
  return Math.round((value / stats.value.totalTimelines) * 100)
}

const fetchStats = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await api.get('/timeline/stats')

    if (response.success) {
      const data = response.data

      stats.value = {
        totalTimelines: data.totalTimelines || 0,
        activeTimelines: data.activeTimelines || 0,
        completedTimelines: data.completedTimelines || 0,
        overdueTimelines: data.overdueTimelines || 0,
        completionRate: data.completionRate || 0,
        onTimeRate: data.onTimeRate || 0,
        avgDuration: data.avgDuration ? `${data.avgDuration} hari` : '0 hari',
      }

      upcomingDeadlines.value = data.upcomingDeadlines || []
      atRiskTimelines.value = data.atRiskTimelines || []
    } else {
      error.value = response.message || 'Gagal memuat analytics'
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat analytics'
    console.error('Error fetching timeline stats:', err)
  } finally {
    loading.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Lifecycle
onMounted(() => {
  fetchStats()
})
</script>
