<template>
  <div>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

const isAuthenticated = ref(false);
const router = useRouter();

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      isAuthenticated.value = true;
    } else {
      isAuthenticated.value = false;
      router.push("/"); // Redirect to home if not authenticated
    }
  });
});
</script>
