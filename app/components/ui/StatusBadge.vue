<template>
  <span :class="cn(badgeVariants({ tone }))">
    <slot>{{ label }}</slot>
  </span>
</template>
<script setup lang="ts">
import { badgeVariants, cn } from '~/utils/ui'

withDefaults(defineProps<{
  label?: string
  tone?: 'neutral' | 'accent' | 'info' | 'success' | 'warning' | 'danger'
}>(), {
  tone: 'neutral',
})
</script>
