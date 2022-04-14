<template>
  <div id="root" class="marky">
    <div v-if="errorMessage.length > 0"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as markybox from '@/core';
import { getLastElement } from '@/base/array';
import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';

export default window.workbench.createComponent((accessor) => {
  const logService = accessor.get(ILogService);
  const sessionService = accessor.get(ISessionService);
  const socketService = accessor.get(ISocketService);

  return defineComponent({
    name: Component.CodePage,
    setup() {
      const { currentRoute } = useRouter();
      const errorMessage = ref('');

      let editor: markybox.MEditor;
      let renderer: markybox.MHTMLRenderer;

      function initEditor(): void {
        const { isAuth, notes, name: userName } = sessionService.profile;

        let initialText = '';

        if (isAuth.value) {
          const lastRecord = getLastElement(notes.value);

          initialText = lastRecord?.data || '';
        }

        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;
        renderer = new markybox.MHTMLRenderer(root, userName.value);

        editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
          logger: logService,
          initialText,
        });
      }

      onMounted(() => {
        socketService.onMessage((event) => {
          const { type, data } = event;

          switch (type) {
            case SocketCommandType.EnterRoom: {
              const { user_name } = data;

              console.log(`User ${user_name} entered room`);
              break;
            }
            case SocketCommandType.RoomCreated: {
              const { note_id } = data;

              console.log(`Room ${note_id} created`);
              break;
            }
          }
        })
      })

      sessionService.onDidUserLogin(() => {
        const noteId = currentRoute.value.params.id as string;

        socketService.createOrEnterRoom(noteId);
      });

      onMounted(async () => {
        await nextTick();

        if (sessionService.profile.isAuth.value) {
          const noteId = currentRoute.value.params.id as string;
          socketService.createOrEnterRoom(noteId);
        }

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
