<template>
  <div class="bg-[#121417] rounded-xl shadow-lg p-6 md:p-8 border border-neutral-800">
    <h2 class="text-2xl font-bold text-white mb-8">
      {{ isEditing ? "Edit Post" : "Create New Post" }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
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
            placeholder="Enter post title"
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
            placeholder="post-slug-url"
          />
        </div>

        <div>
          <label
            for="author"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Author
          </label>
          <input
            id="author"
            v-model="formData.author"
            type="text"
            required
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
            placeholder="Author name"
          />
        </div>

        <div>
          <label
            for="category"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            v-model="formData.category"
            required
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
          >
            <option value="">Select category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="tags"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Tags (comma separated)
          </label>
          <input
            id="tags"
            v-model="formData.tags"
            type="text"
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
            placeholder="tag1, tag2, tag3"
          />
        </div>

        <div>
          <label
            for="read_time"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Read Time (minutes)
          </label>
          <input
            id="read_time"
            v-model.number="formData.read_time"
            type="number"
            min="1"
            required
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
          />
        </div>

        <div>
          <label
            for="series"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Series
          </label>
          <select
            id="series"
            v-model="formData.series_id"
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
          >
            <option :value="null">-</option>
            <option v-for="s in series" :key="s.id" :value="s.id">
              {{ s.title }}
            </option>
          </select>
        </div>

        <div>
          <label
            for="order_in_series"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Order in series
          </label>
          <input
            id="order_in_series"
            v-model.number="formData.order_in_series"
            type="number"
            min="1"
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
          />
        </div>

        <div class="sm:col-span-2">
          <label
            for="excerpt"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            v-model="formData.excerpt"
            rows="3"
            required
            class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
            placeholder="Short description of the post"
          ></textarea>
        </div>

        <div class="sm:col-span-2">
          <label
            for="content"
            class="block text-xs uppercase tracking-wide text-gray-400 mb-2"
          >
            Content
          </label>
          <Editor v-model="formData.content" />
        </div>

        <div class="sm:col-span-2">
          <label class="flex items-center">
            <input
              v-model="formData.published"
              type="checkbox"
              class="w-4 h-4 rounded border-neutral-600 bg-[#0f1114] text-[#84ff61] focus:ring-[#84ff61]/30"
            />
            <span class="ml-2 text-sm font-medium text-gray-300">
              Publish immediately
            </span>
          </label>
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
          {{ isEditing ? "Update Post" : "Create Post" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import Editor from "../Editor.vue";
import type { Post, Series } from "../../data/posts";

const props = defineProps<{
  post: Post | null;
  isEditing: boolean;
}>();

const emit = defineEmits<{
  (e: "submit", post: any): void;
  (e: "cancel"): void;
}>();

const formData = ref<any>({});
const categories = [
  "announcement",
  "tutorials",
  "programming",
  "design",
  "technology",
];
const series = ref<Series[]>([]);

const fetchSeries = async () => {
  const res = await fetch("/api/series");
  series.value = await res.json();
};

onMounted(() => {
  fetchSeries();
});

watch(
  () => props.post,
  (newPost) => {
    if (newPost) {
      formData.value = { ...newPost, published: newPost.published || false };
      if (newPost.tags) {
        formData.value.tags = newPost.tags.join(", ");
      }
    } else {
      formData.value = {
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author: "",
        category: "",
        tags: "",
        read_time: 1,
        published: false,
        series_id: null,
        order_in_series: null,
      };
    }
  },
  { immediate: true }
);

const handleSubmit = () => {
  emit("submit", formData.value);
};
</script>
