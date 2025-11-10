<template>
  <div class="dynamic-input-list">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    
    <div class="space-y-3">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center space-x-2"
      >
        <BaseInput
          :model-value="item"
          @update:model-value="updateItem(index, $event)"
          :placeholder="placeholder"
          :disabled="disabled"
          class="flex-1"
        />
        <button
          v-if="items.length > 1"
          type="button"
          @click="removeItem(index)"
          :disabled="disabled"
          class="p-2 text-danger-500 hover:text-danger-700 hover:bg-danger-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
    
    <button
      v-if="!maxItems || items.length < maxItems"
      type="button"
      @click="addItem"
      :disabled="disabled"
      class="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      {{ addButtonText || '+ Tambah Anggota' }}
    </button>
    
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
import BaseInput from '../base/BaseInput.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => ['']
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  addButtonText: {
    type: String,
    default: ''
  },
  maxItems: {
    type: Number,
    default: null
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
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

const emit = defineEmits(['update:modelValue'])

const items = ref([...props.modelValue])

watch(() => props.modelValue, (newValue) => {
  items.value = [...newValue]
}, { deep: true })

const updateItem = (index, value) => {
  items.value[index] = value
  emit('update:modelValue', [...items.value])
}

const addItem = () => {
  if (!props.maxItems || items.value.length < props.maxItems) {
    items.value.push('')
    emit('update:modelValue', [...items.value])
  }
}

const removeItem = (index) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
    emit('update:modelValue', [...items.value])
  }
}
</script>
