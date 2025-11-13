<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Kelola Dokumen</h1>
          <p class="mt-2 text-gray-600">Upload dan kelola dokumen panduan capstone</p>
        </div>
        
        <BaseButton
          variant="primary"
          @click="showUploadModal = true"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          Upload Dokumen
        </BaseButton>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          label="Total Dokumen"
          :value="stats.total"
          icon="document"
          color="primary"
        />
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
          <BaseSearch
            v-model="searchQuery"
            placeholder="Cari dokumen..."
          />
          
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
          <h2 class="text-xl font-semibold text-gray-900">Daftar Dokumen</h2>
        </div>

        <div v-if="loading" class="p-12">
          <BaseSpinner centered size="lg" label="Memuat dokumen..." />
        </div>

        <div v-else-if="filteredDocuments.length === 0" class="p-12 text-center">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">Belum ada dokumen</p>
        </div>

        <div v-else class="divide-y divide-gray-200">
          <div
            v-for="doc in filteredDocuments"
            :key="doc._id"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center space-x-3">
                  <svg class="w-8 h-8 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h3 class="text-base font-semibold text-gray-900">{{ doc.title }}</h3>
                    <p class="text-sm text-gray-600 mt-1">{{ doc.description }}</p>
                    <div class="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{{ formatDate(doc.uploadDate) }}</span>
                      <span>•</span>
                      <span>{{ doc.fileSize }}</span>
                      <span>•</span>
                      <span>{{ doc.downloads }} downloads</span>
                      <span>•</span>
                      <BaseBadge size="sm" :variant="getCategoryVariant(doc.category)">
                        {{ doc.category }}
                      </BaseBadge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 ml-4">
                <button
                  @click="downloadDocument(doc)"
                  class="text-primary-600 hover:text-primary-700 p-2"
                  title="Download"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                
                <button
                  @click="editDocument(doc)"
                  class="text-gray-600 hover:text-gray-700 p-2"
                  title="Edit"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  @click="deleteDocument(doc)"
                  class="text-danger-600 hover:text-danger-700 p-2"
                  title="Hapus"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
      :title="editingDocument ? 'Edit Dokumen' : 'Upload Dokumen Baru'"
      size="lg"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
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

        <BaseSelect
          v-model="form.category"
          label="Kategori"
          :options="categoryOptions"
          :error="errors.category"
          required
        />

        <BaseFileUpload
          v-if="!editingDocument"
          v-model="form.file"
          label="File Dokumen"
          accept=".pdf,.doc,.docx,.ppt,.pptx"
          :max-size="10"
          :error="errors.file"
          required
        />

        <BaseInput
          v-model="form.link"
          label="Link Dokumen (Opsional)"
          placeholder="https://example.com/document"
          :error="errors.link"
          hint="Link eksternal jika dokumen di cloud storage"
        />

        <div v-if="error" class="p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <p class="text-sm text-danger-700">{{ error }}</p>
        </div>
      </form>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="closeModal">
            Batal
          </BaseButton>
          <BaseButton
            variant="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ editingDocument ? 'Simpan Perubahan' : 'Upload Dokumen' }}
          </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Delete Confirmation Modal -->
    <BaseModal
      v-model="showDeleteModal"
      title="Konfirmasi Hapus"
      size="md"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Apakah Anda yakin ingin menghapus dokumen <strong>{{ selectedDocument?.title }}</strong>?
        </p>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-sm text-danger-700">
            Dokumen yang dihapus tidak dapat dikembalikan.
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDeleteModal = false">
            Batal
          </BaseButton>
          <BaseButton
            variant="danger"
            :loading="deleting"
            @click="confirmDelete"
          >
            Ya, Hapus
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useDocumentStore } from '../../stores/documentStore'
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
  file: null,
  link: ''
})

const errors = reactive({
  title: '',
  description: '',
  category: '',
  file: '',
  link: ''
})

// Get data from store
const loading = computed(() => documentStore.documentsLoading)
const documents = computed(() => documentStore.documents)

// Calculate stats
const stats = computed(() => ({
  total: documents.value.length,
  thisMonth: documents.value.filter(d => {
    const uploadDate = new Date(d.uploadDate)
    const now = new Date()
    return uploadDate.getMonth() === now.getMonth() && uploadDate.getFullYear() === now.getFullYear()
  }).length,
  totalDownloads: documents.value.reduce((sum, d) => sum + (d.downloads || 0), 0)
}))

const categoryOptions = [
  { value: '', label: 'Semua Kategori' },
  { value: 'Panduan', label: 'Panduan' },
  { value: 'Template', label: 'Template' },
  { value: 'Referensi', label: 'Referensi' },
  { value: 'Lainnya', label: 'Lainnya' }
]

const adminMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
  { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
  { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
  { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] }
]

const filteredDocuments = computed(() => {
  let result = documents.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(d =>
      d.title.toLowerCase().includes(query) ||
      d.description.toLowerCase().includes(query)
    )
  }

  if (filterCategory.value) {
    result = result.filter(d => d.category === filterCategory.value)
  }

  return result
})

const getCategoryVariant = (category) => {
  const variants = {
    'Panduan': 'primary',
    'Template': 'success',
    'Referensi': 'warning',
    'Lainnya': 'secondary'
  }
  return variants[category] || 'secondary'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

const validateForm = () => {
  Object.keys(errors).forEach(key => errors[key] = '')
  let isValid = true

  if (!form.title.trim()) {
    errors.title = 'Judul wajib diisi'
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = 'Deskripsi wajib diisi'
    isValid = false
  }

  if (!form.category) {
    errors.category = 'Kategori wajib dipilih'
    isValid = false
  }

  if (!editingDocument.value && !form.file) {
    errors.file = 'File wajib diupload'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  submitting.value = true
  error.value = ''

  try {
    // Create FormData for file upload
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    formData.append('category', form.category)
    
    if (form.file) {
      formData.append('file', form.file)
    }
    
    if (form.link) {
      formData.append('link', form.link)
    }

    // Upload document
    await documentStore.uploadDocument(formData)
    
    closeModal()
    await fetchDocuments()
  } catch (err) {
    error.value = err.message || 'Gagal menyimpan dokumen'
  } finally {
    submitting.value = false
  }
}

const downloadDocument = async (doc) => {
  try {
    await documentStore.downloadDocument(doc._id || doc.id, doc.title)
  } catch (err) {
    console.error('Download failed:', err)
  }
}

const editDocument = (doc) => {
  editingDocument.value = doc
  form.title = doc.title
  form.description = doc.description
  form.category = doc.category
  form.link = doc.link
  showUploadModal.value = true
}

const deleteDocument = (doc) => {
  selectedDocument.value = doc
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  try {
    await documentStore.deleteDocument(selectedDocument.value._id || selectedDocument.value.id)
    showDeleteModal.value = false
    await fetchDocuments()
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
  form.file = null
  form.link = ''
  error.value = ''
  Object.keys(errors).forEach(key => errors[key] = '')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const fetchDocuments = async () => {
  try {
    const params = {
      category: filterCategory.value,
      search: searchQuery.value
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

onMounted(() => {
  fetchDocuments()
})
</script>
