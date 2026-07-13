// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    runtimeConfig: {
        githubToken: process.env.GITHUB_TOKEN, // Default fallback for SSR
        argocdUrl: process.env.ARGOCD_URL,
        argocdToken: process.env.ARGOCD_TOKEN,
        public: {}        // Never put the token here!
    },
    site : {
        name: 'Youllou\'s Portfolio 🚀',
        url: 'https://youllou.com',
        description: 'Hey there! I am Youllou, a computer science student passionate about technology and cybersecurity. Explore my projects, CTFs, and creative works!',
        indexable: true,
    },
    routeRules: {
        "/api/github": {
            // This route will be handled by the server middleware
            cors: true, // Enable CORS for this route
            headers: {
                'Cache-Control': 'no-cache' // Disable caching for this API route
            }
        },
        "api/argocd/**": {
            headers: {
                'Cache-Control': 'no-cache'
            }
        }
    },
    modules: [
        '@nuxt/devtools',
        '@nuxt/ui',
        '@nuxtjs/i18n',
        '@nuxt/image',
        '@nuxtjs/tailwindcss',
        '@nuxtjs/seo',
        '@nuxt/content'
    ],
    css: ['~/public/assets/css/main.css'],
    i18n:  {
        strategy: 'prefix_and_default',
        locales: [
            { code: 'en', name: 'English', file: 'en.json' },
            { code: 'fr', name: 'Français', file: 'fr.json' }
        ],
        defaultLocale: 'en',
        compilation:{
            strictMessage: false
        }

    },
    content: {
    },
    vite:{
        vue:{
            script:{
                propsDestructure: true
            }
        }
    },
})