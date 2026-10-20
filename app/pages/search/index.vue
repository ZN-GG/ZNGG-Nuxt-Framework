<template>
  <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
    <div class="bg-white p-6 rounded-md mt-8 mb-4">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">
            <template v-if="q">“{{ q }}”</template>
            <template v-else>站内搜索</template>
          </h1>
          <p class="mt-1 text-sm text-gray-500">搜索工具、文章、项目或下载资源。</p>
        </div>
        <span v-if="q" class="text-sm text-gray-400">共 {{ total }} 条结果</span>
      </div>

      <form class="mt-4 flex max-w-2xl items-center gap-2" @submit.prevent="submit">
        <label class="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-sm border border-gray-200 bg-white px-3">
          <Search class="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
          <input
            v-model="input"
            type="search"
            class="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none"
            placeholder="搜索工具、文章、项目或下载"
            aria-label="搜索内容"
          />
        </label>
        <button type="submit" class="h-9 rounded-sm bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700">
          搜索
        </button>
      </form>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="rounded-full border px-4 py-1.5 text-sm transition-colors duration-200"
          :class="type === tab.value
            ? 'border-blue-600 bg-blue-600 font-medium text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600'"
          @click="selectType(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <div v-if="!q" class="bg-white p-10 rounded-md text-center">
      <p class="text-sm text-gray-700">输入关键词开始搜索</p>
      <p class="mt-1 text-xs text-gray-400">可以搜工具名、文章标题、项目名或资源名。</p>
      <div class="mt-4 flex flex-wrap justify-center gap-2">
        <button v-for="term in suggestions" :key="term" type="button"
          class="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600"
          @click="useTerm(term)">
          {{ term }}
        </button>
      </div>
    </div>

    <div v-else-if="pending" class="mt-4 divide-y divide-line" aria-hidden="true">
      <div v-for="i in 5" :key="i" class="flex gap-3 py-4">
        <div class="h-8 w-8 animate-pulse rounded-control bg-surface-muted" />
        <div class="flex-1 space-y-2">
          <div class="h-4 w-6/12 animate-pulse rounded bg-surface-muted" />
          <div class="h-3 w-10/12 animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
    </div>

    <UiErrorState v-else-if="error" description="搜索服务暂时不可用，请稍后重试。" @retry="refresh" />

    <UiEmptyState
      v-else-if="total === 0"
      title="没有找到相关内容"
      description="换个关键词，或者浏览全部工具。"
      :icon="Search"
    >
      <NuxtLink to="/tool" class="rounded-control bg-accent px-3 py-2 text-xs font-medium text-white hover:bg-accent-strong">
        浏览全部工具
      </NuxtLink>
    </UiEmptyState>

    <div v-else class="mt-4 space-y-8 bg-white p-6 rounded-md">
      <section v-for="group in visibleGroups" :key="group.type">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold text-muted">{{ group.label }}</h2>
          <NuxtLink :to="groupIndexRoute(group.type)" class="text-xs text-muted hover:text-accent-strong">查看全部</NuxtLink>
        </div>
        <div class="mt-2 divide-y divide-line">
          <NuxtLink
            v-for="item in group.items"
            :key="`${item.type}-${item.id}`"
            :to="item.route"
            class="group -mx-2 flex items-start gap-3 rounded-sm px-2 py-3 transition-colors hover:bg-gray-50/80"
          >
            <span class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-muted text-muted">
              <component :is="typeIcon(item.type)" class="h-4 w-4" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-medium text-ink transition-colors group-hover:text-accent-strong">
                <template v-for="(part, index) in highlight(item.title, q)" :key="index">
                  <span :class="part.match ? 'rounded bg-accent/20 text-ink' : ''">{{ part.text }}</span>
                </template>
              </span>
              <span v-if="item.summary" class="mt-0.5 block line-clamp-1 text-xs text-muted">{{ item.summary }}</span>
              <span class="mt-1 block text-[11px] text-muted">{{ item.category }}</span>
            </span>
            <ArrowRight class="mt-1 h-3.5 w-3.5 shrink-0 text-muted transition-colors group-hover:text-accent-strong" aria-hidden="true" />
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ArrowRight, BookOpen, Download, FileText, FolderGit2, Search, Wrench } from '@lucide/vue'

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

const route = useRoute()
const router = useRouter()

const q = computed(() => String(route.query.q || '').trim())
const type = computed(() => String(route.query.type || '') as SearchType | '')
const input = ref(q.value)

const tabs = [
  { label: '全部', value: '' },
  { label: '工具', value: 'tool' },
  { label: '文章', value: 'article' },
  { label: '项目', value: 'project' },
  { label: '下载', value: 'download' },
]

const typeLabels: Record<SearchType, string> = {
  tool: '工具',
  article: '文章',
  project: '项目',
  download: '下载',
}

const typeIcons = {
  tool: Wrench,
  article: FileText,
  project: FolderGit2,
  download: Download,
}

const suggestions = ['时间戳', 'Base64', 'Word', 'DBX', 'Android']

const { data, pending, error, refresh } = await useAsyncData(
  () => `search_${q.value}_${type.value}`,
  () => {
    if (!q.value) return Promise.resolve(null)
    return $fetch<any>('/api/search', { query: { q: q.value, type: type.value || undefined, limit: 30 } })
  },
  { watch: [q, type] },
)

const total = computed(() => data.value?.total ?? 0)
const groups = computed<SearchGroup[]>(() => {
  const source = data.value?.groups || {}
  return (['tool', 'article', 'project', 'download'] as SearchType[])
    .map((key) => ({
      type: key,
      label: typeLabels[key],
      items: source[key] || [],
    }))
    .filter((group) => group.items.length > 0)
})
const visibleGroups = computed(() => type.value ? groups.value.filter((group) => group.type === type.value) : groups.value)

const typeIcon = (value: SearchType) => typeIcons[value]

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

function submit() {
  const value = input.value.trim()
  router.push({ query: value ? { q: value } : {} })
}

function useTerm(term: string) {
  input.value = term
  router.push({ query: { q: term } })
}

function selectType(value: string) {
  router.push({ query: { ...(q.value ? { q: q.value } : {}), ...(value ? { type: value } : {}) } })
}

function groupIndexRoute(groupType: SearchType) {
  const map: Record<SearchType, string> = {
    tool: '/tool',
    article: '/read',
    project: '/project',
    download: '/download',
  }
  return map[groupType]
}

watch(q, (value) => { input.value = value })
watch(() => route.query.type, () => { /* keep the query-driven state reactive */ })

useHead({
  title: q.value ? `搜索：${q.value} - ZNGG在线工具` : '搜索 - ZNGG在线工具',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
