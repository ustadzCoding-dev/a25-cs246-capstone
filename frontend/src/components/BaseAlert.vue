<template>
  <Transition name="alert">
    <div v-if="modelValue" :class="alertClasses" role="alert">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <component :is="iconComponent" class="h-5 w-5" />
        </div>
        
        <div class="ml-3 flex-1">
          <h3 v-if="title" class="text-sm font-medium" :class="titleColorClass">
            {{ title }}
          </h3>
          <div class="text-sm" :class="[title ? 'mt-1' : '', textColorClass]">
            <slot></slot>
          </div>
        </div>
        
        <div v-if="closable" class="ml-auto pl-3">
          <button
            type="button"
            :class="closeButtonClass"
            @click="close"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, h } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['info', 'success', 'warning', 'danger'].includes(value),
  },
  title: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};

const alertClasses = computed(() => {
  const baseClasses = 'rounded-lg p-4 border';
  
  const variantClasses = {
    info: 'bg-primary-50 border-primary-200',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    danger: 'bg-danger-50 border-danger-200',
  };
  
  return [baseClasses, variantClasses[props.variant]].join(' ');
});

const titleColorClass = computed(() => {
  const colors = {
    info: 'text-primary-800',
    success: 'text-success-800',
    warning: 'text-warning-800',
    danger: 'text-danger-800',
  };
  return colors[props.variant];
});

const textColorClass = computed(() => {
  const colors = {
    info: 'text-primary-700',
    success: 'text-success-700',
    warning: 'text-warning-700',
    danger: 'text-danger-700',
  };
  return colors[props.variant];
});

const closeButtonClass = computed(() => {
  const colors = {
    info: 'text-primary-500 hover:text-primary-600',
    success: 'text-success-500 hover:text-success-600',
    warning: 'text-warning-500 hover:text-warning-600',
    danger: 'text-danger-500 hover:text-danger-600',
  };
  return `inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors[props.variant]}`;
});

const iconComponent = computed(() => {
  const icons = {
    info: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', class: 'text-primary-400' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z', 'clip-rule': 'evenodd' })
    ]),
    success: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', class: 'text-success-400' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z', 'clip-rule': 'evenodd' })
    ]),
    warning: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', class: 'text-warning-400' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z', 'clip-rule': 'evenodd' })
    ]),
    danger: () => h('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 20 20', fill: 'currentColor', class: 'text-danger-400' }, [
      h('path', { 'fill-rule': 'evenodd', d: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z', 'clip-rule': 'evenodd' })
    ]),
  };
  return icons[props.variant];
});
</script>

<style scoped>
.alert-enter-active,
.alert-leave-active {
  transition: all 0.3s ease;
}

.alert-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.alert-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
