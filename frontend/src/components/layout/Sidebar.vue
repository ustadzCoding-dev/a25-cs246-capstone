<template>
  <aside
    :class="[
      'sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0',
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center px-6 border-b border-gray-300">
      <a
        href="/dashboard"
        class="size-20 flex items-center justify-center py-10 w-max my-5 mx-5 px-5 border-2"
      >
        <img src="../../public/img/logo-asah.png" alt="logo-asah" />
      </a>

      <!-- Mobile Close Button -->
      <button @click="$emit('toggle')" class="lg:hidden text-gray-500 hover:text-gray-700">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <router-link
        v-for="item in visibleMenuItems"
        :key="item.path"
        :to="item.path"
        v-slot="{ isActive }"
        custom
      >
        <a
          :href="item.path"
          @click.prevent="$router.push(item.path)"
          :class="[
            'flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200',
            isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          <span>{{ item.name }}</span>
        </a>
      </router-link>
    </nav>

    <!-- User Info & Logout -->
    <div class="border-t border-gray-300 p-4">
      <div class="flex flex-col items-center">
        <div
          class="size-20 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden"
        >
          <img
            v-if="user?.profilePicture"
            :src="user.profilePicture"
            :alt="user?.name || 'avatar'"
            class="w-full h-full object-cover rounded-full"
          />
          <div
            v-else
            class="w-full h-full flex items-center justify-center text-white text-lg font-semibold"
            :class="user?.role === 'admin' ? 'bg-primary-500' : 'bg-gray-500'"
          >
            {{ initials }}
          </div>
        </div>
        <div class="flex flex-col items-center mt-3">
          <p class="text-medium font-medium text-gray-900 truncate">
            {{ user?.name || 'User' }}
          </p>
          <p class="uppercase text-sm text-gray-500 truncate">
            {{ user?.role === 'admin' ? 'Administrator' : 'Siswa' }}
          </p>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="mt-5 w-full flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-100 transition-colors duration-200"
      >
        <div class="w-full flex items-center justify-center">
          <svg
            class="w-5 h-5 mr-3 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span class="text-red-500">Logout</span>
        </div>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  menuItems: {
    type: Array,
    required: true,
    // Format: [{ name: 'Dashboard', icon: IconComponent, path: '/dashboard', roles: ['admin', 'student'] }]
  },
  user: {
    type: Object,
    default: null,
    // Format: { name: 'John Doe', role: 'admin' }
  },
})

const emit = defineEmits(['toggle', 'logout'])

const visibleMenuItems = computed(() => {
  if (!props.user) return []
  return props.menuItems.filter(item => !item.roles || item.roles.includes(props.user.role))
})

const initials = computed(() => {
  const name = props.user?.name || ''
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  const first = parts[0].charAt(0)
  const last = parts[parts.length - 1].charAt(0)
  return (first + last).toUpperCase()
})

const handleLogout = () => {
  emit('logout')
}

const profilePicture = ref(null)

const fetchUser = async () => {
  try {
    // Use the properly configured API service instead of raw fetch
    const response = await api.get('/auth/me')

    if (response.success && response.data) {
      profilePicture.value = response.data
    }
  } catch (error) {
    console.error('Gagal mengambil data user:', error)

    // Handle token expiration
    if (error.status === 401) {
      console.log('Token expired or invalid')
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
}

onMounted(() => {
  fetchUser()
})
</script>
