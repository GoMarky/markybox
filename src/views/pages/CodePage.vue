<template>
  <main class="page-code">
    <div id="root" class="marky">
      <div v-if="errorMessage.length > 0">
        {{ errorMessage }}
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ILogService } from '@/platform/log/common/log';
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';
import { INoteInfo, INoteService } from '@/code/notes/common/notes';
import { CodePageEditor } from '@/code/notes/browser/code-page-editor';
import { APIError, ApiError } from '@/platform/request/common/request';
import { AppRoute } from '@/views/router/router';

export default window.workbench.createComponent((accessor) => {
  const logService = accessor.get(ILogService);
  const sessionService = accessor.get(ISessionService);
  const socketService = accessor.get(ISocketService);
  const noteService = accessor.get(INoteService);

  return defineComponent({
    name: Component.CodePage,
    setup() {
      const { currentRoute, push } = useRouter();
      const errorMessage = ref('');
      const editor = new CodePageEditor(logService, sessionService, noteService);

      function initEditor(note?: INoteInfo): void {
        editor.init(currentRoute, note);
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
              break;
            case SocketCommandType.EnterRoom: {
              const { text, user_name } = data;

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

        try {
          const noteId = currentRoute.value.params.id as string;

          const note = await noteService.getNoteById(noteId);

          connectSocket();

          initEditor(note);
        } catch (error) {
          if (error instanceof ApiError && error.is(APIError.NotFoundError)) {
            return push({ name: AppRoute.HomePage })
          }

          console.error(error.toString());
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
