<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useSettings } from "@/composables/useSettings";

const { settings } = useSettings();
</script>

<template>
  <header class="bg-codewars-dark border-b border-codewars-gray-border">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <RouterLink to="/" class="flex items-center space-x-2">
          <div
            class="w-10 h-10 bg-codewars-red rounded flex items-center justify-center font-bold text-white"
          >
            IF
          </div>
          <span class="text-xl font-bold text-white">{{ settings.blog_title }}</span>
        </RouterLink>

        <nav class="flex items-center space-x-6">
          <RouterLink
            to="/"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Home
          </RouterLink>
          <RouterLink
            to="/categories"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Categories
          </RouterLink>
          <RouterLink
            to="/series"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Series
          </RouterLink>
          <RouterLink
            to="/admin"
            class="text-gray-300 hover:text-white transition-colors"
          >
            Admin
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>
