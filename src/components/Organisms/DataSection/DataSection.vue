<template>
  <div class="mb-4 border-2 shadow-sm bg-gray-50 border-black">
    <div>
      <LabelText :text="title" class="pl-2 font-bold" />

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
import LabelText from "@/components/atoms/LabelText/LabelText.vue";
import DataRow from "@/components/molecules/DataRow/DataRow.vue";

const props = defineProps({
  title: String,
  items: Array, // { label: String, value: [String, Number, Boolean] }[]
});
</script>
