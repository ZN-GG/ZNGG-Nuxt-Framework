<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div class="lg:col-span-9">
                <div class="bg-white p-6 rounded-md">
                    <div>
                        <h1 class="text-2xl font-semibold text-gray-800">软件与资源下载</h1>
                        <p class="mt-1 text-sm text-gray-500">整理常用软件、开发工具与学习资源，按分类和类型筛选。</p>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-2">
                        <label class="flex h-9 w-full items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 sm:w-80">
                            <Search class="h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
                            <input v-model="keyword" type="search"
                                class="min-w-0 flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
                                placeholder="搜索资源名称或简介" aria-label="搜索资源" />
                        </label>
                        <div class="flex flex-wrap items-center gap-y-1">
                            <div class="btn-1" :class="type === '' ? 'bg-blue-600 text-white' : ''" @click="selectType('')">
                                全部类型
                            </div>
                            <div class="btn-1" :class="type === item.value ? 'bg-blue-600 text-white' : ''"
                                v-for="item in types" :key="item.value" @click="selectType(item.value)">
                                {{ item.label }}
                            </div>
                            <button v-if="hasFilters" type="button" class="btn-1" @click="clearFilters">
                                清除筛选
                            </button>
                        </div>
                    </div>

                    <div class="mt-5 border-t border-gray-100 pt-4">
                        <div class="flex items-center justify-between">
                            <div class="border-l-4 border-blue-600 pl-2">
                                <p class="font-semibold text-base text-gray-800">全部资源</p>
                            </div>
                            <span class="text-xs text-gray-400">{{ filteredList.length }} 个</span>
                        </div>

                        <div v-if="pending" class="divide-y divide-gray-100">
                            <div v-for="item in 5" :key="item" class="flex gap-4 py-4">
                                <div class="min-h-20 w-32 shrink-0 self-stretch animate-pulse rounded-sm bg-gray-100"></div>
                                <div class="flex-1 space-y-2 py-1">
                                    <div class="h-3 w-4/12 animate-pulse rounded bg-gray-100"></div>
                                    <div class="h-4 w-6/12 animate-pulse rounded bg-gray-100"></div>
                                    <div class="h-3 w-10/12 animate-pulse rounded bg-gray-100"></div>
                                </div>
                            </div>
                        </div>

                        <div v-else-if="loadError" class="py-10 text-center">
                            <p class="text-sm text-gray-600">{{ loadError }}</p>
                            <button type="button" class="btn-normal mt-4" @click="refresh()">重新加载</button>
                        </div>

                        <ul v-else-if="filteredList.length" class="mt-2 divide-y divide-gray-100">
                            <li v-for="item in filteredList" :key="item.id" class="py-1">
                                <div
                                    class="group -mx-2 rounded-sm px-2 py-3 transition-colors hover:bg-gray-50/80 sm:flex sm:gap-4">
                                    <NuxtLink :to="'/download/' + item.id" class="flex min-w-0 flex-1 gap-4">
                                        <div class="flex min-h-20 w-32 shrink-0 self-stretch items-center justify-center overflow-hidden rounded-sm border border-gray-100 bg-gray-50 transition-colors group-hover:border-blue-200">
                                            <img v-if="item.cover && !coverErrors[item.id]" :src="item.cover" :alt="item.title"
                                                loading="lazy" class="h-full w-full object-cover object-top"
                                                @error="coverErrors[item.id] = true" />
                                            <div v-else class="flex flex-col items-center gap-1 text-blue-600">
                                                <Download class="h-5 w-5" aria-hidden="true" />
                                                <span class="text-sm font-semibold">{{ initialOf(item.title) }}</span>
                                            </div>
                                        </div>
    
                                        <div class="min-w-0 flex-1">
                                            <div class="flex flex-wrap items-center gap-2 text-xs">
                                                <span class="rounded-sm bg-blue-50 px-1.5 py-0.5 text-blue-600">
                                                    {{ typeLabel(item) }}
                                                </span>
                                                <span class="text-gray-400">{{ categoryLabel(item) }}</span>
                                                <span v-if="item.version" class="text-gray-400">v{{ item.version }}</span>
                                            </div>
                                            <h3 class="mt-1 truncate font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                                                {{ item.title }}
                                            </h3>
                                            <p class="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">{{ item.summary }}</p>
                                            <div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400">
                                                <span>{{ formatSize(Number(item.fileSize)) || '-' }}</span>
                                                <span class="text-gray-300">·</span>
                                                <span v-if="item.platform">{{ item.platform }}</span>
                                                <span v-if="item.platform" class="text-gray-300">·</span>
                                                <span>{{ displayDate(item) }}</span>
                                                <span class="text-gray-300">·</span>
                                                <span>下载 {{ item.downloadCount ?? 0 }}</span>
                                            </div>
                                        </div>
                                    </NuxtLink>
    
                                    <div class="mt-3 flex items-center gap-2 sm:hidden">
                                        <a :href="fileHref(item)" target="_blank" rel="noopener noreferrer"
                                            class="inline-flex h-8 items-center gap-1 rounded-sm border border-blue-200 bg-blue-50 px-3 text-xs text-blue-600">
                                            <Download class="h-3.5 w-3.5" aria-hidden="true" />
                                            下载
                                        </a>
                                        <NuxtLink :to="'/download/' + item.id" class="text-xs text-gray-500">
                                            查看详情
                                        </NuxtLink>
                                    </div>
    
                                    <div class="hidden w-24 shrink-0 flex-col items-end justify-between py-1 sm:flex">
                                        <a :href="fileHref(item)" target="_blank" rel="noopener noreferrer"
                                            class="inline-flex h-8 items-center gap-1 rounded-sm border border-blue-200 bg-blue-50 px-3 text-xs text-blue-600 transition-colors hover:bg-blue-100">
                                            <Download class="h-3.5 w-3.5" aria-hidden="true" />
                                            下载
                                        </a>
                                        <NuxtLink :to="'/download/' + item.id"
                                            class="text-xs text-gray-400 transition-colors hover:text-blue-600">
                                            查看详情
                                        </NuxtLink>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div v-else class="py-10">
                            <p class="text-sm font-medium text-gray-700">
                                {{ hasFilters ? '没有找到符合条件的资源' : '暂无下载资源' }}
                            </p>
                            <p class="mt-1 text-sm text-gray-500">
                                {{ hasFilters ? '换个分类、类型或清除筛选看看。' : '资源正在整理中，稍后再来看看。' }}
                            </p>
                            <button v-if="hasFilters" type="button" class="btn-normal mt-4" @click="clearFilters">
                                清除筛选
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <aside class="space-y-4 lg:col-span-3">
                <div class="bg-white p-5 rounded-md">
                    <div class="border-l-4 border-blue-600 pl-2">
                        <p class="font-semibold text-sm text-gray-800">资源分类</p>
                    </div>
                    <div class="mt-3 space-y-1">
                        <button type="button"
                            class="w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
                            :class="categoryId === '' ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'"
                            @click="selectCategory('')">
                            全部资源
                        </button>
                        <button v-for="item in categories" :key="item.id" type="button"
                            class="w-full rounded-sm px-2 py-1.5 text-left text-sm transition-colors"
                            :class="categoryId === String(item.id) ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'"
                            @click="selectCategory(String(item.id))">
                            {{ item.name }}
                        </button>
                    </div>
                </div>

                <div class="bg-white p-5 rounded-md">
                    <div class="border-l-4 border-blue-600 pl-2">
                        <p class="font-semibold text-sm text-gray-800">下载说明</p>
                    </div>
                    <ul class="mt-3 list-disc space-y-2 pl-4 text-xs leading-5 text-gray-500">
                        <li>外链资源跳转官方网站，版本更新以官方为准。</li>
                        <li>本地文件由本站直接提供下载。</li>
                        <li>下载前请确认来源，注意文件安全。</li>
                    </ul>
                </div>

                <SidebarRecommend />
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Download, Search } from '@lucide/vue'
import { api } from '~/api/api'

