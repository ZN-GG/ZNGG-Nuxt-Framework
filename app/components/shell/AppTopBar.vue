<template>
  <header class="fixed inset-x-0 top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4">
      <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="ZNGG 首页">
        <img src="/logo-black.png" alt="ZNGG" class="h-7 w-auto dark:invert" />
      </NuxtLink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="主导航">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :class="cn(
            'flex h-9 items-center gap-1.5 rounded-control px-3 text-sm transition-colors',
            isActive(item.to) ? 'bg-accent-soft font-medium text-ink' : 'text-muted hover:bg-surface-muted hover:text-ink',
          )"
          :aria-current="isActive(item.to) ? 'page' : undefined"
        >
          <component :is="item.icon" class="h-3.5 w-3.5" aria-hidden="true" />
          {{ item.label }}
        </NuxtLink>

      </nav>

      <div class="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          class="hidden h-9 items-center gap-2 rounded-control border border-line bg-surface-muted/60 px-3 text-xs text-muted transition-colors hover:bg-surface-muted hover:text-ink md:flex"
          aria-label="打开全局搜索"
          @click="palette.open()"
        >
          <Search class="h-3.5 w-3.5" aria-hidden="true" />
          <span>搜索或跳转</span>
          <kbd class="rounded border border-line bg-surface px-1.5 py-0.5 font-sans text-[10px] text-muted">⌘K</kbd>
        </button>

        <UiAppIconButton class="md:hidden" label="打开全局搜索" :icon="Search" @click="palette.open()" />
        <ShellThemeToggle />

        <NuxtLink
          v-if="loggedIn"
          to="/user"
          class="flex h-9 items-center gap-1.5 rounded-control px-2.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-ink"
        >
          <User class="h-4 w-4" aria-hidden="true" />
          <span class="hidden sm:inline">我的</span>
        </NuxtLink>
        <button
          v-else
          type="button"
          class="flex h-9 items-center gap-1.5 rounded-control bg-accent px-3 text-sm font-medium text-ink transition-colors hover:bg-accent-strong"
          @click="openLogin"
        >
          <User class="h-4 w-4" aria-hidden="true" />
          <span class="hidden sm:inline">登录</span>
        </button>
      </div>
    </div>

    <Login />
  </header>
</template>
<script setup lang="ts">
import { BookOpen, Compass, Download, FolderGit2, Search, User, Wrench } from '@lucide/vue'
import { useCommandPalette } from '~/composables/useCommandPalette'
import { userStore } from '~/stores/user'
import { cn } from '~/utils/ui'

const route = useRoute()
const palette = useCommandPalette()
const store = userStore()
const token = useCookie('token')

const loggedIn = computed(() => Boolean(token.value) || store.isLogin)

const navItems = [
  { label: '工具', to: '/tool', icon: Wrench },
  { label: '文章', to: '/read', icon: BookOpen },
  { label: '项目', to: '/project', icon: FolderGit2 },
  { label: '下载', to: '/download', icon: Download },
  { label: '发现', to: '/discover', icon: Compass },
]

const isActive = (path: string) =>
  route.path === path || route.path.startsWith(`${path}/`)

function openLogin() {
  store.showLogin = true
}

function isEditable(target: EventTarget | null) {
  const element = target as HTMLElement | null
  if (!element) return false
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName) || element.isContentEditable
}

function onKeydown(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    palette.toggle()
    return
  }
  if (event.key === '/' && !isEditable(event.target)) {
    event.preventDefault()
    palette.open()
    return
  }
  if (event.key === 'Escape') palette.close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
