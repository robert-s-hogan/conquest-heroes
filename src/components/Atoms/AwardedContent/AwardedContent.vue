<!-- src/components/Atoms/AwardedContent/AwardedContent.vue -->
<template>
  <div class="p-4">
    <h3 class="text-xl font-semibold mb-4">Awarded Rewards</h3>
    <div v-if="hasAwards">
      <p class="mb-2">
        <strong>Awarded XP:</strong> {{ encounterData.awardedXp }}
      </p>
      <div>
        <strong>Awarded Items:</strong>
        <ul class="list-disc ml-4">
          <li v-for="(item, index) in encounterData.awardedItems" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <p>No rewards have been awarded for this encounter.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  encounterData: {
    type: Object,
    required: true,
  },
})

const hasAwards = computed(() => {
  return (
    (props.encounterData.awardedXp && props.encounterData.awardedXp > 0) ||
    (props.encounterData.awardedItems &&
      props.encounterData.awardedItems.length > 0)
  )
})
</script>
