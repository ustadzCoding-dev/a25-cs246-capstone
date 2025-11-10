<template>
  <div class="announcement-card bg-gray-100 rounded-lg p-6">
    <div class="flex items-start space-x-4">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <div class="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        </div>
      </div>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between mb-2">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ title }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              {{ formattedDate }}
            </p>
          </div>
          
          <div class="flex items-center space-x-2 ml-4">
            <BaseBadge
              v-if="priority === 'important'"
              variant="danger"
            >
              Penting
            </BaseBadge>
            <button
              v-if="canDelete"
              @click="$emit('delete')"
              class="text-gray-400 hover:text-danger-600 transition-colors duration-200"
            >
              <span class="text-sm">Hapus</span>
            </button>
          </div>
        </div>
        
        <p class="text-sm text-gray-700 whitespace-pre-line">
          {{ content }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseBadge from '../base/BaseBadge.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'important'].includes(value)
  },
  canDelete: {
    type: Boolean,
    default: false
  }
})

defineEmits(['delete'])

const formattedDate = computed(() => {
  const date = new Date(props.date)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
</script>
