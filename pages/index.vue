<template>
  <div class="screen">
    <div class="desktop-ui">
      <div class="vignette"/>
      <div class="vhs-overlay" />
      <div class="icons">
        <div class="icon" id="iconAbout" @click="navigate('/about')">
          <img src="/assets/icons/about.svg" alt="About" />
          <span>About Me</span>
        </div>
        <div class="icon" id="iconProjects" @click="navigate('/projects')">
          <img src="/assets/icons/projects.svg" alt="Projects" />
          <span>Projects</span>
        </div>
        <div class="icon" id="iconWriteups" @click="navigate('/writeups')">
          <img src="/assets/icons/console.svg" alt="Writeups" />
          <span>Writeups</span>
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
  background-color: #000000;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Press Start 2P', monospace;
  position: relative;
  color: #1a9f34;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

.desktop-ui {
  background: radial-gradient(#414141, #1a1a1a);
  padding: 4rem;
  width: 100%;
  height: calc(100vh - 8rem);
}


.icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  cursor: pointer;
  transition: transform 0.2s ease;
}


#iconAbout {
  top: 22%;
  left: 35%;
}

#iconProjects {
  top: 33%;
  left: 62%;
}

#iconWriteups {
  top: 53%;
  left: 40%;
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
  font-size: 1rem;
  text-align: center;
}

/* VHS scanlines + flicker */
.vhs-overlay {
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5) 2px,
      transparent 1px,
      transparent 4px
  );
  mix-blend-mode: screen;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    opacity: 0.1;
  }
  20%, 22%, 55% {
    opacity: 0.13;
  }
}

.vignette{
  pointer-events: none;
  position: absolute;
  inset: 0;
  background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/86186/crt.png);
  @include fill;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 10000;

}
</style>
