<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
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