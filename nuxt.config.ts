import wasm from 'vite-plugin-wasm'

export default defineNuxtConfig({
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1',
      charset: 'utf-8',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { name: 'theme-color', content: '#F7F4EE' },
      ],
    },
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
