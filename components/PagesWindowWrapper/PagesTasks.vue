<script setup lang="ts">
const tasksUrl = 'https://tasks.youllou.com/'
</script>

<template>
  <div class="tasks-wrapper">
    <iframe
      class="tasks-frame"
      :src="tasksUrl"
      title="Youllou tasks"
      loading="lazy"
      allow="fullscreen"
    />
    <p class="tasks-fallback">
      If the tasks app does not load,
      <a :href="tasksUrl" target="_blank" rel="noopener noreferrer">open it in a new tab</a>.
    </p>
  </div>
</template>

<style scoped>
.tasks-wrapper {
  position: relative;
  height: 100%;
  min-height: 0;
  background: #fff;
}

.tasks-frame {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 240px;
  border: 0;
}

.tasks-fallback {
  position: absolute;
  right: 12px;
  bottom: 8px;
  margin: 0;
  padding: 4px 8px;
  color: #555;
  background: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.tasks-fallback a {
  color: #5b2a85;
}
</style>