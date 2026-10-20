<template>
    <div class="rounded-md bg-white p-6">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
                <p class="text-xl font-semibold text-gray-800">你好，{{ displayName }}</p>
                <p class="mt-1 text-sm text-gray-500">这里可以管理你的文章、收藏和账号信息。</p>
            </div>
            <NuxtLink to="/writer" class="btn-normal inline-flex items-center gap-2">
                <PenLine class="h-4 w-4" aria-hidden="true" />
                写文章
            </NuxtLink>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <NuxtLink v-for="action in actions" :key="action.to" :to="action.to"
                class="group flex items-start gap-3 rounded-md border border-gray-100 p-4 transition-colors hover:border-blue-200">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-blue-600">
                    <component :is="action.icon" class="h-4 w-4" aria-hidden="true" />
                </span>
                <span class="min-w-0">
                    <span class="block text-sm font-semibold text-gray-800 transition-colors group-hover:text-blue-600">
                        {{ action.title }}
                    </span>
                    <span class="mt-0.5 block text-xs text-gray-500">{{ action.desc }}</span>
                </span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PenLine, Star, User } from '@lucide/vue'
import { api } from '~/api/api'
import { userStore } from '~/stores/user'

const store = userStore()

const { data: articleCountData } = await useAsyncData('user_ArticleCount', () => api.article.getUserList(1, 1, ''))

const displayName = computed(() => store.info?.name || '朋友')
const articleCount = computed(() => Number(articleCountData.value?.data?.totalElements ?? 0) || 0)

const actions = computed(() => [
    { to: '/user/create', title: '创作中心', desc: `共 ${articleCount.value} 篇文章`, icon: PenLine },
    { to: '/user/favorites', title: '我的收藏', desc: '查看收藏内容', icon: Star },
    { to: '/user/info', title: '用户信息', desc: '查看账号资料', icon: User },
])
</script>
