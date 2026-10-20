<template>
  <UiAppIconButton :label="label" :icon="icon" @click="cycle" />
</template>
<script setup lang="ts">
import { Monitor, Moon, Sun } from '@lucide/vue'

const colorMode = useColorMode()

const icon = computed(() => {
  if (colorMode.preference === 'dark') return Moon
  if (colorMode.preference === 'light') return Sun
  return Monitor
})

const label = computed(() => {
  const current = colorMode.preference === 'dark'
    ? '深色'
    : colorMode.preference === 'light'
      ? '浅色'
      : '跟随系统'
  return `当前主题：${current}，点击切换`
})

function cycle() {
  const order = ['light', 'dark', 'system'] as const
  const index = order.indexOf(colorMode.preference as typeof order[number])
  colorMode.preference = order[(index + 1) % order.length]
}
</script>
