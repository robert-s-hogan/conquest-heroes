<!-- src/components/atoms/CaravanContent.vue -->
<template>
  <div>Caravan</div>
</template>

<script setup>
import { defineProps } from "vue";
import InputField from "@/components/Atoms/Input/Input.vue";

const props = defineProps({
  encounterData: {
    type: Object,
    required: true,
  },
});
</script>
