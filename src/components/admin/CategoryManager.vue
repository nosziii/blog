<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <!-- Add Category Form -->
    <div class="bg-[#121417] rounded-xl shadow-lg border border-neutral-800 p-6 h-fit">
      <h3 class="text-xl font-bold text-white mb-4">Add New Category</h3>
      <form @submit.prevent="addCategory" class="flex items-center gap-4">
        <input
          v-model="newCategoryName"
          type="text"
          required
          class="flex-grow rounded-md border border-neutral-700 bg-[#0f1114] px-3 py-2 text-sm text-gray-100 outline-none focus:border-[#84ff61] focus:ring-2 focus:ring-[#84ff61]/30 placeholder:text-gray-500"
          placeholder="Category name"
        />
        <button
          type="submit"
          class="px-5 py-2 rounded-md bg-[#84ff61] text-sm font-semibold text-black shadow-lg hover:brightness-95 active:brightness-90 transition-all"
        >
          Add
        </button>
      </form>
      <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
    </div>

    <!-- Category List -->
    <div class="bg-[#121417] rounded-xl shadow-lg border border-neutral-800 overflow-hidden">
      <div class="p-6 border-b border-neutral-800">
        <h2 class="text-2xl font-bold text-white">Manage Categories</h2>
      </div>
      <ul class="divide-y divide-neutral-800">
        <li v-for="category in categories" :key="category.id" class="flex items-center justify-between p-4 hover:bg-neutral-800/40 transition-colors">
          <span class="text-white">{{ category.name }}</span>
          <button @click="deleteCategory(category.id)" class="text-red-500 hover:text-red-400 transition-colors text-sm font-medium">
            Delete
          </button>
        </li>
        <li v-if="categories.length === 0" class="p-4 text-center text-gray-400">
          No categories found.
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Category {
  id: number;
  name: string;
}

const categories = ref<Category[]>([]);
const newCategoryName = ref('');
const error = ref('');

const fetchCategories = async () => {
  try {
    const res = await fetch('/api/categories');
    if (!res.ok) throw new Error('Failed to fetch categories');
    categories.value = await res.json();
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

const addCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  error.value = '';
  try {
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategoryName.value.trim() }),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to add category');
    }
    newCategoryName.value = '';
    fetchCategories(); // Refresh list
  } catch (err: any) {
    console.error('Error adding category:', err);
    error.value = err.message;
  }
};

const deleteCategory = async (id: number) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  try {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete category');
    fetchCategories(); // Refresh list
  } catch (err) {
    console.error('Error deleting category:', err);
  }
};

onMounted(() => {
  fetchCategories();
});
</script>