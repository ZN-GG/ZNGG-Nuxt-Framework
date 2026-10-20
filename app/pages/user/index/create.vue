<template>
    <div class="rounded-md bg-white p-6">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
                <div class="flex items-center gap-2">
                    <p class="text-xl font-semibold text-gray-800">创作中心</p>
                    <span class="rounded-sm bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-500">共 {{ total }} 篇</span>
                </div>
                <p class="mt-1 text-sm text-gray-500">管理你发布的文章，支持查看、编辑和删除。</p>
            </div>
            <NuxtLink to="/writer" class="btn-normal inline-flex items-center gap-2">
                <PenLine class="h-4 w-4" aria-hidden="true" />
                写文章
            </NuxtLink>
        </div>

        <div v-if="loading" class="py-12 text-center text-sm text-gray-400">加载中...</div>
        <div v-else-if="!articleList.length" class="py-14 text-center">
            <p class="text-sm font-medium text-gray-700">还没有文章</p>
            <p class="mt-1 text-xs text-gray-500">写下第一篇文章，开始记录你的经验。</p>
            <NuxtLink to="/writer" class="btn-normal mt-4">写一篇文章</NuxtLink>
        </div>
        <div v-else class="mt-2">
            <div class="overflow-x-auto">
                <table class="w-full min-w-[760px] text-left text-sm">
                    <thead>
                        <tr class="border-b border-gray-100 text-xs text-gray-400">
                            <th class="py-2 pr-4 font-medium">文章</th>
                            <th class="py-2 pr-4 font-medium">阅读量</th>
                            <th class="py-2 pr-4 font-medium">状态</th>
                            <th class="py-2 pr-4 font-medium">更新时间</th>
                            <th class="py-2 text-right font-medium">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in articleList" :key="item.id"
                            class="border-b border-gray-50 transition-colors last:border-b-0 hover:bg-gray-50/80">
                            <td class="py-3 pr-4">
                                <NuxtLink :to="'/read/post/' + item.id" target="_blank"
                                    class="line-clamp-1 font-medium text-gray-700 transition-colors hover:text-blue-600">
                                    {{ item.title }}
                                </NuxtLink>
                            </td>
                            <td class="py-3 pr-4 text-gray-500">{{ item.viewCount ?? 0 }}</td>
                            <td class="py-3 pr-4">
                                <span class="rounded-sm px-2 py-0.5 text-[11px]"
                                    :class="stateClass(item.state)">
                                    {{ getState(item.state) }}
                                </span>
                            </td>
                            <td class="py-3 pr-4 text-gray-400">{{ (item.updateTime || '').slice(0, 10) || '-' }}</td>
                            <td class="py-3 text-right">
                                <NuxtLink :to="'/writer?id=' + item.id" target="_blank"
                                    class="text-xs text-blue-600 hover:underline">编辑</NuxtLink>
                                <NuxtLink :to="'/read/post/' + item.id" target="_blank"
                                    class="ml-3 text-xs text-gray-500 transition-colors hover:text-blue-600">查看</NuxtLink>
                                <button type="button" class="ml-3 text-xs text-red-500 hover:underline"
                                    @click="removeArticle(item)">删除</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="totalPages > 1" class="mt-4 flex items-center justify-end gap-3 text-xs text-gray-500">
                <button type="button" class="rounded-sm border border-gray-200 px-3 py-1 disabled:opacity-40"
                    :disabled="page <= 1" @click="goPage(page - 1)">上一页</button>
                <span>{{ page }} / {{ totalPages }}</span>
                <button type="button" class="rounded-sm border border-gray-200 px-3 py-1 disabled:opacity-40"
                    :disabled="page >= totalPages" @click="goPage(page + 1)">下一页</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PenLine } from '@lucide/vue'
import { api } from '~/api/api'

const { $toast } = useNuxtApp()

const page = ref(1)
const pageSize = 10
const articleList = ref<any[]>([])
const total = ref(0)
const totalPages = ref(0)
const loading = ref(true)

const { data: firstPage } = await useAsyncData('user_ArticleList_1', () => api.article.getUserList(1, pageSize, ''))

if (firstPage.value?.success) {
    articleList.value = firstPage.value.data.content ?? []
    total.value = Number(firstPage.value.data.totalElements ?? 0) || 0
    totalPages.value = Number(firstPage.value.data.totalPages ?? 0) || 0
}
loading.value = false

function stateClass(state: string) {
    if (state === '0') return 'bg-blue-50 text-blue-600'
    if (state === '1') return 'bg-gray-100 text-gray-500'
    return 'bg-red-50 text-red-500'
}

function getState(state: string) {
    if (state === '0') return '正常'
    if (state === '1') return '草稿'
    if (state === '2') return '已删除'
    return '未知'
}

async function loadPage(next: number) {
    if (next < 1 || next > totalPages.value || loading.value) return
    loading.value = true
    const result = await api.article.getUserList(next, pageSize, '')
    loading.value = false
    if (!result.success) {
        $toast.error(result.message || '加载失败')
        return
    }
    page.value = next
    articleList.value = result.data.content ?? []
    total.value = Number(result.data.totalElements ?? 0) || 0
    totalPages.value = Number(result.data.totalPages ?? 0) || 0
    if (import.meta.client) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

function goPage(next: number) {
    loadPage(next)
}

async function removeArticle(item: any) {
    if (!window.confirm('确定删除「' + item.title + '」吗？')) return
    const result = await api.article.updateArticle({ id: item.id, state: '2' })
    if (!result.success) {
        $toast.error(result.message || '删除失败')
        return
    }
    $toast.success('已删除')
    await loadPage(page.value)
}
</script>
