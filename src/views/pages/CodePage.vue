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

      function initEditor(): void {
        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;

        const renderer = new markybox.MHTMLRenderer(root);
        const editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
          logger: logService
        });

        editor.addEmptyRow()
      }

      onMounted(async () => {
        await nextTick();

        try {
          initEditor();
        } catch (error) {
          if (error instanceof Error) {
            const { name, message } = error;

            errorMessage.value = `Name: ${name}. Message: ${message}`;
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
  position: relative;
  height: 100%;
  display: flex;
  cursor: text;
  overflow: hidden;
  flex-direction: column;
}

.m-editor__gutter-cell {
  padding-right: 13px;
  padding-left: 19px;
}

.m-editor__row {
  height: 16px;
  display: inline-block;
  word-wrap: normal;
  white-space: pre;
}

.m-editor__layer-text {
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
}

.m-editor__layer-caret {
  font-size: 12px;
  background-color: blue;
  color: blue;
  position: absolute;
  opacity: 0.5;
  height: 1.5em;
  width: 3px;
  max-width: 3px;
  overflow: hidden;
  text-indent: -5px;
  display: inline-block;
  text-decoration: blink;
  animation: blinker 1s linear infinite;
}

.m-editor__keyword-class {
  color: #c800a4;
}

.m-editor__keyword-class-name {
  color: #c79229;
}

.m-editor__keyword-function-name {
  color: #2858b3;
}

.m-editor__keyword-function {
  color: #c800a4;
}

.m-editor__selection {
  position: absolute;
  border-radius: 3px;
  background-color: #b5d5ff;
  z-index: var(--z-index-selection);
}

@keyframes blinker {
  50% {
    opacity: 0.0;
  }
}
</style>
