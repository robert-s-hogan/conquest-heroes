<!-- src/components/organisms/Tabs.vue -->
<template>
  <div>
    <!-- Tab List -->
    <TabList>
      <TabButton
        v-for="tab in tabs"
        :key="tab.id"
        :id="tab.id"
        :isActive="activeTab === tab.id"
        :variant="tab.variant"
        :loading="tab.loading"
        @activate="setActiveTab"
      >
        {{ tab.label }}
      </TabButton>
    </TabList>

    <!-- Tab Panels -->
    <div class="mt-4">
      <TabPanel
        v-for="tab in tabs"
        :key="tab.id"
        :id="tab.id"
        :isActive="activeTab === tab.id"
      >
        <component
          :is="tab.component"
          :encounterData="encounterData"
          :difficultyOptionsRef="difficultyOptionsRef"
          :terrainOptionsRef="terrainOptionsRef"
          :timeOfDayOptionsRef="timeOfDayOptionsRef"
          :weatherOptionsRef="weatherOptionsRef"
          :objectivesOptionsRef="objectivesOptionsRef"
        />
      </TabPanel>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TabList from "@/components/molecules/TabList/TabList.vue";
import TabButton from "@/components/atoms/TabButton/TabButton.vue";
import TabPanel from "@/components/molecules/TabPanel/TabPanel.vue";

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
});

const activeTab = ref(props.tabs.length > 0 ? props.tabs[0].id : null);

const setActiveTab = (id) => {
  activeTab.value = id;
};
</script>
