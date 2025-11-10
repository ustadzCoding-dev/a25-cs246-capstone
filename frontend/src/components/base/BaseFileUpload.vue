<template>
  <div class="base-file-upload">
    <label 
      v-if="label" 
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    
    <div
      :class="[
        'border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200',
        error ? 'border-danger-500' : 'border-gray-300',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer hover:border-primary-500'
      ]"
      @click="!disabled && $refs.fileInput.click()"
      @dragover.prevent="!disabled && (isDragging = true)"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :disabled="disabled"
        :required="required"
        @change="handleFileChange"
        class="hidden"
      />
      
      <!-- Preview Image -->
      <div v-if="preview && previewUrl" class="mb-4">
        <img 
          :src="previewUrl" 
          alt="Preview" 
          class="max-h-48 mx-auto rounded-lg"
        />
      </div>
      
      <!-- Upload Icon & Text -->
      <div v-if="!selectedFile">
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="mt-2 text-sm text-gray-600">
          Click to upload or drag and drop
        </p>
        <p class="mt-1 text-xs text-gray-500">
          {{ accept || 'Any file type' }}
          <span v-if="maxSize"> (Max {{ maxSize }}MB)</span>
        </p>
      </div>
      
      <!-- Selected File Info -->
      <div v-else class="flex items-center justify-center space-x-2">
        <svg
          class="h-6 w-6 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span class="text-sm text-gray-700">{{ selectedFile.name }}</span>
        <button
          type="button"
          @click.stop="clearFile"
          class="text-danger-500 hover:text-danger-700"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-danger-500">
      {{ error }}
    </p>
    
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: File,
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: ''
  },
  maxSize: {
    type: Number,
    default: 2 // MB
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  preview: {
    type: Boolean,
    default: true
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'error'])

const fileInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const isDragging = ref(false)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

const validateAndSetFile = (file) => {
  // Validate file size
  if (props.maxSize && file.size > props.maxSize * 1024 * 1024) {
    emit('error', `File size must be less than ${props.maxSize}MB`)
    return
  }
  
  selectedFile.value = file
  emit('update:modelValue', file)
  
  // Generate preview for images
  if (props.preview && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      previewUrl.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const clearFile = () => {
  selectedFile.value = null
  previewUrl.value = ''
  emit('update:modelValue', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

watch(() => props.modelValue, (newValue) => {
  if (!newValue) {
    clearFile()
  }
})
</script>
