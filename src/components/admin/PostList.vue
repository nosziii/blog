<template>
  <div class="space-y-4">
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Title
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Category
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Author
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="post in posts" :key="post.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ post.title }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
              >
                {{ post.category }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ post.author }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="
                  post.published
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                "
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
              >
                {{ post.published ? "Published" : "Draft" }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
            >
              <button
                @click="$emit('edit', post)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', post.id)"
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
