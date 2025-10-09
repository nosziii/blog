<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import PostCard from "../components/PostCard.vue";
import type { Post } from "../data/posts";

const route = useRoute();
const posts = ref<Post[]>([]);
const searchQuery = ref("");
const isLoading = ref(true);

const fetchSearchResults = async () => {
  const query = route.query.q as string;
  if (!query) {
    posts.value = [];
    isLoading.value = false;
    return;
  }

  searchQuery.value = query;
  isLoading.value = true;

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) {
      throw new Error("Search request failed");
    }
    posts.value = await res.json();
  } catch (error) {
    console.error("Failed to fetch search results:", error);
    posts.value = [];
  } finally {
    isLoading.value = false;
  }
};

watch(() => route.query.q, fetchSearchResults);

onMounted(() => {
  fetchSearchResults();
});
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl md:text-4xl font-bold text-white mb-6">
      Search Results for:
      <span class="text-codewars-red ml-2">"{{ searchQuery }}"</span>
    </h1>

    <div v-if="isLoading" class="text-center py-20">
      <p class="text-xl text-gray-400">Loading...</p>
    </div>

    <div v-else-if="posts.length === 0" class="text-center py-20">
      <p class="text-xl text-gray-400">
        No posts found matching your search criteria.
      </p>
      <RouterLink to="/" class="mt-4 inline-block text-codewars-red hover:underline">
        Back to Home
      </RouterLink>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>
