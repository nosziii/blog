<script setup lang="ts">
import { useSettings } from "@/composables/useSettings";

const { settings } = useSettings();
</script>

<template>
  <footer class="bg-codewars-dark border-t border-codewars-gray-border mt-20">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-gray-400" v-html="settings.footer_text"></p>
        </div>
        <div class="flex space-x-6">
          <a
            href="#"
            class="text-gray-400 hover:text-codewars-red transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            class="text-gray-400 hover:text-codewars-red transition-colors"
          >
            Twitter
          </a>
          <a
            href="#"
            class="text-gray-400 hover:text-codewars-red transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
