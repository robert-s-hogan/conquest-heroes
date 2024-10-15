<!-- EncounterItem.vue -->
<template>
  <div
    class="p-4 bg-white rounded shadow mb-2 cursor-pointer hover:bg-gray-100"
    @click="openEditModal"
  >
    <div class="flex justify-between items-center">
      <div>
        <h3 class="text-lg font-semibold">{{ encounterTitle }}</h3>
        <p class="text-sm text-gray-600">{{ encounterDescription }}</p>
      </div>
      <div>
        <span class="text-gray-500">{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Edit Encounter Modal -->
    <EditEncounterModal
      v-if="isEditModalOpen"
      :isOpen="isEditModalOpen"
      :encounter="encounter"
      @close="isEditModalOpen = false"
      @update="handleUpdateEncounter"
      @delete="handleDeleteEncounter"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";
import EditEncounterModal from "@/organisms/EditEncounterModal/EditEncounterModal.vue";

const props = defineProps({
  encounter: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-encounter", "delete-encounter"]);

const isEditModalOpen = ref(false);

const openEditModal = () => {
  isEditModalOpen.value = true;
};

const handleUpdateEncounter = (updatedEncounter) => {
  emit("update-encounter", updatedEncounter);
  isEditModalOpen.value = false;
};

const handleDeleteEncounter = (encounterId) => {
  emit("delete-encounter", encounterId);
  isEditModalOpen.value = false;
};

const encounterTitle = computed(() => {
  return `Encounter: ${props.encounter.encounterDifficulty || "N/A"}`;
});

const encounterDescription = computed(() => {
  return `XP: ${
    props.encounter.encounterAdjustedExperience || "No data"
  }, Gold: ${props.encounter.goldEarned || "No data"}`;
});

const formattedDate = computed(() => {
  const date = new Date(props.encounter.date);
  return date.toLocaleDateString();
});
</script>
