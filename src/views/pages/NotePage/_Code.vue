<template>
  <div class="code">
    <div id="root" class="marky">
      <div v-if="errorMessage.length > 0">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const noteService = window.workbench.getService(INoteService);
const socketService = window.workbench.getService(ISocketService);
const sessionService = window.workbench.getService(ISessionService);
</script>

<script lang="ts" setup>
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { APIError, ApiError } from '@/platform/request/common/request';
import { RouteName } from '@/code/vue/route-names';
import { INoteService } from '@/code/notes/common/notes';
import { EditorInstance } from '@/code/editor/browser/editor';
import { ISocketService, SocketCommandType } from '@/code/socket/common/socket-service';
import useRoomActions from '@/views/composables/use-room-actions';
import { ISessionService } from '@/code/session/common/session';

const { currentRoute, push } = useRouter();
const errorMessage = ref('');

onBeforeRouteUpdate(async (_, __, next) => {
  await loadNote();
  next();
})

const editor = new EditorInstance('', 'plain', 'light');
const { onEnterRoom, onLeaveRoom, onEditorAction } = useRoomActions(editor.renderer);

socketService.onMessage((event) => {
  switch (event.type) {
    case SocketCommandType.LeaveRoom:
      return onLeaveRoom(event.data);
    case SocketCommandType.EnterRoom:
      return onEnterRoom(event.data);
    case SocketCommandType.EditorAction:
      return onEditorAction(event.data);
  }
});

editor.renderer.navigator.onDidUpdatePosition((position) => {
  const { row, column } = position;
  const noteId = currentRoute.value.params.id as string;

  socketService.send({
    type: SocketCommandType.EditorAction,
    position: `${row},${column}`,
    user_name: sessionService.profile.name.value,
    note_nanoid: noteId,
  })
});

editor.renderer.controller.editorAutoSave.onDidSave((text: string) => {
  const noteId = currentRoute.value.params.id as string;
  noteService.updateNote(noteId, text)
});

async function loadNote(): Promise<void> {
  try {
    const noteId = currentRoute.value.params.id as string;
    const note = await noteService.getNoteById(noteId);
    const { data, lang } = note

    editor.renderer.mount('#root');
    editor.renderer.setText(data);
    editor.renderer.body.setFormat(lang);
    editor.renderer.display.setFullScreen();

    noteService.store.currentNote.value = note || null;
    socketService.createOrEnterRoom(noteId);
  } catch (error) {
    if (error instanceof ApiError && error.is(APIError.NotFoundError)) {
      await push({ name: RouteName.HomePage })
    }

    throw error;
  }
}

onUnmounted(() => {
  editor.dispose();
});

onMounted(async () => {
  await loadNote();
});
</script>
