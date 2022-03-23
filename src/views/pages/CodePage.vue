<template>
  <div id="root" class="marky">
    <div v-if="errorMessage.length > 0"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import * as markybox from '@/core';
import { ILogService } from '@/platform/log/common/log';

export default window.workbench.createComponent((accessor) => {
  const logService = accessor.get(ILogService);

  return defineComponent({
    name: 'AppLayout',
    setup() {
      const errorMessage = ref('');

      let editor: markybox.MEditor;

      function initEditor(): void {
        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;

        const renderer = new markybox.MHTMLRenderer(root);

        editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
          logger: logService
        });
      }

      onMounted(async () => {
        await nextTick();

        try {
          initEditor();
        } catch (error) {
          if (error instanceof Error) {
            const { name, message } = error;

            errorMessage.value = `Name: ${name}. Message: ${message}`;
          } else {
            console.log(error);
          }
        }
      })

      return {
        errorMessage,
      }
    }
  })
})
</script>

<style>
@import '../styles/marky.css';

:root {
  --z-index-selection: 10;
}

.marky {
  display: flex;
  position: relative;
  overflow: hidden;
  direction: ltr;
  text-align: left;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

@keyframes blinker {
  50% {
    opacity: 0.0;
  }
}
</style>
