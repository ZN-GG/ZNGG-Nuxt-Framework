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
const props = defineProps<{
    items: { label: string, to?: string }[]
}>()

const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://www.zngg.net').replace(/\/$/, '')

const absoluteUrl = (value: string) => /^https?:\/\//.test(value) ? value : siteUrl + (value.startsWith('/') ? value : '/' + value)

const jsonLd = computed(() => ({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: siteUrl + '/' },
        ...props.items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 2,
            name: item.label,
            ...(item.to ? { item: absoluteUrl(item.to) } : {}),
        })),
    ],
}))

useHead({
    script: [{
        type: 'application/ld+json',
        key: 'breadcrumb-jsonld',
        innerHTML: computed(() => JSON.stringify(jsonLd.value).replace(/</g, '\\u003c')),
    }],
})
</script>
