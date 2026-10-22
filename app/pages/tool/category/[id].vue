<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <PageBreadcrumb :items="[{ label: '工具', to: '/tool' }, { label: category?.name || '分类' }]" class="mb-2" />

        <div class="bg-white px-6 pb-6 pt-5 rounded-md">
            <div class="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 class="font-semibold text-2xl">{{ category?.name || '工具分类' }}</h1>
                    <p class="mt-1 text-sm text-gray-500">{{ copy.intro }}</p>
                </div>
                <p class="text-sm text-gray-500">共 {{ toolList.length }} 个工具</p>
            </div>

            <div class="category-scroll mt-4 flex gap-2 overflow-x-auto pb-1 md:flex-wrap md:overflow-visible md:pb-0">
                <NuxtLink to="/tool" :class="filterClass(false)">全部</NuxtLink>
                <NuxtLink v-for="item in categories" :key="item.id" :to="'/tool/category/' + item.id"
                    :class="filterClass(String(item.id) === id)">
                    {{ item.name }}
                </NuxtLink>
            </div>
        </div>

        <div class="mt-4 w-full flex flex-wrap justify-between">
            <NuxtLink :to="'/tool/detail/' + item.content" v-for="(item, index) in toolList" :key="index"
                target="_blank" class="w-4/12 md:w-2/12 flex mb-4"
                :class="[(index + 6) % 6 == 0 ? 'md:pr-1 md:pl-0' : '', (index + 1) % 6 == 0 ? 'md:pl-1 md:pr-0' : '', ((index + 7) % 6 != 0) && ((index + 1) % 6 != 0) ? 'md:px-1' : '', (index + 2) % 3 == 0 ? 'px-1' : '', (index + 3) % 3 == 0 ? 'pr-2' : '', (index + 1) % 3 == 0 ? 'pl-2' : '']">
                <div class="w-full relative tool-border">
                    <div class="tool-box absolute">
                        <div class="tool-icon" :style="'background-image: url(/img/' + item.image + ');'"></div>
                        <p class="tool-title" v-text="item.title"></p>
                        <p class="tool-des" v-text="item.summary"></p>
                    </div>
                </div>
            </NuxtLink>
            <div v-for="item in 11" class="w-4/12 md:w-2/12"></div>
        </div>

        <p v-if="!toolList.length" class="py-14 text-center text-sm text-gray-400">暂无工具</p>
    </div>
</template>
<script setup lang="ts">
import { api } from '~/api/api'
import { getToolCategoryCopy } from '~/config/toolCategories'

definePageMeta({
    key: (route) => route.fullPath,
})

const route = useRoute()
const id = String(route.params.id)

const { data: categoryData } = await useAsyncData('tool_CategoryInfo_' + id, () => api.tool.getCategories())
const categories = computed(() => categoryData.value?.data ?? [])
const category = computed(() => categories.value.find((item: any) => String(item.id) === id) || null)
const copy = computed(() => getToolCategoryCopy(category.value?.name))

function filterClass(active: boolean) {
    return active
        ? 'shrink-0 rounded-full border border-blue-600 bg-blue-600 px-4 py-1.5 text-sm font-medium text-white shadow-sm shadow-blue-600/20 transition-colors duration-200 hover:bg-blue-700'
        : 'shrink-0 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50/60 hover:text-blue-600'
}

const { data: toolData } = await useAsyncData('tool_CategoryList_' + id, () => api.tool.getList(1, 60, id))
const toolList = computed(() => toolData.value?.data?.content ?? [])

usePageSeo(() => ({
    title: `${category.value?.name || '工具分类'} - ZNGG在线工具`,
    description: copy.value.description,
    keywords: [category.value?.name, '在线工具', 'ZNGG'].filter(Boolean).join(','),
    path: '/tool/category/' + id,
    jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `${category.value?.name || '工具分类'}在线工具`,
        description: copy.value.description,
        url: 'https://www.zngg.net/tool/category/' + id,
    },
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
