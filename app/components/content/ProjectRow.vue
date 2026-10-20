<template>
  <li class="transition-colors" :class="selected ? 'bg-accent-soft' : 'hover:bg-surface-muted'">
    <button type="button" class="flex w-full items-start gap-3 px-2 py-3 text-left" @click="$emit('select')">
      <span class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-control bg-surface-muted text-xs font-semibold text-ink">
        <img v-if="item.logo" :src="item.logo" :alt="item.name" loading="lazy" class="h-full w-full object-cover" />
        <template v-else>{{ (item.name || '?').slice(0, 1) }}</template>
      </span>
      <span class="min-w-0 flex-1">
        <span class="flex items-center gap-2">
          <span class="truncate text-sm font-medium text-ink">{{ item.name }}</span>
          <UiStatusBadge tone="neutral">{{ platformLabel(item.platform) }}</UiStatusBadge>
        </span>
        <span class="mt-0.5 block line-clamp-1 text-xs text-muted">{{ item.summary }}</span>
        <span class="mt-1 flex flex-wrap gap-x-3 text-[11px] text-muted">
          <span v-if="item.language">{{ item.language }}</span>
          <span v-if="item.stars">{{ item.stars }} stars</span>
          <span v-if="item.license">{{ item.license }}</span>
        </span>
      </span>
    </button>
  </li>
</template>
<script setup lang="ts">
defineProps<{
  item: Record<string, any>
  selected?: boolean
}>()

defineEmits<{ select: [] }>()

const platformLabel = (platform: string) => ({
  GITHUB: 'GitHub',
  GITEE: 'Gitee',
  OTHER: '其他',
}[platform] || platform || '项目')
</script>
