<template>
  <nav class="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden" aria-label="移动端导航">
    <div class="flex h-14 items-stretch">
      <NuxtLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :class="cn(
          'flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] transition-colors',
          active(item.to) ? 'text-accent-strong' : 'text-muted',
        )"
        :aria-current="active(item.to) ? 'page' : undefined"
      >
        <component :is="item.icon" class="h-4 w-4" aria-hidden="true" />
        {{ item.label }}
      </NuxtLink>
    </div>
  </nav>
</template>
<script setup lang="ts">
import { BookOpen, Compass, Home, User, Wrench } from '@lucide/vue'
import { cn } from '~/utils/ui'

const route = useRoute()

const items = [
  { label: '首页', to: '/', icon: Home },
  { label: '工具', to: '/tool', icon: Wrench },
  { label: '文章', to: '/read', icon: BookOpen },
  { label: '发现', to: '/discover', icon: Compass },
  { label: '我的', to: '/user', icon: User },
]

const discoverPaths = ['/discover', '/project', '/download', '/nav', '/link']

const active = (path: string) => {
  if (path === '/') return route.path === '/'
  if (path === '/discover') {
    return discoverPaths.some((entry) => route.path === entry || route.path.startsWith(`${entry}/`))
  }
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>
