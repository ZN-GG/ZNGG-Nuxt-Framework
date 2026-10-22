<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <PageBreadcrumb :items="breadcrumbItems" class="mb-2" />

        <div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div class="lg:col-span-8">
                <div class="bg-white p-6 rounded-md">
                    <div class="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 class="font-semibold text-2xl">{{ category?.name || '文章分类' }}</h1>
                            <p class="mt-1 text-sm text-gray-500">{{ copy.intro }}</p>
                        </div>
                        <p class="shrink-0 whitespace-nowrap text-sm text-gray-500">共 {{ total }} 篇文章</p>
                    </div>

                    <div class="category-scroll mt-4 flex items-center gap-1 overflow-x-auto pb-1">
                        <NuxtLink to="/read" class="btn-1 mx-0">全部</NuxtLink>
                        <NuxtLink v-for="item in categories" :key="item.id" :to="'/read/category/' + item.id"
                            class="btn-1 mx-0" :class="String(item.id) === id ? 'bg-blue-600 text-white' : ''">
                            {{ item.name }}
                        </NuxtLink>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-md mt-4">
                    <ul v-if="pending" aria-hidden="true">
                        <li v-for="i in 4" :key="i" class="flex gap-4 border-b border-gray-100 py-5 last:border-b-0">
                            <div class="min-w-0 flex-1 space-y-3">
                                <div class="h-5 w-8/12 animate-pulse rounded bg-gray-100"></div>
                                <div class="h-4 w-full animate-pulse rounded bg-gray-100"></div>
                                <div class="h-3 w-5/12 animate-pulse rounded bg-gray-100"></div>
                            </div>
                        </li>
                    </ul>

                    <ul v-else-if="list.length" class="mt-1">
                        <ArticleListItem v-for="item in list" :key="item.id" :article="item" />
                    </ul>

                    <p v-else class="py-14 text-center text-sm text-gray-400">暂无文章</p>

                    <nav v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2 text-sm">
                        <NuxtLink v-if="page > 1" :to="pageTo(page - 1)" class="btn-1 mx-0">上一页</NuxtLink>
                        <span class="text-xs text-gray-400">{{ page }} / {{ totalPages }}</span>
                        <NuxtLink v-if="page < totalPages" :to="pageTo(page + 1)" class="btn-1 mx-0">下一页</NuxtLink>
                    </nav>
                </div>
            </div>

            <aside class="lg:col-span-4">
                <div class="rounded-md bg-white p-5">
                    <div class="flex items-center gap-2.5">
                        <span class="h-5 w-1 rounded-full bg-blue-600"></span>
                        <p class="text-lg font-semibold">文章分类</p>
                    </div>
                    <ul class="mt-3 space-y-1">
                        <li>
                            <NuxtLink to="/read"
                                class="flex items-center justify-between rounded px-2 py-1.5 text-sm text-gray-600 transition-colors hover:bg-gray-50">
                                全部文章
                                <span class="text-gray-300">›</span>
                            </NuxtLink>
                        </li>
                        <li v-for="item in categories" :key="item.id">
                            <NuxtLink :to="'/read/category/' + item.id"
                                class="flex items-center justify-between rounded px-2 py-1.5 text-sm transition-colors"
                                :class="String(item.id) === id ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50'">
                                {{ item.name }}
                                <span class="text-gray-300">›</span>
                            </NuxtLink>
                        </li>
                    </ul>
                </div>

                <div v-if="relatedTools.length" class="mt-4 rounded-md bg-white p-5">
                    <div class="flex items-center gap-2.5">
                        <span class="h-5 w-1 rounded-full bg-emerald-500"></span>
                        <p class="text-lg font-semibold">相关工具</p>
                    </div>
                    <div class="mt-3 flex flex-wrap gap-2">
                        <NuxtLink v-for="tool in relatedTools" :key="tool.slug" :to="'/tool/detail/' + tool.slug"
                            target="_blank"
                            class="rounded bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-blue-600 hover:text-white">
                            {{ tool.name }}
                        </NuxtLink>
                    </div>
                </div>

                <div class="mt-4 rounded-md bg-white p-5">
                    <div class="flex items-center gap-2.5">
                        <span class="h-5 w-1 rounded-full bg-orange-500"></span>
                        <p class="text-lg font-semibold">阅读说明</p>
                    </div>
                    <p class="mt-3 text-xs leading-5 text-gray-500">
                        文章按分类归档，点击分类可以查看同类内容。站内文章会持续补充和修订。
                    </p>
                </div>
            </aside>
        </div>
    </div>
</template>
<script setup lang="ts">
import { api } from '~/api/api'
import { getArticleCategoryCopy, toolNames } from '~/config/articleCategories'

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const id = String(route.params.id)
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data: categoryData } = await useAsyncData('read_CategoryInfo_' + id, () => api.article.getCategories())
const categories = computed(() => categoryData.value?.data ?? [])
const category = computed(() => categories.value.find((item: any) => String(item.id) === id) || null)
const copy = computed(() => getArticleCategoryCopy(category.value?.name))

const { data: listData, pending } = await useAsyncData(
    () => `read_Category_${id}_${page.value}`,
    () => api.article.getList(page.value, 10, id),
    { watch: [page] }
)

const list = computed(() => listData.value?.data?.content ?? [])
const total = computed(() => listData.value?.data?.totalElements ?? list.value.length)
const totalPages = computed(() => listData.value?.data?.totalPages ?? 0)

const relatedTools = computed(() => (copy.value.toolSlugs ?? []).map(slug => ({
    slug,
    name: toolNames[slug] ?? slug,
})))

const breadcrumbItems = computed(() => [
    { label: '文章', to: '/read' },
    { label: category.value?.name || '分类' },
])

function pageTo(target: number) {
    return {
        path: '/read/category/' + id,
        query: target > 1 ? { page: String(target) } : {},
    }
}

usePageSeo(() => ({
    title: `${category.value?.name || '文章分类'}${page.value > 1 ? ' - 第' + page.value + '页' : ''} - ZNGG在线工具`,
    description: copy.value.description,
    keywords: [category.value?.name, '技术文章', 'ZNGG'].filter(Boolean).join(','),
    path: '/read/category/' + id + (page.value > 1 ? '?page=' + page.value : ''),
    jsonLd: [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${category.value?.name || '文章分类'}文章`,
            description: copy.value.description,
            url: 'https://www.zngg.net/read/category/' + id,
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: list.value.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: 'https://www.zngg.net/read/post/' + item.id,
                name: item.title,
            })),
        },
    ],
}))
</script>
<style scoped>
.category-scroll {
    scrollbar-width: none;
}

.category-scroll::-webkit-scrollbar {
    display: none;
}
</style>
