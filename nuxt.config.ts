// https://nuxt.com/docs/4.x/api/configuration/nuxt-config
import wasm from "vite-plugin-wasm";


export default defineNuxtConfig({
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
    }
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/google-adsense'],
  css: ['~/assets/css/tailwind.css'],
  googleAdsense: {
    id: 'ca-pub-6667301035180632',
  },
  build: {
    transpile: [
      'png-to-svg-wasm'
    ]
  },
  vite: {
    optimizeDeps: {
      exclude: [
        'png-to-svg-wasm'
      ]
    },
    plugins: [
      wasm()
    ],
    build: {
      // chunkSizeWarningLimit: 4096
      rollupOptions: {
        output: {},
      },
    },

  },
  // render: {
  //   static: {
  //     //@ts-ignore
  //     setHeaders(res: any) {
  //       res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  //       res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  //     },
  //   },
  // },
});
