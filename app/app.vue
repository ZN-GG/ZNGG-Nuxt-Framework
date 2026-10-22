<template>
    <NuxtLayout />
</template>
<script setup lang="ts">
import '~/assets/fonts/iconfont.css'

const route = useRoute()
const config = useRuntimeConfig()
const siteUrl = String(config.public.siteUrl || 'https://www.zngg.net').replace(/\/$/, '')

const canonical = computed(() => {
    const path = route.path === '/' ? '/' : route.path.replace(/\/+$/, '')
    return siteUrl + path
})

const siteJsonLd = [
    {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ZNGG在线工具',
        alternateName: 'ZNGG',
        url: siteUrl + '/',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: siteUrl + '/search?q={search_term_string}',
            },
            'query-input': 'required name=search_term_string',
        },
    },
    {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'ZNGG在线工具',
        url: siteUrl + '/',
        logo: siteUrl + '/logo-black.png',
    },
]

useHead({
    link: [
        { rel: 'canonical', href: canonical, key: 'canonical' },
    ],
    meta: [
        { property: 'og:url', content: canonical, key: 'og:url' },
        { property: 'og:type', content: 'website', key: 'og:type' },
    ],
    script: [
        {
            type: 'application/ld+json',
            key: 'site-jsonld',
            innerHTML: JSON.stringify(siteJsonLd),
        },
    ],
})
</script>
