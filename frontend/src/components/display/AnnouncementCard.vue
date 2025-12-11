<template>
  <div class="announcement-card bg-gray-200 p-6" @click="handleClick">
    <div class="flex items-start space-x-4">
      <!-- Icon -->
      <div class="flex-shrink-0">
        <div class="size-8 bg-gray-800 rounded-full flex items-center justify-center">
          <svg class="size-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-4 md:gap-0 flex-col md:flex-row">
          <div class="flex-1">
            <h3
              class="lg:text-md md:text-md sm:text-sm xs:text-sm text-sm font-semibold text-gray-900"
            >
              {{ title }}
            </h3>
            <p class="lg:text-sm md:text-sm sm:text-xs xs:text-xs text-xs text-gray-500 mt-1">
              {{ formattedDate }}
            </p>
            <p
          class="lg:text-sm md:text-sm sm:text-xs xs:text-xs text-xs text-gray-700 whitespace-pre-line"
        >
          {{ content }}
        </p>
          </div>

          <div class="flex items-center" v-if="canDelete">
            <button
              @click="$emit('edit')"
              class="text-warning-600 hover:text-warning-700 p-2"
              title="Edit"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>

            <button
              @click="$emit('delete')"
              class="text-danger-600 hover:text-danger-700 p-2"
              title="Hapus"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>


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
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    default: 'normal',
    validator: value => ['normal', 'important'].includes(value),
  },
  canDelete: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'edit', 'read'])

const formattedDate = computed(() => {
  const date = new Date(props.date)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const handleClick = () => {
  emit('read')
}
</script>
