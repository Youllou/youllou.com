<script setup lang="ts">
const soundboardUrl = 'https://soundboard.youllou.com/'
</script>

<template>
  <div class="soundboard-wrapper">
    <iframe
        class="soundboard-frame"
        :src="soundboardUrl"
        title="Roombased soundboard"
        loading="lazy"
        allow="fullscreen"
    />
    <p class="soundboard-fallback">
      If the soundboard app does not load,
      <a :href="soundboardUrl" target="_blank" rel="noopener noreferrer">open it in a new tab</a>.
    </p>
  </div>
</template>

<style scoped>
.soundboard-wrapper {
  position: relative;
  height: 100%;
  min-height: 0;
  background: #fff;
}


.soundboard-frame {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 240px;
  border: 0;
}

.soundboard-fallback {
  position: absolute;
  right: 12px;
  bottom: 8px;
  margin: 0;
  padding: 4px 8px;
  color: #555;
  background: rgba(255, 255, 255, 0.9);
  font-size: 12px;
}

.soundboard-fallback a {
  color: #5b2a85;
}
</style>