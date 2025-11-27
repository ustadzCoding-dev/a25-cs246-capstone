<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="text-2xl font-semibold text-gray-900">Dokumen</h1>
        <p class="text-gray-600 text-lg">Akses dokumen panduan dan referensi capstone</p>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="grid grid-cols-3 gap-4">
          <div class="col-span-2">
            <BaseSearch v-model="searchQuery" placeholder="Cari dokumen..." />
          </div>
          <div class="col-span-1">
            <BaseSelect
            v-model="filterCategory"
            :options="categoryOptions"
            placeholder="Semua Kategori"
            />
          </div>
        </div>
      </div>

      <!-- Documents Grid -->
      <div v-if="loading" class="bg-white rounded-lg shadow p-12">
        <BaseSpinner centered size="lg" label="Memuat dokumen..." />
      </div>

      <div
        v-else-if="filteredDocuments.length === 0"
        class="bg-white rounded-lg shadow p-12 text-center"
      >
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
        <p class="mt-2 text-sm text-gray-500">
          {{
            searchQuery || filterCategory
              ? 'Tidak ada dokumen yang sesuai'
              : 'Belum ada dokumen tersedia'
          }}
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DocumentCard
          v-for="doc in filteredDocuments"
          :key="doc._id"
          :title="doc.title"
          :description="doc.description"
          :date="doc.createdAt || doc.uploadDate"
          :link="getDocumentLink(doc)"
          @click="downloadDocument(doc)"
        >
          <template #footer>
            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <div class="flex items-center space-x-3 text-xs text-gray-500">
                <span>{{ doc.fileSize }}</span>
                <span>•</span>
                <span>{{ doc.downloads }} downloads</span>
              </div>
              <BaseBadge size="sm" :variant="getCategoryVariant(doc.category)">
                {{ doc.category }}
              </BaseBadge>
            </div>
          </template>
        </DocumentCard>
      </div>

      <!-- Quick Links -->
      <div class="bg-primary-50 border border-primary-200 rounded-lg p-6">
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
            <h3 class="text-lg font-semibold text-blue-700 mb-2">Tips Menggunakan Dokumen</h3>
            <ul class="text-sm text-primary-700 space-y-1 list-disc list-inside">
              <li class="font-medium">
                Download dokumen yang relevan dengan tahap project Anda saat ini
              </li>
              <li class="font-medium">
                Gunakan template yang disediakan untuk memudahkan pekerjaan
              </li>
              <li class="font-medium">Baca panduan dengan teliti sebelum memulai</li>
              <li class="font-medium">Jika ada pertanyaan, hubungi mentor atau admin</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useDocumentStore } from '../../stores/documentStore'
import api from '../../services/api'
import { useStudentMenu } from '../../composables/useStudentMenu'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import DocumentCard from '../../components/display/DocumentCard.vue'
import BaseSearch from '../../components/base/BaseSearch.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'

const router = useRouter()
const authStore = useAuthStore()
const documentStore = useDocumentStore()

const user = computed(() => authStore.user)
const searchQuery = ref('')
const filterCategory = ref('')

// Get data from store
const loading = computed(() => documentStore.documentsLoading)
const documents = computed(() => documentStore.documents)

const categoryOptions = [
  { value: '', label: 'Semua Kategori' },
  { value: 'Panduan', label: 'Panduan' },
  { value: 'Template', label: 'Template' },
  { value: 'Referensi', label: 'Referensi' },
  { value: 'Lainnya', label: 'Lainnya' },
]

const { studentMenuItems } = useStudentMenu()

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

  // Sort by date (newest first)
  result = result.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))

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

const downloadDocument = async doc => {
  try {
    // Prefer direct static file URL when available to avoid protected API route issues
    const idOrUrl = doc.fileUrl || doc._id || doc.id
    await documentStore.downloadDocument(idOrUrl, doc.title)
  } catch (err) {
    console.error('Download failed:', err)
  }
}

const backendOrigin = api.defaults.baseURL.replace(/\/api\/?$/, '')

const getDocumentLink = doc => {
  if (doc?.fileUrl) {
    const fileUrl = doc.fileUrl
    return fileUrl.startsWith('http') ? fileUrl : `${backendOrigin}${fileUrl}`
  }

  // Fallback to API download route
  const id = doc._id || doc.id
  return `${backendOrigin}/api/document/${id}/download`
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

onMounted(() => {
  fetchDocuments()
})
</script>
