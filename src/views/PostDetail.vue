<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, RouterLink } from "vue-router";
import type { Post, Series } from "../data/posts";

const route = useRoute();
const post = ref<Post | null>(null);
const series = ref<Series | null>(null);

const fetchPost = async () => {
  const res = await fetch(`/api/posts/${route.params.slug}`);
  post.value = await res.json();
  if (post.value?.series_slug) {
    fetchSeries(post.value.series_slug);
  }
};

const fetchSeries = async (seriesSlug: string) => {
  const res = await fetch(`/api/series/${encodeURIComponent(seriesSlug)}`);
  series.value = await res.json();
};

onMounted(() => {
  fetchPost();
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div class="min-h-screen">
    <div v-if="!post" class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-3xl font-bold text-white mb-4">Cikk nem található</h1>
      <RouterLink to="/" class="text-codewars-red hover:underline">
        Vissza a főoldalra
      </RouterLink>
    </div>

    <article v-else class="container mx-auto px-4 py-12 max-w-4xl">
      <RouterLink
        to="/"
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
        Vissza a cikkekhez
      </RouterLink>

      <div
        class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-8 md:p-12"
      >
        <div v-if="series" class="mb-8">
          <h3 class="text-2xl font-bold text-white mb-4">
            Part of the series:
            <RouterLink
              :to="`/series/${series.slug}`"
              class="text-codewars-red hover:underline"
              >{{ series.title }}</RouterLink
            >
          </h3>
          <ul>
            <li
              v-for="(p, index) in series.posts"
              :key="p.id"
              :class="{ 'font-bold': p.id === post.id }"
            >
              <RouterLink
                :to="`/post/${p.slug}`"
                class="hover:text-codewars-red transition-colors"
              >
                {{ index + 1 }}. {{ p.title }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="flex flex-wrap items-center gap-3 mb-6">
          <span
            class="px-3 py-1 text-sm font-semibold bg-codewars-blue text-white rounded capitalize"
          >
            {{ post.category }}
          </span>
          <span class="text-codewars-gray-light">
            {{ post.read_time }} perc olvasás
          </span>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
          {{ post.title }}
        </h1>

        <div
          class="flex items-center gap-4 mb-8 pb-8 border-b border-codewars-gray-border"
        >
          <span class="text-gray-300 font-semibold">{{ post.author }}</span>
          <span class="text-codewars-gray-light">•</span>
          <span class="text-codewars-gray-light">{{
            formatDate(post.created_at)
          }}</span>
        </div>

        <div class="prose prose-invert prose-lg max-w-none">
          <div
            v-html="post.content"
            class="text-gray-300 leading-relaxed whitespace-pre-wrap"
          ></div>
        </div>

        <div
          class="flex flex-wrap gap-2 mt-12 pt-8 border-t border-codewars-gray-border"
        >
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-3 py-2 text-sm bg-codewars-gray text-gray-300 rounded hover:bg-codewars-gray-light transition-colors"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  color: white;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose :deep(h1) {
  font-size: 2.5rem;
}

.prose :deep(h2) {
  font-size: 2rem;
}

.prose :deep(h3) {
  font-size: 1.5rem;
}

.prose :deep(code) {
  background-color: #2d2d2d;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: #d5d1c3;
  font-family: "Courier New", monospace;
}

.prose :deep(pre) {
  background-color: #1c1c1c;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid #2d2d2d;
}
</style>
