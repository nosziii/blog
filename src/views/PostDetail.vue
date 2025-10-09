<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRoute, RouterLink } from "vue-router";
import type { Post, Series } from "../data/posts";

interface Comment {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

const route = useRoute();
const post = ref<Post | null>(null);
const series = ref<Series | null>(null);
const comments = ref<Comment[]>([]);

const newComment = ref({
  author: "",
  content: "",
  captcha: "",
});
const captcha = ref({ num1: 0, num2: 0, answer: 0 });
const submissionStatus = ref("");

const generateCaptcha = () => {
  captcha.value.num1 = Math.floor(Math.random() * 10) + 1;
  captcha.value.num2 = Math.floor(Math.random() * 10) + 1;
  captcha.value.answer = captcha.value.num1 + captcha.value.num2;
};

const fetchPost = async (slug: string) => {
  try {
    const res = await fetch(`/api/posts/${slug}`);
    if (!res.ok) throw new Error("Post not found");
    post.value = await res.json();
    if (post.value?.id) {
      fetchComments(post.value.id);
    }
    if (post.value?.series_slug) {
      fetchSeries(post.value.series_slug);
    }
  } catch (error) {
    console.error("Error fetching post:", error);
    post.value = null;
  }
};

const fetchSeries = async (seriesSlug: string) => {
  const res = await fetch(`/api/series/${encodeURIComponent(seriesSlug)}`);
  series.value = await res.json();
};

const fetchComments = async (postId: number) => {
  try {
    const res = await fetch(`/api/comments/${postId}`);
    comments.value = await res.json();
  } catch (error) {
    console.error("Error fetching comments:", error);
  }
};

const handleCommentSubmit = async () => {
  if (parseInt(newComment.value.captcha) !== captcha.value.answer) {
    submissionStatus.value = "Incorrect captcha. Please try again.";
    generateCaptcha();
    return;
  }

  if (!post.value) return;

  try {
    const response = await fetch(`/api/comments/${post.value.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author: newComment.value.author,
        content: newComment.value.content,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      submissionStatus.value = result.message;
      newComment.value = { author: "", content: "", captcha: "" };
    } else {
      throw new Error(result.error || "Failed to submit comment.");
    }
  } catch (error: any) { submissionStatus.value = error.message;
  } finally {
    generateCaptcha();
  }
};

watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    fetchPost(newSlug as string);
  }
}, { immediate: true });

onMounted(() => {
  generateCaptcha();
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("hu-HU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<template>
  <div class="min-h-screen">
    <div v-if="!post" class="container mx-auto px-4 py-20 text-center">
      <h1 class="text-3xl font-bold text-white mb-4">Cikk nem található</h1>
      <RouterLink to="/" class="text-codewars-red hover:underline">
        Vissza a főoldalra
      </RouterLink>
    </div>

    <article v-else class="container mx-auto px-4 py-12 max-w-4xl">
      <RouterLink
        to="/"
        class="inline-flex items-center text-codewars-red hover:underline mb-8"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Vissza a cikkekhez
      </RouterLink>

      <div
        class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-8 md:p-12"
      >
        <div v-if="series" class="mb-8">
          <h3 class="text-2xl font-bold text-white mb-4">
            Part of the series:
            <RouterLink
              :to="`/series/${series.slug}`"
              class="text-codewars-red hover:underline"
              >{{ series.title }}</RouterLink
            >
          </h3>
          <ul class="list-disc list-inside space-y-2">
            <li
              v-for="(p, index) in series.posts"
              :key="p.id"
              :class="{ 'text-white font-bold': p.id === post.id, 'text-gray-400': p.id !== post.id }"
            >
              <RouterLink
                :to="`/post/${p.slug}`"
                class="hover:text-codewars-red transition-colors"
              >
                {{ index + 1 }}. {{ p.title }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <div class="flex flex-wrap items-center gap-3 mb-6">
          <span
            class="px-3 py-1 text-sm font-semibold bg-codewars-blue text-white rounded capitalize"
          >
            {{ post.category }}
          </span>
          <span class="text-codewars-gray-light">
            {{ post.read_time }} perc olvasás
          </span>
        </div>

        <h1 class="text-4xl md:text-5xl font-bold text-white mb-6">
          {{ post.title }}
        </h1>

        <div
          class="flex items-center gap-4 mb-8 pb-8 border-b border-codewars-gray-border"
        >
          <span class="text-gray-300 font-semibold">{{ post.author }}</span>
          <span class="text-codewars-gray-light">•</span>
          <span class="text-codewars-gray-light">{{
            formatDate(post.created_at)
          }}</span>
        </div>

        <div class="prose prose-invert prose-lg max-w-none">
          <div
            v-html="post.content"
            class="text-gray-300 leading-relaxed whitespace-pre-wrap"
          ></div>
        </div>

        <div
          class="flex flex-wrap gap-2 mt-12 pt-8 border-t border-codewars-gray-border"
        >
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="px-3 py-2 text-sm bg-codewars-gray text-gray-300 rounded hover:bg-codewars-gray-light transition-colors"
          >
            #{{ tag }}
          </span>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="mt-12">
        <h2 class="text-3xl font-bold text-white mb-6">Comments</h2>

        <!-- Comment Form -->
        <div class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-6 mb-8">
          <h3 class="text-xl font-semibold text-white mb-4">Leave a Comment</h3>
          <form @submit.prevent="handleCommentSubmit" class="space-y-4">
            <div>
              <label for="author" class="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input type="text" id="author" v-model="newComment.author" required class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500">
            </div>
            <div>
              <label for="comment" class="block text-sm font-medium text-gray-300 mb-2">Comment</label>
              <textarea id="comment" v-model="newComment.content" required rows="4" class="w-full rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"></textarea>
            </div>
            <div class="flex items-center gap-4">
              <label for="captcha" class="block text-sm font-medium text-gray-300">What is {{ captcha.num1 }} + {{ captcha.num2 }}?</label>
              <input type="text" id="captcha" v-model="newComment.captcha" required class="w-24 rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500">
            </div>
            <div class="flex items-center justify-between">
              <button type="submit" class="px-6 py-2 rounded-md bg-[#84ff61] text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90 transition-all">Submit Comment</button>
              <p v-if="submissionStatus" class="text-sm text-codewars-red">{{ submissionStatus }}</p>
            </div>
          </form>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
          <div v-if="comments.length === 0">
            <p class="text-gray-400">No comments yet. Be the first to comment!</p>
          </div>
          <div v-else v-for="comment in comments" :key="comment.id" class="bg-codewars-dark border border-codewars-gray-border rounded-lg p-5">
            <div class="flex items-center justify-between mb-2">
              <p class="font-semibold text-white">{{ comment.author }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</p>
            </div>
            <p class="text-gray-300">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
.prose :deep(h1),
.prose :deep(h2),
.prose :deep(h3) {
  color: white;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose :deep(h1) {
  font-size: 2.5rem;
}

.prose :deep(h2) {
  font-size: 2rem;
}

.prose :deep(h3) {
  font-size: 1.5rem;
}

.prose :deep(code) {
  background-color: #2d2d2d;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: #d5d1c3;
  font-family: "Courier New", monospace;
}

.prose :deep(pre) {
  background-color: #1c1c1c;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  border: 1px solid #2d2d2d;
}
</style>
