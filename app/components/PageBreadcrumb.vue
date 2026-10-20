<template>
    <nav class="flex flex-wrap items-center gap-1.5 text-sm text-gray-400" aria-label="面包屑">
        <NuxtLink to="/" class="transition-colors hover:text-blue-600">首页</NuxtLink>
        <template v-for="item in items" :key="item.label">
            <span class="text-gray-300">/</span>
            <NuxtLink v-if="item.to" :to="item.to" class="transition-colors hover:text-blue-600">{{ item.label }}</NuxtLink>
            <span v-else class="text-gray-600">{{ item.label }}</span>
        </template>
    </nav>
</template>
<script setup lang="ts">
defineProps<{
    items: { label: string, to?: string }[]
}>()
</script>
