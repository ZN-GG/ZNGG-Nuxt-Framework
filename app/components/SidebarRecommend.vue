<template>
    <div v-if="tools.length" class="bg-white p-5 rounded-md">
        <div class="border-l-4 border-blue-600 pl-2">
            <p class="font-semibold text-sm text-gray-800">常用工具</p>
        </div>
        <ul class="mt-3 space-y-1">
            <li v-for="tool in tools" :key="tool.id">
                <NuxtLink :to="'/tool/detail/' + tool.content"
                    class="flex items-center gap-2 rounded-sm px-1.5 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600">
                    <span
                        class="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-gray-50 text-[11px] font-semibold text-blue-600">
                        <img v-if="tool.image && !iconErrors[tool.id]" :src="'/img/' + tool.image" :alt="tool.title"
                            loading="lazy" class="h-full w-full object-cover" @error="iconErrors[tool.id] = true" />
                        <template v-else>{{ initialOf(tool.title) }}</template>
                    </span>
                    <span class="truncate">{{ tool.title }}</span>
                </NuxtLink>
            </li>
        </ul>
    </div>

    <div v-if="articles.length" class="bg-white p-5 rounded-md">
        <div class="border-l-4 border-blue-600 pl-2">
            <p class="font-semibold text-sm text-gray-800">最新文章</p>
        </div>
        <ul class="mt-3 space-y-3">
            <li v-for="article in articles" :key="article.id">
                <NuxtLink :to="'/read/post/' + article.id"
                    class="line-clamp-2 text-sm leading-6 text-gray-600 transition-colors hover:text-blue-600">
                    {{ article.title }}
                </NuxtLink>
                <p v-if="article.updateTime" class="mt-0.5 text-xs text-gray-400">
                    {{ String(article.updateTime).slice(0, 10) }}
                </p>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { api } from '~/api/api'

const iconErrors = ref<Record<string, boolean>>({})

const { data: toolData } = await useAsyncData('sidebar_Tools', () => api.tool.getList(1, 6, ''))
const { data: articleData } = await useAsyncData('sidebar_Articles', () => api.article.getList(1, 5, ''))

const tools = computed<any[]>(() => toolData.value?.data?.content ?? [])
const articles = computed<any[]>(() => articleData.value?.data?.content ?? [])

function initialOf(value: string) {
    return String(value || '?').trim().slice(0, 1)
}
</script>
