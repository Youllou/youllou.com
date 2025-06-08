<script setup lang="ts">
const posts = []; // Replace with your posts array when available
</script>
<template>
  <div class="writeups-page">
    <h1>Writeups</h1>
    <div v-if="posts.length === 0" class="no-posts">
      <p>Writeups are on their way...<span class="cursor">|</span></p>
    </div>
    <ul v-else class="posts-list">
      <li v-for="(post, index) in posts" :key="index">
        <a :href="post.link">{{ post.title }}</a>
      </li>
    </ul>
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

.posts-list {
  list-style: none;
  padding: 0;
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