const route = useRoute()
const router = useRouter()

const types = [
    { label: '软件', value: 'SOFTWARE' },
    { label: '资源', value: 'RESOURCE' },
]

const categoryId = ref(queryString(route.query.categoryId))
const type = ref(queryString(route.query.type))
const keyword = ref('')
const coverErrors = ref<Record<string, boolean>>({})

const { data: categoryData } = await useAsyncData('download_Categories', () => api.download.getCategories())
const categories = computed<any[]>(() => categoryData.value?.data ?? [])

const { data: firstPage, pending, error: fetchError, refresh } = await useAsyncData(
    () => `download_List_${categoryId.value}_${type.value}`,
    () => api.download.getList(1, 60, { categoryId: categoryId.value || undefined, type: type.value || undefined }),
    { watch: [categoryId, type] },
)

const list = computed<any[]>(() => firstPage.value?.data?.content ?? [])
const filteredList = computed(() => {
    const term = keyword.value.trim().toLowerCase()
    if (!term) return list.value
    return list.value.filter((item) =>
        [item.title, item.summary, categoryLabel(item), typeLabel(item)].filter(Boolean).join(' ').toLowerCase().includes(term)
    )
})
const hasFilters = computed(() => Boolean(categoryId.value || type.value || keyword.value.trim()))
const loadError = computed(() => {
    if (fetchError.value) return '网络或服务暂时不可用，请稍后重试。'
    if (firstPage.value && firstPage.value.success === false) return firstPage.value.message || '加载失败，请稍后重试。'
    return ''
})

watch(() => route.query, (query) => {
    categoryId.value = queryString(query.categoryId)
    type.value = queryString(query.type)
})

function queryString(value: unknown) {
    return typeof value === 'string' ? value : ''
}

function selectCategory(value: string) {
    categoryId.value = value
    router.push({ query: { ...(value ? { categoryId: value } : {}), ...(type.value ? { type: type.value } : {}) } })
}

function selectType(value: string) {
    type.value = value
    router.push({ query: { ...(categoryId.value ? { categoryId: categoryId.value } : {}), ...(value ? { type: value } : {}) } })
}

function clearFilters() {
    categoryId.value = ''
    type.value = ''
    keyword.value = ''
    router.push({ query: {} })
}

function fileHref(item: any) {
    if (!item) return '#'
    return item.storageType === 'EXTERNAL' ? item.fileUrl || '#' : api.download.getFileUrl(item.id)
}

function categoryLabel(item: any) {
    return item.category?.name || item.categoryName || typeLabel(item)
}

function typeLabel(item: any) {
    return item.type === 'SOFTWARE' ? '软件' : '资源'
}

function initialOf(value: string) {
    return String(value || '?').trim().slice(0, 1)
}

function displayDate(item: any) {
    return item.updateTime ? String(item.updateTime).slice(0, 10) : ''
}

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

usePageSeo({
    title: '软件与资源下载 - ZNGG在线工具',
    description: '整理常用软件、开发工具、学习资源与素材下载，支持本地文件和外链下载，持续更新。',
    keywords: '软件下载,资源下载,开发工具下载,学习资源',
    path: '/download',
})
</script>
