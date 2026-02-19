<script setup lang="ts">
const route = useRoute()
const { data: article } = await useAsyncData('article', () =>
    queryContent(`/writeups/${route.params.folder}/${route.params.id}`).findOne()
)
</script>

<template>
  <div class="document-wrapper">
    <NuxtLink to="/writeups" class="back-link">← back</NuxtLink>
    <ContentRenderer :value="article" class="prose" />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.document-wrapper {
  background-color: #000000;
  color: #cccccc;
  min-height: 100vh;
  font-family: 'Press Start 2P', serif;
  font-size: 1rem;
  padding: 1.5rem;
  overflow: hidden;
  padding-bottom: 5%;
}

.back-link {
  display: inline-block;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  color: #660066;
  text-decoration: none;
  margin-bottom: 2rem;
  border: 1px solid #330033;
  padding: 6px 10px;
  border-radius: 3px;
  transition: color 0.15s, border-color 0.15s;
}
.back-link:hover {
  color: #ff66ff;
  border-color: #a020f0;
}

.subtitle {
  color: #999999;
  font-size: 0.75rem;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2rem !important;
  font-weight: bold;
  color: #a020f0;
  text-decoration: underline;
  text-decoration-color: #a020f0;
  margin-bottom: 1rem;
}

h2 {
  font-size: 1.5rem;
  margin-top: 2rem;
  color: #a020f0;
  text-decoration: underline;
  text-decoration-color: #a020f0;
}

@font-face {
  font-family: 'Proto Nerd Font';
  src: url('/assets/fonts/0xProtoNerdFont-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.language-sh code {
  font-family: "Proto Nerd Font", monospace;
}

p a {
  text-decoration: underline;
  text-decoration-color: #a020f0;
}

img {
  width: 70%;
}

ul {
  list-style-type: "- ";
  padding-left: 2rem;
}

@media only screen and (min-width: 768px) {
  .document-wrapper {
    padding: 5% 15%;
  }
}
</style>