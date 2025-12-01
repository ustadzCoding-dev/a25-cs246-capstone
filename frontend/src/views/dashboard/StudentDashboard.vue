<template>
  <DashboardLayout
    :user="user"
    :menu-items="studentMenuItems"
    @logout="handleLogout"
  >
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="font-semibold text-gray-900
        lg:text-2xl
          md:text-xl
          sm:text-lg
          text-base">Dashboard</h1>
        <p class="text-gray-600
        lg:text-lg md:text-lg sm:text-sm text-sm">
          Selamat datang kembali, <span class="text-primary-600 font-semibold">{{ user?.name }}</span>!
        </p>
      </div>

      <!-- Detail Info Capstone Project -->
      <div class="grid gap-5 bg-white shadow-md p-6 rounded-lg
      lg:grid-cols-3
      md:grid-cols-4
      grid-cols-1">
       <div class="
       lg:col-span-2 lg:row-start-1
       md:col-span-2 md:row-start-1">
        <div class="border-b border-gray-200 pb-3">
          <h2 class=" font-semibold text-gray-900
          lg:text-2xl
          md:text-xl
          sm:text-lg
          text-base">Apa itu Capstone Project?</h2>
        </div>
        <p class="text-gray-700
        lg:text-lg lg:mt-5
        md:text-base
        sm:text-sm
        mt-1 text-xs">
          Capstone Project adalah proyek akhir yang dirancang untuk mengaplikasikan
          pengetahuan dan keterampilan yang telah Anda pelajari selama program
          bootcamp. Proyek ini bertujuan untuk memberikan pengalaman praktis dalam
          menyelesaikan masalah dunia nyata melalui kolaborasi tim dan inovasi.
        </p>
        <ul class="text-gray-700 lg:text-lg lg:ml-10 md:text-base md:ml-6 sm:text-sm text-xs ml-3">
          <li class="mt-2">• Bekerja dalam tim untuk <span class="font-semibold">mengembangkan solusi nyata.</span></li>
          <li class="mt-2">• <span class="font-semibold">Meningkatkan keterampilan</span> manajemen proyek dan komunikasi.</li>
        </ul>
       </div>

        <!-- Team Status Card -->
        <div class="
        lg:col-span-2 lg:row-start-2
        md:col-span-4 md:row-start-2">
          <TeamStatusCard
            v-if="hasTeam"
            :team-name="teamInfo.teamName"
            :leader-name="teamInfo.leaderName"
            :use-case="teamInfo.useCase"
            :status="teamInfo.status"
            :members="teamInfo.members"
          />

          <!-- No Team Alert -->
          <div
            v-else
            class="bg-warning-50 border border-yellow-600 rounded-lg p-6"
          >
            <div class="flex items-center">
              <svg
                class="size-7 text-warning-600 mr-3 flex-shrink-0"
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
                <h3 class=" font-semibold text-warning-700
                lg:text-lg
                md:text-base
                sm:text-base
                text-sm">Anda Belum Terdaftar di Tim</h3>
                <p class="lg:text-base md:text-base sm:text-sm text-xs text-warning-600">
                  Silakan bergabung dengan tim atau buat tim baru untuk
                  melanjutkan program capstone.
                </p>
                <div class="mt-4">
                  <BaseButton variant="warning" @click="$router.push('/team')">
                    Kelola Tim
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Information Card -->
        <div class=" lg:p-5 md:p-5 lg:border-l md:border-l border-gray-300
        lg:col-span-1 lg:row-span-2 lg:col-start-3 lg:row-start-1
        md:col-span-2 md:row-span-1 md:col-start-3 md:row-start-1">
          <div class="border-b border-gray-200 pb-3">
            <h3 class="font-semibold text-gray-900
            lg:text-lg
                md:text-base
                sm:text-base
                text-sm">Informasi</h3>
          </div>
          <div class="flex flex-col gap-5 lg:mt-4 md:mt-1">
            <div class="grid grid-cols-7">
              <div class="col-span-5">
                <h4 class="lg:text-base md:text-base sm:text-sm text-sm font-semibold">
                  {3} Dokumen Telah Ditambahkan
                </h4>
                <p class="lg:text-sm md:text-sm sm:text-xs text-xs text-gray-500">
                  Check dokumen terbaru untuk referensi capstone project Anda.
                </p>
              </div>
              <div class="text-end col-span-2">
                <router-link
                  to="/documents"
                  class="lg:text-sm md:text-sm sm:text-xs text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Lihat Semua
                </router-link>
              </div>
            </div>
            <div class="grid grid-cols-7">
              <div class="col-span-5">
                <h4 class="lg:text-base md:text-base sm:text-sm text-sm font-semibold">
                  {5} Timeline Aktif
                </h4>
                <p class="lg:text-sm md:text-sm sm:text-xs text-xs text-gray-500">
                  Pantau perkembangan capstone project Anda melalui timeline yang
                  telah dibuat.
                </p>
              </div>
              <div class="text-end col-span-2">
                <router-link
                  to="/timeline"
                  class="lg:text-sm md:text-sm sm:text-xs text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Lihat Semua
                </router-link>
              </div>
            </div>
            <div class="grid grid-cols-7">
              <div class="col-span-5">
                <h4 class="lg:text-base md:text-base sm:text-sm text-sm font-semibold">
                  {8} Pengumuman Baru
                </h4>
                <p class="lg:text-sm md:text-sm sm:text-xs text-xs text-gray-500">
                  Jangan lewatkan pengumuman penting terkait capstone project Anda.
                </p>
              </div>
              <div class="text-end col-span-2">
                <router-link
                  to="/announcements"
                  class="lg:text-sm md:text-sm sm:text-xs text-xs font-medium text-primary-600 hover:text-primary-700"
                >
                  Lihat Semua
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="bg-white rounded-lg lg:p-5 md:p-5 border-t border-gray-300
        lg:col-span-3 lg:row-start-3
        md:col-span-4 md:row-start-3">
          <div class="mb-4">
            <h3 class="font-semibold text-gray-900
            lg:text-lg
                md:text-base
                sm:text-base
                text-sm">Akses Cepat</h3>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link
              to="/team"
              class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
            >
              <svg
                class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
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
              <span class="font-medium text-primary-600 mt-1
              lg:text-sm md:text-sm sm:text-xs text-xs">Tim Saya</span>
            </router-link>

            <router-link
              to="/documents"
              class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
            >
              <svg
                class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span class="font-medium text-primary-600 mt-1
              lg:text-sm md:text-sm sm:text-xs text-xs">Dokumen</span>
            </router-link>

            <router-link
              to="/timeline"
              class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
            >
              <svg
                class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span class="font-medium text-primary-600 mt-1
              lg:text-sm md:text-sm sm:text-xs text-xs">Timeline</span>
            </router-link>

            <router-link
              to="/announcements"
              class="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
            >
              <svg
                class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                />
              </svg>
              <span class="font-medium text-primary-600 mt-1
              lg:text-sm md:text-sm sm:text-xs text-xs">Pengumuman</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import { useDocumentStore } from '../../stores/documentStore'
