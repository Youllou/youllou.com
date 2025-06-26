<script setup lang="ts">
const {title, startDate, endDate, description} = defineProps<{
  title: string;
  startDate: string;
  endDate?: string;
  description: string;
}>();
</script>

<template>
  <div class="timeline-item">
    <div class="timeline-content">
      <h3 class="timeline-title">{{ title }}</h3>
      <p class="timeline-date">
        {{ startDate }} - {{ endDate || 'Present' }}
      </p>
      <p class="timeline-description">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.timeline-item {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  position: relative;
  padding: 20px;
  margin: 10px 0;
  background-color: #1a1a1a;
  color: #ffffff;
  border-radius: 8px;
}

h3{
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #be67be;
}


</style>