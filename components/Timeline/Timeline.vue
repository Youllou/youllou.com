<script setup lang="ts">
const { items } = defineProps<{
  allLeft: boolean;
  items: {
    title: string;
    startDate: string;
    endDate?: string;
    description: string;
    inverted?: boolean;
    link?: string;
  }[];
}>()
</script>

<template>

  <div class="timeline-container" :class="{ 'all-left': allLeft }">
    <div class="timeline-left">
      <div v-for="(item, index) in items" :key="index" class="timeline-item">
        <TimelineCard
            v-if="index%2==0 || (index%2==1 && item.inverted) || allLeft"
            class="timeline-content"
            :title="item.title"
            :startDate="item.startDate"
            :endDate="item.endDate"
            :description="item.description"
            :link="item.link"
        />
      </div>
    </div>
    <div class="timeline-line">
      <div class="timeline-future"/>
    </div>
    <div class="timeline-right" v-if="!allLeft">
      <div v-for="(item, index) in items" :key="index" class="timeline-item">
        <TimelineCard
            v-if="index%2==1 || (index%2==0 && item.inverted)"
            class="timeline-content"
            :title="item.title"
            :startDate="item.startDate"
            :endDate="item.endDate"
            :description="item.description"
            :link="item.link"
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
.timeline-item.timeline-content::after{
  content: '';
  position: absolute;
  top: 0;
  width: 10px;
  height: 100%;
  background-color: #be67be;
  border-radius: 8px;
}

.timeline-right .timeline-item.timeline-content::after {
  left: 0;
}
.timeline-left .timeline-item.timeline-content::after {
  right: 0;
}


.timeline-item.timeline-content::before {
  content: '';
  position: absolute;
  top: 50%; /* Vertically center dot to the card */
  left: 50%; /* Horizontally align with the center timeline line */
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #be67be;
  border-radius: 50%;
  z-index: 3;
}


.timeline-left .timeline-item.timeline-content::before {
  left: 100%; /* dot appears on the right of the item */
}

.timeline-right .timeline-item.timeline-content::before {
  left: 0; /* dot appears on the left of the item */
  transform: translate(-50%, -50%);
}

.timeline-line {
  grid-area: line;
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  height: 100%;
  background-color: #be67be;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;

  /* 💡 Only round bottom */
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.timeline-future {
  position: absolute;
  top: -40px;
  width: 3px;
  height: 40px;
  background-image: repeating-linear-gradient(
      to bottom,
      #be67be,
      #be67be 4px,
      transparent 4px,
      transparent 8px
  );
  content: "";
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

@media (max-width: 768px) {
  .timeline-container {
    grid-template-columns: 12fr 1fr;
    grid-template-areas:
      "left line";
  }


}


</style>