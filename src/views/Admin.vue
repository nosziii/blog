<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";
import { usePosts } from "../composables/usePosts";
import { useSeries } from "../composables/useSeries";

import LoginModal from "../components/LoginModal.vue";
import PostList from "../components/admin/PostList.vue";
import PostForm from "../components/admin/PostForm.vue";
import SeriesList from "../components/admin/SeriesList.vue";
import SeriesForm from "../components/admin/SeriesForm.vue";
import Statistics from "../components/admin/Statistics.vue";

const router = useRouter();
const activeTab = ref<"posts" | "series" | "stats">("posts");

const {
  isAuthenticated,
  showLoginModal,
  checkAuth,
  handleLogin: performLogin,
  handleLogout,
} = useAuth();

const {
  posts,
  activePostTab,
  selectedPost,
  searchTerm,
  selectedCategory,
  selectedTag,
  allCategories,
  allTags,
  filteredPosts,
  fetchPosts,
  handleCreateNewPost,
  handleEditPost,
  handleDeletePost,
  handleSubmitPost,
  handleCancelPost,
} = usePosts();

const {
  series,
  activeSeriesTab,
  selectedSeries,
  fetchSeries,
  handleCreateNewSeries,
  handleEditSeries,
  handleDeleteSeries,
  handleSubmitSeries,
  handleCancelSeries,
} = useSeries();

const handleLogin = async (credentials: any) => {
  const success = await performLogin(credentials);
  if (success) {
    fetchPosts();
    fetchSeries();
  }
};

onMounted(async () => {
  const isLoggedIn = await checkAuth();
  if (isLoggedIn) {
    fetchPosts();
    fetchSeries();
  }
});
</script>

<template>
  <div>
    <LoginModal
      v-if="showLoginModal"
      @close="router.push('/')"
      @login="handleLogin"
    />
    <div v-if="isAuthenticated" class="min-h-screen bg-[#0c0f12] text-gray-100">
      <div class="bg-[#121417] border-b border-neutral-800 shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-3xl font-bold text-white">Admin Panel</h1>
            <div class="flex items-center space-x-4">
              <button
                v-if="activeTab === 'posts' && activePostTab === 'list'"
                @click="handleCreateNewPost"
                class="px-4 py-2 rounded-md bg-[#84ff61] text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90 transition-all"
              >
                Create New Post
              </button>
              <button
                v-if="activeTab === 'series' && activeSeriesTab === 'list'"
                @click="handleCreateNewSeries"
                class="px-4 py-2 rounded-md bg-[#84ff61] text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90 transition-all"
              >
                Create New Series
              </button>
              <button
                @click="handleLogout"
                class="px-4 py-2 rounded-md border border-neutral-700 bg-transparent text-sm text-gray-300 hover:bg-neutral-800/60 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          <div class="flex border-b border-neutral-800">
            <button
              @click="activeTab = 'posts'"
              :class="[
                'px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'posts'
                  ? 'border-b-2 border-[#84ff61] text-[#84ff61]'
                  : 'text-gray-400 hover:text-white',
              ]"
            >
              Posts
            </button>
            <button
              @click="activeTab = 'series'"
              :class="[
                'px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'series'
                  ? 'border-b-2 border-[#84ff61] text-[#84ff61]'
                  : 'text-gray-400 hover:text-white',
              ]"
            >
              Series
            </button>
            <button
              @click="activeTab = 'stats'"
              :class="[
                'px-4 py-3 text-sm font-medium transition-colors',
                activeTab === 'stats'
                  ? 'border-b-2 border-[#84ff61] text-[#84ff61]'
                  : 'text-gray-400 hover:text-white',
              ]"
            >
              Statistics
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="activeTab === 'posts'">
          <div v-if="activePostTab === 'list'" class="space-y-6">
            <!-- Filter Section -->
            <div
              class="bg-[#121417] p-4 rounded-xl border border-neutral-800 flex items-center space-x-4"
            >
              <div class="flex-1">
                <label
                  for="search"
                  class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
                  >Search by Title</label
                >
                <input
                  type="text"
                  v-model="searchTerm"
                  id="search"
                  class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
                  placeholder="Post title..."
                />
              </div>
              <div class="flex-1">
                <label
                  for="category"
                  class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
                  >Category</label
                >
                <select
                  v-model="selectedCategory"
                  id="category"
                  class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
                >
                  <option v-for="cat in allCategories" :key="cat" :value="cat">
                    {{ cat || "All Categories" }}
                  </option>
                </select>
              </div>
              <div class="flex-1">
                <label
                  for="tag"
                  class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
                  >Tag</label
                >
                <select
                  v-model="selectedTag"
                  id="tag"
                  class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
                >
                  <option v-for="tag in allTags" :key="tag" :value="tag">
                    {{ tag || "All Tags" }}
                  </option>
                </select>
              </div>
            </div>
            <PostList
              :posts="filteredPosts"
              @edit="handleEditPost"
              @delete="handleDeletePost"
            />
          </div>
          <PostForm
            v-if="activePostTab === 'create' || activePostTab === 'edit'"
            :post="selectedPost"
            :is-editing="activePostTab === 'edit'"
            @submit="handleSubmitPost"
            @cancel="handleCancelPost"
          />
        </div>
        <div v-if="activeTab === 'series'">
          <SeriesList
            v-if="activeSeriesTab === 'list'"
            :series="series"
            @edit="handleEditSeries"
            @delete="handleDeleteSeries"
          />
          <SeriesForm
            v-if="activeSeriesTab === 'create' || activeSeriesTab === 'edit'"
            :series="selectedSeries"
            :is-editing="activeSeriesTab === 'edit'"
            @submit="handleSubmitSeries"
            @cancel="handleCancelSeries"
          />
        </div>
        <div v-if="activeTab === 'stats'">
          <Statistics :posts="posts" />
        </div>
      </div>
    </div>
  </div>
</template>
