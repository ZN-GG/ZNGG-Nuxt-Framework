<template>
  <button type="button" :aria-label="label" :class="cn(buttonVariants({ variant, size: 'icon' }))">
    <component :is="icon" class="h-4 w-4" aria-hidden="true" />
  </button>
</template>
<script setup lang="ts">
import type { Component } from 'vue'
import { buttonVariants, cn } from '~/utils/ui'

withDefaults(defineProps<{
  label: string
  icon: Component
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
}>(), {
  variant: 'ghost',
})
</script>
