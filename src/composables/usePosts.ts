import { ref, computed } from "vue";
import type { Post } from "../data/posts";

export function usePosts() {
  const posts = ref<Post[]>([]);
  const activePostTab = ref<"list" | "create" | "edit">("list");
  const selectedPost = ref<Post | null>(null);

  // Filters
  const searchTerm = ref("");
  const selectedCategory = ref("");
  const selectedTag = ref("");

  const allCategories = computed(() => {
    const categories = posts.value.map((p) => p.category);
    return ["", ...new Set(categories)];
  });

  const allTags = computed(() => {
    const tags = posts.value.flatMap((p) => p.tags);
    return ["", ...new Set(tags)];
  });

  const filteredPosts = computed(() => {
    return posts.value.filter((post) => {
      const titleMatch = post.title
        .toLowerCase()
        .includes(searchTerm.value.toLowerCase());
      const categoryMatch =
        !selectedCategory.value || post.category === selectedCategory.value;
      const tagMatch =
        !selectedTag.value || post.tags.includes(selectedTag.value);
      return titleMatch && categoryMatch && tagMatch;
    });
  });

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/posts/all");
      posts.value = await res.json();
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handleCreateNewPost = () => {
    selectedPost.value = null;
    activePostTab.value = "create";
  };

  const handleEditPost = (post: Post) => {
    selectedPost.value = post;
    activePostTab.value = "edit";
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Are you sure you want to delete this post?")) {
      await fetch(`/api/posts/${id}`, { method: "DELETE" });
      fetchPosts(); // Refresh list
    }
  };

  const handleSubmitPost = async (postData: any) => {
    const isEditing = !!selectedPost.value?.id;
    const url = isEditing
      ? `/api/posts/${selectedPost.value!.id}`
      : "/api/posts";
    const method = isEditing ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postData),
    });

    fetchPosts(); // Refresh list
    activePostTab.value = "list";
  };

  const handleCancelPost = () => {
    activePostTab.value = "list";
  };

  return {
    posts,
    activePostTab,
    selectedPost,
    searchTerm,
    selectedCategory,
    selectedTag,
    allCategories,
    allTags,
    filteredPosts,
    fetchPosts,
    handleCreateNewPost,
    handleEditPost,
    handleDeletePost,
    handleSubmitPost,
    handleCancelPost,
  };
}
