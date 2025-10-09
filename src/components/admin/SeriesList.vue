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
          <th scope="col" class="relative px-6 py-3">
            <span class="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-800">
        <tr
          v-for="s in series"
          :key="s.id"
          class="hover:bg-neutral-800/40 transition-colors"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-white">
              {{ s.title }}
            </div>
            <div class="text-xs text-gray-400">{{ s.slug }}</div>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4"
          >
            <button
              @click="$emit('edit', s)"
              class="text-[#84ff61] hover:text-green-400 transition-colors"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', s.id)"
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
import type { Series } from "../../data/posts";

defineProps<{
  series: Series[];
}>();

defineEmits<{
  (e: "edit", series: Series): void;
  (e: "delete", id: number): void;
}>();
</script>
