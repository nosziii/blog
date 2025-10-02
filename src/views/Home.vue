<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PostCard from '../components/PostCard.vue'

const posts = ref<any[]>([])

onMounted(async () => {
  const res = await fetch('/api/posts')
  posts.value = await res.json()
})
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
      <div v-if="posts.length === 0" class="text-center py-20">
        <p class="text-xl text-gray-400">Még nincsenek cikkek.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>
    </div>
  </div>
</template>
