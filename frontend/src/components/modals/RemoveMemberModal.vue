<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Hapus Anggota Tim"
    size="md"
  >
    <div class="space-y-4">
      <!-- Member Info -->
      <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Anggota yang Akan Dihapus</h3>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Nama:</span>
            <span class="text-sm font-medium text-gray-900">
              {{ member?.name || member?.studentId || 'Unknown' }}
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Email:</span>
            <span class="text-sm font-medium text-gray-900">{{ member?.email || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">Learning Path:</span>
            <span class="text-sm font-medium text-gray-900">
              {{ member?.learningPathName || member?.learningPath || '-' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Warning Message -->
      <div class="bg-danger-50 border border-danger-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-danger-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-danger-700">
            <p class="font-semibold mb-1">Perhatian!</p>
            <p>Anggota ini akan dihapus dari tim. Tindakan ini tidak dapat dibatalkan.</p>
          </div>
        </div>
      </div>

      <!-- Reason (Optional) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Penghapusan (Opsional)</label>
        <textarea
          v-model="reason"
          placeholder="Contoh: Student DO, tidak aktif, dll"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
        />
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
          variant="danger"
          :loading="loading"
          @click="handleConfirm"
        >
          Ya, Hapus Anggota
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  modelValue: Boolean,
  team: Object,
  member: Object,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const loading = ref(false)
const reason = ref('')

const handleConfirm = async () => {
  loading.value = true
  try {
    emit('confirm', {
      memberId: props.member?._id || props.member?.studentId,
      reason: reason.value || null,
    })
    reason.value = ''
  } finally {
    loading.value = false
  }
}
</script>
