<template>
  <li class="transition-colors" :class="selected ? 'bg-accent-soft' : 'hover:bg-surface-muted'">
    <button type="button" class="flex w-full items-start gap-3 px-2 py-3 text-left" @click="$emit('select')">
      <span class="min-w-0 flex-1">
        <span class="flex items-center gap-1.5 text-[11px] text-muted">
          {{ item.category?.name || '文章' }}
          <span class="text-line">·</span>
          <time>{{ dateOf(item) }}</time>
        </span>
        <span class="mt-1 block line-clamp-1 text-sm font-semibold text-ink">{{ item.title }}</span>
        <span class="mt-0.5 block line-clamp-1 text-xs text-muted">{{ item.summary }}</span>
      </span>
      <img v-if="item.image" :src="item.image" :alt="item.title" loading="lazy" class="h-12 w-16 shrink-0 rounded-control object-cover" />
    </button>
  </li>
</template>
<script setup lang="ts">
defineProps<{
  item: Record<string, any>
  selected?: boolean
}>()

defineEmits<{ select: [] }>()

const dateOf = (item: Record<string, any>) => item.updateTime ? String(item.updateTime).slice(0, 10) : ''
</script>
