<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../data/posts'
import LoginModal from '../components/LoginModal.vue'
import Editor from '../components/Editor.vue'

const router = useRouter()
const isAuthenticated = ref(false)
const showLoginModal = ref(false)

const activeTab = ref<'list' | 'create' | 'edit'>('list')
const selectedPost = ref<Post | null>(null)

const formData = ref({
  id: null as string | null,
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  author: '',
  category: '',
  tags: '',
  read_time: 5,
  published: false
})

const categories = ['announcement', 'tutorials', 'programming', 'design', 'technology']

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
  formData.value = {
    id: null,
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    author: '',
    category: '',
    tags: '',
    read_time: 5,
    published: false
  }
  selectedPost.value = null
  activeTab.value = 'create'
}

const handleEdit = (post: Post) => {
  selectedPost.value = post
  formData.value = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    content: post.content,
    excerpt: post.excerpt,
    author: post.author,
    category: post.category,
    tags: post.tags.join(', '),
    read_time: post.read_time,
    published: post.published
  }
  activeTab.value = 'edit'
}

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this post?')) {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }
}

const handleSubmit = async () => {
  const isEditing = !!selectedPost.value?.id;
  if (isEditing && selectedPost.value) {
    const url = `/api/posts/${selectedPost.value.id}`;
    const method = 'PUT';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });
  } else {
    const url = '/api/posts';
    const method = 'POST';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
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
        <div v-if="activeTab === 'list'" class="space-y-4">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ post.title }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ post.category }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ post.author }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ post.published ? 'Published' : 'Draft' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      @click="handleEdit(post)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      @click="handleDelete(post.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-if="activeTab === 'create' || activeTab === 'edit'" class="bg-white rounded-lg shadow p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ activeTab === 'create' ? 'Create New Post' : 'Edit Post' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  id="title"
                  v-model="formData.title"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  id="slug"
                  v-model="formData.slug"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="post-slug-url"
                />
              </div>

              <div>
                <label for="author" class="block text-sm font-medium text-gray-700 mb-2">
                  Author
                </label>
                <input
                  id="author"
                  v-model="formData.author"
                  type="text"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Author name"
                />
              </div>

              <div>
                <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category"
                  v-model="formData.category"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select category</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">
                    {{ cat }}
                  </option>
                </select>
              </div>

              <div>
                <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  id="tags"
                  v-model="formData.tags"
                  type="text"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="tag1, tag2, tag3"
                />
              </div>

              <div>
                <label for="read_time" class="block text-sm font-medium text-gray-700 mb-2">
                  Read Time (minutes)
                </label>
                <input
                  id="read_time"
                  v-model.number="formData.read_time"
                  type="number"
                  min="1"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div class="sm:col-span-2">
                <label for="excerpt" class="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  v-model="formData.excerpt"
                  rows="3"
                  required
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Short description of the post"
                ></textarea>
              </div>

              <div class="sm:col-span-2">
                <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <Editor v-model="formData.content" />
              </div>

              <div class="sm:col-span-2">
                <label class="flex items-center">
                  <input
                    v-model="formData.published"
                    type="checkbox"
                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span class="ml-2 text-sm font-medium text-gray-700">
                    Publish immediately
                  </span>
                </label>
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                @click="handleCancel"
                class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ activeTab === 'create' ? 'Create Post' : 'Update Post' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
