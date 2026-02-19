<script setup lang="ts">
import { useDesktop, type DesktopApp } from '@/composables/useDesktop'
import PagesAbout from "@/components/PagesWindowWrapper/PagesAbout.vue";
import PagesProjects from "@/components/PagesWindowWrapper/PagesProjects.vue";
import PagesWriteups from "@/components/PagesWindowWrapper/PagesWriteups.vue";

const { windows, openWindow } = useDesktop()

// ── Define your apps here — add more as needed ───────────────────
const apps: DesktopApp[] = [
  {
    id: 'about',
    label: 'About Me',
    icon: '👤',
    component: 'PagesAbout',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: '🗂️',
    component: 'PagesProjects',
  },
  {
    id: 'writeups',
    label: 'Writeups',
    icon: '📝',
    component: 'PagesWriteups',
  },
]

// Default grid positions for icons (column of icons on the left)
function defaultPos(index: number) {
  return { x: 20, y: 20 + index * 110 }
}
</script>

<template>
  <div class="virtual-desktop">
    <!-- Desktop background -->
    <div class="desktop-bg" />

    <!-- Desktop Icons -->
    <DesktopIcon
        v-for="(app, i) in apps"
        :key="app.id"
        :app="app"
        :default-position="defaultPos(i)"
        @open="openWindow"
    />

    <!-- Windows -->
    <DesktopWindow
        v-for="win in windows"
        :key="win.id"
        :win="win"
    >
      <PagesAbout     v-if="win.appId === 'about'" />
      <PagesProjects  v-else-if="win.appId === 'projects'" />
      <PagesWriteups  v-else-if="win.appId === 'writeups'" />
      <!-- Add more pages here as you build them -->
    </DesktopWindow>

    <!-- Taskbar -->
    <div class="taskbar">
      <div class="taskbar-apps">
        <button
            v-for="win in windows"
            :key="win.id"
            class="taskbar-item"
            :class="{ minimized: win.minimized }"
            @click="win.minimized = !win.minimized"
        >
          <span class="taskbar-icon">{{ win.icon }}</span>
          <span class="taskbar-title">{{ win.title }}</span>
        </button>
      </div>
      <div class="taskbar-clock">
        <ClientOnly>
          <DesktopClock />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>
.virtual-desktop {
  position: fixed;
  inset: 0;
  overflow: hidden;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

.desktop-bg {
  position: absolute;
  inset: 0;
  background-color: #2f2f2f;
  background-image:
      radial-gradient(ellipse 80% 60% at 70% 40%, rgba(190, 103, 190, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 20% 80%, rgba(100, 60, 140, 0.08) 0%, transparent 50%);
  z-index: 0;
}

.taskbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 44px;
  background: rgba(20, 20, 20, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(190, 103, 190, 0.2);
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  z-index: 9999;
}

.taskbar-apps {
  display: flex;
  gap: 4px;
  flex: 1;
  overflow: hidden;
}

.taskbar-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 6px;
  color: #ccc;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.15s;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
}

.taskbar-item:hover {
  background: rgba(190, 103, 190, 0.2);
  border-color: rgba(190, 103, 190, 0.4);
  color: #fff;
}

.taskbar-item.minimized {
  opacity: 0.55;
}

.taskbar-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.taskbar-title {
  overflow: hidden;
  text-overflow: ellipsis;
}

.taskbar-clock {
  color: #ccc;
  font-size: 12px;
  flex-shrink: 0;
  padding-left: 12px;
  border-left: 1px solid rgba(255,255,255,0.1);
}
</style>