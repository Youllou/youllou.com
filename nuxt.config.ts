// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    runtimeConfig: {
        githubToken: process.env.GITHUB_TOKEN, // Default fallback for SSR
        public: {}        // Never put the token here!
    },
    routeRules: {
        "/projects": {
            // Temporary redirect using a 307 status code
            redirect: "https://github.com/Youllou",
        },
        "/api/github": {
            // This route will be handled by the server middleware
            cors: true, // Enable CORS for this route
            headers: {
                'Cache-Control': 'no-cache' // Disable caching for this API route
            }
        }
    },
    modules: [
        '@nuxt/devtools',
        '@nuxt/ui',
        '@nuxtjs/i18n',
        '@nuxt/image',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/seo'
    ],
    seo: {
        // Your base URL (important!)
        siteUrl: 'https://youllou.com',

        // You can define dynamic routes too, but start simple:
        sitemap: {
            enabled: true,
            include: ['/'], // will auto-generate others
            i18n: true, // ✅ Enable multi-locale support
        }
    },
    css: ['~/public/assets/css/main.css'],
    i18n:  {
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'fr', name: 'Français', file: 'fr.json' }
        ],
        defaultLocale: 'en',
        compilation:{
            strictMessage: false
        }

    },
    vite:{
        vue:{
            script:{
                propsDestructure: true
            }
        }
    },
})