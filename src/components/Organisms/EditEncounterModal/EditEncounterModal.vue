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
          <div class="mt-8 grid grid-cols-3 text-center p-4 rounded-lg">
            <!-- Top Section -->
            <div class="col-span-1" />
            <div>
              <div class="border-2 border-black">
                <div
                  v-for="(item, index) in mapPositions.top"
                  :key="`top-${index}`"
                >
                  <p
                    v-if="item === 'OPPOSITION START'"
                    class="border-t-2 border-black bg-gray-200 font-bold text-red-600"
                  >
                    {{ item }}
                  </p>
                  <p v-else>{{ item || "-" }}</p>
                </div>
              </div>
            </div>
            <div class="col-span-1" />

            <!-- Left, Center, Right Sections -->
            <div class="-mt-12">
              <div class="border-2 border-black">
                <div
                  v-for="(item, index) in mapPositions.left"
                  :key="`left-${index}`"
                >
                  <p
                    v-if="item === 'OPPOSITION START'"
                    class="border-t-2 border-black bg-gray-200 font-bold text-red-600"
                  >
                    {{ item }}
                  </p>
                  <p v-else>{{ item || "-" }}</p>
                </div>
              </div>
            </div>

            <div>
              <div class="border-2 border-black">
                <div
                  v-for="(item, index) in mapPositions.center"
                  :key="`center-${index}`"
                >
                  <p
                    v-if="item === 'PLAYER START'"
                    class="border-t-2 border-black bg-gray-200 font-bold text-red-600"
                  >
                    {{ item }}
                  </p>
                  <p v-else>{{ item || "-" }}</p>
                </div>
                <p
                  class="border-2 border-black bg-gray-200 font-bold text-green-600 uppercase"
                >
                  Player Start
                </p>
              </div>
            </div>

            <div class="-mt-12">
              <div class="border-2 border-black">
                <div
                  v-for="(item, index) in mapPositions.right"
                  :key="`right-${index}`"
                >
                  <p
                    v-if="item === 'OPPOSITION START'"
                    class="border-t-2 border-black bg-gray-200 font-bold text-red-600"
                  >
                    {{ item }}
                  </p>
                  <p v-else>{{ item || "-" }}</p>
                </div>
              </div>
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
import { ref, watch } from "vue";
import InputField from "@/components/Atoms/Input/Input.vue";
import SelectField from "@/components/Atoms/SelectField/SelectField.vue";
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

const encounterData = ref({ ...props.encounter });
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

// Define map positions
const mapPositions = ref({
  top: [],
  left: [],
  right: [],
  center: ["PLAYER START"], // Player start is fixed in the center
});

// Map items with empty spots included
const mapItems = [
  "Ladder, metal, 25ft telescopic",
  "Backpack (empty)",
  "Hot Air Balloon, tethered, unoccupied",
  "Fountain (holy water)",
  "Trap - Grease Trap",
  "Beast (Ox)",
  "Cartographer's Station (empty)",
  "Suspended Cage, empty",
  "Carnival Tent",
  "Den (empty)",
  "Cannon, gunpowder loaded",
  "Levitating Stones, orbiting",
  "Construct, large",
  "Time-Worn Reliquary, sacred contents",
  "",
  "",
  "", // Adding empty spots for randomness
];

// Randomize function for assigning items to map positions
const randomizeMapItems = () => {
  const shuffledItems = [...mapItems].sort(() => Math.random() - 0.5);

  // Randomly select a position for OPPOSITION START (either top, left, or right)
  const oppositionPositions = ["top", "left", "right"];
  const randomOppositionPosition =
    oppositionPositions[Math.floor(Math.random() * oppositionPositions.length)];

  // Assign OPPOSITION START to the chosen position
  mapPositions.value[randomOppositionPosition] = [
    ...shuffledItems.slice(0, 3),
    "OPPOSITION START",
  ];

  // Index for items
  let index = 3;

  // Fill remaining positions with shuffled items
  for (const position of ["top", "left", "right", "center"]) {
    if (position !== randomOppositionPosition) {
      if (position === "center") {
        mapPositions.value[position] = shuffledItems.slice(index, index + 4);
        index += 4;
      } else {
        mapPositions.value[position] = shuffledItems.slice(index, index + 4);
        index += 4;
      }
    }
  }
};

randomizeMapItems();

watch(
  () => props.encounter,
  (newEncounter) => {
    encounterData.value = { ...newEncounter };
    randomizeMapItems(); // Re-randomize items when encounter data changes
  }
);

const closeModal = () => {
  emit("close");
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  await emit("update", encounterData.value);
  isSubmitting.value = false;
  closeModal();
};

const handleDelete = async () => {
  isDeleting.value = true;
  await emit("delete", encounterData.value.id);
  isDeleting.value = false;
  closeModal();
};
</script>
