<template>
    <div class="mx-auto container px-4 my-8 mt-20 min-h-screen">
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
            <aside class="h-fit rounded-md bg-white p-4">
                <p class="px-2 text-xs font-medium uppercase tracking-wide text-gray-400">管理后台</p>
                <nav class="mt-3 space-y-1">
                    <NuxtLink to="/site/manager/download"
                        class="block rounded-sm px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                        active-class="bg-blue-50 font-medium text-blue-600">
                        应用管理
                    </NuxtLink>
                    <NuxtLink to="/site/manager/project"
                        class="block rounded-sm px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                        active-class="bg-blue-50 font-medium text-blue-600">
                        项目管理
                    </NuxtLink>
                    <NuxtLink to="/site/manager/nav"
                        class="block rounded-sm px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                        active-class="bg-blue-50 font-medium text-blue-600">
                        导航管理
                    </NuxtLink>
                    <NuxtLink to="/site/manager/link"
                        class="block rounded-sm px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-blue-600"
                        active-class="bg-blue-50 font-medium text-blue-600">
                        友链管理
                    </NuxtLink>
                </nav>
                <div class="mt-4 border-t border-gray-100 pt-3">
                    <NuxtLink to="/" class="block px-3 py-1.5 text-xs text-gray-400 transition-colors hover:text-blue-600">
                        返回首页
                    </NuxtLink>
                </div>
            </aside>

            <div class="min-w-0">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    middleware: ['admin']
})

useHead({
    title: '管理后台',
    titleTemplate: (title) => `${title} - ZNGG在线工具`,
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})
</script>
