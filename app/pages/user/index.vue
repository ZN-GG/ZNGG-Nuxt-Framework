<template>
    <div class="mx-auto container px-4 my-8 min-h-screen mt-20">
        <PageBreadcrumb :items="[{ label: '个人中心' }]" class="mb-2" />

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
            <aside class="h-fit rounded-md bg-white p-4">
                <UserLeftContents />
            </aside>

            <div class="min-w-0">
                <NuxtPage />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
    middleware: ['auth']
})

useHead({
    title: "个人中心",
    titleTemplate: (title) => `${title} - ZNGG在线工具`,
    meta: [
        { name: 'description', content: 'ZNGG在线工具个人中心，管理文章、收藏与账号信息。' }
    ],
})
</script>
