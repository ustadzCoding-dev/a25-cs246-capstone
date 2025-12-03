<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-900">Capstone Worksheet</h1>
        <p class="text-gray-600 text-lg">
          Laporkan progress aktivitas capstone project Anda untuk setiap periode check-in.
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-red-700">{{ error }}</span>
        </div>
        <button @click="fetchData" class="mt-2 text-red-600 hover:text-red-800 text-sm font-medium">
          Coba lagi
        </button>
      </div>

      <!-- Worksheet Periods -->
      <div v-else class="space-y-6">
        <!-- No Periods Message -->
        <div v-if="worksheets.length === 0" class="bg-white rounded-lg shadow p-8 text-center">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada periode worksheet</h3>
          <p class="mt-2 text-gray-500">
            Periode check-in worksheet akan muncul di sini saat sudah tersedia.
          </p>
        </div>

        <!-- Worksheet Cards -->
        <div
          v-for="item in worksheets"
          :key="item.period?.id"
          class="bg-white rounded-lg shadow overflow-hidden"
        >
          <!-- Period Header -->
          <div class="px-6 py-4 border-b" :class="getPeriodHeaderClass(item.period)">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  {{ item.period?.title || `Periode ${item.period?.periodNumber}` }}
                </h2>
                <p class="text-sm text-gray-600">
                  {{ formatDate(item.period?.startDate) }} - {{ formatDate(item.period?.deadline) }}
                </p>
              </div>
              <div class="flex items-center space-x-3">
                <span
                  :class="getPeriodStatusClass(item.period)"
                  class="px-3 py-1 rounded-full text-xs font-medium"
                >
                  {{ getPeriodStatusLabel(item.period) }}
                </span>
                <span
                  v-if="item.period?.status === 'active' && item.period?.daysRemaining > 0"
                  class="text-sm text-orange-600 font-medium"
                >
                  {{ item.period.daysRemaining }} hari lagi
                </span>
              </div>
            </div>
          </div>

          <!-- Worksheet Content -->
          <div class="px-6 py-4">
            <!-- Worksheet Status (if submitted) -->
            <div v-if="item.worksheet?.isSubmitted" class="mb-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <span class="text-sm text-gray-600">Status Validasi:</span>
                  <span
                    :class="getValidationStatusClass(item.worksheet)"
                    class="ml-2 px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ item.worksheet?.validationStatusLabel || 'Menunggu Validasi' }}
                  </span>
                  <span v-if="item.worksheet?.isLate" class="ml-2 text-xs text-orange-600"
                    >(Terlambat)</span
                  >
                </div>
                <span class="text-sm text-gray-500">
                  Disubmit: {{ formatDateTime(item.worksheet?.submittedAt) }}
                </span>
              </div>

              <!-- Admin Notes -->
              <div v-if="item.worksheet?.adminNotes" class="mt-3 p-3 bg-blue-50 rounded-lg">
                <p class="text-sm font-medium text-blue-800">Catatan Admin:</p>
                <p class="text-sm text-blue-700">{{ item.worksheet.adminNotes }}</p>
              </div>

              <!-- View Submitted Content -->
              <div class="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 class="text-sm font-medium text-gray-700 mb-2">Deskripsi Aktivitas:</h4>
                <p class="text-sm text-gray-600 whitespace-pre-wrap">
                  {{ item.worksheet?.activityDescription }}
                </p>

                <!-- Evidence Files - Clickable -->
                <div v-if="item.worksheet?.evidence?.length > 0" class="mt-4">
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    Bukti ({{ item.worksheet.evidence.length }} file):
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <a
                      v-for="(evidence, idx) in item.worksheet.evidence"
                      :key="idx"
                      :href="evidence.fileUrl || evidence.filePath"
                      :download="evidence.originalName"
                      class="flex items-center bg-white border rounded-lg px-4 py-3 hover:bg-indigo-50 hover:border-indigo-300 transition-colors group cursor-pointer"
                    >
                      <svg
                        v-if="evidence.mimeType?.includes('pdf')"
                        class="w-8 h-8 text-red-500 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <svg
                        v-else
                        class="w-8 h-8 text-blue-500 mr-3 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="flex-1 min-w-0">
                        <p
                          class="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600"
                        >
                          {{ evidence.originalName }}
                        </p>
                        <p class="text-xs text-gray-500">{{ formatFileSize(evidence.fileSize) }}</p>
                      </div>
                      <svg
                        class="w-5 h-5 text-gray-400 group-hover:text-indigo-600 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Form (if can submit) -->
            <div
              v-else-if="
                item.period?.status === 'active' ||
                (item.period?.status === 'closed' && !item.worksheet?.isSubmitted)
              "
            >
              <form @submit.prevent="openSubmitModal(item.period)">
                <!-- Activity Description -->
                <div class="mb-4">
                  <label
                    :for="`activity-${item.period?.id}`"
                    class="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Deskripsi Aktivitas <span class="text-red-500">*</span>
                  </label>
                  <textarea
                    :id="`activity-${item.period?.id}`"
                    v-model="formData[item.period?.id]"
                    rows="5"
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Jelaskan aktivitas yang telah Anda lakukan selama periode ini (minimal 50 karakter)..."
                    :disabled="item.period?.status !== 'active'"
                  ></textarea>
                  <p class="mt-1 text-xs text-gray-500">
                    {{ (formData[item.period?.id] || '').length }} / 50 karakter minimum
                  </p>
                </div>

                <!-- Evidence Upload -->
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Bukti (Screenshot/PDF)
                  </label>

                  <!-- Uploaded Files - Clickable -->
                  <div v-if="uploadedEvidence[item.period?.id]?.length > 0" class="mb-3 space-y-2">
                    <div
                      v-for="(file, idx) in uploadedEvidence[item.period?.id]"
                      :key="idx"
                      class="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <a
                        :href="file.fileUrl || file.filePath"
                        :download="file.originalName || file.name"
                        class="flex items-center flex-1 min-w-0 hover:text-indigo-600 group"
                      >
                        <svg
                          class="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <span class="text-sm text-gray-700 truncate group-hover:text-indigo-600">
                          {{ file.originalName || file.name }}
                        </span>
                        <svg
                          class="w-4 h-4 text-gray-400 group-hover:text-indigo-600 ml-2 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                      <button
                        type="button"
                        @click="removeFile(item.period?.id, idx, file)"
                        class="text-red-500 hover:text-red-700 ml-3 p-1"
                        :disabled="item.period?.status !== 'active'"
                      >
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Upload Button -->
                  <div v-if="item.period?.status === 'active'">
                    <label
                      class="flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-400 transition-colors"
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*,.pdf"
                        class="hidden"
                        @change="handleFileUpload($event, item.period?.id)"
                        :disabled="uploading"
                      />
                      <div class="flex items-center text-gray-600">
                        <svg
                          v-if="!uploading"
                          class="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <div
                          v-else
                          class="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 mr-2"
                        ></div>
                        <span class="text-sm">{{
                          uploading ? 'Mengupload...' : 'Upload bukti (maks 5 file, 5MB/file)'
                        }}</span>
                      </div>
                    </label>
                    <p class="mt-1 text-xs text-gray-500">Format: JPEG, PNG, GIF, WebP, PDF</p>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex items-center justify-between pt-4 border-t">
                  <div>
                    <button
                      v-if="item.period?.status === 'active'"
                      type="button"
                      @click="saveDraft(item.period?.id)"
                      :disabled="submitting"
                      class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {{ submitting ? 'Menyimpan...' : 'Simpan Draft' }}
                    </button>
                  </div>
                  <button
                    type="submit"
                    :disabled="
                      !canSubmit(item.period?.id) || submitting || item.period?.status !== 'active'
                    "
                    class="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ submitting ? 'Mengirim...' : 'Submit Worksheet' }}
                  </button>
                </div>

                <!-- Late Warning -->
                <div
                  v-if="item.period?.status === 'closed' && !item.worksheet?.isSubmitted"
                  class="mt-4 p-3 bg-orange-50 rounded-lg"
                >
                  <p class="text-sm text-orange-700">
                    ⚠️ Periode sudah ditutup. Anda masih bisa submit, namun akan dicatat sebagai
                    terlambat.
                  </p>
                </div>
              </form>
            </div>

            <!-- Draft Status -->
            <div v-else-if="item.period?.status === 'draft'" class="text-center py-6">
              <svg
                class="mx-auto h-10 w-10 text-gray-400"
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
              <p class="mt-2 text-gray-500">Periode ini belum dibuka</p>
            </div>

            <!-- Validated Period without submission -->
            <div
              v-else-if="item.period?.status === 'validated' && !item.worksheet"
              class="text-center py-6"
            >
              <svg
                class="mx-auto h-10 w-10 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="mt-2 text-red-600 font-medium">Tidak Mengisi Worksheet</p>
              <p class="text-sm text-gray-500">
                Periode ini sudah berakhir dan Anda tidak mengisi worksheet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Toast Notification -->
    <div v-if="toast.show" class="fixed bottom-4 right-4 z-50">
      <div
        :class="[
          'px-4 py-3 rounded-lg shadow-lg flex items-center',
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white',
        ]"
      >
        <svg
          v-if="toast.type === 'success'"
          class="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <svg v-else class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import { useWorksheetStore } from '../../stores/worksheetStore'
