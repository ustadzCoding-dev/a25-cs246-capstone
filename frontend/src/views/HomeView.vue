<script setup>
import { ref } from 'vue'

const message = ref('Welcome to Dicoding Academic Dashboard')
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-4xl mx-auto px-4 py-16 text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        {{ message }}
      </h1>
      <p class="text-xl text-gray-600 mb-8">
        Capstone Project Management System
      </p>
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">
          🎓 Tim A25-CS246
        </h2>
        <p class="text-gray-600 mb-4">
          Use Case: DC-09 - Enhancing Academic Dashboard with Capstone Project Features
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="font-semibold text-blue-900 mb-2">📝 Registrasi Tim</h3>
            <p class="text-sm text-blue-700">Validasi komposisi otomatis</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="font-semibold text-green-900 mb-2">📚 Informasi Dokumen</h3>
            <p class="text-sm text-green-700">Repository terpusat</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <h3 class="font-semibold text-purple-900 mb-2">📅 Timeline</h3>
            <p class="text-sm text-purple-700">Visualisasi milestone</p>
          </div>
        </div>
      </div>
      <div class="text-sm text-gray-500">
        <p>🚀 Project setup complete! Ready for development.</p>
        <p class="mt-2">Vue 3 + Vite + Vue Router + Pinia + Tailwind CSS</p>
      </div>
    </div>
  </div>
</template>
