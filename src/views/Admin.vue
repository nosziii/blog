<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post, Series } from '../data/posts'
import LoginModal from '../components/LoginModal.vue'
import PostList from '../components/admin/PostList.vue'
import PostForm from '../components/admin/PostForm.vue'
import SeriesList from '../components/admin/SeriesList.vue'
import SeriesForm from '../components/admin/SeriesForm.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const showLoginModal = ref(false)

const activeTab = ref<'posts' | 'series'>('posts')
const activePostTab = ref<'list' | 'create' | 'edit'>('list')
const activeSeriesTab = ref<'list' | 'create' | 'edit'>('list')

const selectedPost = ref<Post | null>(null)
const selectedSeries = ref<Series | null>(null)

const posts = ref<Post[]>([])
const series = ref<Series[]>([])

const checkAuth = async () => {
  const res = await fetch('/api/check-auth')
  const data = await res.json()
  isAuthenticated.value = data.authenticated
  if (!isAuthenticated.value) {
    showLoginModal.value = true
  }
}

const handleLogin = async (credentials: any) => {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  const data = await res.json()
  if (data.success) {
    isAuthenticated.value = true
    showLoginModal.value = false
    fetchPosts()
    fetchSeries()
  } else {
    alert('Invalid credentials')
  }
}

const handleLogout = async () => {
  await fetch('/api/logout', { method: 'POST' })
  isAuthenticated.value = false
  router.push('/')
}

const fetchPosts = async () => {
  const res = await fetch('/api/posts')
  posts.value = await res.json()
}

const fetchSeries = async () => {
  const res = await fetch('/api/series')
  series.value = await res.json()
}

onMounted(() => {
  checkAuth()
  fetchPosts()
  fetchSeries()
})

const handleCreateNewPost = () => {
  selectedPost.value = null
  activePostTab.value = 'create'
}

const handleEditPost = (post: Post) => {
  selectedPost.value = post
  activePostTab.value = 'edit'
}

const handleDeletePost = async (id: string) => {
  if (confirm('Are you sure you want to delete this post?')) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }
}

const handleSubmitPost = async (postData: any) => {
  const isEditing = !!selectedPost.value?.id;
  if (isEditing && selectedPost.value) {
    const url = `/api/posts/${selectedPost.value.id}`;
    const method = 'PUT';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
  } else {
    const url = '/api/posts';
    const method = 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });
  }

  fetchPosts();
  activePostTab.value = 'list';
};

const handleCancelPost = () => {
  activePostTab.value = 'list'
}

const handleCreateNewSeries = () => {
  selectedSeries.value = null
  activeSeriesTab.value = 'create'
}

const handleEditSeries = (series: Series) => {
  selectedSeries.value = series
  activeSeriesTab.value = 'edit'
}

const handleDeleteSeries = async (id: string) => {
  if (confirm('Are you sure you want to delete this series?')) {
    await fetch(`/api/series/${id}`, { method: 'DELETE' })
    fetchSeries()
  }
}

const handleSubmitSeries = async (seriesData: any) => {
  const isEditing = !!selectedSeries.value?.id;
  if (isEditing && selectedSeries.value) {
    const url = `/api/series/${selectedSeries.value.id}`;
    const method = 'PUT';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(seriesData)
    });
  } else {
    const url = '/api/series';
    const method = 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(seriesData)
    });
  }

  fetchSeries();
  activeSeriesTab.value = 'list';
};

const handleCancelSeries = () => {
  activeSeriesTab.value = 'list'
}
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
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div v-if="activeTab === 'posts'">
          <PostList
            v-if="activePostTab === 'list'"
            :posts="posts"
            @edit="handleEditPost"
            @delete="handleDeletePost"
          />
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
      </div>
    </div>
  </div>
</template>
