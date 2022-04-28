<template>
  <div id="root" class="marky">
    <div v-if="errorMessage.length > 0"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as markybox from '@/core';
import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';
import { INoteInfo, INoteService } from '@/code/notes/common/notes';

export default window.workbench.createComponent((accessor) => {
  const logService = accessor.get(ILogService);
  const sessionService = accessor.get(ISessionService);
  const socketService = accessor.get(ISocketService);
  const noteService = accessor.get(INoteService);

  return defineComponent({
    name: Component.CodePage,
    setup() {
      const { currentRoute, beforeEach } = useRouter();
      const errorMessage = ref('');

      beforeEach((to) => {
        console.log(to);
      })

      function initEditor(note?: INoteInfo): void {
        const { name: userName } = sessionService.profile;

        let initialText = '';

        if (note) {
          initialText = note.data;
        }

        const root = document.querySelector<HTMLElement>('#root') as HTMLElement;
        const renderer = window.$renderer = new markybox.MHTMLRenderer(root, userName.value);

        const editor = window.$editor = new markybox.MEditor({
          renderer,
          fullscreen: true,
          logger: logService,
        });

        renderer.editorAutoSave.onDidSave((text: string) => {
          const noteId = currentRoute.value.params.id as string;

          noteService.updateNote(noteId, text);
        })

        editor.setText(initialText)
      }

      const connectSocket = () => {
        const noteId = currentRoute.value.params.id as string;
        socketService.createOrEnterRoom(noteId);
      }

      onMounted(() => {
        socketService.onMessage((event) => {
          const { type, data } = event;

          switch (type) {
            case SocketCommandType.Info:
              const { text } = data;
              break;
            case SocketCommandType.LeaveRoom:
            case SocketCommandType.EnterRoom: {
              const { text, user_name } = data;

              window.$renderer?.addNavigator(user_name);

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

      sessionService.onDidUserLogin(() => connectSocket());

      onMounted(async () => {
        await nextTick();

        if (sessionService.profile.isAuth.value) {
          connectSocket();
        }

        try {
          const noteId = currentRoute.value.params.id as string;

          const note = await noteService.getNoteById(noteId);

          initEditor(note);
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
