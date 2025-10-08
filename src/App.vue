<script setup lang="ts">
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div class="min-h-screen bg-codewars-darker flex flex-col">
    <Header />
    <div class="flex-grow container mx-auto px-4 py-8">
      <main class="w-full">
        <RouterView />
      </main>
    </div>
    <Footer />
  </div>
</template>
