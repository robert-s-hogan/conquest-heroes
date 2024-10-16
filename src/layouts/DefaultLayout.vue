<template>
  <div>
    <Header />

    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from "@/components/organisms/Header/Header.vue";
</script>
