<template>
  <div class="auth-layout min-h-screen bg-gray-100 flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div class="flex items-center justify-center w-20">
          <img src="/src/public/img/logo-asah.png" alt="logo-asah" >
        </div>
        <div>
          <a href="https://www.dicoding.com/" class="flex items-center justify-center w-20">
          <img src="../../public/img/logo-dicoding.png" alt="logo-asah">
        </a>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div class="w-full max-w-md">
        <slot></slot>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-200 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm text-gray-600">
          © {{ currentYear }} Dicoding
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentYear = new Date().getFullYear()

const showRegisterButton = computed(() => {
  return route.path === '/login'
})
</script>
