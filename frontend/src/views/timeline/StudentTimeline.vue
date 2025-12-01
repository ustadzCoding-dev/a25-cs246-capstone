<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-900">Timeline Capstone</h1>
        <p class="text-gray-600 text-lg">Pantau progres dan deadline project Anda</p>
      </div>

      <!-- Current Week Highlight -->
      <div v-if="currentTimeline" class="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 text-white">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center space-x-2 mb-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span class="text-sm font-semibold uppercase tracking-wide">Timeline Aktif</span>
            </div>
            <h2 class="text-2xl font-bold mb-2">{{ currentTimeline.title }}</h2>
            <p class="text-primary-100 mb-4">{{ currentTimeline.description }}</p>
            <div class="flex items-center space-x-6 text-sm">
              <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDateRange(currentTimeline.startDate, currentTimeline.endDate) }}</span>
              </div>
              <div class="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="font-semibold">{{ getDaysRemaining(currentTimeline.endDate) }} hari tersisa</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-md text-gray-600">Selesai</p>
              <p class="text-2xl text-success-600">{{ stats.completed }}</p>
            </div>
            <div class="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-md text-gray-600">Sedang Berjalan</p>
              <p class="text-2xl text-warning-600">{{ stats.active }}</p>
            </div>
            <div class="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-md text-gray-600">Mendatang</p>
              <p class="text-2xl text-gray-600">{{ stats.upcoming }}</p>
            </div>
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Timeline Visualization -->
      <div class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Timeline Project</h2>
        </div>

        <div v-if="loading" class="p-12">
          <BaseSpinner centered size="lg" label="Memuat timeline..." />
        </div>

        <div v-else-if="timelineItems.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Belum ada timeline</p>
        </div>

        <div v-else class="p-6">
          <div class="space-y-8">
            <TimelineItem
              v-for="(item, index) in timelineItems"
              :key="item._id"
              :title="item.title"
              :description="item.description"
              :start-date="item.startDate"
              :end-date="item.endDate"
              :status="item.status"
              :is-last="index === timelineItems.length - 1"
            />
          </div>
        </div>
      </div>

      <!-- Upcoming Deadlines -->
      <div v-if="upcomingDeadlines.length > 0" class="bg-white rounded-lg shadow">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Deadline Terdekat</h2>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="deadline in upcomingDeadlines"
            :key="deadline._id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-base font-semibold text-gray-900">{{ deadline.title }}</h3>
                <p class="text-sm text-gray-600 mt-1">{{ deadline.description }}</p>
                <div class="mt-2 flex items-center space-x-4 text-sm">
                  <span class="text-gray-500">{{ formatDate(deadline.endDate) }}</span>
                  <span
                    :class="[
                      'font-medium',
                      getDaysRemaining(deadline.endDate) <= 3 ? 'text-danger-600' : 'text-warning-600'
                    ]"
                  >
                    {{ getDaysRemaining(deadline.endDate) }} hari lagi
                  </span>
                </div>
              </div>

              <div
                :class="[
                  'flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold',
                  getDaysRemaining(deadline.endDate) <= 3 ? 'bg-danger-100 text-danger-600' : 'bg-warning-100 text-warning-600'
                ]"
              >
                {{ getDaysRemaining(deadline.endDate) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="bg-primary-50 border border-primary-400 rounded-lg p-6">
          <div class="flex items-start">
            <svg
              class="size-7 text-primary-600 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-blue-700 mb-2">Tips Mengelola Timeline</h3>
              <ul class="text-sm text-primary-700 space-y-1 list-disc list-inside">
                <li class="font-medium">
                  Pantau deadline secara berkala agar tidak terlewat
                </li>
                <li class="font-medium">
                  Koordinasi dengan tim untuk pembagian tugas yang efektif
                </li>
                <li class="font-medium">Mulai mengerjakan task lebih awal untuk menghindari deadline mepet</li>
                <li class="font-medium">Komunikasikan kendala ke mentor jika ada kesulitan</li>
              </ul>
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
import { useTimelineStore } from '../../stores/timelineStore'
import { useStudentMenu } from '../../composables/useStudentMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import TimelineItem from '../../components/display/TimelineItem.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()
const timelineStore = useTimelineStore()

const user = computed(() => authStore.user)

// Get data from store
const loading = computed(() => timelineStore.timelinesLoading)
const timelineItems = computed(() => timelineStore.sortedTimelines)

const { studentMenuItems } = useStudentMenu()

const currentTimeline = computed(() => {
  return timelineItems.value.find(item => item.status === 'ongoing')
})

const stats = computed(() => {
  return {
    completed: timelineItems.value.filter(item => item.status === 'overdue').length,
    active: timelineItems.value.filter(item => item.status === 'ongoing').length,
    upcoming: timelineItems.value.filter(item => item.status === 'upcoming').length
  }
})

const upcomingDeadlines = computed(() => {
  const today = new Date()
  return timelineItems.value
    .filter(item => {
      const endDate = new Date(item.endDate)
      const daysRemaining = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24))
      return daysRemaining > 0 && daysRemaining <= 14 && item.status !== 'completed'
    })
    .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
    .slice(0, 3)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const formatDateRange = (start, end) => {
  const startDate = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
  const endDate = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  return `${startDate} - ${endDate}`
}

const getDaysRemaining = (endDate) => {
  const today = new Date()
  const end = new Date(endDate)
  const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    await timelineStore.fetchTimelines()
  } catch (err) {
    console.error('Failed to fetch timelines:', err)
  }
})
</script>
