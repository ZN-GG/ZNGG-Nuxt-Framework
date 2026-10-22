import wasm from 'vite-plugin-wasm'

export default defineNuxtConfig({
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: { lang: 'zh-CN' },
      title: 'ZNGG在线工具 - 在线工具、技术文章与资源下载',
      titleTemplate: (title) => {
        if (!title) return 'ZNGG在线工具'
        return title.includes('ZNGG在线工具') ? title : `${title} - ZNGG在线工具`
      },
      meta: [
        { name: 'theme-color', content: '#F7F4EE' },
        { name: 'format-detection', content: 'telephone=no' },
        {
          name: 'description',
          content: 'ZNGG在线工具提供免费在线工具、技术文章、开源项目推荐与软件资源下载，帮助开发者与创作者高效完成工作。',
        },
        { name: 'keywords', content: '在线工具,免费在线工具,技术文章,开源项目推荐,软件下载,资源下载,ZNGG' },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:site_name', content: 'ZNGG在线工具' },
        { property: 'og:locale', content: 'zh_CN' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/logo-black.png' },
        { rel: 'apple-touch-icon', href: '/logo-black.png' },
      ],
    },
  },
  routeRules: {
    '/user/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/writer': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/site/manager/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/search': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
  },
  runtimeConfig: {
    public: {
      siteUrl: 'https://www.zngg.net',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://api.zngg.net',
    },
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/google-adsense',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
    storageKey: 'zngg-theme',
  },
  css: ['~/assets/css/tailwind.css'],
  googleAdsense: {
    id: 'ca-pub-6667301035180632',
  },
  build: {
    transpile: ['png-to-svg-wasm'],
  },
  vite: {
    optimizeDeps: {
      exclude: ['png-to-svg-wasm'],
    },
    plugins: [wasm()],
    build: {
      rollupOptions: {
        output: {},
      },
    },
  },
})
