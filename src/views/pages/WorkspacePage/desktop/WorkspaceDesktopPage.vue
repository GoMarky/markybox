<template>
    <div class="workspace">
        <WorkspaceSidebarMenu class="workspace__section workspace__section_sidebar" />
        <WorkspaceFileListSection @choose-file="onChooseFile" class="workspace__section" />
        <div id="root" class="marky">
        </div>
    </div>
</template>

<script lang="ts">
import { IWorkspaceService } from '@/code/workspace/common/workspace-service';
import { useRoute } from 'vue-router';
const workspaceService = window.workbench.getService(IWorkspaceService);

export default { name: 'WorkspaceDesktopPage' };
</script>

<script lang="ts" setup>
import WorkspaceSidebarMenu from '@/views/components/workspace/WorkspaceSidebarMenu.vue';
import WorkspaceFileListSection from '@/views/components/workspace/WorkspaceFileList.vue';
import { EditorInstance } from '@/code/editor/browser/editor';
import { onMounted } from 'vue';
import * as markybox from '@/core';
import { IWorkspaceFile } from '@/code/workspace/common/workspace-file';

const route = useRoute();
const editor = new EditorInstance('', 'plain', 'light');

const workspaceId = route.params.workspaceId as string;
const workspace = await workspaceService.loadWorkspacebyId(workspaceId);

workspace.connection.onMessage(() => {
    editor.renderer.clear();
    editor.renderer.setText('import test');
})

onMounted(() => {
    editor.renderer.mount('#root');
    editor.renderer.clear();
    editor.renderer.body.setFormat('plain');
    editor.renderer.display.setFullScreen();
});

const onChooseFile = (file: IWorkspaceFile) => {
    workspace.requestFile('');

    const lang = markybox.getValuableSyntax(file.name);
    editor.renderer.body.setFormat(lang);
}
</script>

<style lang="sass" scoped>
.workspace
  &__section
    position: absolute
    background-color: var(--background-default)
    border-left: 1px solid var(--accent-blue-default)
    border-right: 1px solid var(--accent-blue-default)

    &_sidebar
      border-left: 0
.marky
    left: 245px
</style>
