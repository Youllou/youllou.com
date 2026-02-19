<script setup lang="ts">
import { useDesktop, type WindowState } from '~/composables/useDesktop'

const props = defineProps<{
  win: WindowState
}>()

const { closeWindow, minimizeWindow, toggleMaximize, bringToFront } = useDesktop()

const winRef = ref<HTMLElement | null>(null)

// --- Drag (titlebar) ---
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

function onTitleMouseDown(e: MouseEvent) {
  if (e.button !== 0 || props.win.maximized) return
  isDragging.value = true
  bringToFront(props.win.id)
  dragOffset.value = {
    x: e.clientX - props.win.x,
    y: e.clientY - props.win.y,
  }
  window.addEventListener('mousemove', onDragMove)
  window.addEventListener('mouseup', onDragUp)
  e.preventDefault()
}

function onDragMove(e: MouseEvent) {
  if (!isDragging.value) return
  props.win.x = Math.max(0, e.clientX - dragOffset.value.x)
  props.win.y = Math.max(0, e.clientY - dragOffset.value.y)
}

function onDragUp() {
  isDragging.value = false
  window.removeEventListener('mousemove', onDragMove)
  window.removeEventListener('mouseup', onDragUp)
}

// --- Resize ---
type ResizeDir = 'n'|'s'|'e'|'w'|'ne'|'nw'|'se'|'sw'
const isResizing = ref(false)
const resizeDir = ref<ResizeDir>('se')
const resizeStart = ref({ x: 0, y: 0, w: 0, h: 0, winX: 0, winY: 0 })
const MIN_W = 320
const MIN_H = 240

function onResizeMouseDown(e: MouseEvent, dir: ResizeDir) {
  if (props.win.maximized) return
  isResizing.value = true
  resizeDir.value = dir
  bringToFront(props.win.id)
  resizeStart.value = {
    x: e.clientX,
    y: e.clientY,
    w: props.win.width,
    h: props.win.height,
    winX: props.win.x,
    winY: props.win.y,
  }
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('mouseup', onResizeUp)
  e.preventDefault()
  e.stopPropagation()
}

function onResizeMove(e: MouseEvent) {
  if (!isResizing.value) return
  const dx = e.clientX - resizeStart.value.x
  const dy = e.clientY - resizeStart.value.y
  const dir = resizeDir.value

  if (dir.includes('e')) {
    props.win.width = Math.max(MIN_W, resizeStart.value.w + dx)
  }
  if (dir.includes('s')) {
    props.win.height = Math.max(MIN_H, resizeStart.value.h + dy)
  }
  if (dir.includes('w')) {
    const newW = Math.max(MIN_W, resizeStart.value.w - dx)
    props.win.x = resizeStart.value.winX + (resizeStart.value.w - newW)
    props.win.width = newW
  }
  if (dir.includes('n')) {
    const newH = Math.max(MIN_H, resizeStart.value.h - dy)
    props.win.y = resizeStart.value.winY + (resizeStart.value.h - newH)
    props.win.height = newH
  }
}

function onResizeUp() {
  isResizing.value = false
  window.removeEventListener('mousemove', onResizeMove)
  window.removeEventListener('mouseup', onResizeUp)
}

function onWindowClick() {
  bringToFront(props.win.id)
}

const windowStyle = computed(() => {
  if (props.win.maximized) {
    return {
      left: '0px', top: '0px',
      width: '100vw', height: '100vh',
      zIndex: props.win.zIndex,
    }
  }
  return {
    left: props.win.x + 'px',
    top: props.win.y + 'px',
    width: props.win.width + 'px',
    height: props.win.height + 'px',
    zIndex: props.win.zIndex,
  }
})
</script>

