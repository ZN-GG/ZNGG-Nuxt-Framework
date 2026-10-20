<template>
  <DialogRoot :open="isOpen" @update:open="isOpen = $event">
    <DialogPortal>
      <DialogOverlay class="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]" />
      <div class="pointer-events-none fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 pt-[10vh] md:pt-[12vh]">
        <DialogContent
          class="pointer-events-auto relative w-full max-w-2xl overflow-hidden rounded-card border border-line bg-surface shadow-pop animate-slide-up focus:outline-none"
        >
        <DialogTitle class="sr-only">全局搜索</DialogTitle>
        <DialogDescription class="sr-only">搜索工具、文章、项目和下载</DialogDescription>

        <div class="flex items-center gap-2 border-b border-line px-4">
          <Search class="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            ref="inputRef"
            v-model="query"
            type="search"
            class="h-14 min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            placeholder="搜索工具、文章、项目或下载…"
            autocomplete="off"
            spellcheck="false"
            aria-label="搜索"
            aria-controls="command-results"
            :aria-activedescendant="flatResults[activeIndex] ? `command-result-${activeIndex}` : undefined"
            @keydown="onKeydown"
          />
          <button type="button" class="rounded-control p-1.5 text-muted hover:bg-surface-muted hover:text-ink" aria-label="关闭搜索" @click="close">
            <X class="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div id="command-results" class="max-h-[60vh] overflow-y-auto p-2" role="listbox" aria-label="搜索结果">
          <template v-if="!query">
            <div v-if="recentSearches.length" class="px-2 pb-2">
              <p class="px-2 py-1 text-[11px] font-medium text-muted">最近搜索</p>
              <div class="flex flex-wrap gap-1.5">
                <button
                  v-for="term in recentSearches"
                  :key="term"
                  type="button"
                  class="rounded-full border border-line px-2.5 py-1 text-xs text-muted hover:border-accent/40 hover:text-ink"
                  @click="query = term"
                >
                  {{ term }}
                </button>
              </div>
            </div>

            <div v-if="recentItems.length" class="px-2 pb-2">
              <p class="px-2 py-1 text-[11px] font-medium text-muted">最近访问</p>
              <button
                v-for="item in recentItems.slice(0, 4)"
                :key="item.route"
                type="button"
                class="flex w-full items-center gap-3 rounded-control px-2 py-2 text-left hover:bg-surface-muted"
                @click="go(item.route)"
              >
                <component :is="typeIcon(item.type)" class="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                <span class="min-w-0 flex-1">
                  <span class="block truncate text-sm text-ink">{{ item.title }}</span>
                  <span class="block text-[11px] text-muted">{{ typeLabel(item.type) }}</span>
                </span>
              </button>
            </div>

            <div class="px-2">
              <p class="px-2 py-1 text-[11px] font-medium text-muted">快捷跳转</p>
              <div class="grid grid-cols-2 gap-1">
                <button
                  v-for="item in quickLinks"
                  :key="item.to"
                  type="button"
                  class="flex items-center gap-2 rounded-control px-2 py-2 text-left text-sm text-muted hover:bg-surface-muted hover:text-ink"
                  @click="go(item.to)"
                >
                  <component :is="item.icon" class="h-4 w-4" aria-hidden="true" />
                  {{ item.label }}
                </button>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-if="pending" class="space-y-1 p-2" aria-hidden="true">
              <div v-for="i in 4" :key="i" class="h-12 animate-pulse rounded-control bg-surface-muted" />
            </div>

            <div v-else-if="error" class="px-2 py-6 text-center">
              <p class="text-sm text-ink">{{ error }}</p>
              <button type="button" class="mt-3 text-sm text-accent-strong hover:underline" @click="runSearch(query)">重试</button>
            </div>

            <div v-else-if="total === 0" class="px-2 py-8 text-center">
              <p class="text-sm text-ink">没有找到与“{{ query }}”相关的内容</p>
              <p class="mt-1 text-xs text-muted">换个关键词，或者浏览全部工具。</p>
              <button type="button" class="mt-3 text-sm text-accent-strong hover:underline" @click="go('/tool')">浏览全部工具</button>
            </div>

            <template v-else>
              <div v-for="group in groups" :key="group.type" class="mb-1">
                <p class="px-2 py-1 text-[11px] font-medium text-muted">{{ group.label }}</p>
                <button
                  v-for="item in group.items"
                  :id="`command-result-${flatResults.findIndex((entry) => entry.id === item.id && entry.type === item.type)}`"
                  :key="`${item.type}-${item.id}`"
                  type="button"
                  role="option"
                  :aria-selected="flatResults[activeIndex]?.id === item.id && flatResults[activeIndex]?.type === item.type"
                  class="flex w-full items-center gap-3 rounded-control px-2 py-2 text-left transition-colors"
                  :class="flatResults[activeIndex]?.id === item.id && flatResults[activeIndex]?.type === item.type ? 'bg-accent-soft' : 'hover:bg-surface-muted'"
                  @mouseenter="activeIndex = flatResults.findIndex((entry) => entry.id === item.id && entry.type === item.type)"
                  @click="select(item)"
                >
                  <component :is="typeIcon(item.type)" class="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm text-ink">
                      <template v-for="(part, index) in highlight(item.title, query)" :key="index">
                        <span :class="part.match ? 'rounded bg-accent/20 text-ink' : ''">{{ part.text }}</span>
                      </template>
                    </span>
                    <span class="mt-0.5 block truncate text-[11px] text-muted">{{ item.category }}<template v-if="item.summary"> · {{ item.summary }}</template></span>
                  </span>
                  <ArrowRight class="h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
                </button>
              </div>
            </template>
          </template>
        </div>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import {
  ArrowRight,
  BookOpen,
  Compass,
  Download,
  FolderGit2,
  Search,
  Wrench,
  X,
} from '@lucide/vue'
import { DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui'
import { useCommandPalette } from '~/composables/useCommandPalette'
import { useRecent } from '~/composables/useRecent'

type SearchType = 'tool' | 'article' | 'project' | 'download'
type SearchItem = {
  type: SearchType
  id: string
  title: string
  summary: string
  category: string
  route: string
}
type SearchGroup = { type: SearchType; label: string; items: SearchItem[] }

const { isOpen, close } = useCommandPalette()
const { items: recentItems, add: addRecent } = useRecent()
const router = useRouter()

const inputRef = ref<HTMLInputElement | null>(null)
const query = ref('')
const pending = ref(false)
const error = ref('')
const total = ref(0)
const groups = ref<SearchGroup[]>([])
const activeIndex = ref(0)
const recentSearches = ref<string[]>([])

let timer: ReturnType<typeof setTimeout> | null = null
let controller: AbortController | null = null

const typeLabels: Record<SearchType, string> = {
  tool: '工具',
  article: '文章',
  project: '项目',
  download: '下载',
}

const typeIcons = {
  tool: Wrench,
  article: BookOpen,
  project: FolderGit2,
  download: Download,
}

const quickLinks = [
  { label: '在线工具', to: '/tool', icon: Wrench },
  { label: '技术文章', to: '/read', icon: BookOpen },
  { label: '开源项目', to: '/project', icon: FolderGit2 },
  { label: '资源下载', to: '/download', icon: Download },
  { label: '网址导航', to: '/nav', icon: Compass },
]

const flatResults = computed(() => groups.value.flatMap((group) => group.items))
const typeLabel = (type: SearchType) => typeLabels[type]
const typeIcon = (type: SearchType) => typeIcons[type]

function loadRecentSearches() {
  if (!import.meta.client) return
  try {
    recentSearches.value = JSON.parse(window.localStorage.getItem('zngg:recent-searches') || '[]')
  } catch {
    recentSearches.value = []
  }
}

function rememberSearch(term: string) {
  if (!import.meta.client) return
  const next = [term, ...recentSearches.value.filter((item) => item !== term)].slice(0, 5)
  recentSearches.value = next
  try {
    window.localStorage.setItem('zngg:recent-searches', JSON.stringify(next))
  } catch {
    // Recent searches are optional.
  }
}

function highlight(text: string, term: string) {
  if (!term) return [{ text, match: false }]
  const index = text.toLowerCase().indexOf(term.toLowerCase())
  if (index < 0) return [{ text, match: false }]
  return [
    { text: text.slice(0, index), match: false },
    { text: text.slice(index, index + term.length), match: true },
    { text: text.slice(index + term.length), match: false },
  ].filter((part) => part.text)
}

async function runSearch(term: string) {
  const value = term.trim()
  if (!value) {
    groups.value = []
    total.value = 0
    pending.value = false
    error.value = ''
    return
  }

  controller?.abort()
  controller = new AbortController()
  pending.value = true
  error.value = ''

  try {
    const response = await $fetch<any>('/api/search', {
      query: { q: value, limit: 6 },
      signal: controller.signal,
    })
    const groupOrder: SearchType[] = ['tool', 'article', 'project', 'download']
    groups.value = groupOrder
      .map((type) => ({
        type,
        label: typeLabels[type],
        items: response?.groups?.[type] || [],
      }))
      .filter((group) => group.items.length > 0)
    total.value = response?.total || 0
    activeIndex.value = 0
  } catch (err: any) {
    if (err?.name === 'AbortError') return
    error.value = navigator.onLine ? '搜索暂时不可用，请稍后重试。' : '网络不可用，请检查连接后重试。'
  } finally {
    pending.value = false
  }
}

watch(query, (term) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => runSearch(term), 160)
})

