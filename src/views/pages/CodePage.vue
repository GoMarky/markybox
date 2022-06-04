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
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ISocketService} from '@/code/socket/common/socket-service';
import { APIError, ApiError } from '@/platform/request/common/request';
import { AppRoute } from '@/views/router/router';
import { IEditorService } from '@/code/editor/common/editor-service';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const socketService = accessor.get(ISocketService);
  const editorService = accessor.get(IEditorService);

  return defineComponent({
    name: Component.CodePage,
    setup() {
      const { currentRoute, push } = useRouter();
      const errorMessage = ref('');

      const connectSocket = () => {
        const noteId = currentRoute.value.params.id as string;
        socketService.createOrEnterRoom(noteId);
      }

      sessionService.onDidUserLogin(() => connectSocket());

      onMounted(async () => {
        await nextTick();

        try {
          const noteId = currentRoute.value.params.id as string;

          connectSocket();

          await editorService.create(noteId);
        } catch (error) {
          if (error instanceof ApiError && error.is(APIError.NotFoundError)) {
            return push({ name: AppRoute.HomePage })
          }

          throw error;
        }
      })

      return {
        errorMessage,
      }
    }
  })
})
</script>

<style lang="sass">
\:root
  --z-index-selection: 10

.marky
  display: flex
  position: relative
  overflow: scroll
  direction: ltr
  text-align: left
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)


@keyframes blinker
  50%
    opacity: 0.0

</style>
