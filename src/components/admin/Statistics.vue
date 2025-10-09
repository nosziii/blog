<template>
  <div class="space-y-8">
    <h2 class="text-2xl font-bold text-white">Post Statistics</h2>

    <!-- Stat Boxes -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div
        @click="filterBy = 'all'"
        class="p-6 rounded-xl border transition-all duration-300 cursor-pointer"
        :class="
          filterBy === 'all'
            ? 'bg-[#84ff61]/10 border-[#84ff61]'
            : 'bg-[#121417] border-neutral-800 hover:bg-neutral-800/60'
        "
      >
        <h3 class="text-lg font-medium text-gray-300">Total Posts</h3>
        <p
          class="text-3xl font-bold"
          :class="filterBy === 'all' ? 'text-[#84ff61]' : 'text-white'"
        >
          {{ totalPosts }}
        </p>
      </div>
      <div
        @click="filterBy = 'published'"
        class="p-6 rounded-xl border transition-all duration-300 cursor-pointer"
        :class="
          filterBy === 'published'
            ? 'bg-green-500/10 border-green-500'
            : 'bg-[#121417] border-neutral-800 hover:bg-neutral-800/60'
        "
      >
        <h3 class="text-lg font-medium text-gray-300">Published</h3>
        <p
          class="text-3xl font-bold"
          :class="filterBy === 'published' ? 'text-green-400' : 'text-white'"
        >
          {{ publishedPostsCount }}
        </p>
      </div>
      <div
        @click="filterBy = 'draft'"
        class="p-6 rounded-xl border transition-all duration-300 cursor-pointer"
        :class="
          filterBy === 'draft'
            ? 'bg-yellow-500/10 border-yellow-500'
            : 'bg-[#121417] border-neutral-800 hover:bg-neutral-800/60'
        "
      >
        <h3 class="text-lg font-medium text-gray-300">Drafts</h3>
        <p
          class="text-3xl font-bold"
          :class="filterBy === 'draft' ? 'text-yellow-400' : 'text-white'"
        >
          {{ draftPostsCount }}
        </p>
      </div>
    </div>

    <!-- Post List -->
    <div>
      <h3 class="text-xl font-semibold mb-4 capitalize text-white">
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
