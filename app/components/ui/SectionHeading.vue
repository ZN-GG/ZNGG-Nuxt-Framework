<template>
  <div class="flex flex-wrap items-end justify-between gap-3">
    <div class="min-w-0">
      <p v-if="eyebrow" class="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{{ eyebrow }}</p>
      <component :is="as || 'h2'" class="text-lg font-semibold tracking-tight text-ink">{{ title }}</component>
      <p v-if="description" class="mt-1 max-w-2xl text-sm leading-6 text-muted">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="flex shrink-0 items-center gap-2">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  eyebrow?: string
  as?: string
}>(), {
  as: 'h2',
})
</script>
