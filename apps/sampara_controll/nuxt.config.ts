export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    ['@nuxt/icon', { localApiEndpoint: '/_nuxt_icon' }],
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  ui: {
    colorMode: false
  },

  runtimeConfig: {
    apiBaseInternal: process.env.API_BASE_INTERNAL ?? 'http://localhost:8090/api',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? process.env.API_BASE ?? 'http://localhost:8090/api'
    }
  },

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