import { useAuthStore } from '../../stores/authStore'
import { useStudentMenu } from '../../composables/useStudentMenu'

const router = useRouter()
const worksheetStore = useWorksheetStore()
const authStore = useAuthStore()
const { studentMenuItems } = useStudentMenu()

// User data
const user = computed(() => authStore.user)

// State
const formData = reactive({})
const uploadedEvidence = reactive({})
const selectedPeriodId = ref(null)
const toast = reactive({
  show: false,
  message: '',
  type: 'success',
})

// Computed
const loading = computed(() => worksheetStore.loading)
const submitting = computed(() => worksheetStore.submitting)
const uploading = computed(() => worksheetStore.uploading)
const error = computed(() => worksheetStore.error)
const worksheets = computed(() => worksheetStore.myWorksheets)

// Methods
const fetchData = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  try {
    await worksheetStore.fetchMyWorksheets()

    worksheets.value.forEach(item => {
      if (item.period?.id) {
        formData[item.period.id] = item.worksheet?.activityDescription || ''
        uploadedEvidence[item.period.id] = item.worksheet?.evidence || []

        // Debug: log evidence data structure
        if (item.worksheet?.evidence?.length > 0) {
          console.log(
            '[fetchData] Evidence for period',
            item.period.id,
            ':',
            JSON.stringify(item.worksheet.evidence, null, 2)
          )
        }
      }
    })
  } catch (err) {
    if (
      err.status === 401 ||
      err.message?.includes('Unauthorized') ||
      err.message?.includes('token')
    ) {
      authStore.logout()
      router.push('/login')
      return
    }
    showToast('Gagal memuat data worksheet', 'error')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = date => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const formatDateTime = date => {
  if (!date) return '-'
  return new Date(date).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatFileSize = bytes => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getPeriodHeaderClass = period => {
  if (!period) return 'bg-gray-100'
  switch (period.status) {
    case 'active':
      return 'bg-green-50 border-green-200'
    case 'closed':
      return 'bg-orange-50 border-orange-200'
    case 'validated':
      return 'bg-blue-50 border-blue-200'
    default:
      return 'bg-gray-100'
  }
}

const getPeriodStatusClass = period => {
  if (!period) return 'bg-gray-100 text-gray-700'
  switch (period.status) {
    case 'active':
      return 'bg-green-100 text-green-700'
    case 'closed':
      return 'bg-orange-100 text-orange-700'
    case 'validated':
      return 'bg-blue-100 text-blue-700'
    case 'draft':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getPeriodStatusLabel = period => {
  if (!period) return 'Unknown'
  switch (period.status) {
    case 'active':
      return 'Aktif'
    case 'closed':
      return 'Ditutup'
    case 'validated':
      return 'Sudah Divalidasi'
    case 'draft':
      return 'Belum Dibuka'
    default:
      return period.status
  }
}

const getValidationStatusClass = worksheet => {
  if (!worksheet) return 'bg-gray-100 text-gray-700'
  switch (worksheet.validationStatus) {
    case 'completed':
      return 'bg-green-100 text-green-700'
    case 'completed_late':
      return 'bg-yellow-100 text-yellow-700'
    case 'incomplete':
      return 'bg-red-100 text-red-700'
    case 'pending':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const canSubmit = periodId => {
  const description = formData[periodId] || ''
  return description.length >= 50
}

const handleFileUpload = async (event, periodId) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  const currentCount = (uploadedEvidence[periodId] || []).length
  if (currentCount + files.length > 5) {
    showToast('Maksimal 5 file bukti', 'error')
    return
  }

  const maxSize = 5 * 1024 * 1024
  const validFiles = files.filter(f => f.size <= maxSize)
  if (validFiles.length < files.length) {
    showToast('Beberapa file melebihi batas 5MB', 'error')
  }

  if (validFiles.length === 0) return

  try {
    await worksheetStore.uploadEvidence(periodId, validFiles)

    await worksheetStore.fetchMyWorksheetByPeriod(periodId)
    const worksheet = worksheetStore.currentWorksheet
    uploadedEvidence[periodId] = worksheet?.evidence || []

    showToast('Bukti berhasil diupload', 'success')
  } catch (err) {
    showToast(err.message || 'Gagal upload bukti', 'error')
  }

  event.target.value = ''
}

const removeFile = async (periodId, index, file) => {
  // Show confirmation dialog
  const result = await Swal.fire({
    title: 'Hapus Bukti',
    text: `Hapus file "${file.originalName || file.name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    // Debug: log the file object to see its structure
    console.log('[removeFile] File object:', JSON.stringify(file, null, 2))
    console.log('[removeFile] file._id:', file._id)
    console.log('[removeFile] file.id:', file.id)
    console.log('[removeFile] file.publicId:', file.publicId)
    console.log('[removeFile] file.fileName:', file.fileName)

    // Try multiple ID sources - _id, id (from transformation), publicId, fileName
    const evidenceId = file._id || file.id || file.publicId || file.fileName
    console.log('[removeFile] Using evidenceId:', evidenceId)

    if (!evidenceId) {
      showToast('ID bukti tidak ditemukan', 'error')
      return
    }

    await worksheetStore.removeEvidence(periodId, evidenceId)

    uploadedEvidence[periodId] = uploadedEvidence[periodId].filter((_, i) => i !== index)

    showToast('Bukti berhasil dihapus', 'success')
  } catch (err) {
    showToast(err.message || 'Gagal menghapus bukti', 'error')
  }
}

const saveDraft = async periodId => {
  try {
    await worksheetStore.saveWorksheetDraft(periodId, formData[periodId] || '')
    showToast('Draft berhasil disimpan', 'success')
  } catch (err) {
    showToast(err.message || 'Gagal menyimpan draft', 'error')
  }
}

const openSubmitModal = async period => {
  if (!canSubmit(period.id)) {
    showToast('Deskripsi aktivitas minimal 50 karakter', 'error')
    return
  }

  // Show SweetAlert confirmation
  const result = await Swal.fire({
    title: 'Konfirmasi Submit',
    text: 'Anda yakin ingin submit worksheet ini? Setelah submit, Anda tidak bisa mengubahnya lagi.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Submit',
    cancelButtonText: 'Batal'
  })

  if (!result.isConfirmed) return

  try {
    await worksheetStore.submitWorksheet(period.id, formData[period.id])
    showToast('Worksheet berhasil disubmit!', 'success')
    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal submit worksheet', 'error')
  }
}

const confirmSubmit = async () => {
  if (!selectedPeriodId.value) return

  try {
    await worksheetStore.submitWorksheet(selectedPeriodId.value, formData[selectedPeriodId.value])
    showSubmitModal.value = false
    showToast('Worksheet berhasil disubmit!', 'success')

    await fetchData()
  } catch (err) {
    showToast(err.message || 'Gagal submit worksheet', 'error')
  }
}

const showToast = (message, type = 'success') => {
  toast.message = message
  toast.type = type
  toast.show = true
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

// Lifecycle
onMounted(() => {
  fetchData()
})
</script>
