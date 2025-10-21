<script setup lang="ts">

import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
const query: QueryBuilderParams = { path: '/writeups', where: [{ meta: 'folder' }],
sort: [{ date: -1 }] }
const { data: files } = await useAsyncData('writeups', () =>
    queryContent('writeups').only(['title', 'path', 'dir', 'slug']).find()
)
</script>


<template>
  <div class="writeups-page">
    <h1>Writeups</h1>
    <div v-if="files?.length === 0" class="no-posts">
      <p>Writeups are on their way...<span class="cursor">|</span></p>
    </div>
    <div v-else class="post-wrapper">
      <ContentList :query="query"  v-slot="{ list }"  >
        <div v-for="folder in list" :key="folder._path" class="folder-section">
          <h2>{{ folder.title }}</h2>
          <ContentList :folder="folder" v-slot="{ list: articles }">
            <ul class="posts-list">
              <li v-for="article in (articles || []).filter(a => a?.meta !== 'folder')" :key="article._path">
                <NuxtLink :to="article._path">{{ article.title }}</NuxtLink>
              </li>
            </ul>
          </ContentList>
        </div>
      </ContentList>
    </div>
  </div>
</template>

<style scoped>
.writeups-page {
  background-color: #000000;
  color: #a020f0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Press Start 2P', monospace;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
}

.no-posts p {
  font-size: 1.2rem;
  text-align: center;
}

.post-wrapper {
  width: 80%;
}


.posts-list {
  list-style-type: "|-- " ;
  padding-left: 4rem;
}

.posts-list li {
  margin: 0.5rem 0;
}

.posts-list a {
  color: #a020f0;
  text-decoration: none;
  transition: color 0.2s ease;
}

.posts-list a:hover {
  color: #ffffff;
}

.cursor {
  display: inline-block;
  margin-left: 5px;
  width: 10px;
  background-color: #a020f0;
  animation: blink 1s step-start infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}


</style>