watch(isOpen, async (open) => {
  if (!open) {
    controller?.abort()
    return
  }
  loadRecentSearches()
  query.value = ''
  groups.value = []
  total.value = 0
  activeIndex.value = 0
  await nextTick()
  inputRef.value?.focus()
})

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (flatResults.value.length) activeIndex.value = (activeIndex.value + 1) % flatResults.value.length
    return
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault()
    if (flatResults.value.length) activeIndex.value = (activeIndex.value - 1 + flatResults.value.length) % flatResults.value.length
    return
  }
  if (event.key === 'Enter') {
    event.preventDefault()
    const selected = flatResults.value[activeIndex.value]
    if (selected) select(selected)
    else if (query.value.trim()) {
      rememberSearch(query.value.trim())
      go(`/search?q=${encodeURIComponent(query.value.trim())}`)
    }
    return
  }
  if (event.key === 'Escape') close()
}

function select(item: SearchItem) {
  addRecent({
    type: item.type,
    id: item.id,
    title: item.title,
    route: item.route,
    meta: item.category,
  })
  rememberSearch(query.value.trim() || item.title)
  go(item.route)
}

function go(path: string) {
  close()
  router.push(path)
}

onMounted(() => {
  loadRecentSearches()
})

onBeforeUnmount(() => {
  controller?.abort()
  if (timer) clearTimeout(timer)
})
</script>
