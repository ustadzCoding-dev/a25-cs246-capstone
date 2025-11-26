<template>
  <BaseModal
    v-model="isOpen"
    title="Edit Anggota Tim"
    size="lg"
  >
    <div class="space-y-4">
      <!-- Info -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm text-blue-700">
          Anda dapat menambah atau menghapus anggota tim. Tim masih dalam status pending, jadi perubahan ini akan dikirim ulang ke admin untuk persetujuan.
        </p>
      </div>

      <!-- Members List -->
      <div class="space-y-3">
        <label class="block text-sm font-medium text-gray-900">Anggota Tim</label>

        <div v-for="(member, index) in members" :key="index" class="flex items-center gap-2">
          <input
            v-model="members[index]"
            type="email"
            placeholder="Email atau ID siswa"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            v-if="members.length > 1"
            type="button"
            @click="removeMember(index)"
            class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Add Member Button -->
        <button
          type="button"
          @click="addMember"
          class="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 transition"
        >
          <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tambah Anggota
        </button>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <BaseButton variant="outline" @click="isOpen = false">
          Batal
        </BaseButton>
        <BaseButton
          variant="primary"
          :loading="loading"
          @click="handleSave"
        >
          Simpan Perubahan
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  team: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'save'])

const isOpen = ref(false)
const members = ref([])

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
  if (newVal && props.team?.membersUserId) {
    // Initialize members from team data
    members.value = props.team.membersUserId.map(m => {
      if (typeof m === 'object') {
        return m.email || m._id
      }
      return m
    })
  }
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const addMember = () => {
  members.value.push('')
}

const removeMember = (index) => {
  members.value.splice(index, 1)
}

const handleSave = () => {
  // Filter out empty members
  const validMembers = members.value.filter(m => m.trim())

  if (validMembers.length === 0) {
    alert('Minimal harus ada 1 anggota tim')
    return
  }

  emit('save', validMembers)
}
</script>
