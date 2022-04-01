<template>
  <div id="root" class="marky">
    <div v-if="errorMessage.length > 0"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import * as markybox from '@/core';
import { getLastElement } from '@/base/array';
import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';

export default window.workbench.createComponent((accessor) => {
  const logService = accessor.get(ILogService);
  const sessionService = accessor.get(ISessionService);

  return defineComponent({
    name: Component.CodePage,
    setup() {
      const errorMessage = ref('');

      let editor: markybox.MEditor;

      function initEditor(): void {
        const { isAuth, notes, name: userName } = sessionService.profile;

        let initialText = '';

        if (isAuth.value) {
          const lastRecord = getLastElement(notes.value);

          initialText = lastRecord?.data || '';
        }

        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;
        const renderer = new markybox.MHTMLRenderer(root, userName);

        editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
          logger: logService,
          initialText,
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
