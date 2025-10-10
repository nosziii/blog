<template>
  <div class="bg-[#121417] p-6 rounded-xl border border-neutral-800">
    <h2 class="text-2xl font-bold text-white mb-6">Settings</h2>
    <form @submit.prevent="saveSettings">
      <div class="mb-5">
        <label for="blog_title" class="block text-sm font-medium text-gray-400 mb-2">Blog Title</label>
        <input type="text" id="blog_title" v-model="editableSettings.blog_title" class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500">
      </div>
      <div class="mb-5">
        <label for="footer_text" class="block text-sm font-medium text-gray-400 mb-2">Footer Text</label>
        <input type="text" id="footer_text" v-model="editableSettings.footer_text" class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500">
      </div>
      <button type="submit" class="px-5 py-2 rounded-md bg-[#84ff61] text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90 transition-all">
        Save Settings
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, Ref } from 'vue';
import { useSettings } from '@/composables/useSettings';

interface Settings {
  blog_title: string;
  footer_text: string;
}

const { settings, updateSettings } = useSettings();
const editableSettings: Ref<Settings> = ref<Settings>({ blog_title: '', footer_text: '' });

watch(settings, (newSettings) => {
  editableSettings.value = { ...newSettings };
}, { immediate: true, deep: true });

const saveSettings = async () => {
  await updateSettings(editableSettings.value);
  alert('Settings saved!');
};
</script>
