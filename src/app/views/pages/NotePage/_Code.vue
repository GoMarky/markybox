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
import { INoteService } from '@/app/code/notes/common/notes';
import { ISessionService } from '@/app/code/session/common/session';

const noteService = window.workbench.getService(INoteService);
const sessionService = window.workbench.getService(ISessionService);

export default { name: 'Code' };
</script>

<script lang="ts" setup>
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { APIError, ApiError } from '@/app/platform/request/common/request';
import { RouteName } from '@/app/code/vue/route-names';
import { EditorInstance } from '@/app/code/editor/browser/editor';
import { SocketCommandType } from '@/app/code/socket/common/socket-service';
import useRoomActions from '@/app/views/composables/use-room-actions';
import useCurrentEditorNoteLang from '@/app/views/composables/use-current-editor-note-lang';
import useAnonymousUser from '@/app/views/composables/use-anonymous-user';
import { EditorLang } from '@gomarky/markybox-core/lib/types/common';

const { currentRoute, push } = useRouter();
const errorMessage = ref('');

onBeforeRouteUpdate(async (_, __, next) => {
  await loadNote();
  next();
});

const { name: userName } = useAnonymousUser();

const editor = new EditorInstance(userName.value);
const { onEnterRoom, onLeaveRoom, onEditorAction } = useRoomActions(editor.renderer);

noteService.connection.onMessage((event) => {
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

  noteService.connection.send({
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

const { currentEditorLang, setEditorLang } = useCurrentEditorNoteLang()

watch(currentEditorLang, async (lang: EditorLang) => {
  const noteId = currentRoute.value.params.id as string;
  const text = editor.renderer.getText() as string;

  await noteService.updateNote(noteId, text, lang);
  editor.renderer.setFormat(lang);
});

async function loadNote(): Promise<void> {
  try {
    const noteId = currentRoute.value.params.id as string;
    const note = await noteService.getNoteById(noteId);
    const { data, lang } = note

    if (editor.renderer.$isMount) {
      editor.renderer.clear();
    } else {
      editor.renderer.mount('#root');
      editor.renderer.display.setFullScreen();
    }

    editor.renderer.setText(data);
    editor.renderer.setFormat(lang);

    setEditorLang(lang);
    noteService.createOrEnterRoom(noteId);
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
