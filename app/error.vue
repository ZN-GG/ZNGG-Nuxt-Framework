<template>
  <div class="flex min-h-screen items-center justify-center bg-canvas px-4">
    <div class="w-full max-w-lg rounded-card border border-line bg-surface p-8 text-center shadow-card">
      <NuxtLink to="/" class="inline-flex items-center" aria-label="ZNGG 首页">
        <img src="/logo-black.png" alt="ZNGG" class="h-8 w-auto dark:invert" />
      </NuxtLink>

      <p class="mt-6 text-5xl font-semibold tracking-tight text-accent-strong">{{ statusCode }}</p>
      <h1 class="mt-3 text-xl font-semibold tracking-tight text-ink">{{ title }}</h1>
      <p class="mt-2 text-sm leading-6 text-muted">{{ message }}</p>

      <div class="mt-6 flex flex-wrap justify-center gap-2">
        <button type="button" class="rounded-control bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-strong" @click="handleError">
          返回首页
        </button>
        <NuxtLink to="/search" class="rounded-control border border-line px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-ink">
          搜索内容
        </NuxtLink>
        <NuxtLink to="/tool" class="rounded-control border border-line px-4 py-2 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-ink">
          去工具
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const statusCode = computed(() => props.error?.statusCode || 500)
const title = computed(() => statusCode.value === 404 ? '页面不存在' : '页面出错了')
const message = computed(() => statusCode.value === 404
  ? '你访问的内容可能已被移动或删除。'
  : '服务暂时不可用，请稍后再试。')

useHead({
  title: computed(() => `${title.value} - ZNGG在线工具`),
  meta: [{ name: 'robots', content: 'noindex' }],
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>
