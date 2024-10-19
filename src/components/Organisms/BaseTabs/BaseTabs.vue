<!-- src/components/Organisms/Tabs/Tabs.vue -->
<template>
  <div>
    <!-- Tab Headers -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="{ active: activeTab === tab.id }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Active Tab Content -->
    <div class="tab-content">
      <component
        :is="currentTab.component"
        :encounterData="encounterData"
        v-bind="currentTab.props"
        @update:encounterData="handleUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  encounterData: {
    type: Object,
    required: true,
  },
  difficultyOptionsRef: {
    type: Array,
    required: true,
  },
  terrainOptionsRef: {
    type: Array,
    required: true,
  },
  timeOfDayOptionsRef: {
    type: Array,
    required: true,
  },
  weatherOptionsRef: {
    type: Array,
    required: true,
  },
  objectivesOptionsRef: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:encounterData'])

const activeTab = ref(props.tabs[0].id)

const currentTab = computed(() =>
  props.tabs.find((tab) => tab.id === activeTab.value)
)

// Handle update:encounterData from child components
const handleUpdate = (updatedData) => {
  emit('update:encounterData', updatedData)
}
</script>

<style scoped>
/* Add your styles here */
.active {
  font-weight: bold;
}
</style>
