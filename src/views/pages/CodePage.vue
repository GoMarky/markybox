<template>
  <div id="root" class="marky">
    <textarea wrap="off" autocapitalize="off" autocorrect="off" spellcheck="false" class="marky__textarea"></textarea>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from 'vue';
import * as markybox from '@/core';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'AppLayout',
    setup() {
      onMounted(async () => {
        await nextTick();

        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;

        const renderer = new markybox.MHTMLRenderer(root);
        const editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
        });

        editor.addEmptyRow()
      })
    }
  })
})
</script>

<style>
.marky {
  display: flex;
  position: relative;
  overflow: hidden;
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

.m-editor__gutter {
  display: flex;
  background-color: #e8e8e8;
  flex-direction: column;
  height: 100%;
}

.m-editor__body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.m-editor__gutter-cell {
  padding-right: 13px;
  padding-left: 19px;
}

.m-editor__row {
  display: inline-block;
}
</style>
