<template>
  <div id="root" class="marky">
    <textarea wrap="off" autocapitalize="off" autocorrect="off" spellcheck="false" class="marky__textarea"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, nextTick } from 'vue';
import * as markybox from '@/core';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'App',
    setup() {
      onMounted(async () => {
        await nextTick();

        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;

        const renderer = new markybox.MHTMLRenderer(root);
        const editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
        });

        editor.addRow()
      })
    }
  });
})
</script>

<style>
.marky {
  display: flex;
  position: relative;
  overflow: hidden;
  font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  direction: ltr;
  text-align: left;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.marky__textarea {
  border: 0;
  resize: none;
  outline: none;
  padding: 0 1px;
  margin: 0 -1px;
  z-index: 0;
  position: absolute;
  opacity: 0;
  height: 19px;
  width: 8px;
}

body {
  margin: 0;
  padding: 0;
}

.m-editor__gutter {
  display: flex;
  background-color: #e8e8e8;
  flex-direction: column;
  height: 100%;
}

.m-editor__body {
  height: 100%;
}

.m-editor__gutter-cell {
  padding-right: 13px;
  padding-left: 19px;
}
</style>
