<template>
  <div class="p-4 mb-4 border rounded-md shadow-sm bg-gray-50">
    <Heading :title="title" />
    <div>
      <DataRow
        v-for="(item, index) in items"
        :key="index"
        :label="item.label"
        :value="item.value"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import Heading from "@/atoms/Heading/Heading.vue";
import DataRow from "@/molecules/DataRow/DataRow.vue";

const props = defineProps({
  title: String,
  items: Array, // { label: String, value: [String, Number, Boolean] }[]
});
</script>
