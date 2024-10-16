<template>
  <Modal
    :isOpen="isOpen"
    title="Edit Encounter"
    size="large"
    @close="closeModal"
  >
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 md:grid-cols-2">
        <div>
          <!-- Input Fields -->
          <InputField
            v-model="encounterData.numberOfPlayers"
            label="Number of Players"
            type="number"
          />
          <InputField
            v-model="encounterData.encounterExperience"
            label="Encounter Experience"
            type="number"
          />
          <InputField
            v-model="encounterData.encounterAdjustedExperience"
            label="Encounter Adjusted Experience"
            type="number"
          />
          <div class="grid grid-cols-2 lg:grid-cols-4">
            <!-- Select Fields -->
            <SelectField
              v-model="encounterData.encounterDifficultyOption"
              label="Encounter Difficulty Option"
              :options="difficultyOptions"
            />
            <SelectField
              v-model="encounterData.mapTerrainType"
              label="Map Terrain Type"
              :options="terrainOptions"
            />
            <SelectField
              v-model="encounterData.timeOfDay"
              label="Time of Day"
              :options="timeOfDayOptions"
            />
            <SelectField
              v-model="encounterData.weather"
              label="Weather"
              :options="weatherOptions"
            />
            <SelectField
              v-model="encounterData.objectivesOfEncounter"
              label="Objectives"
              :options="objectiveOptions"
            />
          </div>
        </div>
        <div>
          <div class="mt-8 grid grid-cols-3 text-center p-4 rounded-lg">
            <!-- Top Section -->
            <div class="col-span-1" />
            <div class="">
              <div class="border-2 border-black">
                <Heading level="4" title="Top" />
                <div v-for="item in mapPositions.top" :key="item">
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
                <Heading level="4" title="Left" />
                <div v-for="item in mapPositions.left" :key="item">
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
                <Heading level="4" title="Center" />
                <div v-for="item in mapPositions.center" :key="item">
                  <p
                    v-if="item === 'PLAYER START'"
                    class="border-t-2 border-black bg-gray-200 font-bold text-red-600"
                  >
                    {{ item }}
                  </p>
                  <p v-else>{{ item || "-" }}</p>
                </div>
                <p
                  class="border-2 border-black bg-gray-200 font-bold text-red-600 uppercase"
                >
                  Player Start
                </p>
              </div>
            </div>

            <div class="-mt-12">
              <div class="border-2 border-black">
                <Heading level="4" title="Right" />
                <div v-for="item in mapPositions.right" :key="item">
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
import { ref, defineProps, defineEmits, watch } from "vue";
import Modal from "@/atoms/Modal/Modal.vue";
import InputField from "@/atoms/Input/Input.vue";
import SelectField from "@/atoms/SelectField/SelectField.vue";
import Button from "@/atoms/Button/Button.vue";
import Heading from "@/atoms/Heading/Heading.vue";

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

  // Fill remaining positions with shuffled items
  if (randomOppositionPosition !== "top") {
    mapPositions.value.top = shuffledItems.slice(3, 7);
  }
  if (randomOppositionPosition !== "left") {
    mapPositions.value.left = shuffledItems.slice(7, 11);
  }
  if (randomOppositionPosition !== "right") {
    mapPositions.value.right = shuffledItems.slice(11, 15);
  }
  if (randomOppositionPosition !== "center") {
    mapPositions.value.center = shuffledItems.slice(15, 18);
  }
};

// Initialize randomized map items
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
