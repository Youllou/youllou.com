<script setup lang="ts">
const { items } = defineProps<{
  items: {
    title: string;
    startDate: string;
    endDate?: string;
    description: string;
    inverted?: boolean;
  }[];
}>()
</script>

<template>

  <div class="timeline-container">
    <div class="timeline-left">
      <div v-for="(item, index) in items" :key="index" class="timeline-item">
        <TimelineCard
            v-if="index%2==0 || (index%2==1 && item.inverted)"
            class="timeline-content"
            :title="item.title"
            :startDate="item.startDate"
            :endDate="item.endDate"
            :description="item.description"
        />
      </div>
    </div>
    <div class="timeline-line">
      <div v-for="item in items" class="dot"></div>
    </div>
    <div class="timeline-right">
      <div v-for="(item, index) in items" :key="index" class="timeline-item">
        <TimelineCard
            v-if="index%2==1 || (index%2==0 && item.inverted)"
            class="timeline-content"
            :title="item.title"
            :startDate="item.startDate"
            :endDate="item.endDate"
            :description="item.description"
        />
      </div>
    </div>
  </div>

</template>

<style scoped>

.timeline-container {
  position: relative;
  padding: 20px;
  color: #ffffff;
  display: grid;
  grid-template-columns: 12fr 1fr 12fr;
  grid-template-areas:
    "left line right";
}
.timeline-left,
.timeline-right {
  display: flex;
  flex-direction: column;
}

.timeline-left {
  grid-area: left;
  padding-right: 20px;
}
.timeline-right {
  grid-area: right;
  padding-left: 20px;
}

.timeline-content {
  z-index: 1;
  position: relative;
  padding: 20px;
  margin: 10px 0;
  background-color: #1a1a1a;
  color: #ffffff;
  border-radius: 8px;
}

/* decoration on card border */
.timeline-content:after{
  content: '';
  position: absolute;
  top: 0;
  width: 10px;
  height: 100%;
  background-color: #be67be;
  border-radius: 8px;
}

.timeline-right .timeline-content:after {
  left: 0;
}
.timeline-left .timeline-content:after {
  right: 0;
}




.timeline-line {
  grid-area: line;
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  border-radius: 20px;
  height: 100%;
  background-color: #be67be;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.timeline-item:not(:has(.timeline-content)) {
  width: 100%;
  height: 100%;
}

.dot{
  position: relative;
  left: 50%;
  width: 20px;
  height: 20px;
  background-color: #be67be;
  border-radius: 50%;
  transform: translateX(-50%);
}
</style>