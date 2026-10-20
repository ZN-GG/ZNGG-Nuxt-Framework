<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <div v-if="pending" class="bg-white p-6 rounded-md mt-4 animate-pulse">
            <div class="h-8 w-6/12 rounded bg-gray-100"></div>
            <div class="mt-4 h-4 w-full rounded bg-gray-100"></div>
            <div class="mt-6 h-64 w-full rounded bg-gray-100"></div>
        </div>

        <template v-else-if="item">
            <PageBreadcrumb :items="[{ label: '项目', to: '/project' }, { label: item.name }]" class="mb-2" />

            <div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-12">
                <div class="lg:col-span-8">
                    <div class="rounded-md border border-gray-100 bg-white p-6">
                        <div class="flex flex-col gap-4 sm:flex-row sm:items-start">
                            <img v-if="item.logo" :src="item.logo" :alt="item.name"
                                class="h-16 w-16 shrink-0 rounded object-cover" />
                            <div v-else
                                class="flex h-16 w-16 shrink-0 items-center justify-center rounded bg-blue-50 text-2xl font-bold text-blue-600">
                                {{ (item.name || '?').slice(0, 1) }}
                            </div>

                            <div class="min-w-0 flex-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <h1 class="text-xl font-semibold text-gray-800 lg:text-2xl">{{ item.name }}</h1>
                                    <span v-if="platformLabel"
                                        class="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">
                                        {{ platformLabel }}
                                    </span>
                                </div>
                                <p v-if="item.summary" class="mt-3 text-sm leading-6 text-gray-600">{{ item.summary }}</p>

                                <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                                    <span v-if="item.language">语言：{{ item.language }}</span>
                                    <span v-if="item.stars" class="flex items-center gap-1">
                                        <svg class="h-3 w-3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path
                                                d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.4l6.1-.9L12 3Z" />
                                        </svg>
                                        {{ item.stars }}
                                    </span>
                                    <span v-if="item.forks">Fork {{ item.forks }}</span>
                                    <span v-if="item.license">{{ item.license }}</span>
                                    <span v-if="item.category?.name">{{ item.category.name }}</span>
                                </div>

                                <div v-if="tags.length" class="mt-3 flex flex-wrap gap-1.5">
                                    <span v-for="tag in tags" :key="tag"
                                        class="rounded bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500">{{ tag }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="mt-5 flex flex-wrap gap-2">
                            <a v-if="item.repoUrl" :href="item.repoUrl" target="_blank" rel="noopener noreferrer"
                                class="btn-normal inline-flex items-center gap-1.5">
                                访问仓库
                                <svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    stroke-width="2" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7M7 7h10v10" />
                                </svg>
                            </a>
                            <a v-if="item.homepageUrl" :href="item.homepageUrl" target="_blank"
                                rel="noopener noreferrer"
                                class="rounded bg-gray-100 px-5 py-2 text-sm text-gray-700 transition-colors hover:bg-blue-600 hover:text-white">
                                项目主页
                            </a>
                        </div>
                    </div>

                    <div class="bg-white p-6 rounded-md mt-4">
                        <div class="mb-3 flex items-center gap-2.5">
                            <span class="h-5 w-1 rounded-full bg-blue-600"></span>
                            <p class="text-lg font-semibold">项目介绍</p>
                        </div>
                        <div class="max-w-3xl">
                            <MarkdownContent v-if="item.content" :content="item.content" />
                            <p v-else class="text-sm text-gray-400">暂无详细介绍</p>
                        </div>
                    </div>

                    <div v-if="related.length" class="bg-white p-6 rounded-md mt-4">
                        <div class="mb-3 flex items-center gap-2.5">
                            <span class="h-5 w-1 rounded-full bg-blue-600"></span>
                            <p class="text-lg font-semibold">同类项目</p>
                        </div>
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <ProjectCard v-for="projectItem in related" :key="projectItem.id" :project="projectItem" />
                        </div>
                    </div>
                </div>

                <aside class="lg:col-span-4">
                    <div class="rounded-md bg-white p-5">
                        <div class="flex items-center gap-2.5">
                            <span class="h-5 w-1 rounded-full bg-blue-600"></span>
                            <p class="text-lg font-semibold">项目信息</p>
                        </div>
                        <dl class="mt-3 text-sm">
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">平台</dt>
                                <dd class="text-right font-medium text-gray-700">{{ platformLabel || '-' }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">语言</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.language || '-' }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">Stars</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.stars ?? 0 }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">Forks</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.forks ?? 0 }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 border-b border-gray-100 py-2">
                                <dt class="text-gray-500">License</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.license || '-' }}</dd>
                            </div>
                            <div class="flex items-start justify-between gap-4 py-2">
                                <dt class="text-gray-500">分类</dt>
                                <dd class="text-right font-medium text-gray-700">{{ item.category?.name || '-' }}</dd>
                            </div>
                        </dl>
                    </div>

                    <div v-if="hotList.length" class="mt-4 rounded-md bg-white p-5">
                        <div class="flex items-center gap-2.5">
                            <span class="h-5 w-1 rounded-full bg-orange-500"></span>
                            <p class="text-lg font-semibold">热门项目</p>
                        </div>
                        <ul class="mt-3 divide-y divide-gray-100">
                            <li v-for="(hotItem, index) in hotList" :key="hotItem.id"
                                class="py-2.5 first:pt-0 last:pb-0">
                                <NuxtLink :to="'/project/' + hotItem.id" class="group flex items-center gap-2">
                                    <span
                                        class="flex h-5 w-5 shrink-0 items-center justify-center rounded text-[11px] font-medium"
                                        :class="index < 3 ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'">
                                        {{ index + 1 }}
                                    </span>
                                    <img v-if="hotItem.logo" :src="hotItem.logo" :alt="hotItem.name" loading="lazy"
                                        class="h-8 w-8 shrink-0 rounded object-cover" />
                                    <div v-else
                                        class="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-blue-50 text-xs font-semibold text-blue-600">
                                        {{ (hotItem.name || '?').slice(0, 1) }}
                                    </div>
                                    <span class="min-w-0 flex-1">
                                        <span
                                            class="line-clamp-1 text-xs text-gray-700 transition-colors group-hover:text-blue-600">
                                            {{ hotItem.name }}
                                        </span>
                                        <span class="mt-0.5 block text-[10px] text-gray-400">
                                            {{ hotItem.stars ?? 0 }} stars
                                        </span>
                                    </span>
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-4 rounded-md bg-white p-5">
                        <div class="flex items-center gap-2.5">
                            <span class="h-5 w-1 rounded-full bg-emerald-500"></span>
                            <p class="text-lg font-semibold">项目说明</p>
                        </div>
                        <ul class="mt-3 space-y-2 text-xs leading-5 text-gray-500">
                            <li class="flex gap-2">
                                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                                项目信息来自 GitHub、Gitee，仅供学习参考。
                            </li>
                            <li class="flex gap-2">
                                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                                仓库地址以项目作者页面为准。
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </template>

        <div v-else class="bg-white p-12 rounded-md mt-4 text-center">
            <p class="text-sm text-gray-400">没有找到该项目</p>
            <NuxtLink to="/project" class="mt-3 inline-block text-sm text-blue-600">返回项目列表</NuxtLink>
        </div>
    </div>
