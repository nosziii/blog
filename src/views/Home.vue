<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import PostCard from "../components/PostCard.vue";
import type { Post } from "../data/posts";

const posts = ref<Post[]>([]);
const selectedCategory = ref<string>("all");

onMounted(async () => {
  const res = await fetch("/api/posts");
  posts.value = await res.json();
});

const filteredPosts = computed(() => {
  if (selectedCategory.value === "all") {
    return posts.value;
  }
  return posts.value.filter((post) => post.category === selectedCategory.value);
});

const categories = computed(() => {
  const uniqueCategories = [...new Set(posts.value.map((p) => p.category))];
  return uniqueCategories;
});

const filterByCategory = (category: string) => {
  selectedCategory.value = category;
};
</script>

<template>
  <div class="min-h-screen">
    <div class="bg-codewars-dark border-b border-codewars-gray-border">
      <div class="container mx-auto px-4 py-12">
        <h1 class="text-4xl md:text-5xl font-bold text-white mb-4">
          Fedezd fel a tudást
        </h1>
        <p class="text-xl text-gray-400 max-w-2xl">
          Cikkek, tutorialok és tippek fejlesztőknek és programozóknak
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <div class="mb-8">
        <div class="flex flex-wrap gap-3">
          <button
            @click="filterByCategory('all')"
            :class="[
              'px-4 py-2 rounded font-semibold transition-colors',
              selectedCategory === 'all'
                ? 'bg-codewars-red text-white'
                : 'bg-codewars-gray text-gray-300 hover:bg-codewars-gray-light',
            ]"
          >
            Összes
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="filterByCategory(category)"
            :class="[
              'px-4 py-2 rounded font-semibold transition-colors capitalize',
              selectedCategory === category
                ? 'bg-codewars-red text-white'
                : 'bg-codewars-gray text-gray-300 hover:bg-codewars-gray-light',
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <div v-if="filteredPosts.length === 0" class="text-center py-20">
        <p class="text-xl text-gray-400">
          Még nincsenek cikkek ebben a kategóriában.
        </p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCard v-for="post in filteredPosts" :key="post.id" :post="post" />
      </div>
    </div>
  </div>
</template>
