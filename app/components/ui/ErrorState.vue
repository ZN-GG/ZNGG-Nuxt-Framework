<template>
  <div class="flex flex-col items-center justify-center px-6 py-14 text-center">
    <div class="flex h-11 w-11 items-center justify-center rounded-full border border-danger/20 bg-danger/10 text-danger">
      <AlertCircle class="h-5 w-5" aria-hidden="true" />
    </div>
    <p class="mt-3 text-sm font-medium text-ink">{{ title }}</p>
    <p class="mt-1 max-w-md text-sm leading-6 text-muted">{{ description }}</p>
    <button type="button" :class="cn(buttonVariants({ variant: 'secondary', size: 'sm' }), 'mt-4')" @click="$emit('retry')">
      重试
    </button>
  </div>
</template>
<script setup lang="ts">
import { AlertCircle } from '@lucide/vue'
import { buttonVariants, cn } from '~/utils/ui'

withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '加载失败',
  description: '网络或服务暂时不可用，请稍后重试。',
})

defineEmits<{ retry: [] }>()
</script>
