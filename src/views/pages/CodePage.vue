<template>
  <div>
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

        editor.addRow()
      })
    }
  })
})
</script>
