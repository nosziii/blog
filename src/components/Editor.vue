<template>
  <div class="editor-container">
    <div class="toolbar">
      <select @change="setLanguage($event)">
        <option value="">-</option>
        <option v-for="lang in languages" :key="lang" :value="lang">{{ lang }}</option>
      </select>
      <button @click="showHelp = true">Help</button>
    </div>
    <editor-content :editor="editor" />
    <div v-if="showHelp" class="help-modal">
      <div class="modal-content">
        <h2>Editor Help</h2>
        <p>To create a code block, type three backticks ` ` ` and press enter.</p>
        <p>You can select the language of the code block from the dropdown menu above the editor.</p>
        <button @click="showHelp = false">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import CodeBlock from '@tiptap/extension-code-block'

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    CodeBlock.configure({
      languageClassPrefix: 'language-',
    }),
  ],
  onUpdate: () => {
    emit('update:modelValue', editor.value?.getHTML())
  },
})

const languages = ['javascript', 'typescript', 'html', 'css', 'python', 'java', 'csharp']
const showHelp = ref(false)

const setLanguage = (event: Event) => {
  const target = event.target as HTMLSelectElement
  editor.value?.chain().focus().setCodeBlock({ language: target.value }).run()
}

</script>

<style>
.editor-container .ProseMirror {
  border: 1px solid #ccc;
  padding: 10px;
  min-height: 200px;
  background-color: #f5f5f5;
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

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.help-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
}
</style>