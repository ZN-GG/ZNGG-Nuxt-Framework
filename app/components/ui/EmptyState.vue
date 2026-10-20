<template>
  <div class="flex flex-col items-center justify-center px-6 py-14 text-center">
    <div v-if="icon" class="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface-muted text-muted">
      <component :is="icon" class="h-5 w-5" aria-hidden="true" />
    </div>
    <p class="mt-3 text-sm font-medium text-ink">{{ title }}</p>
    <p v-if="description" class="mt-1 max-w-md text-sm leading-6 text-muted">{{ description }}</p>
    <div v-if="$slots.default" class="mt-4">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  title: string
  description?: string
  icon?: Component
}>()
</script>
