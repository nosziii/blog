<template>
  <div v-if="editor" class="editor-container">
    <div class="toolbar">
      <button @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
        Bold
      </button>
      <button @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
        Italic
      </button>
      <button @click="editor.chain().focus().toggleStrike().run()" :disabled="!editor.can().chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
        Strike
      </button>
      <button @click="editor.chain().focus().toggleCode().run()" :disabled="!editor.can().chain().focus().toggleCode().run()" :class="{ 'is-active': editor.isActive('code') }">
        Code
      </button>
      <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
        Set Link
      </button>
      <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
        Unset Link
      </button>
      <button @click="triggerFileInput">
        Add Image
      </button>
      <button @click="editor.chain().focus().setParagraph().run()" :class="{ 'is-active': editor.isActive('paragraph') }">
        Paragraph
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 1 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }">
        H1
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }">
        H2
      </button>
      <button @click="editor.chain().focus().toggleHeading({ level: 3 }).run()" :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }">
        H3
      </button>
      <button @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
        Bullet List
      </button>
      <button @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
        Ordered List
      </button>
      <button @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'is-active': editor.isActive('codeBlock') }">
        Code Block
      </button>
      <button @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'is-active': editor.isActive('blockquote') }">
        Blockquote
      </button>
      <button @click="editor.chain().focus().setHorizontalRule().run()">
        Horizontal Rule
      </button>
    </div>
    <input type="file" ref="fileInput" @change="uploadImage" style="display: none" accept="image/*" />
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlock from '@tiptap/extension-code-block'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref<HTMLInputElement | null>(null);

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    CodeBlock.configure({
      languageClassPrefix: 'language-',
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Image,
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML())
  },
})

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)

  if (url === null) {
    return
  }

  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

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
  formData.append('image', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const { url } = await response.json();

    if (url) {
      editor.value?.chain().focus().setImage({ src: url }).run();
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Error uploading image. Please try again.');
  } finally {
    if (target) {
      target.value = '';
    }
  }
};

</script>

<style>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 5px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  background-color: #f9f9f9;
}

.toolbar button {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
}

.toolbar button.is-active {
  background-color: #e0e0e0;
  border-color: #a0a0a0;
}

.toolbar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.editor-container .ProseMirror {
  padding: 15px;
  min-height: 300px;
  outline: none;
}

.editor-container .ProseMirror > *:first-child {
  margin-top: 0;
}

.editor-container .ProseMirror > *:last-child {
  margin-bottom: 0;
}

/* Basic styling for elements */
.editor-container .ProseMirror a {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}

.editor-container .ProseMirror img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1rem 0;
}

.editor-container .ProseMirror h1,
.editor-container .ProseMirror h2,
.editor-container .ProseMirror h3 {
  font-weight: bold;
}

.editor-container .ProseMirror h1 { font-size: 2em; }
.editor-container .ProseMirror h2 { font-size: 1.5em; }
.editor-container .ProseMirror h3 { font-size: 1.17em; }

.editor-container .ProseMirror ul,
.editor-container .ProseMirror ol {
  padding-left: 20px;
}

.editor-container .ProseMirror blockquote {
  border-left: 3px solid #ccc;
  margin-left: 1rem;
  padding-left: 1rem;
  font-style: italic;
}

.editor-container .ProseMirror code {
  background-color: #f5f5f5;
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: 'JetBrainsMono', monospace;
}

.editor-container .ProseMirror pre {
  background: #0D0D0D;
  color: #FFF;
  font-family: 'JetBrainsMono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.editor-container .ProseMirror pre code {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}
</style>
