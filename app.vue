<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

useHead({
  title: "Youllou's Portfolio 🚀",
  meta: [
    {
      name: 'description',
      content: 'Personal portfolio showcasing projects, writeups, and creative works by a passionate CS student.'
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
      content: 'Explore my projects, CTFs, and creative works as a computer science student.'
    },
    {
      property: 'og:image',
      content: 'https://youllou.com/assets/images/logo.svg'
    },
    {
      property: 'og:url',
      content: 'https://youllou.com'
    },
    {
      property: 'og:type',
      content: 'website'
    },
    // Twitter Card
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    },
    {
      name: 'twitter:title',
      content: "Youllou's Portfolio 🚀"
    },
    {
      name: 'twitter:description',
      content: 'Check out my projects and CTF writeups!'
    },
    {
      name: 'twitter:image',
      content: 'https://youllou.com/assets/images/logo.svg'
    }
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