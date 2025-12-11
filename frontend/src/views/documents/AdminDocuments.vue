<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div
        class="pb-4 bg-white p-5 rounded-lg shadow-md flex justify-start items-start flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
            Manage Documents
          </h1>
          <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
            Upload dan kelola dokumen panduan capstone
          </p>
        </div>
        <BaseButton variant="primary" @click="showUploadModal = true">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          Upload Dokumen
        </BaseButton>
      </div>

      <div class="p-6 bg-white shadow-md rounded-lg flex flex-col gap-5">
        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard label="Total Dokumen" :value="stats.total" icon="document" color="primary" />
          <StatsCard
            label="Diupload Bulan Ini"
            :value="stats.thisMonth"
            icon="document"
            color="success"
          />
          <StatsCard
            label="Total Download"
            :value="stats.totalDownloads"
            icon="chart"
            color="warning"
          />
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseSearch v-model="searchQuery" placeholder="Cari dokumen..." />

            <BaseSelect
              v-model="filterCategory"
              :options="categoryOptions"
              placeholder="Semua Kategori"
            />
          </div>
        </div>

        <!-- Documents Table -->
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="font-semibold text-gray-900 lg:text-lg md:text-base sm:text-base text-sm">
              Daftar Dokumen
            </h2>
          </div>

          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>

          <div v-else-if="filteredDocuments.length === 0" class="p-12 text-center">
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
            <p class="mt-2 text-sm text-gray-500">Belum ada dokumen</p>
          </div>

          <div v-else class="divide-y divide-gray-200 overflow-x-auto">
            <div
              v-for="doc in filteredDocuments"
              :key="doc._id"
              class="p-6 hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex items-start justify-between gap-4 md:gap-0 flex-col md:flex-row">
                <div class="flex-1">
                  <div class="flex items-center space-x-3">
                    <svg
                      class="lg:size-8 md:size-8 sm:size-6 size-6 text-primary-600 flex-shrink-0"
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
                    <div class="min-w-max">
                      <h3 class="lg:text-base md:text-base sm:text-sm text-sm font-semibold text-gray-900">{{ doc.title }}</h3>
                      <p class="lg:text-sm md:text-sm sm:text-xs text-xs text-gray-600">{{ doc.description }}</p>
                      <div class="flex items-center space-x-4 mt-3 lg:text-sm md:text-sm sm:text-xs text-xs text-gray-500">
                        <span>{{ formatDate(doc.createdAt) }}</span>
                        <span>•</span>
                        <span>{{ doc.fileName }}</span>
                        <span>•</span>
                        <span>{{ doc.downloadCount }} downloads</span>
                        <span>•</span>
                        <BaseBadge size="sm" :variant="getCategoryVariant(doc.category)">
                          {{ doc.category }}
                          {{ getCategoryVariant(doc.category) }}
                        </BaseBadge>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="flex items-center space-x-2 ml-4 ">
                  <button
                    @click="downloadDocument(doc)"
                    class="text-primary-600 hover:text-primary-700 p-2"
                    title="Download"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>

                  <button
                    @click="editDocument(doc)"
                    class="text-warning-600 hover:text-warning-700 p-2"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>

                  <button
                    @click="deleteDocument(doc)"
                    class="text-danger-600 hover:text-danger-700 p-2"
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

      <!-- Upload/Edit Document Modal -->
      <BaseModal
        v-model="showUploadModal"
        :title="editingDocument ? '✏️ Edit Dokumen' : '📤 Upload Dokumen Baru'"
        size="lg"
      >
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- MODE INDICATOR -->
          <div
            v-if="editingDocument"
            class="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <span class="text-xs font-semibold text-blue-700 uppercase">Mode Edit</span>
            <span class="text-xs text-blue-600">Ubah informasi atau file dokumen</span>
          </div>

          <!-- METADATA SECTION -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-900">📋 Informasi Dokumen</h3>

            <BaseInput
              v-model="form.title"
              label="Judul Dokumen"
              placeholder="Masukkan judul dokumen"
              :error="errors.title"
              required
            />

            <BaseTextarea
              v-model="form.description"
              label="Deskripsi"
              placeholder="Masukkan deskripsi dokumen"
              :rows="3"
              :error="errors.description"
              required
            />

            <div class="grid grid-cols-2 gap-4">
              <BaseSelect
                v-model="form.category"
                label="Kategori"
                :options="categoryOptions"
                :error="errors.category"
                required
              />

              <BaseSelect
                v-model="form.visibility"
                label="Visibilitas"
                :options="[
                  { value: 'public', label: 'Public (Semua siswa)' },
                  { value: 'private', label: 'Private (Admin saja)' },
                ]"
                :error="errors.visibility"
                required
              />
            </div>
          </div>

          <!-- FILE/LINK SECTION -->
          <div class="space-y-4 pt-4 border-t border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900">📁 File & Link</h3>

            <!-- File upload -->
            <div>
              <BaseFileUpload
                v-model="form.file"
                :label="editingDocument ? 'File Dokumen (Pilih untuk mengganti)' : 'File Dokumen'"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                :max-size="10"
                :error="errors.file"
                :required="!editingDocument"
              />
              <p v-if="editingDocument" class="mt-2 text-xs text-gray-600">
                💡 Biarkan kosong jika tidak ingin mengganti file
              </p>
            </div>

            <!-- Current file info (after input) -->
            <div
              v-if="editingDocument && editingDocument.fileUrl"
              class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
            >
              <p class="text-xs font-medium text-blue-900 mb-1">📄 File Saat Ini:</p>
              <p class="text-sm text-blue-700 break-all">{{ editingDocument.fileName }}</p>
              <p v-if="editingDocument.fileUrl" class="text-xs text-blue-600 mt-1">
                Ukuran: {{ formatFileSize(editingDocument.fileUrl) }}
              </p>
            </div>

            <!-- Link input -->
            <div>
              <BaseInput
                v-model="form.link"
                label="Link Eksternal (Opsional)"
                placeholder="https://drive.google.com/... atau https://..."
                :error="errors.link"
                hint="Gunakan jika dokumen tersimpan di cloud storage"
              />
              <p v-if="editingDocument" class="mt-2 text-xs text-gray-600">
                💡 Kosongkan untuk menghapus link
              </p>
            </div>

            <!-- Current link info (after input) -->
            <div
              v-if="editingDocument && editingDocument.link"
              class="p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <p class="text-xs font-medium text-green-900 mb-1">🔗 Link Saat Ini:</p>
              <a
                :href="editingDocument.link"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-green-700 hover:underline break-all"
              >
                {{ editingDocument.link }}
              </a>
            </div>
          </div>

          <!-- ERROR MESSAGE -->
          <div v-if="error" class="p-3 bg-danger-50 border border-danger-200 rounded-lg">
            <p class="text-sm text-danger-700">⚠️ {{ error }}</p>
          </div>
        </form>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <BaseButton variant="outline" @click="closeModal"> Batal </BaseButton>
            <BaseButton variant="primary" :loading="submitting" @click="handleSubmit">
              {{ editingDocument ? 'Simpan Perubahan' : 'Upload Dokumen' }}
            </BaseButton>
          </div>
        </template>
      </BaseModal>

      <!-- Delete Confirmation Modal -->
      <BaseModal v-model="showDeleteModal" title="⚠️ Konfirmasi Hapus Permanen" size="md">
        <div class="space-y-4">
          <p class="text-gray-700">
            Apakah Anda yakin ingin menghapus dokumen ini secara <strong>permanen</strong>?
          </p>

          <!-- Document Details -->
          <div
            v-if="selectedDocument"
            class="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2"
          >
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Judul</p>
              <p class="text-sm text-gray-900">{{ selectedDocument.title }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">File</p>
              <p class="text-sm text-gray-900">{{ selectedDocument.fileName }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-600 uppercase">Kategori</p>
              <p class="text-sm text-gray-900">{{ selectedDocument.category }}</p>
            </div>
          </div>

          <!-- Warning -->
          <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
            <p class="text-sm text-danger-700">
              ⚠️ <strong>Perhatian:</strong> Dokumen dan file akan dihapus dari sistem secara
              permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <BaseButton variant="outline" @click="showDeleteModal = false"> Batal </BaseButton>
            <BaseButton variant="danger" :loading="deleting" @click="confirmDelete">
              Ya, Hapus
            </BaseButton>
          </div>
        </template>
      </BaseModal>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useDocumentStore } from '../../stores/documentStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import { getAdminDashboardStats } from '../../services/dashboardService'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseTextarea from '../../components/base/BaseTextarea.vue'
import BaseFileUpload from '../../components/base/BaseFileUpload.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const documentStore = useDocumentStore()

const user = computed(() => authStore.user)
const submitting = ref(false)
const deleting = ref(false)
const error = ref('')

const searchQuery = ref('')
const filterCategory = ref('')

const showUploadModal = ref(false)
const showDeleteModal = ref(false)
const editingDocument = ref(null)
const selectedDocument = ref(null)

const form = reactive({
  title: '',
  description: '',
  category: '',
  visibility: 'public',
  file: null,
  link: '',
})

const errors = reactive({
  title: '',
  description: '',
  category: '',
  visibility: '',
  file: '',
  link: '',
})

// Get data from store
const loading = computed(() => documentStore.documentsLoading)
const documents = computed(() => documentStore.documents)
const dashboardStats = ref(null)

// Calculate stats from API
const stats = computed(() => {
  if (!dashboardStats.value) {
    return { total: 0, thisMonth: 0, totalDownloads: 0 }
  }
  return {
    total: dashboardStats.value.documents?.total || 0,
    thisMonth: dashboardStats.value.documents?.thisMonth || 0,
    totalDownloads: dashboardStats.value.documents?.totalDownloads || 0,
  }
})

const categoryOptions = [
  { value: '', label: 'Semua Kategori' },
  { value: 'Panduan', label: 'Panduan' },
  { value: 'Template', label: 'Template' },
  { value: 'Referensi', label: 'Referensi' },
  { value: 'Lainnya', label: 'Lainnya' },
]

const { adminMenuItems } = useAdminMenu()

const filteredDocuments = computed(() => {
  let result = documents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      d => d.title.toLowerCase().includes(query) || d.description.toLowerCase().includes(query)
    )
  }

  if (filterCategory.value) {
    result = result.filter(d => d.category === filterCategory.value)
  }

  return result
})

