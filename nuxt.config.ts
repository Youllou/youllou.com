// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: { enabled: true },
    routeRules: {
        "/projects": {
            // Temporary redirect using a 307 status code
            redirect: "https://github.com/Youllou",
        },
    },
    modules: [
         '@nuxt/devtools',
        '@nuxt/ui',
        '@nuxtjs/i18n'
    ],
    css: ['~/public/assets/css/main.css'],
    i18n:  {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'fr', name: 'Français', file: 'fr.json' }
        ],
        defaultLocale: 'en',
    }
})