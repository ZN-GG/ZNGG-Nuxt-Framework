type PageSeoOptions = {
    title: string
    description: string
    path: string
    keywords?: string
    image?: string
    type?: 'website' | 'article' | 'profile'
    robots?: string
    jsonLd?: Record<string, any> | Record<string, any>[]
}

type ToolSeoOptions = {
    title: string
    description: string
    keywords?: string
    path: string
}

const fallbackSiteUrl = 'https://www.zngg.net'

function resolveSiteUrl() {
    const config = useRuntimeConfig()
    return String(config.public.siteUrl || fallbackSiteUrl).replace(/\/$/, '')
}

function normalizePath(path: string) {
    if (!path) return '/'
    return path.startsWith('/') ? path : '/' + path
}

export function usePageSeo(input: PageSeoOptions | (() => PageSeoOptions)) {
    const siteUrl = resolveSiteUrl()
    const resolved = computed<PageSeoOptions>(() => typeof input === 'function' ? input() : input)

    const canonical = computed(() => siteUrl + normalizePath(resolved.value.path))
    const image = computed(() => {
        const value = resolved.value.image
        if (!value) return siteUrl + '/logo-black.png'
        if (/^https?:\/\//.test(value)) return value
        return siteUrl + (value.startsWith('/') ? value : '/' + value)
    })

    const scripts = computed(() => {
        const options = resolved.value
        if (!options.jsonLd) return []
        const items = Array.isArray(options.jsonLd) ? options.jsonLd : [options.jsonLd]
        return items.map(item => ({
            type: 'application/ld+json',
            innerHTML: JSON.stringify(item).replace(/</g, '\\u003c'),
        }))
    })

    useHead({
        title: computed(() => resolved.value.title),
        meta: computed(() => [
            { name: 'description', content: resolved.value.description, key: 'description' },
            ...(resolved.value.keywords ? [{ name: 'keywords', content: resolved.value.keywords, key: 'keywords' }] : []),
            { property: 'og:title', content: resolved.value.title, key: 'og:title' },
            { property: 'og:description', content: resolved.value.description, key: 'og:description' },
            { property: 'og:type', content: resolved.value.type || 'website', key: 'og:type' },
            { property: 'og:url', content: canonical.value, key: 'og:url' },
            { property: 'og:image', content: image.value, key: 'og:image' },
            { property: 'og:site_name', content: 'ZNGG在线工具' },
            { property: 'og:locale', content: 'zh_CN' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: resolved.value.title, key: 'twitter:title' },
            { name: 'twitter:description', content: resolved.value.description, key: 'twitter:description' },
            { name: 'twitter:image', content: image.value, key: 'twitter:image' },
            ...(resolved.value.robots ? [{ name: 'robots', content: resolved.value.robots }] : []),
        ]),
        link: computed(() => [
            { rel: 'canonical', href: canonical.value, key: 'canonical' },
        ]),
        script: scripts,
    })
}

export function useToolSeo(input: ToolSeoOptions) {
    const siteUrl = resolveSiteUrl()
    const url = siteUrl + normalizePath(input.path)

    usePageSeo({
        title: `${input.title} - 工具 - ZNGG在线工具`,
        description: input.description,
        keywords: input.keywords,
        path: input.path,
        jsonLd: {
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: input.title,
            description: input.description,
            url,
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'CNY',
            },
        },
    })
}
