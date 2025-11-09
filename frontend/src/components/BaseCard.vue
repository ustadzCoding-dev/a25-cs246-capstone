<template>
  <div :class="cardClasses">
    <div v-if="$slots.header || title" class="px-6 py-4 border-b border-gray-200">
      <slot name="header">
        <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
      </slot>
    </div>
    
    <div :class="bodyClasses">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  padding: {
    type: Boolean,
    default: true,
  },
  shadow: {
    type: String,
    default: 'soft',
    validator: (value) => ['none', 'soft', 'medium', 'hard'].includes(value),
  },
  hover: {
    type: Boolean,
    default: false,
  },
});

const cardClasses = computed(() => {
  const baseClasses = 'bg-white rounded-lg border border-gray-200 overflow-hidden';
  
  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    hard: 'shadow-hard',
  };
  
  const hoverClass = props.hover ? 'transition-shadow duration-200 hover:shadow-medium cursor-pointer' : '';
  
  return [baseClasses, shadowClasses[props.shadow], hoverClass].join(' ');
});

const bodyClasses = computed(() => {
  return props.padding ? 'px-6 py-4' : '';
});
</script>
