<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <div v-if="pending" class="bg-white p-6 rounded-md mt-4 animate-pulse">
            <div class="h-8 w-6/12 rounded bg-gray-100"></div>
            <div class="mt-4 h-4 w-full rounded bg-gray-100"></div>
            <div class="mt-6 h-64 w-full rounded bg-gray-100"></div>
        </div>

        <template v-else-if="item">
            <PageBreadcrumb :items="[{ label: '下载', to: '/download' }, { label: item.title }]" class="mb-2" />

            <div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div class="lg:col-span-8">
                    <div class="overflow-hidden rounded-md border border-gray-100 bg-white">
                        <div class="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
                            <div class="relative aspect-[16/9] overflow-hidden bg-gray-100 lg:aspect-auto lg:min-h-[280px]">
                                <template v-if="item.cover">
                                    <img :src="item.cover" alt="" aria-hidden="true"
                                        class="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-2xl" />
                                    <div v-if="coverColor" class="absolute inset-0"
                                        :style="{ backgroundColor: coverColor, opacity: 0.3 }"></div>
                                    <img :src="item.cover" :alt="item.title"
                                        class="relative z-10 h-full w-full object-contain p-2" />
                                </template>
                                <div v-else class="flex h-full w-full items-center justify-center text-gray-300">
                                    <svg class="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="1.5" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
                                    </svg>
                                </div>
                                <span
                                    class="absolute left-3 top-3 z-20 rounded-sm bg-blue-600 px-2 py-0.5 text-[11px] font-medium text-white">
                                    {{ item.type === 'SOFTWARE' ? '软件' : '资源' }}
                                </span>
                                <span v-if="item.version"
                                    class="absolute right-3 top-3 z-20 rounded-sm bg-gray-900/70 px-2 py-0.5 text-[11px] text-white">
                                    v{{ item.version }}
                                </span>
                            </div>

                            <div class="flex min-w-0 flex-col justify-between gap-5 p-5 sm:p-6">
                                <div class="min-w-0">
                                    <h1 class="text-xl font-semibold leading-snug text-gray-800 lg:text-2xl">
                                        {{ item.title }}
                                    </h1>

                                    <p v-if="item.summary"
                                        class="mt-2.5 line-clamp-4 text-sm leading-6 text-gray-600">{{ item.summary }}</p>

                                    <div v-if="item.category?.name || tags.length"
                                        class="mt-3 flex flex-wrap items-center gap-1.5">
                                        <NuxtLink v-if="item.category?.name"
                                            :to="'/download?categoryId=' + item.categoryId"
                                            class="rounded-sm bg-blue-50 px-2 py-0.5 text-[11px] leading-5 text-blue-600 transition-colors hover:bg-blue-100">
                                            {{ item.category.name }}
                                        </NuxtLink>
                                        <span v-for="tag in tags" :key="tag"
                                            class="rounded-sm bg-gray-100 px-2 py-0.5 text-[11px] leading-5 text-gray-500">#{{ tag }}</span>
                                    </div>

                                    <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-500">
                                        <span v-if="sizeLabel" class="flex items-center gap-1.5">
                                            <HardDrive class="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
                                            {{ sizeLabel }}
                                        </span>
                                        <span v-if="item.platform" class="flex items-center gap-1.5">
                                            <Monitor class="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
                                            {{ item.platform }}
                                        </span>
                                        <span class="flex items-center gap-1.5">
                                            <Download class="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
                                            {{ item.downloadCount ?? 0 }} 次下载
                                        </span>
                                        <span v-if="displayDate" class="flex items-center gap-1.5">
                                            <CalendarDays class="h-3.5 w-3.5 shrink-0 text-gray-400" aria-hidden="true" />
                                            {{ displayDate }}
                                        </span>
                                    </div>
                                </div>

                                <div class="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
                                    <a :href="fileHref" target="_blank" rel="noopener noreferrer"
                                        class="btn-normal inline-flex h-9 shrink-0 items-center gap-2 px-5">
                                        立即下载
                                        <i class="iconfont icon-falling text-[14px]" aria-hidden="true"></i>
                                    </a>
                                    <span class="flex items-center gap-1 text-xs text-gray-400">
                                        <ExternalLink class="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                        {{ item.storageType === 'EXTERNAL' ? '外链资源' : '本地文件' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="gallery.length" class="bg-white p-6 rounded-md mt-4">
                        <div class="mb-3 border-l-4 border-blue-600 pl-2">
                            <p class="text-lg font-semibold">界面预览</p>
                        </div>
                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <a v-for="(shot, index) in gallery" :key="shot" :href="shot" target="_blank"
                                rel="noopener noreferrer"
                                class="overflow-hidden rounded border border-gray-100 bg-gray-50">
                                <img :src="shot" :alt="item.title + ' 截图 ' + (index + 1)" loading="lazy"
                                    class="aspect-[16/10] w-full object-cover object-top transition-transform duration-300 hover:scale-[1.03]" />
                            </a>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-md mt-4">
                        <div class="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <span class="-ml-3 h-4 w-1 shrink-0 rounded-full bg-blue-600"></span>
                            <p class="text-lg font-semibold text-gray-800">资源介绍</p>
                        </div>
                        <MarkdownContent v-if="item.content" :content="item.content"
                            class="prose-p:my-2.5 prose-p:leading-7 prose-p:text-gray-600 prose-headings:text-gray-800 prose-h2:mb-2 prose-h2:mt-5 prose-h2:text-[15px] prose-h2:font-semibold prose-ul:my-3 prose-ol:my-3 prose-li:my-1 prose-li:leading-7 prose-li:text-gray-600 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:font-semibold prose-strong:text-gray-800 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[13px] prose-code:font-normal prose-code:text-gray-700 prose-code:before:content-none prose-code:after:content-none prose-pre:my-4 prose-blockquote:my-4 prose-img:my-4" />
                        <p v-else class="text-sm text-gray-400">暂无详细说明</p>
                    </div>

                    <div v-if="related.length" class="bg-white p-6 rounded-md mt-4">
                        <div class="mb-3 border-l-4 border-blue-600 pl-2">
                            <p class="text-lg font-semibold">相关下载</p>
                        </div>
                        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <DownloadListItem v-for="downloadItem in related" :key="downloadItem.id"
                                :item="downloadItem" />
                        </ul>
                    </div>
                </div>

                <aside class="lg:col-span-4">
                    <div class="rounded-md bg-white p-5">
                        <div class="border-l-4 border-blue-600 pl-2">
                            <p class="text-lg font-semibold">下载信息</p>
                        </div>

                        <dl class="mt-3 text-sm">
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">版本</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.version || '-' }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">平台</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.platform || '-' }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">大小</dt>
                                <dd class="text-right font-medium text-gray-700">{{ sizeLabel || '-' }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">类型</dt>
                                <dd class="text-right font-medium text-gray-700">
                                    {{ item.type === 'SOFTWARE' ? '软件' : '资源' }}
                                </dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">下载次数</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.downloadCount ?? 0 }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 py-2">
                                <dt class="text-gray-500">更新时间</dt>
                                <dd class="text-right font-medium text-gray-700">{{ displayDate || '-' }}</dd>
                            </div>
                        </dl>

                    </div>

                    <div v-if="hotList.length" class="mt-4 rounded-md bg-white p-5">
                        <div class="border-l-4 border-blue-600 pl-2">
                            <p class="text-lg font-semibold">热门下载</p>
                        </div>
                        <ul v-if="hotList.length" class="mt-3 divide-y divide-gray-100">
                            <li v-for="(hotItem, index) in hotList" :key="hotItem.id"
                                class="py-2.5 first:pt-0 last:pb-0">
                                <NuxtLink :to="'/download/' + hotItem.id" class="group flex items-start gap-2">
                                    <span
                                        class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-medium"
                                        :class="index < 3 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'">
                                        {{ index + 1 }}
                                    </span>
                                    <img v-if="hotItem.cover" :src="hotItem.cover" :alt="hotItem.title" loading="lazy"
                                        class="h-10 w-14 shrink-0 rounded object-cover object-top" />
                                    <span class="min-w-0 flex-1">
                                        <span
                                            class="line-clamp-2 text-xs leading-5 text-gray-700 transition-colors group-hover:text-blue-600">
                                            {{ hotItem.title }}
                                        </span>
                                        <span class="mt-0.5 block text-[10px] text-gray-400">
                                            {{ hotItem.downloadCount ?? 0 }} 次下载
                                        </span>
                                    </span>
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-4 rounded-md bg-white p-5">
                        <div class="border-l-4 border-blue-600 pl-2">
                            <p class="text-lg font-semibold">下载须知</p>
                        </div>
                        <ul class="mt-3 space-y-2 text-xs leading-5 text-gray-500">
                            <li class="flex gap-2">
                                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                                外链资源跳转官方页面，版本更新更及时。
                            </li>
                            <li class="flex gap-2">
                                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                                本地文件由本站直接提供，不额外跳转。
                            </li>
                            <li class="flex gap-2">
                                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                                下载前请确认来源可信，注意文件安全。
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </template>

        <div v-else class="bg-white p-12 rounded-md mt-4 text-center">
            <p class="text-sm text-gray-400">没有找到该资源</p>
            <NuxtLink to="/download" class="mt-3 inline-block text-sm text-blue-600">返回下载列表</NuxtLink>
        </div>
    </div>
</template>
<script setup lang="ts">
import { CalendarDays, Download, ExternalLink, HardDrive, Monitor } from '@lucide/vue'
import { api } from '~/api/api'
import { extractDominantColor } from '~/utils/color'
import { splitTags, splitUrls } from '~/utils/tags'

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const id = String(route.params.id)

const { data: detailData, pending } = await useAsyncData('download_Detail_' + id, () => api.download.getDetail(id))
const item = computed(() => detailData.value?.success ? detailData.value.data : null)

if (detailData.value?.success === false && (detailData.value.status === 404 || detailData.value.code === 404)) {
  throw createError({ statusCode: 404, statusMessage: '资源不存在', fatal: true })
}

const tags = computed(() => splitTags(item.value?.tags))
const screenshots = computed(() => splitUrls(item.value?.screenshots))
const gallery = computed(() => screenshots.value.filter(url => url !== item.value?.cover))

const coverColor = ref('')

watch(
    () => item.value?.cover,
    async (cover) => {
        coverColor.value = ''
        if (!cover || !import.meta.client) return
        const color = await extractDominantColor(cover)
        if (item.value?.cover === cover) {
            coverColor.value = color
        }
    },
    { immediate: true }
)

const fileHref = computed(() => {
    if (!item.value) return '#'
    return item.value.storageType === 'EXTERNAL'
        ? item.value.fileUrl
        : api.download.getFileUrl(item.value.id)
})

const sizeLabel = computed(() => formatSize(Number(item.value?.fileSize)))

const displayDate = computed(() =>
    item.value?.updateTime ? String(item.value.updateTime).slice(0, 10) : ''
)

const siteUrl = 'https://www.zngg.net'

function absoluteImage(url?: string) {
    if (!url) return undefined
    if (/^https?:\/\//.test(url)) return url
    return siteUrl + (url.startsWith('/') ? url : '/' + url)
}

const { data: relatedData } = await useAsyncData('download_Related_' + id, () => {
    const categoryId = detailData.value?.data?.categoryId
    if (!categoryId) {
        return Promise.resolve({ success: false, code: 0, message: '', data: { content: [] } } as ApiResponse)
    }
    return api.download.getList(1, 5, { categoryId })
})

const { data: hotData } = await useAsyncData('download_Hot_' + id, () => api.download.getList(1, 5, {}))

const related = computed(() =>
    (relatedData.value?.data?.content ?? []).filter((downloadItem: any) => downloadItem.id !== id).slice(0, 4)
)

const hotList = computed(() =>
    (hotData.value?.data?.content ?? []).filter((hotItem: any) => hotItem.id !== id).slice(0, 5)
)

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

usePageSeo(() => {
    const images = screenshots.value.map(absoluteImage).filter(Boolean) as string[]
    return {
        title: item.value ? `${item.value.title} 下载 - ZNGG在线工具` : '资源不存在 - ZNGG在线工具',
        description: item.value?.summary || '软件与资源下载详情',
        keywords: item.value ? [item.value.title, item.value.platform, '下载'].filter(Boolean).join(',') : '下载',
        path: '/download/' + id,
        image: absoluteImage(item.value?.cover || screenshots.value[0]),
        jsonLd: item.value ? {
            '@context': 'https://schema.org',
            '@type': item.value.type === 'SOFTWARE' ? 'SoftwareApplication' : 'CreativeWork',
            name: item.value.title,
            description: item.value.summary,
            image: images.length ? images : (item.value.cover ? [absoluteImage(item.value.cover)] : undefined),
            applicationCategory: item.value.type === 'SOFTWARE' ? 'UtilitiesApplication' : undefined,
            operatingSystem: item.value.platform,
            softwareVersion: item.value.version,
            fileSize: item.value.fileSize ? item.value.fileSize + ' B' : undefined,
            downloadUrl: fileHref.value,
            url: 'https://www.zngg.net/download/' + id,
        } : undefined,
    }
})
</script>
