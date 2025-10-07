<template>
  <div class="min-h-screen">
    <div class="bg-codewars-dark border-b border-codewars-gray-border">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">Series</h1>
        <p class="text-xl text-gray-400">Browse articles by series</p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="s in series"
          :key="s.id"
          :to="`/series/${s.slug}`"
          class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-8 hover:border-codewars-red transition-colors group"
        >
          <h2
            class="text-2xl font-bold text-white mb-2 capitalize group-hover:text-codewars-red transition-colors"
          >
            {{ s.title }}
          </h2>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import type { Series } from "../data/posts";

const series = ref<Series[]>([]);

const fetchSeries = async () => {
  const res = await fetch("/api/series");
  series.value = await res.json();
};

onMounted(() => {
  fetchSeries();
});
</script>
