<script setup lang="ts">
import type { Post } from '../data/posts'
import { RouterLink } from 'vue-router'

defineProps<{
  post: Post
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('hu-HU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <article class="bg-codewars-dark border border-codewars-gray-border rounded-lg overflow-hidden hover:border-codewars-red transition-colors">
    <RouterLink :to="`/post/${post.slug}`" class="block p-6">
      <div class="flex items-center gap-3 mb-3">
        <span class="px-3 py-1 text-xs font-semibold bg-codewars-blue text-white rounded">
          {{ post.category }}
        </span>
        <span class="text-codewars-gray-light text-sm">
          {{ post.read_time }} min olvasás
        </span>
      </div>

      <h2 class="text-2xl font-bold text-white mb-3 hover:text-codewars-red transition-colors">
        {{ post.title }}
      </h2>

      <p class="text-gray-400 mb-4 line-clamp-2">
        {{ post.excerpt }}
      </p>

      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="text-sm text-codewars-gray-light">{{ post.author }}</span>
          <span class="text-codewars-gray-light">•</span>
          <span class="text-sm text-codewars-gray-light">{{ formatDate(post.created_at) }}</span>
        </div>

        <div class="flex gap-2">
          <span
            v-for="tag in post.tags.slice(0, 3)"
            :key="tag"
            class="px-2 py-1 text-xs bg-codewars-gray text-gray-300 rounded"
          >
            #{{ tag }}
          </span>
        </div>
      </div>
    </RouterLink>
  </article>
</template>