import { useTimelineStore } from '../../stores/timelineStore'
import { useAnnouncementStore } from '../../stores/announcementStore'
import { useStudentMenu } from '../../composables/useStudentMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import TeamStatusCard from '../../components/display/TeamStatusCard.vue'
import BaseButton from '../../components/base/BaseButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()
const documentStore = useDocumentStore()
const timelineStore = useTimelineStore()
const announcementStore = useAnnouncementStore()

const user = computed(() => authStore.user)

const hasTeam = computed(() => {
  // Fixed logic: Check if user has an approved team
  // Previously was just checking if currentTeam exists
  const team = teamStore.currentTeam
  return team && team.status === 'approved'
})

const teamInfo = computed(() => {
  const team = teamStore.currentTeam
  if (!team || team.status !== 'approved') return null

  return {
    teamName: team.teamName,
    leaderName: team.leader?.name || team.leader?.email,
    useCase: team.useCase?.code || team.useCase,
    status: team.status,
    members: team.members || []
  }
})

const { studentMenuItems } = useStudentMenu()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

onMounted(async () => {
  try {
    // Fetch all dashboard data in parallel
    await Promise.all([
      teamStore.fetchCurrentTeam(),
      documentStore.fetchDocuments({ limit: 5 }),
      timelineStore.fetchTimelines(),
      announcementStore.fetchAnnouncements()
    ])
  } catch (err) {
    console.error('Failed to fetch dashboard data:', err)
  }
})
</script>
