
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
  overflow: hidden;
  padding-bottom: 5%;
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
@font-face {
  font-family: 'Proto Nerd Font';
  src: url('/assets/fonts/0xProtoNerdFont-Regular.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}


.language-sh code{
  font-family: "Proto Nerd Font", monospace;
}

p a{
  text-decoration: underline;
  text-decoration-color: #a020f0;
}

img{
  width: 70%;
}

ul {
  list-style-type: "- " ;
  padding-left: 2rem;
}

useparator{
  margin: 2rem 0;
  border-top: 2px solid #a020f0;
}
</style>