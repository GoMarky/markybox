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
import { nextTick, onMounted, ref } from 'vue';
import { APIError, ApiError } from '@/platform/request/common/request';
import { AppRoute } from '@/views/router/router';

const editorService = window.workbench.getService(IEditorService);

const { currentRoute, push } = useRouter();
const errorMessage = ref('');

onBeforeRouteUpdate(async (_, to, next) => {
  const { id } = to.params;
  const noteId = id.toString();

  await editorService.create(noteId);
  next();
})

onMounted(async () => {
  await nextTick();

  try {
    const noteId = currentRoute.value.params.id as string;

    await editorService.create(noteId);
  } catch (error) {
    if (error instanceof ApiError && error.is(APIError.NotFoundError)) {
      return push({ name: AppRoute.HomePage })
    }

    throw error;
  }
})
</script>

<script lang="ts">
export default { name: 'Code' };
</script>

<style lang="sass">

</style>
