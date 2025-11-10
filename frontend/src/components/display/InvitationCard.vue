<template>
  <div class="invitation-card bg-white border border-gray-200 rounded-lg p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h3 class="text-base font-semibold text-gray-900">
          Undangan Tim
        </h3>
      </div>
    </div>
    
    <div class="space-y-3 mb-4">
      <!-- Team Info -->
      <div>
        <p class="text-sm font-medium text-gray-900">{{ invitation.teamName }}</p>
        <p class="text-sm text-gray-600">
          Ketua: {{ invitation.leader.name }} ({{ invitation.leader.id }})
        </p>
        <p class="text-sm text-gray-600">Use Case: {{ invitation.useCase }}</p>
      </div>
      
      <!-- Members -->
      <div>
        <p class="text-sm font-medium text-gray-900 mb-1">Anggota:</p>
        <ul class="space-y-1">
          <li
            v-for="(member, index) in invitation.members"
            :key="index"
            class="text-sm text-gray-600"
          >
            • {{ member.name }} ({{ member.id }})
          </li>
        </ul>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex space-x-3">
      <BaseButton
        variant="primary"
        @click="$emit('accept')"
        class="flex-1"
      >
        Terima
      </BaseButton>
      <BaseButton
        variant="outline"
        @click="$emit('reject')"
        class="flex-1"
      >
        Tolak
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../base/BaseButton.vue'

defineProps({
  invitation: {
    type: Object,
    required: true
    // Format: {
    //   teamName: 'Team Name',
    //   leader: { name: 'Leader Name', id: 'F123456' },
    //   useCase: 'DC-09',
    //   members: [{ name: 'Member Name', id: 'F123456' }]
    // }
  }
})

defineEmits(['accept', 'reject'])
</script>
