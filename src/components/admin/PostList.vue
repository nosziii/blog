<template>
  <div class="bg-[#121417] rounded-xl shadow-lg border border-neutral-800 overflow-hidden">
    <table class="min-w-full divide-y divide-neutral-800">
      <thead class="bg-neutral-900/50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Title
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Category
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Author
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
          >
            Status
          </th>
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-800">
        <tr v-for="post in posts" :key="post.id" class="hover:bg-neutral-800/40 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-white">
              {{ post.title }}
            </div>
            <div class="text-xs text-gray-400">{{ post.slug }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-codewars-blue/20 text-codewars-blue"
            >
              {{ post.category }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
            {{ post.author }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="
                post.published
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-yellow-500/20 text-yellow-400'
              "
              class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            >
              {{ post.published ? "Published" : "Draft" }}
            </span>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4"
          >
            <button
              @click="$emit('edit', post)"
              class="text-[#84ff61] hover:text-green-400 transition-colors"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', post.id)"
              class="text-red-500 hover:text-red-400 transition-colors"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import type { Post } from "../../data/posts";

defineProps<{
  posts: Post[];
}>();

defineEmits<{
  (e: "edit", post: Post): void;
  (e: "delete", id: string): void;
}>();
</script>
