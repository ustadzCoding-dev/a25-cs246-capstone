<template>
  <div class="timeline-item flex">
    <!-- Timeline Dot & Line -->
    <div class="flex flex-col items-center mr-4">
      <div class="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
        <div class="w-4 h-4 bg-white rounded-full"></div>
      </div>
      <div v-if="!isLast" class="w-0.5 h-full bg-gray-300 mt-2"></div>
    </div>
    
    <!-- Content -->
    <div class="flex-1 pb-8">
      <div class="bg-gray-100 rounded-lg p-4">
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-base font-semibold text-gray-900">
            {{ title }}
          </h3>
          <button
            v-if="canDelete"
            @click="$emit('delete')"
            class="text-gray-400 hover:text-danger-600 transition-colors duration-200"
          >
            <span class="text-sm">Hapus</span>
          </button>
        </div>
        
        <p class="text-sm text-gray-600 mb-3">
          {{ description }}
        </p>
        
        <div class="flex items-center text-sm text-gray-500">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ formattedDateRange }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: String,
    required: true
  },
  endDate: {
    type: String,
    required: true
  },
  canDelete: {
    type: Boolean,
    default: false
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

const formattedDateRange = computed(() => {
  const start = new Date(props.startDate)
  const end = new Date(props.endDate)
  
  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }
  
  return `${formatDate(start)} - ${formatDate(end)}`
})
</script>
