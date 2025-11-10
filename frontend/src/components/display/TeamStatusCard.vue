<template>
  <div class="team-status-card bg-gray-100 rounded-lg p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-base font-semibold text-gray-900">
            Tim Capstone Aktif
          </h3>
          <p class="text-sm text-gray-600 mt-1">
            Terdaftar di tim <span class="font-medium">{{ leaderName }}</span>
          </p>
        </div>
      </div>
      
      <BaseBadge
        v-if="status"
        :variant="statusVariant"
      >
        {{ status }}
      </BaseBadge>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseBadge from '../base/BaseBadge.vue'

const props = defineProps({
  teamName: {
    type: String,
    default: ''
  },
  leaderName: {
    type: String,
    required: true
  },
  useCase: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Active'
  },
  members: {
    type: Array,
    default: () => []
  }
})

const statusVariant = computed(() => {
  const variants = {
    'Active': 'success',
    'Pending': 'warning',
    'Approved': 'success',
    'Rejected': 'danger',
    'Draft': 'secondary'
  }
  return variants[props.status] || 'secondary'
})
</script>
