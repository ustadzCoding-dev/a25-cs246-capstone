<template>
  <aside
    :class="[
      'sidebar fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center justify-center px-6 border-b border-gray-300">
        <a href="/dashboard" class="size-20 flex items-center justify-center py-10 w-max my-5 mx-5 px-5 border-2 ">
          <img src="../../public/img/logo-asah.png" alt="logo-asah">
        </a>

      <!-- Mobile Close Button -->
      <button
        @click="$emit('toggle')"
        class="lg:hidden text-gray-500 hover:text-gray-700"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
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
            isActive
              ? 'bg-primary-100 text-primary-700'
              : 'text-gray-700 hover:bg-gray-100'
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
        <div class="size-20 bg-gray-300 rounded-full flex items-center justify-center ">
          <svg class="size-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
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
        <svg class="w-5 h-5 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="text-red-500">Logout</span>
      </div>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true
  },
  menuItems: {
    type: Array,
    required: true
    // Format: [{ name: 'Dashboard', icon: IconComponent, path: '/dashboard', roles: ['admin', 'student'] }]
  },
  user: {
    type: Object,
    default: null
    // Format: { name: 'John Doe', role: 'admin' }
  }
})

const emit = defineEmits(['toggle', 'logout'])

const router = useRouter()

const visibleMenuItems = computed(() => {
  if (!props.user) return []
  return props.menuItems.filter(item =>
    !item.roles || item.roles.includes(props.user.role)
  )
})

const handleLogout = () => {
  emit('logout')
}

// Icon Components (inline SVG)
const DashboardIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  `
}

const TeamIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  `
}

const DocumentIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  `
}

const TimelineIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  `
}

const AnnouncementIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  `
}

const ProfileIcon = {
  template: `
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  `
}
</script>
