<template>
  <div class="space-y-6">
    <h2 class="text-2xl font-bold">Post Statistics</h2>

    <!-- Stat Boxes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        @click="filterBy = 'all'"
        class="p-6 rounded-lg shadow cursor-pointer transition-transform transform hover:-translate-y-1"
        :class="filterBy === 'all' ? 'bg-blue-500 text-white' : 'bg-white'"
      >
        <h3 class="text-lg font-medium">Total Posts</h3>
        <p class="text-3xl font-bold">{{ totalPosts }}</p>
      </div>
      <div
        @click="filterBy = 'published'"
        class="p-6 rounded-lg shadow cursor-pointer transition-transform transform hover:-translate-y-1"
        :class="
          filterBy === 'published' ? 'bg-green-500 text-white' : 'bg-white'
        "
      >
        <h3 class="text-lg font-medium">Published</h3>
        <p class="text-3xl font-bold">{{ publishedPostsCount }}</p>
      </div>
      <div
        @click="filterBy = 'draft'"
        class="p-6 rounded-lg shadow cursor-pointer transition-transform transform hover:-translate-y-1"
        :class="filterBy === 'draft' ? 'bg-yellow-500 text-white' : 'bg-white'"
      >
        <h3 class="text-lg font-medium">Drafts</h3>
        <p class="text-3xl font-bold">{{ draftPostsCount }}</p>
      </div>
    </div>

    <!-- Post List -->
    <div>
      <h3 class="text-xl font-semibold mb-4 capitalize">
        {{ filterBy }} Posts
      </h3>
      <PostList :posts="displayedPosts" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { Post } from "../../data/posts";
import PostList from "./PostList.vue"; // We will reuse the PostList component

const props = defineProps<{
  posts: Post[];
}>();

const filterBy = ref<"all" | "published" | "draft">("all");

const totalPosts = computed(() => props.posts.length);
const publishedPostsCount = computed(
  () => props.posts.filter((p) => p.published).length
);
const draftPostsCount = computed(
  () => props.posts.filter((p) => !p.published).length
);

const displayedPosts = computed(() => {
  switch (filterBy.value) {
    case "published":
      return props.posts.filter((p) => p.published);
    case "draft":
      return props.posts.filter((p) => !p.published);
    case "all":
    default:
      return props.posts;
  }
});
</script>
