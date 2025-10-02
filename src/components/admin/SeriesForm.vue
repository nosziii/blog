<template>
  <div class="bg-white rounded-lg shadow p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">
      {{ isEditing ? 'Edit Series' : 'Create New Series' }}
    </h2>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div class="sm:col-span-2">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter series title"
          />
        </div>

        <div class="sm:col-span-2">
          <label for="slug" class="block text-sm font-medium text-gray-700 mb-2">
            Slug
          </label>
          <input
            id="slug"
            v-model="formData.slug"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="series-slug-url"
          />
        </div>
      </div>

      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('cancel')"
          class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {{ isEditing ? 'Update Series' : 'Create Series' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Series } from '../../data/posts'

const props = defineProps<{
  series: Series | null
  isEditing: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', series: any): void
  (e: 'cancel'): void
}>()

const formData = ref<any>({})

watch(() => props.series, (newSeries) => {
  formData.value = { ...newSeries }
}, { immediate: true })

const handleSubmit = () => {
  emit('submit', formData.value)
}
</script>
