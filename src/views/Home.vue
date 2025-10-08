<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import PostCard from "../components/PostCard.vue";
import type { Post } from "../data/posts";

// From Home.vue
const posts = ref<Post[]>([]);
const selectedCategory = ref<string>("all");

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

// From Sidebar.vue
interface RecentPost {
  title: string;
  slug: string;
  excerpt: string;
}

interface Tag {
  tag: string;
  count: number;
}

const recentPosts = ref<RecentPost[]>([]);
const tags = ref<Tag[]>([]);

const fetchRecentPosts = async () => {
  try {
    const res = await fetch('/api/posts/recent');
    recentPosts.value = await res.json();
  } catch (error) {
    console.error('Failed to fetch recent posts:', error);
  }
};

const fetchTags = async () => {
  try {
    const res = await fetch('/api/tags');
    tags.value = await res.json();
  } catch (error) {
    console.error('Failed to fetch tags:', error);
  }
};

const tagFontSize = (count: number) => {
  const minSize = 0.8; // rem
  const maxSize = 1.5; // rem
  const scale = Math.min(Math.log(count + 1) / Math.log(20), 1); // Logarithmic scale, adjust 20 for sensitivity
  const size = minSize + (maxSize - minSize) * scale;
  return `${size}rem`;
};

onMounted(async () => {
  // From Home.vue
  const res = await fetch("/api/posts");
  posts.value = await res.json();

  // From Sidebar.vue
  fetchRecentPosts();
  fetchTags();
});
</script>

<template>
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
    <div class="flex flex-col lg:flex-row gap-12">
      <div class="w-full lg:w-3/4">
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

      <div class="w-full lg:w-1/4 space-y-8">
        <!-- Recent Posts -->
        <section>
          <h3 class="text-xl font-bold mb-4 text-white">Recent Posts</h3>
          <div v-if="recentPosts.length" class="space-y-4">
            <div v-for="post in recentPosts" :key="post.slug">
              <router-link :to="`/post/${post.slug}`" class="font-semibold text-codewars-yellow hover:text-blue-600 transition-colors">
                {{ post.title }}
              </router-link>
              <p class="text-sm text-gray-400">{{ post.excerpt }}</p>
            </div>
          </div>
          <div v-else>
            <p class="text-gray-500">No recent posts found.</p>
          </div>
        </section>

        <!-- Tag Cloud -->
        <section>
          <h3 class="text-xl font-bold mb-4 text-white">Tags</h3>
          <div v-if="tags.length" class="flex flex-wrap gap-2">
            <span 
              v-for="tag in tags" 
              :key="tag.tag"
              :style="{ fontSize: tagFontSize(tag.count) }"
              class="px-2 py-1 bg-codewars-gray text-gray-300 rounded-md hover:bg-blue-500 hover:text-white transition-colors cursor-pointer"
            >
              {{ tag.tag }}
            </span>
          </div>
          <div v-else>
            <p class="text-gray-500">No tags found.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>