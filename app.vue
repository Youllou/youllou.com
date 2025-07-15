<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

useHead({
  title: "Youllou's Portfolio 🚀",
  titleTemplate: '%s',
  meta: [
    {
      name: 'description',
      content: 'Hey there! I am Youllou, a computer science student passionate about technology and cybersecurity. Explore my projects, CTFs, and creative works!'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    },
    {
      name: 'theme-color',
      content: '#1a9f34'
    },
    {
      name: 'author',
      content: 'Youllou'
    },
    {
      name: 'keywords',
      content: 'Youllou, portfolio, computer science, cybersecurity, projects, CTFs, creative works'
    },
    {
      name: 'robots',
      content: 'index, follow'
    },
    // Open Graph
    {
      property: 'og:title',
      content: "Youllou's Portfolio 🚀"
    },
    {
      property: 'og:description',
      content: 'Hey there! I am Youllou, a computer science student passionate about technology and cybersecurity. Explore my projects, CTFs, and creative works!'
    },
    {
      property: 'og:image',
      content: 'https://youllou.com/assets/images/logo.png'
    },

    {
      property: 'og:type',
      content: 'website'
    },

  ]
})
</script>


<template>
  <UApp :locale="locales[locale]">
    <NuxtPage />
  </UApp>
</template>

<style>
  body{
    margin: 0;
  }
</style>