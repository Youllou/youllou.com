
<script setup>
const route = useRoute();
const { data: article } = await useAsyncData("article", () =>
    queryContent(`/writeups/${route.params.folder}/${route.params.id}`).findOne()
);
</script>

<template>
  <div class="w-full pb-10 document-wrapper">
    <ContentRenderer :value="article" class="prose" />
  </div>
</template>
<style>

.document-wrapper {
  background-color: #000000;
  color: #cccccc;
  min-height: 100vh;
  font-family: 'Press Start 2P',serif;
  font-size: 1rem;
  padding: 1.5rem;
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
  margin-top: 2rem;
  color: #a020f0;
  text-decoration: underline;
  text-decoration-color: #a020f0;
}

.language-sh code{
  font-family: "FiraCode Nerd Font", monospace;
}

p a{
  text-decoration: underline;
  text-decoration-color: #a020f0;
}

</style>