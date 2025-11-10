<template>
  <div class="base-checkbox flex items-start">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
      :disabled="disabled"
      :required="required"
      class="w-4 h-4 mt-0.5 text-primary-600 border-gray-300 rounded focus:ring-primary-500 focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
    />
    <label 
      v-if="label" 
      :for="inputId"
      :class="[
        'ml-2 text-sm cursor-pointer',
        disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700'
      ]"
    >
      {{ label }}
      <span v-if="required" class="text-danger-500">*</span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
})

defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`)
</script>
