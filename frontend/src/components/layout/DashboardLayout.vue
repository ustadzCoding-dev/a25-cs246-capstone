<template>
  <div class="dashboard-layout min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <Sidebar
      :is-open="sidebarOpen"
      :menu-items="menuItems"
      :user="user"
      @toggle="sidebarOpen = !sidebarOpen"
      @logout="handleLogout"
    />
    
    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Mobile Header -->
      <div class="lg:hidden sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6">
        <button
          type="button"
          @click="sidebarOpen = true"
          class="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        >
          <span class="sr-only">Open sidebar</span>
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <div class="flex-1 text-sm font-semibold leading-6 text-gray-900">
          {{ pageTitle }}
        </div>
      </div>
      
      <!-- Page Content -->
      <main class="py-10">
        <div class="px-4 sm:px-6 lg:px-8">
          <slot></slot>
        </div>
      </main>
    </div>
    
    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-900 bg-opacity-75 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  menuItems: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['logout'])

const route = useRoute()
const sidebarOpen = ref(false)

const pageTitle = computed(() => {
  return route.meta.title || 'Dashboard'
})

const handleLogout = () => {
  emit('logout')
}
</script>
