<template>
  <div v-if="editor" class="editor-container">
    <div class="toolbar">
      <button
        @click="editor.chain().focus().toggleBold().run()"
        :disabled="!editor.can().chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Bold
      </button>
      <button
        @click="editor.chain().focus().toggleItalic().run()"
        :disabled="!editor.can().chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Italic
      </button>
      <button
        @click="editor.chain().focus().toggleStrike().run()"
        :disabled="!editor.can().chain().focus().toggleStrike().run()"
        :class="{ 'is-active': editor.isActive('strike') }"
      >
        Strike
      </button>
      <button
        @click="editor.chain().focus().toggleCode().run()"
        :disabled="!editor.can().chain().focus().toggleCode().run()"
        :class="{ 'is-active': editor.isActive('code') }"
      >
        Code
      </button>
      <button
        @click="setLink"
        :class="{ 'is-active': editor.isActive('link') }"
      >
        Set Link
      </button>
      <button
        @click="editor.chain().focus().unsetLink().run()"
        :disabled="!editor.isActive('link')"
      >
        Unset Link
      </button>
      <button @click="triggerFileInput">Add Image</button>
      <button
        @click="editor.chain().focus().setParagraph().run()"
        :class="{ 'is-active': editor.isActive('paragraph') }"
      >
        Paragraph
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
      >
        H1
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
      >
        H2
      </button>
      <button
        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
      >
        H3
      </button>
      <button
        @click="editor.chain().focus().toggleBulletList().run()"
        :class="{ 'is-active': editor.isActive('bulletList') }"
      >
        Bullet List
      </button>
      <button
        @click="editor.chain().focus().toggleOrderedList().run()"
        :class="{ 'is-active': editor.isActive('orderedList') }"
      >
        Ordered List
      </button>
      <button
        @click="editor.chain().focus().toggleCodeBlock().run()"
        :class="{ 'is-active': editor.isActive('codeBlock') }"
      >
        Code Block
      </button>
      <button
        @click="editor.chain().focus().toggleBlockquote().run()"
        :class="{ 'is-active': editor.isActive('blockquote') }"
      >
        Blockquote
      </button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        Horizontal Rule
      </button>
    </div>
    <input
      type="file"
      ref="fileInput"
      @change="uploadImage"
      style="display: none"
      accept="image/*"
    />
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref<HTMLInputElement | null>(null);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    CodeBlock.configure({
      languageClassPrefix: "language-",
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Image,
  ],
  onUpdate: () => {
    emit("update:modelValue", editor.value?.getHTML());
  },
});

const setLink = () => {
  const previousUrl = editor.value?.getAttributes("link").href;
  const url = window.prompt("URL", previousUrl);

  if (url === null) {
    return;
  }

  if (url === "") {
    editor.value?.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  editor.value
    ?.chain()
    .focus()
    .extendMarkRange("link")
    .setLink({ href: url })
    .run();
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const uploadImage = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) {
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Image upload failed");
    }

    const { url } = await response.json();

    if (url) {
      editor.value?.chain().focus().setImage({ src: url }).run();
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    alert("Error uploading image. Please try again.");
  } finally {
    if (target) {
      target.value = "";
    }
  }
};
</script>

<style>
/* General container for the editor */
.editor-container {
  border: 1px solid #404040; /* neutral-700 */
  border-radius: 8px;
  background-color: #0f1114; /* Darker background for the whole container */
  color: #d1d5db; /* gray-300 for default text */
  overflow: hidden;
}

/* Toolbar styling */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid #404040; /* neutral-700 */
  background-color: #121417; /* Slightly lighter than the editor bg */
}

.toolbar button {
  padding: 6px 12px;
  border: 1px solid #404040; /* neutral-700 */
  border-radius: 6px;
  background-color: transparent;
  color: #d1d5db; /* gray-300 */
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}

.toolbar button:hover {
  background-color: #404040; /* neutral-700 */
  color: #fff;
}

.toolbar button.is-active {
  background-color: rgba(132, 255, 97, 0.1);
  border-color: #84ff61;
  color: #84ff61;
  font-weight: bold;
}

.toolbar button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: transparent;
}

/* ProseMirror editor content area */
.editor-container .ProseMirror {
  padding: 16px;
  min-height: 400px;
  outline: none;
  line-height: 1.6;
}

.editor-container .ProseMirror > *:first-child {
  margin-top: 0;
}

.editor-container .ProseMirror > *:last-child {
  margin-bottom: 0;
}

/* Styling for elements inside the editor */
.editor-container .ProseMirror p {
  color: #d1d5db; /* gray-300 */
}

.editor-container .ProseMirror a {
  color: #84ff61;
  text-decoration: underline;
  cursor: pointer;
}

.editor-container .ProseMirror img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
  border-radius: 8px;
  border: 1px solid #404040; /* neutral-700 */
}

.editor-container .ProseMirror h1,
.editor-container .ProseMirror h2,
.editor-container .ProseMirror h3 {
  color: #fff;
  font-weight: 600;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.editor-container .ProseMirror h1 {
  font-size: 2em;
}
.editor-container .ProseMirror h2 {
  font-size: 1.5em;
}
.editor-container .ProseMirror h3 {
  font-size: 1.25em;
}

.editor-container .ProseMirror ul,
.editor-container .ProseMirror ol {
  padding-left: 20px;
  color: #d1d5db; /* gray-300 */
}

.editor-container .ProseMirror blockquote {
  border-left: 3px solid #84ff61;
  margin-left: 1rem;
  padding-left: 1rem;
  font-style: italic;
  color: #a1a1aa; /* neutral-400 */
}

.editor-container .ProseMirror code {
  background-color: rgba(132, 255, 97, 0.1);
  color: #84ff61;
  padding: 0.2em 0.4em;
  border-radius: 4px;
  font-family: "JetBrainsMono", monospace;
  font-size: 0.9em;
}

.editor-container .ProseMirror pre {
  background: #0c0f12;
  color: #d1d5db; /* gray-300 */
  font-family: "JetBrainsMono", monospace;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #404040; /* neutral-700 */
  margin: 1rem 0;
}

.editor-container .ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.85rem;
}

.editor-container .ProseMirror hr {
  border: none;
  border-top: 1px solid #404040; /* neutral-700 */
  margin: 1.5rem 0;
}
</style>
