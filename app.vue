<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()

useHead({
  title: "Youllou's Portfolio 🚀",
  titleTemplate: '%s',
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
      content: 'https://youllou.com/assets/images/logo.png'
    },
    {
      property: 'og:url',
      content: 'https://youllou.com'
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