<script setup lang="ts">
import { useDesktop, type DesktopApp, type IconPosition } from '~/composables/useDesktop'

const props = defineProps<{
  app: DesktopApp
  defaultPosition: IconPosition
}>()

const emit = defineEmits<{
  open: [app: DesktopApp]
}>()

const { getIconPosition, saveIconPosition } = useDesktop()

const pos = ref<IconPosition>({ x: 0, y: 0 })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const hasMoved = ref(false)
const iconRef = ref<HTMLElement | null>(null)

onMounted(() => {
  pos.value = getIconPosition(props.app.id, props.defaultPosition)
})

function onMouseDown(e: MouseEvent) {
  if (e.button !== 0) return
  isDragging.value = true
  hasMoved.value = false
  dragOffset.value = {
    x: e.clientX - pos.value.x,
    y: e.clientY - pos.value.y,
  }
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
  e.preventDefault()
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging.value) return
  const dx = e.clientX - dragOffset.value.x
  const dy = e.clientY - dragOffset.value.y
  if (Math.abs(dx - pos.value.x) > 3 || Math.abs(dy - pos.value.y) > 3) {
    hasMoved.value = true
  }
  pos.value = { x: dx, y: dy }
}

function onMouseUp() {
  isDragging.value = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
  if (hasMoved.value) {
    saveIconPosition(props.app.id, pos.value)
  }
}

function onClick() {
  if (!hasMoved.value) {
    emit('open', props.app)
  }
}

// Touch support
function onTouchStart(e: TouchEvent) {
  const touch = e.touches[0]
  isDragging.value = true
  hasMoved.value = false
  dragOffset.value = {
    x: touch.clientX - pos.value.x,
    y: touch.clientY - pos.value.y,
  }
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging.value) return
  const touch = e.touches[0]
  const dx = touch.clientX - dragOffset.value.x
  const dy = touch.clientY - dragOffset.value.y
  if (Math.abs(dx - pos.value.x) > 3 || Math.abs(dy - pos.value.y) > 3) {
    hasMoved.value = true
  }
  pos.value = { x: dx, y: dy }
  e.preventDefault()
}

function onTouchEnd() {
  isDragging.value = false
  saveIconPosition(props.app.id, pos.value)
  if (!hasMoved.value) {
    emit('open', props.app)
  }
}
</script>

<template>
  <div
      ref="iconRef"
      class="desktop-icon"
      :class="{ dragging: isDragging }"
      :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
      @mousedown="onMouseDown"
      @click="onClick"
      @touchstart.passive="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend="onTouchEnd"
  >
    <div class="icon-image">
      <img v-if="app.icon.startsWith('/')" :src="app.icon" :alt="app.label" />
      <span v-else class="icon-emoji">{{ app.icon }}</span>
    </div>
    <span class="icon-label">{{ app.label }}</span>
  </div>
</template>

<style scoped>
.desktop-icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 80px;
  cursor: pointer;
  user-select: none;
  padding: 8px 4px;
  border-radius: 8px;
  transition: background 0.15s;
}

.desktop-icon:hover {
  background: rgba(190, 103, 190, 0.15);
}

.desktop-icon.dragging {
  opacity: 0.8;
  cursor: grabbing;
  background: rgba(190, 103, 190, 0.2);
}

.icon-image {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(40, 40, 40, 0.85);
  border: 1px solid rgba(190, 103, 190, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
  transition: box-shadow 0.15s, transform 0.15s;
}

.desktop-icon:hover .icon-image {
  box-shadow: 0 4px 24px rgba(190,103,190,0.35), inset 0 1px 0 rgba(255,255,255,0.08);
  transform: scale(1.05);
}

.icon-image img {
  width: 36px;
  height: 36px;
  object-fit: contain;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.icon-emoji {
  font-size: 28px;
  line-height: 1;
}

.icon-label {
  color: #eee;
  font-size: 11px;
  font-family: 'Segoe UI', system-ui, sans-serif;
  font-weight: 500;
  text-align: center;
  text-shadow: 0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.7);
  line-height: 1.3;
  word-break: break-word;
  max-width: 76px;
}
</style>