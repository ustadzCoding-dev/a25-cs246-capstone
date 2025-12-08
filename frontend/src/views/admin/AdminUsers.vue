<template>
  <DashboardLayout :user="user" :menu-items="adminMenuItems" @logout="handleLogout">
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="pb-4 bg-white p-5 rounded-lg shadow-md">
        <h1 class="font-semibold text-gray-900 lg:text-2xl md:text-xl sm:text-lg text-base">
          Manage Users
        </h1>
        <p class="text-gray-600 lg:text-lg md:text-lg sm:text-sm text-sm">
          Kelola semua user di sistem
        </p>
      </div>

      <div class="p-6 bg-white shadow-md flex flex-col gap-5 rounded-lg">
        <!-- Statistics -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatsCard label="Total Users" :value="stats.total" icon="team" color="primary" />
          <StatsCard label="Students" :value="stats.students" icon="team" color="success" />
          <StatsCard label="Admins" :value="stats.admins" icon="settings" color="warning" />
        </div>

        <!-- Filters & Search -->
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4 items-end border-t border-gray-300 pt-5">
          <div class="col-span-2">
            <BaseInput v-model="searchQuery" placeholder="Cari user (nama, email, student ID)..." />
          </div>
          <div class="col-span-2">
            <BaseSelect v-model="filterRole" label="Filter by Role" :options="roleOptions" />
          </div>

          <BaseButton variant="danger" @click="resetFilters"> Reset Filters </BaseButton>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <p class="text-danger-700">{{ error }}</p>
          <BaseButton variant="outline" @click="fetchUsers" class="mt-4"> Coba Lagi </BaseButton>
        </div>

        <!-- Users Table -->
        <div v-else class="bg-white overflow-hidden pt-5">
          <div v-if="filteredUsers.length === 0" class="p-12 text-center">
            <p class="text-gray-500">Tidak ada user yang sesuai dengan filter</p>
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Nama
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Email
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Student ID
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Role
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Learning Path
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="user in paginatedUsers" :key="user._id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ user.name }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.dicodingId || '-' }}</td>
                  <td class="px-6 py-4 text-sm">
                    <BaseBadge :variant="getRoleVariant(user.role)">
                      {{ getRoleLabel(user.role) }}
                    </BaseBadge>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ user.learningPathName || '-' }}
                  </td>
                  <td class="px-6 py-4 text-sm">
                    <span v-if="user.role === 'admin'">-</span>
                    <BaseBadge
                      v-else
                      :variant="user.memberStatus === 'active' ? 'success' : 'warning'"
                    >
                      {{
                        user.memberStatus === 'active' ? 'Aktif' : user.memberStatus || 'Nonaktif'
                      }}
                    </BaseBadge>
                  </td>
                  <td class="px-6 py-4 text-sm flex flex-col gap-3">
                    <button
                      @click="viewUserDetail(user)"
                      class="text-primary-700 hover:text-primary-900 font-medium bg-blue-100 py-1"
                    >
                      Lihat
                    </button>
                    <button
                      @click="openChangeRoleModal(user)"
                      class="text-yellow-700 hover:text-yellow-900 font-medium bg-yellow-100 py-1 w-full"
                    >
                      Ubah Role
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            v-if="totalPages > 1"
            class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
          >
            <div class="text-sm text-gray-600">
              Menampilkan {{ (pagination.currentPage - 1) * pagination.limit + 1 }} -
              {{ Math.min(pagination.currentPage * pagination.limit, pagination.totalItems) }} dari
              {{ pagination.totalItems }} users
            </div>
            <div class="flex space-x-2">
              <BaseButton variant="outline" :disabled="currentPage === 1" @click="currentPage--">
                Sebelumnya
              </BaseButton>
              <div class="flex items-center space-x-1">
                <span v-for="page in totalPages" :key="page">
                  <button
                    @click="currentPage = page"
                    :class="[
                      'px-3 py-1 rounded',
                      currentPage === page
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
                    ]"
                  >
                    {{ page }}
                  </button>
                </span>
              </div>
              <BaseButton
                variant="outline"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Selanjutnya
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Detail Modal -->
    <BaseModal v-model="showDetailModal" :title="`Detail User: ${selectedUser?.name}`" size="lg">
      <div v-if="selectedUser" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Nama</label>
            <p class="mt-1 text-gray-900">{{ selectedUser.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <p class="mt-1 text-gray-900">{{ selectedUser.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Student ID</label>
            <p class="mt-1 text-gray-900">{{ selectedUser.dicodingId || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Role</label>
            <p class="mt-1 text-gray-900">{{ getRoleLabel(selectedUser.role) }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Learning Path</label>
            <p class="mt-1 text-gray-900">{{ selectedUser.learningPathName || '-' }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <p class="mt-1 text-gray-900">
              <span v-if="selectedUser.role === 'admin'">-</span>
              <span v-else>{{
                selectedUser.memberStatus === 'active'
                  ? 'Aktif'
                  : selectedUser.memberStatus || 'Nonaktif'
              }}</span>
            </p>
          </div>
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700">Dibuat</label>
            <p class="mt-1 text-gray-900">{{ formatDate(selectedUser.createdAt) }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showDetailModal = false"> Tutup </BaseButton>
        </div>
      </template>
    </BaseModal>

    <!-- Change Role Modal -->
    <BaseModal v-model="showChangeRoleModal" title="Ubah Role User" size="md">
      <div v-if="selectedUser" class="space-y-4">
        <p class="text-gray-700">
          Ubah role untuk <strong>{{ selectedUser.name }}</strong>
        </p>

        <BaseSelect v-model="newRole" label="Role Baru" :options="roleOptions" />

        <div v-if="changeRoleError" class="p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <p class="text-sm text-danger-700">{{ changeRoleError }}</p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <BaseButton variant="outline" @click="showChangeRoleModal = false"> Batal </BaseButton>
          <BaseButton variant="primary" :loading="changingRole" @click="handleChangeRole">
            Ubah Role
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useAdminMenu } from '../../composables/useAdminMenu'
import api from '../../services/api'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import StatsCard from '../../components/display/StatsCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import BaseSpinner from '../../components/base/BaseSpinner.vue'
import BaseBadge from '../../components/base/BaseBadge.vue'
import BaseModal from '../../components/base/BaseModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const { adminMenuItems } = useAdminMenu()

const user = computed(() => authStore.user)

// State
const loading = ref(false)
const error = ref('')
const users = ref([])
const searchQuery = ref('')
const filterRole = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
const pagination = ref({
  currentPage: 1,
  totalItems: 0,
  limit: 10,
  totalPages: 1,
})

const showDetailModal = ref(false)
const showChangeRoleModal = ref(false)
const selectedUser = ref(null)
const newRole = ref('')
const changingRole = ref(false)
const changeRoleError = ref('')

const roleOptions = [
  { value: 'student', label: 'Student' },
  { value: 'admin', label: 'Admin' },
]

// Computed
// Note: Filtering and pagination now handled by backend
// Frontend just displays the data received from backend
const filteredUsers = computed(() => {
  return Array.isArray(users.value) ? users.value : []
})

const totalPages = computed(() => {
  // Use totalPages from backend pagination info
  return pagination.value?.totalPages || 1
})

const paginatedUsers = computed(() => {
  // Backend already returns paginated data, so just return as-is
  return filteredUsers.value
})

const stats = computed(() => {
  // Backend now returns stats with total counts by role
  // This ensures stats show TOTAL KESELURUHAN, not just current page
  const backendStats = pagination.value?.stats || {}

  return {
    total: backendStats.total || 0,
    students: backendStats.students || 0,
    admins: backendStats.admins || 0,
  }
})

// Methods
const formatDate = date => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getRoleLabel = role => {
  const labels = {
    student: 'Student',
    admin: 'Admin',
    instructor: 'Instructor',
  }
  return labels[role] || role
}

const getRoleVariant = role => {
  const variants = {
    student: 'primary',
    admin: 'warning',
    instructor: 'success',
  }
  return variants[role] || 'secondary'
}

const fetchUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    // Build query parameters
    const params = {
      page: currentPage.value,
      limit: itemsPerPage,
    }

    // Add role filter if selected
    if (filterRole.value) {
      params.role = filterRole.value
    }

    // Add search query if provided
    if (searchQuery.value) {
      params.search = searchQuery.value
    }

    const response = await api.get('/users', { params })
    console.log('[AdminUsers] fetchUsers response:', response)

    if (response.success) {
      // Backend returns { success: true, data: { users: [...], pagination: {...}, stats: {...} } }
      const usersData = response.data?.users || response.data || []
      users.value = Array.isArray(usersData) ? usersData : []

      // Store pagination info from backend
      if (response.data?.pagination) {
        pagination.value = response.data.pagination
      }

      // Store stats from backend (if available)
      if (response.data?.stats) {
        pagination.value.stats = response.data.stats
      }

      console.log(
        '[AdminUsers] users loaded:',
        users.value.length,
        'pagination:',
        pagination.value,
        'stats:',
        response.data?.stats
      )
      if (users.value.length > 0) {
        console.log(
          '[AdminUsers] First user _id:',
          users.value[0]._id,
          'First user:',
          users.value[0]
        )
      }
    } else {
      error.value = response.message || 'Gagal memuat users'
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat users'
    console.error('[AdminUsers] Error fetching users:', err)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterRole.value = ''
  currentPage.value = 1
}

const viewUserDetail = userItem => {
  selectedUser.value = userItem
  showDetailModal.value = true
}

const openChangeRoleModal = userItem => {
  selectedUser.value = userItem
  newRole.value = userItem.role
  changeRoleError.value = ''
  console.log('[AdminUsers] openChangeRoleModal - selectedUser:', selectedUser.value)
  showChangeRoleModal.value = true
}

const handleChangeRole = async () => {
  if (!newRole.value || !selectedUser.value) {
    changeRoleError.value = 'User atau role tidak valid'
    return
  }

  // Validate user ID (use 'id' not '_id' - backend transforms _id to id)
  const userId = selectedUser.value.id || selectedUser.value._id
  if (!userId) {
    changeRoleError.value = 'User ID tidak ditemukan'
    console.error('Error: selectedUser.id is undefined', selectedUser.value)
    return
  }

  changingRole.value = true
  changeRoleError.value = ''

  try {
    console.log('[AdminUsers] Changing role for user:', userId, 'to:', newRole.value)

    const response = await api.put(`/users/${userId}/role`, {
      role: newRole.value,
    })

    console.log('[AdminUsers] Change role response:', response)

    if (response.success) {
      // Update local user
      const index = users.value.findIndex(u => (u.id || u._id) === userId)
      if (index !== -1) {
        users.value[index] = response.data
      }
      showChangeRoleModal.value = false
    } else {
      changeRoleError.value = response.message || 'Gagal mengubah role'
    }
  } catch (err) {
    changeRoleError.value = err.message || 'Gagal mengubah role'
    console.error('Error changing role:', err)
  } finally {
    changingRole.value = false
  }
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Watchers - Trigger fetch when filters/search/page changes
watch(currentPage, () => {
  fetchUsers()
})

watch([filterRole, searchQuery], () => {
  currentPage.value = 1 // Reset to page 1 when filter/search changes
  fetchUsers()
})

// Lifecycle
onMounted(() => {
  fetchUsers()
})
</script>
