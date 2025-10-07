<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { usePosts } from '../composables/usePosts';
import { useSeries } from '../composables/useSeries';

import LoginModal from '../components/LoginModal.vue';
import PostList from '../components/admin/PostList.vue';
import PostForm from '../components/admin/PostForm.vue';
import SeriesList from '../components/admin/SeriesList.vue';
import SeriesForm from '../components/admin/SeriesForm.vue';
import Statistics from '../components/admin/Statistics.vue';
const router = useRouter();
const activeTab = ref<'posts' | 'series' | 'stats'>('posts');

const { 
  isAuthenticated, 
  showLoginModal, 
  checkAuth, 
  handleLogin: performLogin, 
  handleLogout 
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
  handleCancelPost 
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
  handleCancelSeries 
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
    <LoginModal v-if="showLoginModal" @close="router.push('/')" @login="handleLogin" />
    <div v-if="isAuthenticated" class="min-h-screen bg-gray-50">
      <div class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <h1 class="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <div>
              <button
                v-if="activeTab === 'posts' && activePostTab === 'list'"
                @click="handleCreateNewPost"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Post
              </button>
              <button
                v-if="activeTab === 'series' && activeSeriesTab === 'list'"
                @click="handleCreateNewSeries"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Series
              </button>
              <button @click="handleLogout" class="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Logout</button>
            </div>
          </div>
          <div class="flex border-b">
            <button @click="activeTab = 'posts'" :class="{'border-b-2 border-blue-500': activeTab === 'posts'}" class="px-4 py-2 text-sm font-medium">Posts</button>
            <button @click="activeTab = 'series'" :class="{'border-b-2 border-blue-500': activeTab === 'series'}" class="px-4 py-2 text-sm font-medium">Series</button>
            <button @click="activeTab = 'stats'" :class="{'border-b-2 border-blue-500': activeTab === 'stats'}" class="px-4 py-2 text-sm font-medium">Statistics</button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="activeTab === 'posts'">
          <div v-if="activePostTab === 'list'" class="space-y-4">
            <!-- Filter Section -->
            <div class="bg-white p-4 rounded-lg shadow flex items-center space-x-4">
              <div class="flex-1">
                <label for="search" class="block text-sm font-medium text-gray-700">Search by Title</label>
                <input type="text" v-model="searchTerm" id="search" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Post title...">
              </div>
              <div class="flex-1">
                <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
                <select v-model="selectedCategory" id="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option v-for="cat in allCategories" :key="cat" :value="cat">{{ cat || 'All Categories' }}</option>
                </select>
              </div>
              <div class="flex-1">
                <label for="tag" class="block text-sm font-medium text-gray-700">Tag</label>
                <select v-model="selectedTag" id="tag" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option v-for="tag in allTags" :key="tag" :value="tag">{{ tag || 'All Tags' }}</option>
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
