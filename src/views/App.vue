<template>
  <div id="root" class="marky">

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

        const editor = new markybox.MEditor({
          renderer: new markybox.MHTMLRenderer(root),
          fullscreen: true,
        });

        editor
          .addRow()
          .addRow()
          .addRow()
          .addRow();
      })
    }
  });
})
</script>

<style>
.marky {
  position: relative;
  overflow: hidden;
  font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;
  direction: ltr;
  text-align: left;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

body {

  margin: 0;
  padding: 0;
}

.m-gutter {
  display: flex;
  background-color: #e8e8e8;
  flex-direction: column;
}

.m-gutter__cell {
  padding-right: 13px;
  padding-left: 19px;
}
</style>
