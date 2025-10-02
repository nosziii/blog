<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../data/posts'
import LoginModal from '../components/LoginModal.vue'
import PostList from '../components/admin/PostList.vue'
import PostForm from '../components/admin/PostForm.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const showLoginModal = ref(false)

const activeTab = ref<'list' | 'create' | 'edit'>('list')
const selectedPost = ref<Post | null>(null)

const posts = ref<Post[]>([])

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

onMounted(() => {
  checkAuth()
  fetchPosts()
})

const handleCreateNew = () => {
  selectedPost.value = null
  activeTab.value = 'create'
}

const handleEdit = (post: Post) => {
  selectedPost.value = post
  activeTab.value = 'edit'
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this post?')) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }
}

const handleSubmit = async (postData: any) => {
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
  activeTab.value = 'list';
};

const handleCancel = () => {
  activeTab.value = 'list'
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
                v-if="activeTab === 'list'"
                @click="handleCreateNew"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create New Post
              </button>
              <button @click="handleLogout" class="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">Logout</button>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostList
          v-if="activeTab === 'list'"
          :posts="posts"
          @edit="handleEdit"
          @delete="handleDelete"
        />
        <PostForm
          v-if="activeTab === 'create' || activeTab === 'edit'"
          :post="selectedPost"
          :is-editing="activeTab === 'edit'"
          @submit="handleSubmit"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>
