<template>
  <div class="team-info-card bg-gray-100 rounded-lg p-6">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 class="text-base font-semibold text-gray-900">
          Informasi Tim
        </h3>
      </div>
      
      <svg v-if="isApproved" class="w-6 h-6 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    
    <div class="space-y-3">
      <!-- Team Name -->
      <div>
        <p class="text-sm font-medium text-gray-900">Tim Capstone</p>
        <p class="text-sm text-gray-600">
          Ketua: {{ team.leader.name }} ({{ team.leader.id }}) | {{ team.learningPath }}
        </p>
        <p class="text-sm text-gray-600">Use Case: {{ team.useCase }}</p>
      </div>
      
      <!-- Members List -->
      <div>
        <p class="text-sm font-medium text-gray-900 mb-2">Anggota:</p>
        <ul class="space-y-1">
          <li
            v-for="(member, index) in team.members"
            :key="index"
            class="text-sm text-gray-600"
          >
            • {{ member.name }} ({{ member.id }}) | {{ member.learningPath }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  team: {
    type: Object,
    required: true
    // Format: {
    //   name: 'Team Name',
    //   leader: { name: 'Leader Name', id: 'F123456' },
    //   useCase: 'DC-09',
    //   learningPath: 'Front-End & Back-End with AI',
    //   members: [{ name: 'Member Name', id: 'F123456', learningPath: 'Path' }]
    // }
  }
})

const isApproved = computed(() => {
  return props.team.status === 'approved' || props.team.status === 'active'
})
</script>
