<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <PageBreadcrumb :items="breadcrumbItems" class="mb-2" />

        <div class="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <div class="lg:col-span-8">
                <div class="bg-white p-6 rounded-md">
                    <div class="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 class="font-semibold text-2xl">#{{ tag || '标签' }}</h1>
                            <p class="mt-1 text-sm text-gray-500">
                                包含「{{ tag }}」标签的技术文章，共 {{ total }} 篇。
                            </p>
                        </div>
                        <p class="shrink-0 whitespace-nowrap text-sm text-gray-500">共 {{ total }} 篇文章</p>
                    </div>

                    <div class="mt-4 flex flex-wrap items-center gap-2">
                        <NuxtLink to="/read" class="btn-1 mx-0">全部文章</NuxtLink>
                        <NuxtLink v-for="item in tags.slice(0, 12)" :key="item.name"
                            :to="'/read/tag/' + encodeURIComponent(item.name)" class="btn-1 mx-0"
                            :class="item.name === tag ? 'bg-blue-600 text-white' : ''">
                            #{{ item.name }}
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
                        <ArticleListItem v-for="item in list" :key="item.id" :article="item"
                            :category-name="categoryNameOf(item)" />
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
                        <p class="text-lg font-semibold">全部标签</p>
                    </div>
                    <div v-if="tags.length" class="mt-3 flex flex-wrap gap-2">
                        <NuxtLink v-for="item in tags" :key="item.name"
                            :to="'/read/tag/' + encodeURIComponent(item.name)"
                            class="rounded px-2.5 py-1 text-xs transition-colors"
                            :class="item.name === tag
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-600 hover:text-white'">
                            #{{ item.name }}
                            <span class="ml-0.5 text-[10px]"
                                :class="item.name === tag ? 'text-blue-100' : 'text-gray-400'">{{ item.count }}</span>
                        </NuxtLink>
                    </div>
                    <p v-else class="mt-3 text-xs text-gray-400">暂无标签</p>
                </div>

                <div class="mt-4 rounded-md bg-white p-5">
                    <div class="flex items-center gap-2.5">
                        <span class="h-5 w-1 rounded-full bg-orange-500"></span>
                        <p class="text-lg font-semibold">标签说明</p>
                    </div>
                    <p class="mt-3 text-xs leading-5 text-gray-500">
                        标签用于串联不同分类下的相关内容，点击标签可以查看所有带有该标签的文章。
                    </p>
                </div>
            </aside>
        </div>
    </div>
</template>

<script setup lang="ts">
import { api } from '~/api/api'

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const tag = computed(() => String(route.params.tag || ''))
const page = computed(() => Math.max(1, Number(route.query.page) || 1))

const { data: tagData } = await useAsyncData('read_TagList', () => api.article.getTags())
const tags = computed(() => tagData.value?.data ?? [])
const categoryList = ref<any[]>([])
const categoryResult = await api.article.getCategories()
categoryList.value = categoryResult?.data ?? []

const { data: listData, pending } = await useAsyncData(
    () => `read_Tag_${tag.value}_${page.value}`,
    () => api.article.getTagList(tag.value, page.value, 10),
    { watch: [page, tag] }
)

const list = computed(() => listData.value?.data?.content ?? [])
const total = computed(() => listData.value?.data?.totalElements ?? list.value.length)
const totalPages = computed(() => listData.value?.data?.totalPages ?? 0)

function categoryNameOf(article: any) {
    return categoryList.value.find(category => String(category.id) === String(article.categoryId))?.name || ''
}

const breadcrumbItems = computed(() => [
    { label: '文章', to: '/read' },
    { label: '标签' },
    { label: '#' + (tag.value || '标签') },
])

function pageTo(target: number) {
    return {
        path: '/read/tag/' + encodeURIComponent(tag.value),
        query: target > 1 ? { page: String(target) } : {},
    }
}

usePageSeo(() => ({
    title: `${tag.value || '标签'}${page.value > 1 ? ' - 第' + page.value + '页' : ''} - 文章标签 - ZNGG在线工具`,
    description: `与「${tag.value}」标签相关的技术文章，共 ${total.value} 篇，持续更新。`,
    keywords: [tag.value, '技术文章', '文章标签', 'ZNGG'].filter(Boolean).join(','),
    path: '/read/tag/' + encodeURIComponent(tag.value) + (page.value > 1 ? '?page=' + page.value : ''),
    jsonLd: [
        {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: `${tag.value || '标签'}相关文章`,
            description: `与「${tag.value}」标签相关的技术文章`,
            url: 'https://www.zngg.net/read/tag/' + encodeURIComponent(tag.value),
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
