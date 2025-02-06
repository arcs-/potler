import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-13',
  ssr: false,

  app: {
    head: {
      htmlAttrs: {
        lang: 'de-CH',
      },
    },
    pageTransition: {
      name: 'fade',
      mode: 'out-in',
    },
  },

  runtimeConfig: {
    databaseUrl: '',
    tokenSecret: '',
    public: { },
  },

  modules: [
    '@vite-pwa/nuxt',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/i18n',
  ],

  tailwindcss: {
    cssPath: '~/assets/css/app.css',
    viewer: false,
  },

  eslint: {
    config: { stylistic: true },
  },

  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': {},
      'tailwindcss': {},
      'autoprefixer': {},
    },
  },

  // https://v8.i18n.nuxtjs.org/
  i18n: {
    defaultLocale: process.env.DEFAULT_LOCALE || 'de',
    lazy: true,
    langDir: 'lang/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    locales: [
      {
        code: 'de',
        name: 'Deutsch',
        iso: 'de-CH',
        file: 'de.json',
      },
    ],
  },

  piniaPluginPersistedstate: {
    storage: 'localStorage',
  },

})
