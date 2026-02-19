<script setup lang="ts">
const now = ref(new Date())
let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => clearInterval(interval))

const time = computed(() =>
    now.value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
)
const date = computed(() =>
    now.value.toLocaleDateString([], { month: 'short', day: 'numeric' })
)
</script>

<template>
  <div class="clock">
    <span class="time">{{ time }}</span>
    <span class="date">{{ date }}</span>
  </div>
</template>

<style scoped>
.clock {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  line-height: 1.2;
}
.time {
  font-size: 13px;
  color: #eee;
  font-weight: 500;
}
.date {
  font-size: 10px;
  color: #999;
}
</style>