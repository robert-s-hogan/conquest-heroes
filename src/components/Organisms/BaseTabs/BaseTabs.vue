<!-- src/components/Organisms/baseTabs/baseTabs.vue -->
<template>
  <div>
    <!-- Tab Headers -->
    <div class="tabs flex space-x-4">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click.stop="activeTab = tab.id"
        :class="[
          'px-4 py-2 rounded-md focus:outline-none',
          activeTab === tab.id
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Active Tab Content -->
    <div class="tab-content p-4">
      <component
        :is="currentTab.component"
        :encounterData="encounterData"
        v-bind="currentTab.props"
        @update:mapLocations="
          (newMapLocations) => emit('update:mapLocations', newMapLocations)
        "
        @update:encounterDetails="
          (newDetails) => emit('update:encounterDetails', newDetails)
        "
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
  // Removed unnecessary props
})

const emit = defineEmits(['update:encounterData'])

const activeTab = ref(props.tabs[0].id)

const currentTab = computed(() =>
  props.tabs.find((tab) => tab.id === activeTab.value)
)
</script>

<style scoped>
/* Add your styles here */
.active {
  font-weight: bold;
}
</style>