<template>
  <Transition name="window">
    <div
        v-if="!win.minimized"
        ref="winRef"
        class="desktop-window"
        :style="windowStyle"
        @mousedown="onWindowClick"
    >
      <!-- Resize handles -->
      <template v-if="!win.maximized">
        <div class="resize-handle resize-n" @mousedown.stop="onResizeMouseDown($event, 'n')" />
        <div class="resize-handle resize-s" @mousedown.stop="onResizeMouseDown($event, 's')" />
        <div class="resize-handle resize-e" @mousedown.stop="onResizeMouseDown($event, 'e')" />
        <div class="resize-handle resize-w" @mousedown.stop="onResizeMouseDown($event, 'w')" />
        <div class="resize-handle resize-ne" @mousedown.stop="onResizeMouseDown($event, 'ne')" />
        <div class="resize-handle resize-nw" @mousedown.stop="onResizeMouseDown($event, 'nw')" />
        <div class="resize-handle resize-se" @mousedown.stop="onResizeMouseDown($event, 'se')" />
        <div class="resize-handle resize-sw" @mousedown.stop="onResizeMouseDown($event, 'sw')" />
      </template>

      <!-- Titlebar -->
      <div class="titlebar" @mousedown="onTitleMouseDown" @dblclick="toggleMaximize(win.id)">
        <div class="titlebar-left">
          <span class="title-icon">
            <img v-if="win.icon.startsWith('/')" :src="win.icon" alt="" width="16" height="16" />
            <span v-else class="title-emoji">{{ win.icon }}</span>
          </span>
          <span class="title-text">{{ win.title }}</span>
        </div>
        <div class="titlebar-controls">
          <button class="ctrl-btn minimize" @click.stop="minimizeWindow(win.id)" title="Minimize">
            <span>—</span>
          </button>
          <button class="ctrl-btn maximize" @click.stop="toggleMaximize(win.id)" title="Maximize">
            <span>{{ win.maximized ? '❐' : '□' }}</span>
          </button>
          <button class="ctrl-btn close" @click.stop="closeWindow(win.id)" title="Close">
            <span>✕</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="window-content">
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.desktop-window {
  position: fixed;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border: 1px solid rgba(190, 103, 190, 0.3);
  border-radius: 10px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05);
  overflow: hidden;
  min-width: 320px;
  min-height: 240px;
}

/* Titlebar */
.titlebar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 8px 0 12px;
  background: linear-gradient(to bottom, #2a2a2a, #222222);
  border-bottom: 1px solid rgba(190, 103, 190, 0.2);
  cursor: grab;
  flex-shrink: 0;
  user-select: none;
}

.titlebar:active {
  cursor: grabbing;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
}

.title-icon img {
  display: block;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5));
}

.title-emoji {
  font-size: 14px;
}

.title-text {
  color: #ddd;
  font-size: 13px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.titlebar-controls {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.ctrl-btn {
  width: 28px;
  height: 22px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  transition: background 0.15s, transform 0.1s;
}

.ctrl-btn span {
  line-height: 1;
  pointer-events: none;
}

.minimize {
  background: rgba(255,255,255,0.08);
  color: #aaa;
}
.minimize:hover { background: rgba(255,255,255,0.16); color: #fff; }

.maximize {
  background: rgba(255,255,255,0.08);
  color: #aaa;
}
.maximize:hover { background: rgba(190,103,190,0.3); color: #be67be; }

.close {
  background: rgba(255,255,255,0.08);
  color: #aaa;
}
.close:hover { background: rgba(220,60,60,0.7); color: #fff; }

/* Content */
.window-content {
  flex: 1;
  overflow: auto;
  position: relative;
}

/* Resize handles */
.resize-handle {
  position: absolute;
  z-index: 10;
}

.resize-n  { top: 0; left: 8px; right: 8px; height: 4px; cursor: n-resize; }
.resize-s  { bottom: 0; left: 8px; right: 8px; height: 4px; cursor: s-resize; }
.resize-e  { right: 0; top: 8px; bottom: 8px; width: 4px; cursor: e-resize; }
.resize-w  { left: 0; top: 8px; bottom: 8px; width: 4px; cursor: w-resize; }
.resize-ne { top: 0; right: 0; width: 10px; height: 10px; cursor: ne-resize; }
.resize-nw { top: 0; left: 0; width: 10px; height: 10px; cursor: nw-resize; }
.resize-se { bottom: 0; right: 0; width: 10px; height: 10px; cursor: se-resize; }
.resize-sw { bottom: 0; left: 0; width: 10px; height: 10px; cursor: sw-resize; }

/* Transitions */
.window-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.window-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.window-enter-from {
  opacity: 0;
  transform: scale(0.94);
}
.window-leave-to {
  opacity: 0;
  transform: scale(0.97);
}
</style>