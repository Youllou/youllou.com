
<script setup>
const route = useRoute();
const { data: article } = await useAsyncData("article", () =>
    queryContent(`/writeups/${route.params.folder}/${route.params.id}`).findOne()
);
console.log(article.value);
console.log(`/writeups/${route.params.folder}/${route.params.id}`)

</script>

<template>
  <div class="w-full pb-10">
    <div
        class="max-w-7xl bg-white rounded-3xl flex flex-col items-center shadow-md -mt-20 mx-auto p-10 gap-10"
    >
      <ContentRenderer :value="article" class="prose" />
    </div>
  </div>
</template>