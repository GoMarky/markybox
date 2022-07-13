<template>
  <main class="page-code">
    <component :is="currentSection" />
  </main>
</template>

<script lang="ts">
import Code from './_Code.vue';
import Commands from './_Commands.vue';
import Console from './_Console.vue';
import Files from './_Files.vue';

import { IEditorService } from '@/code/editor/common/editor-service';
const editorService = window.workbench.getService(IEditorService);

export default { name: 'NotePage', components: { Code, Commands, Console, Files } };
</script>


<script lang="ts" setup>
import useCodeSectionNavigation from '@/views/composables/useCodeSectionNavigation';
import { onUnmounted } from 'vue';

const { currentSection } = useCodeSectionNavigation();

onUnmounted(() => {
  editorService.renderer.$isMount = false;
})
</script>
