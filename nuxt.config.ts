// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: [
    "assets/scss/themes/dark/app-dark.scss",
    "assets/scss/app.scss",
    "assets/scss/iconly.scss",
  ],
  plugins: [
    { src: '~/plugins/bootstrap.client', mode: 'client' },
  ],
  modules: [
    '@pinia/nuxt', 
    '@nuxtjs/google-fonts', 
    '@nuxtjs/color-mode', 
    'nuxt-toast'
  ],
  colorMode: {
    classPrefix: 'theme-',
    classSuffix: ''
  },
  googleFonts: {
    families: {
      'Nunito': true,
    },
  },
  compatibilityDate: '2025-05-10',
  runtimeConfig: {
    public: {}, // Variables públicas (opcional)
    scopusApiKey: process.env.NUXT_SCOPUS_API_KEY, // Privada (solo server-side)
    openaiApiKey: process.env.NUXT_OPENAI_API_KEY,
  },
  nitro: {
    plugins: ['~/server/plugins/error-nitro.ts']
  },
  pages:true,
  devtools: {
    enabled: process.env.ENVIROMENT == "true" ? true : false
  }
})