</template>
<script setup lang="ts">
import { api } from '~/api/api'
import { splitTags } from '~/utils/tags'

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const id = String(route.params.id)

const { data: detailData, pending } = await useAsyncData('project_Detail_' + id, () => api.project.getDetail(id))
const item = computed(() => detailData.value?.success ? detailData.value.data : null)

if (detailData.value?.success === false && (detailData.value.status === 404 || detailData.value.code === 404)) {
  throw createError({ statusCode: 404, statusMessage: '项目不存在', fatal: true })
}
const tags = computed(() => splitTags(item.value?.tags))

const platformLabel = computed(() => {
    const map: Record<string, string> = {
        GITHUB: 'GitHub',
        GITEE: 'Gitee',
        OTHER: '其他',
    }
    return item.value ? (map[item.value.platform] ?? item.value.platform ?? '') : ''
})

const { data: relatedData } = await useAsyncData('project_Related_' + id, () => {
    const categoryId = detailData.value?.data?.categoryId
    if (!categoryId) {
        return Promise.resolve({ success: false, code: 0, message: '', data: { content: [] } } as ApiResponse)
    }
    return api.project.getList(1, 7, { categoryId })
})

const { data: hotData } = await useAsyncData('project_Hot_' + id, () => api.project.getList(1, 6, {}))

const related = computed(() =>
    (relatedData.value?.data?.content ?? []).filter((projectItem: any) => projectItem.id !== id).slice(0, 4)
)

const hotList = computed(() =>
    (hotData.value?.data?.content ?? [])
        .filter((hotItem: any) => hotItem.id !== id)
        .sort((a: any, b: any) => (b.stars ?? 0) - (a.stars ?? 0))
        .slice(0, 5)
)

usePageSeo(() => ({
    title: item.value ? `${item.value.name} - 开源项目推荐 - ZNGG在线工具` : '项目不存在 - ZNGG在线工具',
    description: item.value?.summary || '开源项目推荐详情',
    keywords: item.value ? [item.value.name, item.value.language, '开源项目'].filter(Boolean).join(',') : '开源项目',
    path: '/project/' + id,
    image: item.value?.logo || undefined,
    jsonLd: item.value ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareSourceCode',
        name: item.value.name,
        description: item.value.summary,
        codeRepository: item.value.repoUrl,
        programmingLanguage: item.value.language,
        license: item.value.license,
        url: 'https://www.zngg.net/project/' + id,
    } : undefined,
}))
</script>
