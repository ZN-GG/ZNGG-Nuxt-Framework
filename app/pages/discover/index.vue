<template>
  <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
    <div class="bg-white p-6 rounded-md mt-8 mb-4">
      <div class="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 class="text-2xl font-semibold text-gray-800">网址导航</h1>
          <p class="mt-1 text-sm text-gray-500">整理常用网站、开发资源与朋友站点，按分类浏览或直接搜索。</p>
        </div>
        <span class="text-sm text-gray-400">{{ filteredCount }} 个</span>
      </div>

      <label class="mt-4 flex h-9 max-w-xl items-center gap-2 rounded-sm border border-gray-200 bg-white px-3">
        <Search class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <input v-model="searchTerm" type="search" class="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none" placeholder="筛选网站或链接" aria-label="筛选网站或链接" />
      </label>

      <div class="mt-4 flex items-center gap-1.5">
        <button v-for="item in tabs" :key="item.value" type="button" class="btn-1" :class="tab === item.value ? 'bg-blue-600 text-white' : ''" @click="switchTab(item.value)">
          {{ item.label }}
        </button>
      </div>
    </div>

    <div v-if="activePending" class="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2" aria-hidden="true">
      <div v-for="i in 6" :key="i" class="flex gap-3 py-3">
        <div class="h-8 w-8 animate-pulse rounded-control bg-surface-muted" />
        <div class="flex-1 space-y-2">
          <div class="h-4 w-5/12 animate-pulse rounded bg-surface-muted" />
          <div class="h-3 w-9/12 animate-pulse rounded bg-surface-muted" />
        </div>
      </div>
    </div>

    <UiErrorState v-else-if="activeError" description="发现内容加载失败，请稍后重试。" @retry="refresh" />

    <template v-else-if="tab === 'nav'">
      <div v-if="filteredNav.length" class="mt-4 space-y-8 bg-white p-6 rounded-md">
        <section v-for="group in filteredNav" :key="group.name">
          <div class="flex items-center justify-between border-b border-line pb-2">
            <h2 class="text-sm font-semibold text-ink">{{ group.name }}</h2>
            <span class="text-[11px] text-muted">{{ group.itemList.length }} 个</span>
          </div>
          <div class="mt-1 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
            <a v-for="item in group.itemList" :key="item.url + item.title" :href="item.url" target="_blank" rel="noopener noreferrer" class="group flex items-start gap-3 rounded-control px-2 py-3 transition-colors hover:bg-surface-muted">
              <span class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-control bg-surface-muted text-[11px] font-semibold text-ink">
                <img v-if="item.img" :src="item.img" :alt="item.title" loading="lazy" class="h-full w-full object-cover" />
                <template v-else>{{ initialOf(item.title) }}</template>
              </span>
              <span class="min-w-0 flex-1">
                <span class="block truncate text-sm font-medium text-ink transition-colors group-hover:text-accent-strong">{{ item.title }}</span>
                <span class="mt-0.5 block line-clamp-1 text-xs text-muted">{{ item.description || item.url }}</span>
              </span>
              <ExternalLink class="mt-1 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
            </a>
          </div>
        </section>
      </div>
      <UiEmptyState v-else title="没有找到网站" description="换个关键词试试。" :icon="Inbox" />
    </template>

    <template v-else>
      <div v-if="filteredLinks.length" class="mt-4 divide-y divide-line bg-white px-6 rounded-md">
        <a v-for="item in filteredLinks" :key="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" class="group flex items-start gap-3 px-2 py-3 transition-colors hover:bg-surface-muted">
          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-control bg-surface-muted text-[11px] font-semibold text-ink">{{ initialOf(item.name) }}</span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-medium text-ink transition-colors group-hover:text-accent-strong">{{ item.name }}</span>
            <span class="mt-0.5 block line-clamp-1 text-xs text-muted">{{ item.description || item.url }}</span>
          </span>
          <ExternalLink class="mt-1 h-3.5 w-3.5 shrink-0 text-muted" aria-hidden="true" />
        </a>
      </div>
      <UiEmptyState v-else title="没有找到链接" description="换个关键词试试。" :icon="Inbox" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ExternalLink, Inbox, Search } from '@lucide/vue'
import { api } from '~/api/api'

const route = useRoute()
const router = useRouter()

const tab = ref(route.query.tab === 'links' ? 'links' : 'nav')
const searchTerm = ref('')

const tabs = [
  { label: '网址导航', value: 'nav' },
  { label: '友情链接', value: 'links' },
]

const { data: navData, pending: navPending, error: navError, refresh: refreshNav } = await useAsyncData('discover_Nav', () => api.web.getNavInfo())
const { data: linkData, pending: linkPending, error: linkError, refresh: refreshLinks } = await useAsyncData('discover_Links', () => api.web.getFriendLinks())

const navGroups = computed<any[]>(() => navData.value?.data ?? [])
const links = computed<any[]>(() => linkData.value?.data ?? [])

const filteredNav = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return navGroups.value
  return navGroups.value
    .map((group) => ({
      ...group,
      itemList: (group.itemList || []).filter((item: any) =>
        [item.title, item.description, item.url, group.name].filter(Boolean).join(' ').toLowerCase().includes(term)
      ),
    }))
    .filter((group) => group.itemList.length > 0)
})

const filteredLinks = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return links.value
  return links.value.filter((item) =>
    [item.name, item.description, item.url].filter(Boolean).join(' ').toLowerCase().includes(term)
  )
})

const filteredCount = computed(() => tab.value === 'nav'
  ? filteredNav.value.reduce((sum, group) => sum + group.itemList.length, 0)
  : filteredLinks.value.length
)

const activePending = computed(() => tab.value === 'nav' ? navPending.value : linkPending.value)
const activeError = computed(() => tab.value === 'nav' ? navError.value : linkError.value)

watch(() => route.query.tab, (value) => {
  tab.value = value === 'links' ? 'links' : 'nav'
})

function switchTab(value: string) {
  tab.value = value
  router.push({ query: value === 'links' ? { tab: 'links' } : {} })
}

async function refresh() {
  if (tab.value === 'nav') await refreshNav()
  else await refreshLinks()
}

const initialOf = (value: string) => String(value || '?').slice(0, 1)

usePageSeo({
  title: '网址导航与友情链接 - ZNGG在线工具',
  description: '整理常用网站、开发资源与朋友站点，按分类浏览或搜索。',
  keywords: '网址导航,常用网站,开发资源,友情链接',
  path: '/discover',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '网址导航与友情链接',
    description: '常用网站与友情链接',
    url: 'https://www.zngg.net/discover',
  },
})
</script>
