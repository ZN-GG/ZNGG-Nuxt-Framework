<template>
  <li
    class="group flex items-center gap-3 px-2 py-3 transition-colors"
    :class="selected ? 'bg-accent-soft' : 'hover:bg-surface-muted'"
  >
    <button
      type="button"
      class="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline-none"
      :aria-current="selected ? 'true' : undefined"
      @click="$emit('select')"
    >
      <span class="relative h-12 w-16 shrink-0 overflow-hidden rounded-control bg-surface-muted">
        <img
          v-if="item.cover"
          :src="item.cover"
          :alt="item.title"
          loading="lazy"
          class="h-full w-full object-cover object-top"
        />
        <span v-else class="flex h-full w-full items-center justify-center text-muted">
          <Download class="h-4 w-4" aria-hidden="true" />
        </span>
      </span>

      <span class="min-w-0 flex-1">
        <span class="flex items-center gap-2">
          <span class="truncate text-sm font-semibold text-ink">{{ item.title }}</span>
          <UiStatusBadge v-if="item.version" tone="neutral">v{{ item.version }}</UiStatusBadge>
        </span>
        <span class="mt-0.5 block truncate text-xs text-muted">{{ item.summary }}</span>
        <span class="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-muted">
          <span>{{ categoryLabel }}</span>
          <span v-if="item.platform">{{ item.platform }}</span>
          <span v-if="sizeLabel">{{ sizeLabel }}</span>
          <span>{{ item.downloadCount ?? 0 }} 次下载</span>
        </span>
      </span>
    </button>

    <a
      :href="fileHref"
      target="_blank"
      rel="noopener noreferrer"
      class="shrink-0 rounded-control bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-strong"
      @click.stop
    >
      下载
    </a>
  </li>
</template>
<script setup lang="ts">
import { Download } from '@lucide/vue'
import { api } from '~/api/api'

const props = defineProps<{
  item: Record<string, any>
  selected?: boolean
}>()

defineEmits<{ select: [] }>()

const categoryLabel = computed(() =>
  props.item.category?.name
  || props.item.categoryName
  || (props.item.type === 'SOFTWARE' ? '软件' : '资源')
)

const sizeLabel = computed(() => formatSize(Number(props.item.fileSize)))

const fileHref = computed(() => {
  if (props.item.storageType === 'EXTERNAL') return props.item.fileUrl || '#'
  return api.download.getFileUrl(props.item.id)
})

function formatSize(bytes: number) {
  if (!bytes || Number.isNaN(bytes)) return ''
  const units = ['B', 'KB', 'MB', 'GB']
  let index = 0
  let value = bytes
  while (value >= 1024 && index < units.length - 1) {
    value = value / 1024
    index++
  }
  return `${value.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}
</script>
