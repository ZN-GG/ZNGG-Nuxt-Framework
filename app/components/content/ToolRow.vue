<template>
  <li class="flex items-center gap-3 px-2 py-2.5 transition-colors" :class="selected ? 'bg-accent-soft' : 'hover:bg-surface-muted'">
    <button type="button" class="flex min-w-0 flex-1 items-center gap-3 text-left" @click="$emit('select')">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-surface-muted">
        <img v-if="item.image" :src="'/img/' + item.image" :alt="item.title" loading="lazy" class="h-5 w-5 object-contain" />
        <Wrench v-else class="h-4 w-4 text-muted" aria-hidden="true" />
      </span>
      <span class="min-w-0 flex-1">
        <span class="block truncate text-sm font-medium text-ink">{{ item.title }}</span>
        <span class="mt-0.5 block truncate text-xs text-muted">{{ item.summary }}</span>
      </span>
    </button>
    <NuxtLink :to="'/tool/detail/' + item.content" class="shrink-0 text-xs text-muted transition-colors hover:text-accent-strong" @click="$emit('open')">
      打开
    </NuxtLink>
  </li>
</template>
<script setup lang="ts">
import { Wrench } from '@lucide/vue'

defineProps<{
  item: Record<string, any>
  selected?: boolean
}>()

defineEmits<{ select: []; open: [] }>()
</script>
