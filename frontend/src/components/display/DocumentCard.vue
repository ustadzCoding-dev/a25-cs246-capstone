<template>
  <div
    class="document-card border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-shadow duration-300 cursor-pointer"
  >
    <h3 class="text-lg font-semibold text-gray-900
    lg:text-xl
    md:text-xl
    sm:text-lg
    xs:text-lg">
      {{ title }}
    </h3>

    <p class="text-sm text-gray-600 mb-4 line-clamp-1
    lg:text-md
    md:text-md
    sm:text-sm
    xs:text-sm">
      {{ description }}
    </p>

    <div class="flex flex-col justify-between">
      <div class="flex items-center text-sm text-gray-500">
        <svg class="size-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span class="text-md">{{ formattedDate }}</span>
      </div>
      <div class="w-full text-end">
        <a
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        @click.prevent="$emit('click')"
        class="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 cursor-pointer hover:underline
        lg:text-md
    md:text-md
    sm:text-sm
    xs:text-sm"
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
