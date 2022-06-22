<template>
  <div class="code">
    <div id="root" class="marky">
      <div v-if="errorMessage.length > 0">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { IEditorService } from '@/code/editor/common/editor-service';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import { nextTick, ref } from 'vue';
import { APIError, ApiError } from '@/platform/request/common/request';
import { RouteName } from '@/code/vue/route-names';
import { timeout } from '@/base/async';

const editorService = window.workbench.getService(IEditorService);

const { currentRoute, push } = useRouter();
const errorMessage = ref('');

onBeforeRouteUpdate(async (_, __, next) => {
  await loadNote();
  next();
})

function loadNote(): Promise<void> {
  return new Promise(async (resolve) => {
    try {
      const noteId = currentRoute.value.params.id as string;
      const note = await editorService.loadNote(noteId);

      resolve();
      await timeout(100);
      await editorService.create(note);
    } catch (error) {
      if (error instanceof ApiError && error.is(APIError.NotFoundError)) {
        await push({ name: RouteName.HomePage })
      }

      throw error;
    }
  })
}

await loadNote();
</script>
