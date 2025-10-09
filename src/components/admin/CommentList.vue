<template>
  <div class="bg-[#121417] rounded-xl shadow-lg border border-neutral-800 overflow-hidden">
    <div class="p-6 border-b border-neutral-800">
      <h2 class="text-2xl font-bold text-white">Manage Comments</h2>
    </div>
    <table class="min-w-full divide-y divide-neutral-800">
      <thead class="bg-neutral-900/50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Author</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Comment</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Post ID</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
          <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-neutral-800">
        <tr v-for="comment in comments" :key="comment.id" class="hover:bg-neutral-800/40 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-white">{{ comment.author }}</div>
            <div class="text-xs text-gray-400">{{ formatDate(comment.created_at) }}</div>
          </td>
          <td class="px-6 py-4">
            <div class="text-sm text-gray-300">{{ comment.content }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{{ comment.post_id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              :class="comment.is_approved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'"
              class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            >
              {{ comment.is_approved ? 'Approved' : 'Pending' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
            <button @click="toggleApproval(comment)" class="text-blue-400 hover:text-blue-300 transition-colors">
              {{ comment.is_approved ? 'Un-approve' : 'Approve' }}
            </button>
            <button @click="deleteComment(comment.id)" class="text-red-500 hover:text-red-400 transition-colors">
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Comment {
  id: number;
  post_id: number;
  author: string;
  content: string;
  created_at: string;
  is_approved: boolean;
}

const comments = ref<Comment[]>([]);

const fetchComments = async () => {
  try {
    const res = await fetch('/api/comments/admin/all');
    if (!res.ok) throw new Error('Failed to fetch comments');
    comments.value = await res.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const toggleApproval = async (comment: Comment) => {
  try {
    const res = await fetch(`/api/comments/admin/${comment.id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !comment.is_approved }),
      }
    );
    if (!res.ok) throw new Error('Failed to update comment');
    const updatedComment = await res.json();
    const index = comments.value.findIndex(c => c.id === comment.id);
    if (index !== -1) {
      comments.value[index] = updatedComment;
    }
  } catch (error) {
    console.error('Error updating comment:', error);
  }
};

const deleteComment = async (commentId: number) => {
  if (!confirm('Are you sure you want to delete this comment?')) return;

  try {
    const res = await fetch(`/api/comments/admin/${commentId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete comment');
    comments.value = comments.value.filter(c => c.id !== commentId);
  } catch (error) {
    console.error('Error deleting comment:', error);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

onMounted(() => {
  fetchComments();
});
</script>