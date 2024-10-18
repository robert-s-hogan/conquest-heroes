<!-- EditEncounterModal.vue -->
<template>
  <Modal
    :isOpen="isOpen"
    title="Edit Encounter"
    size="large"
    @close="closeModal"
  >
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <Tabs
          :tabs="tabs"
          :encounterData="encounterData"
          :difficultyOptionsRef="difficultyOptionsRef"
          :terrainOptionsRef="terrainOptionsRef"
          :timeOfDayOptionsRef="timeOfDayOptionsRef"
          :weatherOptionsRef="weatherOptionsRef"
          :objectivesOptionsRef="objectivesOptionsRef"
        />
        <div>
          <!-- NPC Types -->
          <div class="mt-4">
            <label class="block text-gray-700">NPC Types:</label>
            <!-- Ensure npcTypes exists and is an array before rendering -->
            <div
              v-if="
                encounterData.npcTypes && Array.isArray(encounterData.npcTypes)
              "
            >
              <div
                v-for="(npcType, index) in encounterData.npcTypes"
                :key="index"
              >
                <input
                  v-model="encounterData.npcTypes[index]"
                  type="text"
                  placeholder="NPC Type"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
              </div>
            </div>
          </div>

          <!-- Map Locations -->
          <div class="mt-4">
            <label class="block text-gray-700">Map Locations:</label>
            <div
              v-for="(items, location) in encounterData.mapLocations || {}"
              :key="location"
              class="mt-2"
            >
              <h4 class="font-semibold">
                {{ location.charAt(0).toUpperCase() + location.slice(1) }}
              </h4>
              <div
                v-for="(item, index) in items"
                :key="index"
                class="flex items-center"
              >
                <input
                  v-model="encounterData.mapLocations[location][index]"
                  type="text"
                  placeholder="Item Description"
                  class="mt-1 block w-full border border-gray-300 rounded-md p-2"
                />
                <button
                  type="button"
                  class="ml-2 text-red-500"
                  @click="removeItem(location, index)"
                >
                  Remove
                </button>
              </div>
              <button
                type="button"
                class="mt-2 text-blue-500"
                @click="addItem(location)"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between mt-4">
        <Button
          type="button"
          variant="danger"
          @click="handleDelete"
          :loading="isDeleting"
        >
          Delete Encounter
        </Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          Save Changes
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup>
import { ref, watch, reactive } from "vue";
import Modal from "@/components/Atoms/Modal/Modal.vue";
import Button from "@/components/Atoms/Button/Button.vue";
import Heading from "@/components/Atoms/Heading/Heading.vue";
import CaravanContent from "@/components/Atoms/CaravanContent/CaravanContent.vue";
import MapDetailsContent from "@/components/Atoms/MapDetailsContent/MapDetailsContent.vue";
import XPDetailsContent from "@/components/Atoms/XPDetailsContent/XPDetailsContent.vue";
import Tabs from "@/components/Organisms/Tabs/Tabs.vue";

import {
  difficultyOptions,
  terrainOptions,
  timeOfDayOptions,
  weatherOptions,
  objectivesOptions,
  generateMapLocationsWithItems,
} from "@/utils/encounterUtils";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  encounter: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "update", "delete"]);

const encounterData = reactive({ ...props.encounter });
const isSubmitting = ref(false);
const isDeleting = ref(false);

// Tabs Configuration
const tabs = [
  {
    id: "xp-details",
    label: "XP Details",
    component: XPDetailsContent,
    variant: "danger",
    loading: false,
  },
  {
    id: "map-details",
    label: "Map Details",
    component: MapDetailsContent,
    variant: "primaryOutlined",
    loading: false,
  },
  {
    id: "caravan",
    label: "Caravan",
    component: CaravanContent,
    variant: "primary",
    loading: false,
  },
];

// Convert options arrays into the format expected by SelectField
const difficultyOptionsRef = ref(
  difficultyOptions.map((value) => ({ value, label: value }))
);
const terrainOptionsRef = ref(
  terrainOptions.map((value) => ({ value, label: value }))
);
const timeOfDayOptionsRef = ref(
  timeOfDayOptions.map((value) => ({ value, label: value }))
);
const weatherOptionsRef = ref(
  weatherOptions.map((value) => ({ value, label: value }))
);
const objectivesOptionsRef = ref(
  objectivesOptions.map((value) => ({ value, label: value }))
);

// Functions to handle adding/removing items
const addItem = (location) => {
  encounterData.mapLocations[location].push("");
};

const removeItem = (location, index) => {
  encounterData.mapLocations[location].splice(index, 1);
};

watch(
  () => props.encounter,
  (newEncounter) => {
    Object.assign(encounterData, newEncounter);

    // Ensure npcTypes and other fields are initialized correctly
    if (!Array.isArray(encounterData.npcTypes)) {
      encounterData.npcTypes = ["", "", "", ""]; // Ensure 4 empty NPC types
    }

    if (!encounterData.mapLocations) {
      encounterData.mapLocations = generateMapLocationsWithItems() || {};
    }
  },
  { immediate: true }
);

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await emit("update", encounterData);
  } catch (error) {
    console.error("Update failed:", error);
  } finally {
    isSubmitting.value = false;
    closeModal();
  }
};

const handleDelete = async () => {
  isDeleting.value = true;
  try {
    await emit("delete", encounterData.id);
  } catch (error) {
    console.error("Delete failed:", error);
  } finally {
    isDeleting.value = false;
    closeModal();
  }
};
</script>
