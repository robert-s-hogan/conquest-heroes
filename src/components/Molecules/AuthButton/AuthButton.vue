<!-- src/components/molecules/AuthButton/AuthButton.vue -->
<template>
  <Button :variant="variant" @click="handleAuthAction">
    {{ isAuthenticated ? "Logout" : "Login" }}
  </Button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import Button from "@/components/atoms/Button/Button.vue";
import { useAuth } from "@/composables/useAuth";

const props = defineProps({
  variant: {
    type: String,
    default: "primary",
  },
  isAuthenticated: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["login", "logout"]);
const { login, logout } = useAuth();

const handleAuthAction = () => {
  if (props.isAuthenticated) {
    logout().then(() => emit("logout"));
  } else {
    login().then(() => emit("login"));
  }
};
</script>
