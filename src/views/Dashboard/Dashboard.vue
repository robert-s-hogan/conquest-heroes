<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="flex flex-1">
      <aside class="w-64 bg-white p-4 shadow-md">
        <nav>
          <ul>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Home</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Profile</a>
            </li>
            <li class="mb-4">
              <a href="#" class="text-blue-500 hover:underline">Settings</a>
            </li>
          </ul>
        </nav>
      </aside>
      <main class="flex-1 p-4">
        <Heading title="Conquest of Heroes v2.5 Framework" />

        <DataSection
          title="Player Progression"
          :items="[
            { label: 'Level of Player Characters - Start', value: '1' },
            { label: 'Player Experience - Start', value: '0' },
            { label: 'XP Threshold Easy', value: '100' },
            { label: 'XP Threshold Medium', value: '200' },
            { label: 'XP Threshold Hard', value: '300' },
            { label: 'XP Threshold Deadly', value: '400' },
          ]"
        />

        <Button variant="primary">Edit Campaign</Button>
      </main>
    </div>
  </div>
</template>

<script setup>
import Heading from "@/atoms/Heading/Heading.vue";
import DataSection from "@/organisms/DataSection/DataSection.vue";
import Button from "@/atoms/Button/Button.vue";
</script>
