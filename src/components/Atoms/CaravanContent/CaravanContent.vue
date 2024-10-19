<!-- src/components/atoms/CaravanContent.vue -->
<template>
  <div>
    <InputField
      v-model="localEncounterData.caravanSize"
      label="Caravan Size"
      type="number"
    />
    <!-- Add more Caravan-related fields here if necessary -->
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import InputField from '@/components/Atoms/BaseInput/BaseInput.vue'

// Define props
const props = defineProps({
  encounterData: {
    type: Object,
    required: true,
  },
})

// Define emits
const emit = defineEmits(['update:encounterData'])

// Create a reactive local copy of encounterData
const localEncounterData = reactive({ ...props.encounterData })

// Watch for changes in localEncounterData and emit updates
watch(
  () => ({ ...localEncounterData }),
  (newData) => {
    emit('update:encounterData', newData)
  },
  { deep: true }
)
</script>
