<!-- src/components/atoms/TabButton.vue -->
<template>
  <button
    type="button"
    :class="buttonClasses"
    @click="activate"
    role="tab"
    :aria-selected="isActive.toString()"
    :aria-controls="`panel-${id}`"
    :id="`tab-${id}`"
    tabindex="0"
    data-cy="button"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "TabButton",
  props: {
    id: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    // Removed variant prop as we're simplifying to two styles
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["activate"],
  computed: {
    buttonClasses() {
      // Define two styles: active and inactive
      const activeClasses =
        "px-4 py-2 border-b-2 text-blue-500 border-blue-500 font-bold focus:outline-none";
      const inactiveClasses =
        "px-4 py-2 border-b-2 border-transparent text-gray-400 hover:text-blue-500 focus:outline-none";
      const loadingClasses = this.loading
        ? "opacity-70 cursor-not-allowed"
        : "";

      return this.isActive
        ? `${activeClasses} ${loadingClasses}`
        : `${inactiveClasses} ${loadingClasses}`;
    },
  },
  methods: {
    activate() {
      if (!this.loading) {
        this.$emit("activate", this.id);
      }
    },
  },
};
</script>
