<template>
    <div class="rounded-md bg-white p-6">
        <div class="border-b border-gray-100 pb-4">
            <p class="text-xl font-semibold text-gray-800">个人信息</p>
            <p class="mt-1 text-sm text-gray-500">查看你的账号资料，如需修改请联系管理员。</p>
        </div>

        <div v-if="info" class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start">
            <div class="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-blue-50">
                <img v-if="info.avatar" :src="info.avatar" alt="" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center text-xl font-semibold text-blue-600">
                    {{ (info.name || '?').slice(0, 1) }}
                </div>
            </div>

            <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                    <p class="text-lg font-semibold text-gray-800">{{ info.name || '-' }}</p>
                    <span class="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[11px] text-blue-600">{{ roleLabel }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-500">{{ info.sign || '这个人很懒，什么都没留下。' }}</p>

                <dl class="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div class="flex items-center justify-between gap-4 border-b border-gray-100 py-2">
                        <dt class="text-gray-500">邮箱</dt>
                        <dd class="truncate text-right font-medium text-gray-700">{{ info.email || '-' }}</dd>
                    </div>
                    <div class="flex items-center justify-between gap-4 border-b border-gray-100 py-2">
                        <dt class="text-gray-500">账号角色</dt>
                        <dd class="text-right font-medium text-gray-700">{{ roleLabel }}</dd>
                    </div>
                    <div class="flex items-center justify-between gap-4 border-b border-gray-100 py-2">
                        <dt class="text-gray-500">注册时间</dt>
                        <dd class="text-right font-medium text-gray-700">{{ formatDate(info.createTime) }}</dd>
                    </div>
                    <div class="flex items-center justify-between gap-4 border-b border-gray-100 py-2">
                        <dt class="text-gray-500">最近更新</dt>
                        <dd class="text-right font-medium text-gray-700">{{ formatDate(info.updateTime) }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <div v-else-if="loadFailed" class="py-12 text-center text-sm text-gray-500">
            账号信息加载失败，请刷新重试。
        </div>
        <div v-else class="py-12 text-center text-sm text-gray-500">正在加载账号信息...</div>
    </div>
</template>

<script setup lang="ts">
import { api } from '~/api/api'

const { data: userInfo } = await useAsyncData('info_GetUserInfo', () => api.user.getInfo())

const info = computed(() => userInfo.value?.success ? userInfo.value.data : null)
const loadFailed = computed(() => Boolean(userInfo.value && !userInfo.value.success))
const roleLabel = computed(() => {
    const roles = String(info.value?.roles || '')
    return roles.split(',').map(role => role.trim()).includes('role_admin') ? '管理员' : '普通用户'
})

function formatDate(value?: string) {
    return value ? String(value).slice(0, 10) : '-'
}
</script>
