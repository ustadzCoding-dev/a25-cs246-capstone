<template>
  <BaseModal
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    title="Edit Tim"
    size="lg"
  >
    <div class="space-y-6">
      <!-- Team Name -->
      <div>
        <label class="block text-sm font-medium text-gray-900 mb-2">Nama Tim</label>
        <input
          v-model="form.teamName"
          type="text"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Masukkan nama tim"
        />
      </div>

      <!-- Current Members -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 mb-3">Anggota Saat Ini</h3>
        <div class="space-y-2 bg-gray-50 p-4 rounded-lg max-h-48 overflow-y-auto">
          <div
            v-for="(member, idx) in currentMembers"
            :key="idx"
            class="flex items-center justify-between bg-white p-3 rounded border border-gray-200"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ member.name || member.studentId }}</p>
              <p v-if="member.email" class="text-xs text-gray-500">{{ member.email }}</p>
              <p v-if="member.learningPath" class="text-xs text-gray-600">
                {{ member.learningPath }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded"
              >
                Existing
              </span>
              <!-- allow removing placeholders or entries without resolved name -->
              <button
                v-if="!member.name"
                @click="removeExistingMember(idx)"
                type="button"
                class="px-2 py-1 text-red-600 hover:bg-red-50 rounded"
                title="Hapus anggota placeholder"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Members -->
      <div>
        <h3 class="text-sm font-medium text-gray-900 mb-3">Tambah Anggota Baru</h3>
        <div class="space-y-3">
          <div v-for="(newMember, index) in form.newMembers" :key="index" class="flex gap-2">
            <div class="flex-1">
              <input
                v-model="form.newMembers[index].studentId"
                type="text"
                placeholder="ID Siswa / Email"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                @blur="fetchStudentInfo(index)"
              />
              <p v-if="newMember.name" class="text-xs text-gray-600 mt-1">
                {{ newMember.name }} ({{ newMember.learningPath }})
              </p>
            </div>
            <button
              v-if="form.newMembers.length > 1"
              type="button"
              @click="removeNewMember(index)"
              class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
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

          <button
            type="button"
            @click="addNewMember"
            class="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-500 hover:text-primary-600 text-sm font-medium"
          >
            + Tambah Anggota
          </button>
        </div>
      </div>

      <!-- Composition Validation -->
      <div
        v-if="compositionStatus"
        :class="[
          'p-4 rounded-lg',
          compositionStatus.valid
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200',
        ]"
      >
        <p
          :class="compositionStatus.valid ? 'text-green-800' : 'text-red-800'"
          class="text-sm font-medium"
        >
          {{ compositionStatus.message }}
        </p>
      </div>

      <!-- Changes Summary -->
      <div v-if="changesSummary" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-sm font-medium text-blue-900 mb-2">Ringkasan Perubahan:</p>
        <ul class="text-sm text-blue-800 space-y-1">
          <li v-if="changesSummary.added > 0">
            ✓ Akan menambah {{ changesSummary.added }} anggota baru
          </li>
          <li v-if="changesSummary.removed > 0">
            ✓ Akan menghapus {{ changesSummary.removed }} anggota
          </li>
          <li v-if="changesSummary.kept > 0">✓ {{ changesSummary.kept }} anggota tetap</li>
        </ul>
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
          :disabled="!compositionStatus?.valid || loading"
          @click="handleSubmit"
        >
          Simpan Perubahan
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import BaseButton from '../base/BaseButton.vue'
import api from '../../services/api'

const props = defineProps({
  modelValue: Boolean,
  team: Object,
  useCases: Array,
})

const emit = defineEmits(['update:modelValue', 'submit'])

const loading = ref(false)
const form = reactive({
  teamName: '',
  newMembers: [{ studentId: '', name: '', learningPath: '' }],
})

// Maintain a local, editable copy of existing members so leader can remove placeholders
const localCurrentMembers = ref([])

const currentMembers = computed(() => localCurrentMembers.value || [])

const allMembers = computed(() => {
  const newMemberIds = form.newMembers.filter(m => m.studentId).map(m => m.studentId)
  return [...currentMembers.value, ...newMemberIds]
})

const changesSummary = computed(() => {
  if (!props.team) return null

  const oldIds = currentMembers.value.map(m => m.studentId || m._id || m)
  const newIds = form.newMembers.filter(m => m.studentId).map(m => m.studentId)

  const added = newIds.filter(id => !oldIds.includes(id)).length
  const removed = oldIds.filter(id => !newIds.includes(id)).length
  const kept = oldIds.filter(id => newIds.includes(id)).length

  return { added, removed, kept }
})

const compositionStatus = computed(() => {
  if (!props.team || !props.useCases) return null

  const useCase = props.useCases.find(uc => uc._id === props.team.useCaseId)
  if (!useCase) return { valid: false, message: 'Use case tidak ditemukan' }

  const totalMembers = allMembers.value.length
  if (totalMembers !== useCase.totalTeamSize) {
    return {
      valid: false,
      message: `Jumlah anggota harus ${useCase.totalTeamSize}, saat ini ${totalMembers}`,
    }
  }

  return { valid: true, message: '✓ Komposisi tim valid' }
})

watch(
  () => props.modelValue,
  newVal => {
    if (newVal && props.team) {
      form.teamName = props.team.teamName
      form.newMembers = [{ studentId: '', name: '', learningPath: '' }]

      // Initialize local editable members from props.team.membersUserId
      // We clone values to avoid mutating parent prop
      const members = (props.team.membersUserId || []).map(m => {
        // Normalize member to object with studentId/name/learningPath when possible
        if (typeof m === 'object') {
          return {
            studentId: m._id || m.studentId || m.email || '',
            name: m.name || '',
            learningPath: m.learningPath || m.learningPathName || '',
          }
        }
        // primitive id (string) - treated as placeholder (invited or id)
        return { studentId: m, name: '', learningPath: '' }
      })
      localCurrentMembers.value = members
    }
  }
)

const addNewMember = () => {
  form.newMembers.push({ studentId: '', name: '', learningPath: '' })
}

const removeExistingMember = index => {
  // Remove from local current members only
  localCurrentMembers.value.splice(index, 1)
}

const removeNewMember = index => {
  form.newMembers.splice(index, 1)
}

const fetchStudentInfo = async index => {
  const studentId = form.newMembers[index].studentId
  if (!studentId) return

  try {
    // Use the properly configured API service instead of raw fetch
    const response = await api.get(`/students/lookup/${studentId}`)
    if (response.success && response.data) {
      form.newMembers[index].name = response.data.name
      form.newMembers[index].learningPath = response.data.learningPathName || 'Unknown'
    }
  } catch (err) {
    console.error('Failed to fetch student info:', err)
  }
}

const handleSubmit = async () => {
  loading.value = true
  try {
    // Build membersUserId from the editable localCurrentMembers and any newMembers
    const existingIds = currentMembers.value.map(m => m.studentId || m._id || m).filter(Boolean)

    const newIds = form.newMembers.filter(m => m.studentId).map(m => m.studentId)

    const membersUserId = [...existingIds, ...newIds]

    emit('submit', {
      teamName: form.teamName,
      membersUserId,
    })
  } finally {
    loading.value = false
  }
}
</script>
