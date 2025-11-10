<template>
  <div :class="spinnerClasses" role="status">
    <svg
      class="animate-spin"
      :class="sizeClass"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
    <span v-if="label" :class="labelClass">{{ label }}</span>
    <span class="sr-only">Loading...</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'white', 'gray', 'success', 'danger', 'warning'].includes(value)
  },
  label: {
    type: String,
    default: ''
  },
  centered: {
    type: Boolean,
    default: false
  }
})

const spinnerClasses = computed(() => {
  const baseClasses = 'inline-flex items-center'
  const centeredClass = props.centered ? 'justify-center w-full' : ''
  
  return [baseClasses, centeredClass].filter(Boolean).join(' ')
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  return sizes[props.size]
})

const colorClass = computed(() => {
  const colors = {
    primary: 'text-primary-600',
    white: 'text-white',
    gray: 'text-gray-600',
    success: 'text-success-600',
    danger: 'text-danger-600',
    warning: 'text-warning-600'
  }
  return colors[props.color]
})

const labelClass = computed(() => {
  const baseClass = 'ml-2 text-gray-700'
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }
  return [baseClass, sizeClasses[props.size]].join(' ')
})
</script>
