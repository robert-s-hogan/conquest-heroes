<!-- src/components/molecules/AuthButton/AuthButton.vue -->
<template>
  <Button :variant="variant" @click="handleAuthAction">
    {{ isAuthenticated ? "Logout" : "Login" }}
  </Button>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import { useRouter } from "vue-router";
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
const router = useRouter(); // Access the router

const handleAuthAction = () => {
  if (props.isAuthenticated) {
    // If authenticated, logout
    logout().then(() => emit("logout"));
  } else {
    // Redirect to the login page if not authenticated
    router.push("/login"); // Adjust the route path if necessary
    login().then(() => emit("login"));
  }
};
</script>
