export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    ['@nuxt/icon', { localApiEndpoint: '/_nuxt_icon' }],
    '@nuxt/ui',
    '@nuxt/image'
  ],

  devtools: {
    enabled: true
  },

  css: [
    '~/assets/css/main.css'
  ],

  app: {
    head: {
      title: 'SAMPARA',
      htmlAttrs: {
        lang: 'id'
      },
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png?v=3'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png?v=3'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png?v=3'
        }
      ]
    }
  },

  ui: {
    colorMode: false
  },

  runtimeConfig: {
    apiBaseInternal:
      process.env.API_BASE_INTERNAL ??
      'http://localhost:8090/api',

    public: {
      apiBase:
        process.env.NUXT_PUBLIC_API_BASE ??
        process.env.API_BASE ??
        'http://localhost:8090/api'
    }
  },

  routeRules: {
    '/': {
      prerender: true
    }
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