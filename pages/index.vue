<template>
  <div class="screen">
    <div class="desktop-ui">
      <div class="vhs-overlay" />
      <div class="icons">
        <div class="icon" e@click="navigate('/about')">
          <img src="/assets/icons/about.svg" alt="About" />
          <span>About Me</span>
        </div>
        <div class="icon" @click="navigate('/projects')">
          <img src="/assets/icons/projects.svg" alt="Projects" />
          <span>Projects</span>
        </div>
        <div class="icon" @click="navigate('/contact')">
          <img src="/assets/icons/contact.svg" alt="Contact" />
          <span>Contact</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const router = useRouter()
const navigate = (path) => router.push(path)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.screen {
  background: radial-gradient(#202020, #000);
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Press Start 2P', monospace;
  position: relative;
  color: #00ff99;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.desktop-ui {
  padding: 2rem;
  width: 100%;
  height: 100%;
}

.icons {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.icon:hover {
  transform: scale(1.05);
}

.icon img {
  width: 64px;
  height: 64px;
  image-rendering: pixelated;
}

.icon span {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  text-align: center;
}

/* VHS scanlines + flicker */
.vhs-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02) 1px,
      transparent 1px,
      transparent 2px
  );
  mix-blend-mode: screen;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 0.1;
  }
  20%, 22%, 55% {
    opacity: 0.15;
  }
}
</style>
