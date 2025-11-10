<template>
  <div class="base-textarea">
    <label 
      v-if="label" 
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
    
    <textarea
      :id="inputId"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      :maxlength="maxLength"
      :class="[
        'w-full px-4 py-2 border rounded-lg transition-colors duration-200 resize-none',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        error ? 'border-danger-500' : 'border-gray-300',
        disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
      ]"
    ></textarea>
    
    <div v-if="maxLength" class="flex justify-between items-center mt-1">
      <p v-if="error" class="text-sm text-danger-500">
        {{ error }}
      </p>
      <p v-else-if="hint" class="text-sm text-gray-500">
        {{ hint }}
      </p>
      <span v-else class="flex-1"></span>
      <span class="text-sm text-gray-500">
        {{ modelValue.length }} / {{ maxLength }}
      </span>
    </div>
    
    <template v-else>
      <p v-if="error" class="mt-1 text-sm text-danger-500">
        {{ error }}
      </p>
      <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
        {{ hint }}
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  rows: {
    type: Number,
    default: 4
  },
  maxLength: {
    type: Number,
    default: null
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`)
</script>
