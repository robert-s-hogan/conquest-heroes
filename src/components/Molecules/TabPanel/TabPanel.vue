<!-- src/components/molecules/TabPanel.vue -->
<template>
  <div
    v-show="isActive"
    :id="`panel-${id}`"
    role="tabpanel"
    :aria-labelledby="`tab-${id}`"
    class="p-4"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "TabPanel",
  props: {
    id: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
