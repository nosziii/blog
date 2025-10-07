<template>
  <div class="min-h-screen">
    <div v-if="!series" class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-3xl font-bold text-white mb-4">Series not found</h1>
      <RouterLink to="/series" class="text-codewars-red hover:underline">
        Back to all series
      </RouterLink>
    </div>

    <article v-else class="container mx-auto px-4 py-12 max-w-4xl">
      <RouterLink
        to="/series"
        class="inline-flex items-center text-codewars-red hover:underline mb-8"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to all series
      </RouterLink>

      <div
        class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-8 md:p-12"
      >
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
          {{ series.title }}
        </h1>

        <div v-for="(post, index) in series.posts" :key="post.id" class="mb-8">
          <div class="flex items-center mb-2">
            <span class="text-2xl font-bold text-codewars-red mr-4">{{
              index + 1
            }}</span>
            <h2 class="text-2xl font-bold text-white">
              <RouterLink
                :to="`/post/${post.slug}`"
                class="hover:text-codewars-red transition-colors"
              >
                {{ post.title }}
              </RouterLink>
            </h2>
          </div>
          <p class="text-gray-400 ml-10">{{ post.excerpt }}</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import type { Series } from "../data/posts";

const route = useRoute();
const series = ref<Series | null>(null);

const fetchSeries = async () => {
  const res = await fetch(`/api/series/${route.params.slug}`);
  series.value = await res.json();
};

onMounted(() => {
  fetchSeries();
});
</script>
