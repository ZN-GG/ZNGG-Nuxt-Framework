<template>
    <div class="rounded-md bg-white p-6">
        <div class="border-b border-gray-100 pb-4">
            <p class="text-xl font-semibold text-gray-800">我的收藏</p>
            <p class="mt-1 text-sm text-gray-500">收藏的文章会显示在这里。</p>
        </div>

        <div class="flex flex-col items-center justify-center py-14 text-center">
            <span class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                <Star class="h-5 w-5" aria-hidden="true" />
            </span>
            <p class="mt-3 text-sm font-medium text-gray-700">收藏功能正在整理中</p>
            <p class="mt-1 text-xs text-gray-500">后续会在这里展示你收藏的文章，先去逛逛文章吧。</p>
            <NuxtLink to="/read" class="btn-normal mt-4">去逛文章</NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Star } from '@lucide/vue'
</script>
