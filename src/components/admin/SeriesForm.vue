<template>
  <div class="bg-[#121417] rounded-xl shadow-lg p-6 md:p-8 border border-neutral-800">
    <h2 class="text-2xl font-bold text-white mb-8">
      {{ isEditing ? "Edit Series" : "Create New Series" }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label
            for="title"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
            placeholder="Enter series title"
          />
        </div>

        <div class="sm:col-span-2">
          <label
            for="slug"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Slug
          </label>
          <input
            id="slug"
            v-model="formData.slug"
            type="text"
            required
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
            placeholder="series-slug-url"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-6 border-t border-neutral-800">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 rounded-md border border-neutral-700 bg-transparent text-sm text-gray-300 hover:bg-neutral-800/60 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 rounded-md bg-[#84ff61] text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90 transition-all"
        >
          {{ isEditing ? "Update Series" : "Create Series" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Series } from "../../data/posts";

const props = defineProps<{
  series: Series | null;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", series: any): void;
  (e: "cancel"): void;
}>();

const formData = ref<any>({});

watch(
  () => props.series,
  (newSeries) => {
    if (newSeries) {
      formData.value = { ...newSeries };
    } else {
      formData.value = {
        title: "",
        slug: "",
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", formData.value);
};
</script>
