<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import type { Post } from "../data/posts";

const posts = ref<Post[]>([]);

const fetchPosts = async () => {
  const res = await fetch("/api/posts");
  posts.value = await res.json();
};

onMounted(() => {
  fetchPosts();
});

const categories = computed<{ name: string; count: number }[]>(() => {
  const categoryMap = new Map<string, number>();
  posts.value.forEach((post) => {
    const count = categoryMap.get(post.category) || 0;
    categoryMap.set(post.category, count + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
});
</script>

<template>
  <div class="min-h-screen">
    <div class="bg-codewars-dark border-b border-codewars-gray-border">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Kategóriák
        </h1>
        <p class="text-xl text-gray-400">
          Böngészd a cikkeket kategóriák szerint
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="category in categories"
          :key="category.name"
          to="/"
          class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-8 hover:border-codewars-red transition-colors group"
        >
          <h2
            class="text-2xl font-bold text-white mb-2 capitalize group-hover:text-codewars-red transition-colors"
          >
            {{ category.name }}
          </h2>
          <p class="text-codewars-gray-light">{{ category.count }} cikk</p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
