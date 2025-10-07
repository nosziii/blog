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
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="series in series"
            :key="series.id"
            class="hover:bg-gray-50"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ series.title }}
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
            >
              <button
                @click="$emit('edit', series)"
                class="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
              <button
                @click="$emit('delete', series.id)"
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
import type { Series } from "../../data/posts";

defineProps<{
  series: Series[];
}>();

defineEmits<{
  (e: "edit", series: Series): void;
  (e: "delete", id: string): void;
}>();
</script>
