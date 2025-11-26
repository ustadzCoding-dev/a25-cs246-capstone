<template>
  <DashboardLayout :user="user" :menu-items="studentMenuItems" @logout="handleLogout">
    <div class="max-w-4xl mx-auto">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Daftar Tim Capstone</h1>
        <p class="mt-2 text-gray-600">
          Buat tim capstone baru dengan mengisi form di bawah ini
        </p>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-danger-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-danger-700">{{ error }}</p>
        </div>
      </div>

      <!-- Success Alert -->
      <div v-if="success" class="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-success-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-success-700">{{ success }}</p>
        </div>
      </div>

      <!-- Registration Form -->
      <div class="bg-white rounded-lg shadow p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Team Name -->
          <BaseInput
            v-model="form.teamName"
            label="Nama Tim"
            placeholder="Contoh: Team Alpha"
            :error="errors.teamName"
            hint="Nama tim harus unik dan mudah diingat"
            required
          />

          <!-- Use Case Selection -->
          <BaseSelect
            v-model="form.useCase"
            label="Use Case"
            :options="useCaseOptions"
            placeholder="Pilih use case"
            :error="errors.useCase"
            hint="Pilih use case yang akan dikerjakan tim Anda"
            required
          />

          <!-- Leader Info (Auto-filled) -->
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Informasi Ketua Tim</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Nama:</span>
                <span class="font-medium text-gray-900">{{ user?.name }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Email:</span>
                <span class="font-medium text-gray-900">{{ user?.email }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Learning Path:</span>
                <span class="font-medium text-gray-900">{{ user?.learningPath }}</span>
              </div>
            </div>
          </div>

          <!-- Members & Learning Paths -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Anggota Tim
            </label>
            <p class="text-sm text-gray-500 mb-3">
              Masukkan Email anggota tim (minimal {{ selectedUseCaseTotalTeamSize || 2 }}, maksimal {{ selectedUseCaseTotalTeamSize || 4 }} anggota)
            </p>

            <div class="space-y-4">
              <div v-for="(member, index) in form.members" :key="index" class="flex gap-3">
                <!-- Member Email Input -->
                <div class="flex-1">
                  <input
                    v-model="form.members[index]"
                    type="email"
                    placeholder="Contoh: anggota@gmail.com"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    @blur="fetchStudentLearningPath(index, form.members[index])"
                  />
                </div>

                <!-- Learning Path Display (auto-fetched) -->
                <div class="flex-1">
                  <input
                    v-model="form.learningPaths[index]"
                    type="text"
                    placeholder="Auto-filled"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readonly
                  />
                </div>

                <!-- Delete Button -->
                <button
                  v-if="form.members.length > 1"
                  type="button"
                  @click="form.members.splice(index, 1); form.learningPaths.splice(index, 1)"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <!-- Add Member Button -->
              <button
                v-if="form.members.length < Math.max(0, (selectedUseCaseTotalTeamSize || 4) - 1)"
                type="button"
                @click="form.members.push(''); form.learningPaths.push('')"
                class="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                + Tambah Anggota
              </button>
            </div>

            <p v-if="errors.members" class="mt-2 text-sm text-danger-600">{{ errors.members }}</p>
          </div>

          <!-- Team Composition Info -->
          <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div class="flex items-start">
              <svg class="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-blue-700">
                <p class="font-semibold mb-1">Ketentuan Komposisi Tim:</p>
                <template v-if="selectedUseCaseComposition && selectedUseCaseComposition.length > 0">
                  <p class="mb-2">Use case ini memerlukan komposisi tim khusus:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li v-for="comp in selectedUseCaseComposition" :key="comp.learningPathId || comp.learningPath">
                      {{ comp.count }} orang dari {{ comp.learningPathName || comp.learningPath }}
                    </li>
                  </ul>
                  <p class="mt-2 font-semibold">Total: {{ selectedUseCaseTotalTeamSize }} anggota (termasuk ketua)</p>
                </template>
                <template v-else>
                  <ul class="list-disc list-inside space-y-1">
                    <li>Tim terdiri dari 2-4 orang (1 ketua + 1-3 anggota)</li>
                    <li>Semua anggota harus dari learning path yang sama</li>
                    <li>Semua anggota harus terdaftar di sistem</li>
                  </ul>
                </template>
              </div>
            </div>
          </div>

          <!-- Terms & Conditions -->
          <BaseCheckbox
            v-model="form.agreeToTerms"
            label="Saya menyetujui bahwa informasi yang diberikan adalah benar dan semua anggota telah setuju untuk bergabung dalam tim ini"
            required
          />
          <p v-if="errors.agreeToTerms" class="mt-1 text-sm text-danger-500">
            {{ errors.agreeToTerms }}
          </p>

          <!-- Action Buttons -->
          <div class="flex space-x-4 pt-4">
            <BaseButton
              type="submit"
              variant="primary"
              size="lg"
              :loading="loading"
              :disabled="loading"
              class="flex-1"
            >
              {{ loading ? 'Memproses...' : 'Daftar Tim' }}
            </BaseButton>

            <BaseButton
              type="button"
              variant="outline"
              size="lg"
              @click="handleCancel"
              :disabled="loading"
            >
              Batal
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useTeamStore } from '../../stores/teamStore'
import DashboardLayout from '../../components/layout/DashboardLayout.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseSelect from '../../components/base/BaseSelect.vue'
import BaseCheckbox from '../../components/base/BaseCheckbox.vue'
import BaseButton from '../../components/base/BaseButton.vue'
import DynamicInputList from '../../components/display/DynamicInputList.vue'

const router = useRouter()
const authStore = useAuthStore()
const teamStore = useTeamStore()

const user = computed(() => authStore.user)
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = reactive({
  teamName: '',
  useCase: '',
  members: [''], // Start with one empty field
  learningPaths: [''],
  agreeToTerms: false
})

const errors = reactive({
  teamName: '',
  useCase: '',
  members: '',
  learningPaths: '',
  agreeToTerms: ''
})

// Use case options (fetch from backend)
const useCaseOptions = ref([])
const loadingUseCases = ref(false)
const useCasesData = ref([]) // Store full use case data including composition

// Computed properties for selected use case composition
const selectedUseCaseComposition = computed(() => {
  if (!form.useCase) return null
  const useCase = useCasesData.value.find(uc => (uc._id || uc.id) === form.useCase)
  return useCase?.teamComposition || null
})

const selectedUseCaseTotalTeamSize = computed(() => {
  if (!form.useCase) return 0
  const useCase = useCasesData.value.find(uc => (uc._id || uc.id) === form.useCase)
  return useCase?.totalTeamSize || 0
})

// Auto-adjust member fields when use case changes
watch(() => form.useCase, (newUseCase) => {
  if (newUseCase) {
    const totalSize = selectedUseCaseTotalTeamSize.value
    // Subtract 1 because leader is already counted in totalSize
    const additionalMembersNeeded = Math.max(0, totalSize - 1)
    // Reset members and learning paths to match additional members needed
    form.members = Array(additionalMembersNeeded).fill('')
    form.learningPaths = Array(additionalMembersNeeded).fill('')
    console.log(`Adjusted form for ${additionalMembersNeeded} additional members (total team size: ${totalSize})`)
  }
})

const studentMenuItems = [
  { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
  { name: 'Tim Saya', icon: 'team', path: '/team', roles: ['student'] },
  { name: 'Dokumen', icon: 'document', path: '/documents', roles: ['student'] },
  { name: 'Timeline', icon: 'timeline', path: '/timeline', roles: ['student'] },
  { name: 'Pengumuman', icon: 'announcement', path: '/announcements', roles: ['student'] }
]

const validateForm = () => {
  // Reset errors
  Object.keys(errors).forEach(key => errors[key] = '')

  let isValid = true

  // Team name validation
  if (!form.teamName.trim()) {
    errors.teamName = 'Nama tim wajib diisi'
    isValid = false
  } else if (form.teamName.length < 3) {
    errors.teamName = 'Nama tim minimal 3 karakter'
    isValid = false
  }
  console.log('Team name valid:', !errors.teamName)

  // Use case validation
  if (!form.useCase) {
    errors.useCase = 'Use case wajib dipilih'
    isValid = false
  }
  console.log('Use case valid:', !errors.useCase)

  // Members validation
  const validMembers = form.members.filter(m => m.trim() !== '')
  const totalTeamSize = selectedUseCaseTotalTeamSize.value || 2
  const expectedAdditionalMembers = Math.max(0, totalTeamSize - 1)

  console.log('Members validation:', {
    validMembers: validMembers.length,
    expectedAdditionalMembers,
    totalTeamSize
  })

  if (validMembers.length === 0) {
    errors.members = 'Minimal 1 anggota tim harus diisi'
    isValid = false
  } else if (validMembers.length !== expectedAdditionalMembers) {
    errors.members = `Tim harus memiliki tepat ${totalTeamSize} anggota total (1 ketua + ${expectedAdditionalMembers} anggota), Anda input ${validMembers.length + 1}`
    isValid = false
  }
  console.log('Members valid:', !errors.members)

  // Learning paths validation
  const validPaths = form.learningPaths.filter(p => p.trim() !== '')
  if (validPaths.length !== validMembers.length) {
    errors.learningPaths = 'Semua anggota harus memiliki learning path'
    isValid = false
  }
  console.log('Learning paths valid:', !errors.learningPaths, {
    validPaths: validPaths.length,
    validMembers: validMembers.length
  })

  // Validate composition requirements
  if (!errors.learningPaths && selectedUseCaseComposition.value && selectedUseCaseComposition.value.length > 0) {
    console.log('Checking composition:', selectedUseCaseComposition.value)

    // Include leader's learning path in composition validation
    const allPaths = [user.value?.learningPath, ...validPaths]
    console.log('All paths (including leader):', allPaths)

    const compositionCount = {}
    allPaths.forEach(path => {
      if (path) { // Only count if path exists
        compositionCount[path] = (compositionCount[path] || 0) + 1
      }
    })
    console.log('Composition count:', compositionCount)

    for (const requirement of selectedUseCaseComposition.value) {
      // Use learningPathName from backend (not learningPath)
      const learningPathName = requirement.learningPathName || requirement.learningPath
      const actualCount = compositionCount[learningPathName] || 0
      console.log('Checking requirement:', {
        learningPathName,
        required: requirement.count,
        actual: actualCount
      })

      if (actualCount !== requirement.count) {
        errors.learningPaths = `Komposisi tidak sesuai. Dibutuhkan ${requirement.count} dari "${learningPathName}", Anda input ${actualCount}`
        isValid = false
        break
      }
    }
  }
  console.log('Composition valid:', !errors.learningPaths)

  // Terms validation
  if (!form.agreeToTerms) {
    errors.agreeToTerms = 'Anda harus menyetujui pernyataan di atas'
    isValid = false
  }
  console.log('Terms valid:', !errors.agreeToTerms)

  console.log('=== FINAL VALIDATION RESULT ===')
  console.log('All errors:', errors)
  console.log('Is valid:', isValid)

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    console.log('Form validation failed')
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    // Filter out empty members and paths
    const validMembers = form.members.filter(m => m.trim() !== '')
    const validPaths = form.learningPaths.filter(p => p.trim() !== '')

    // Include leader (current user) in members list
    const allMembers = [user.value?.email, ...validMembers]

    // Prepare team data
    const teamData = {
      teamName: form.teamName,
      useCaseId: form.useCase, // Backend expects useCaseId
      membersUserId: allMembers
    }

    console.log('Submitting team data:', teamData)

    // Call API to create team
    const response = await teamStore.createTeam(teamData)

    console.log('Team creation response:', response)
    console.log('Response type:', typeof response)
    console.log('Response.success:', response?.success)
    console.log('Response.data:', response?.data)
    console.log('Response.message:', response?.message)

    if (response && response.success) {
      success.value = 'Tim berhasil didaftarkan! Menunggu persetujuan admin.'
      console.log('✅ Team creation successful!')

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/team')
      }, 2000)
    } else {
      console.log('❌ Team creation failed - response.success is false or missing')
      error.value = response?.message || 'Gagal mendaftarkan tim'
    }

  } catch (err) {
    console.error('Team creation error:', err)
    error.value = err.message || 'Gagal mendaftarkan tim. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/team')
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Fetch student learning path by student ID
const fetchStudentLearningPath = async (index, studentId) => {
  if (!studentId.trim()) {
    form.learningPaths[index] = ''
    return
  }

  try {
    const response = await fetch(`http://localhost:8000/api/students/lookup/${studentId}`)

    if (!response.ok) {
      console.warn(`Student ${studentId} not found`)
      form.learningPaths[index] = ''
      return
    }

    const data = await response.json()
    if (data.success && data.data) {
      form.learningPaths[index] = data.data.learningPathName || ''
      console.log(`Loaded learning path for ${studentId}: ${data.data.learningPathName}`)
    }
  } catch (err) {
    console.error(`Failed to fetch student ${studentId}:`, err)
    form.learningPaths[index] = ''
  }
}

const fetchUseCases = async () => {
  loadingUseCases.value = true
  try {
    const response = await teamStore.fetchUseCases()
    console.log('Full response:', response)

    // Response is already the array (teamStore returns response.data which is the array)
    const useCases = Array.isArray(response) ? response : (response.data || [])
    console.log('Use cases array:', useCases)
    console.log('Use cases length:', useCases.length)

    useCasesData.value = useCases
    useCaseOptions.value = useCases.map(uc => ({
      value: uc._id || uc.id,
      label: `${uc.usecaseId || uc.code} - ${uc.title || uc.name}`
    }))
  } catch (err) {
    console.error('Failed to fetch use cases:', err)
    console.error('Error details:', err.message)
    // Fallback to default options if API fails
    useCaseOptions.value = [
      { value: 'DC-01', label: 'DC-01 - E-Commerce Platform' },
      { value: 'DC-02', label: 'DC-02 - Learning Management System' },
      { value: 'DC-09', label: 'DC-09 - Event Management System' },
      { value: 'DC-10', label: 'DC-10 - Job Portal' }
    ]
  } finally {
    loadingUseCases.value = false
  }
}

onMounted(() => {
  console.log('TeamRegistrationForm mounted!')
  fetchUseCases()
})
</script>
