<template>
  <div
    class="document-card border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
  >
    <h3 class="text-lg font-semibold text-gray-900 mb-2">
      {{ title }}
    </h3>

    <p class="text-sm text-gray-600 mb-4 line-clamp-2">
      {{ description }}
    </p>

    <div class="flex items-center justify-between">
      <div class="flex items-center text-sm text-gray-500">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span>{{ formattedDate }}</span>
      </div>

      <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
      >
        Buka Dokumen
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
})

const formattedDate = computed(() => {
  const date = new Date(props.date)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
})
</script>
