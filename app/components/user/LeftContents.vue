<template>
    <div>
        <div class="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div class="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-blue-50">
                <img v-if="store.info?.avatar" :src="store.info.avatar" alt="" class="h-full w-full object-cover" />
                <div v-else class="flex h-full w-full items-center justify-center text-sm font-semibold text-blue-600">
                    {{ displayName.slice(0, 1) }}
                </div>
            </div>
            <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-gray-800">{{ displayName }}</p>
                <p class="truncate text-xs text-gray-500">{{ store.info?.email || roleLabel }}</p>
            </div>
        </div>

        <nav class="mt-3 space-y-1" aria-label="个人中心导航">
            <NuxtLink v-for="item in menu" :key="item.path" :to="item.path"
                class="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors"
                :class="isActive(item.path) ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'">
                <component :is="item.icon" class="h-4 w-4 shrink-0" aria-hidden="true" />
                {{ item.name }}
            </NuxtLink>
            <NuxtLink v-if="store.isAdmin" to="/site/manager/download"
                class="flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors"
                :class="route.path.startsWith('/site/manager') ? 'bg-blue-50 font-medium text-blue-600' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'">
                <Settings class="h-4 w-4 shrink-0" aria-hidden="true" />
                管理后台
            </NuxtLink>
        </nav>

        <div class="mt-4 border-t border-gray-100 pt-3">
            <button type="button"
                class="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-sm text-red-500 transition-colors hover:bg-red-50"
                @click="logout">
                <LogOut class="h-4 w-4 shrink-0" aria-hidden="true" />
                退出登录
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Home, LogOut, PenLine, Settings, Star, User } from '@lucide/vue'
import { userStore } from '~/stores/user'

const { $toast } = useNuxtApp()
const route = useRoute()
const store = userStore()
const token = useCookie('token')

const menu = [
    { path: '/user', name: '主页', icon: Home },
    { path: '/user/create', name: '创作中心', icon: PenLine },
    { path: '/user/favorites', name: '我的收藏', icon: Star },
    { path: '/user/info', name: '用户信息', icon: User },
]

const displayName = computed(() => store.info?.name || '用户')
const roleLabel = computed(() => store.isAdmin ? '管理员' : '普通用户')

onMounted(() => {
    store.loadInfo()
})

function isActive(path: string) {
    return path === '/user' ? route.path === '/user' : route.path.startsWith(path)
}

function logout() {
    store.$patch({
        isLogin: false,
        info: null,
        infoLoaded: false,
    })
    token.value = null
    $toast.success('您已退出登录')
    navigateTo('/')
}
</script>
