type PageSeoOptions = {
    title: string
    description: string
    path: string
    keywords?: string
    image?: string
    type?: 'website' | 'article' | 'profile'
    jsonLd?: Record<string, any> | Record<string, any>[]
}

export function usePageSeo(input: PageSeoOptions | (() => PageSeoOptions)) {
    const config = useRuntimeConfig()
    const siteUrl = ((config.public.siteUrl as string) || 'https://www.zngg.net').replace(/\/$/, '')
    const resolved = computed<PageSeoOptions>(() => typeof input === 'function' ? input() : input)

    const canonical = computed(() => siteUrl + resolved.value.path)
    const image = computed(() => resolved.value.image || siteUrl + '/logo-black.png')

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
            { name: 'description', content: resolved.value.description },
            ...(resolved.value.keywords ? [{ name: 'keywords', content: resolved.value.keywords }] : []),
            { property: 'og:title', content: resolved.value.title },
            { property: 'og:description', content: resolved.value.description },
            { property: 'og:type', content: resolved.value.type || 'website' },
            { property: 'og:url', content: canonical.value },
            { property: 'og:image', content: image.value },
            { name: 'twitter:card', content: 'summary_large_image' },
        ]),
        link: computed(() => [
            { rel: 'canonical', href: canonical.value },
        ]),
        script: scripts,
    })
}
