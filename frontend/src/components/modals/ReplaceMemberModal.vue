<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Ganti Anggota Tim"
    size="lg"
  >
    <div class="space-y-6">
      <!-- Old Member Info -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Anggota Lama (Akan Dihapus)</h3>
        <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Nama:</span>
              <span class="text-sm font-medium text-gray-900">
                {{ oldMember?.name || oldMember?.studentId || 'Unknown' }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Email:</span>
              <span class="text-sm font-medium text-gray-900">{{ oldMember?.email || '-' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">Learning Path:</span>
              <span class="text-sm font-medium text-gray-900">
                {{ oldMember?.learningPathName || oldMember?.learningPath || '-' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- New Member Selection -->
      <div>
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Pilih Anggota Baru</h3>
        <div class="space-y-2">
          <div v-if="availableMembers.length === 0" class="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
            Tidak ada anggota yang tersedia untuk mengganti
          </div>
          <div v-else class="space-y-2 max-h-64 overflow-y-auto">
            <div
              v-for="member in availableMembers"
              :key="member._id || member.studentId"
              class="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              @click="selectNewMember(member)"
              :class="{ 'bg-primary-50 border-primary-300': isSelected(member) }"
            >
              <input
                type="radio"
                :checked="isSelected(member)"
                class="mr-3"
              />
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900">
                  {{ member.name || member.studentId }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ member.learningPathName || member.learningPath }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Composition Validation -->
      <div v-if="compositionStatus" :class="[
        'p-4 rounded-lg',
        compositionStatus.valid
          ? 'bg-green-50 border border-green-200'
          : 'bg-danger-50 border border-danger-200',
      ]">
        <p :class="compositionStatus.valid ? 'text-green-800' : 'text-danger-800'" class="text-sm font-medium">
          {{ compositionStatus.message }}
        </p>
      </div>

      <!-- Team Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p class="text-xs text-blue-700">
          <span class="font-semibold">Tim:</span> {{ team?.teamName }}
        </p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="$emit('update:modelValue', false)">
          Batal
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loading"
          :disabled="!selectedNewMember || !compositionStatus?.valid"
          @click="handleConfirm"
        >
          Ya, Ganti Anggota
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  modelValue: Boolean,
  team: Object,
  oldMember: Object,
  availableMembers: {
    type: Array,
    default: () => []
  },
  useCases: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const loading = ref(false)
const selectedNewMember = ref(null)

const isSelected = (member) => {
  return selectedNewMember.value?.(_id || studentId) === (member._id || member.studentId)
}

const selectNewMember = (member) => {
  selectedNewMember.value = member
}

// Validate composition after replacement
const compositionStatus = computed(() => {
  if (!selectedNewMember.value || !props.team || !props.useCases) return null

  const useCase = props.useCases.find(uc => uc._id === props.team.useCaseId)
  if (!useCase) return { valid: false, message: 'Use case tidak ditemukan' }

  // If no composition requirements, always valid
  if (!useCase.teamComposition || useCase.teamComposition.length === 0) {
    return { valid: true, message: '✓ Komposisi tim valid (fleksibel)' }
  }

  // Build new composition after replacement
  const newComposition = {}
  props.team.membersUserId?.forEach(member => {
    // Skip old member
    if (member._id === props.oldMember._id || member.studentId === props.oldMember.studentId) {
      return
    }

    const path = member.learningPathName || member.learningPath || 'Unknown'
    newComposition[path] = (newComposition[path] || 0) + 1
  })

  // Add new member
  const newPath = selectedNewMember.value.learningPathName || selectedNewMember.value.learningPath || 'Unknown'
  newComposition[newPath] = (newComposition[newPath] || 0) + 1

  // Check if composition matches requirements
  for (const requirement of useCase.teamComposition) {
    const path = requirement.learningPathName || requirement.learningPath
    const actualCount = newComposition[path] || 0

    if (actualCount !== requirement.count) {
      return {
        valid: false,
        message: `Komposisi tidak sesuai. Dibutuhkan ${requirement.count} dari "${path}", akan menjadi ${actualCount}`
      }
    }
  }

  return { valid: true, message: '✓ Komposisi tim valid' }
})

const handleConfirm = async () => {
  if (!selectedNewMember.value) return

  loading.value = true
  try {
    emit('confirm', {
      oldMemberId: props.oldMember?._id || props.oldMember?.studentId,
      newMemberId: selectedNewMember.value._id || selectedNewMember.value.studentId,
    })
    selectedNewMember.value = null
  } finally {
    loading.value = false
  }
}
</script>