const getCategoryVariant = category => {
  const variants = {
    Panduan: 'primary',
    Template: 'success',
    Referensi: 'warning',
    Lainnya: 'secondary',
  }
  return variants[category] || 'secondary'
}

const formatDate = date => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatFileSize = url => {
  // Try to extract size from URL or return generic message
  // For Cloudinary URLs, we can't easily get file size from URL
  // So we return a generic message
  if (url && url.includes('cloudinary')) {
    return 'Tersimpan di Cloudinary'
  }
  return 'File tersimpan'
}

const validateForm = () => {
  Object.keys(errors).forEach(key => (errors[key] = ''))
  let isValid = true

  if (!form.title || !form.title.trim()) {
    errors.title = 'Judul wajib diisi'
    isValid = false
  }

  if (form.title && form.title.trim().length < 3) {
    errors.title = 'Judul minimal 3 karakter'
    isValid = false
  }

  if (!form.description || !form.description.trim()) {
    errors.description = 'Deskripsi wajib diisi'
    isValid = false
  }

  if (form.description && form.description.trim().length < 10) {
    errors.description = 'Deskripsi minimal 10 karakter'
    isValid = false
  }

  if (!form.category) {
    errors.category = 'Kategori wajib dipilih'
    isValid = false
  }

  if (!form.visibility) {
    errors.visibility = 'Visibilitas wajib dipilih'
    isValid = false
  }

  // For new documents: File OR Link required
  if (!editingDocument.value && !form.file && !form.link) {
    errors.file = 'File atau Link harus diisi (minimal salah satu)'
    isValid = false
  }

  // For editing: File OR Link must exist (either new file, or existing file, or link)
  if (editingDocument.value) {
    const hasFile = form.file || editingDocument.value.fileUrl
    const hasLink = form.link
    if (!hasFile && !hasLink) {
      errors.file = 'File atau Link harus diisi (minimal salah satu)'
      isValid = false
    }
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  error.value = ''

  try {
    if (editingDocument.value) {
      // Update existing document
      const documentId = editingDocument.value._id || editingDocument.value.id

      // Check if file changed or link changed
      const hasNewFile = form.file !== null
      const hasLinkChange = form.link !== editingDocument.value.link

      console.log('=== Document Update Debug ===')
      console.log('Document ID:', documentId)
      console.log('Has new file:', hasNewFile)
      console.log('Has link change:', hasLinkChange)

      if (hasNewFile) {
        // If file changed, use FormData (for file upload)
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('category', form.category)
        formData.append('visibility', form.visibility)
        formData.append('file', form.file)

        if (form.link) {
          formData.append('link', form.link)
        }

        console.log('Updating with new file')
        await documentStore.updateDocument(documentId, formData)
      } else {
        // If only metadata/link changed, use JSON
        const updateData = {
          title: form.title,
          description: form.description,
          category: form.category,
          visibility: form.visibility,
          link: form.link || null,
        }

        console.log('Updating metadata/link only')
        console.log('Update Data:', updateData)
        await documentStore.updateDocument(documentId, updateData)
      }
    } else {
      // Create new document
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('visibility', form.visibility)

      if (form.file) {
        formData.append('file', form.file)
      }

      if (form.link) {
        formData.append('link', form.link)
      }

      console.log('=== Document Upload Debug ===')
      console.log('Title:', form.title)
      console.log('Description:', form.description)
      console.log('Category:', form.category)
      console.log('Visibility:', form.visibility)
      console.log(
        'File:',
        form.file ? { name: form.file.name, size: form.file.size, type: form.file.type } : null
      )

      await documentStore.uploadDocument(formData)
    }

    closeModal()
    await fetchDocuments()

    // Refresh stats after upload/update
    try {
      const statsResponse = await getAdminDashboardStats()
      if (statsResponse.success) {
        dashboardStats.value = statsResponse.data
      }
    } catch (err) {
      console.error('Failed to refresh stats:', err)
    }
  } catch (err) {
    console.error('Submit error:', err)
    error.value = err.message || 'Gagal menyimpan dokumen'
  } finally {
    submitting.value = false
  }
}

const downloadDocument = async doc => {
  try {
    await documentStore.downloadDocument(doc._id || doc.id, doc.title)
  } catch (err) {
    console.error('Download failed:', err)
  }
}

const editDocument = doc => {
  editingDocument.value = doc
  form.title = doc.title
  form.description = doc.description
  form.category = doc.category
  form.link = doc.link || ''
  form.file = null // Reset file - user must select new file if they want to replace
  showUploadModal.value = true
}

const deleteDocument = doc => {
  selectedDocument.value = doc
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await documentStore.deleteDocument(selectedDocument.value._id || selectedDocument.value.id)
    showDeleteModal.value = false
    await fetchDocuments()

    // Refresh stats after delete
    try {
      const statsResponse = await getAdminDashboardStats()
      if (statsResponse.success) {
        dashboardStats.value = statsResponse.data
      }
    } catch (err) {
      console.error('Failed to refresh stats:', err)
    }
  } finally {
    deleting.value = false
  }
}

const closeModal = () => {
  showUploadModal.value = false
  editingDocument.value = null
  form.title = ''
  form.description = ''
  form.category = ''
  form.visibility = 'public'
  form.file = null
  form.link = ''
  error.value = ''
  Object.keys(errors).forEach(key => (errors[key] = ''))
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchDocuments = async () => {
  try {
    const params = {
      category: filterCategory.value,
      search: searchQuery.value,
    }
    await documentStore.fetchDocuments(params)
  } catch (err) {
    console.error('Failed to fetch documents:', err)
  }
}

// Watch filters and refetch
watch([searchQuery, filterCategory], () => {
  fetchDocuments()
})

onMounted(async () => {
  try {
    // Fetch dashboard stats from API
    const statsResponse = await getAdminDashboardStats()
    console.log('Dashboard stats response:', statsResponse)
    if (statsResponse && statsResponse.data) {
      dashboardStats.value = statsResponse.data
      console.log('Dashboard stats loaded:', dashboardStats.value)
    }
  } catch (err) {
    console.error('Failed to fetch dashboard stats:', err)
  }

  fetchDocuments()
})
</script>
