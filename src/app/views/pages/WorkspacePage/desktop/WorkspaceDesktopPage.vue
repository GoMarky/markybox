<template>
    <div class="workspace">
        <WorkspaceSidebarMenu class="workspace__section workspace__section_sidebar" />
        <WorkspaceFileListSection class="workspace__section" />
        <div id="root" class="marky">
        </div>
    </div>
</template>

<script lang="ts">
export default { name: 'WorkspaceDesktopPage' };
</script>

<script lang="ts" setup>
import WorkspaceSidebarMenu from '@/app/views/components/workspace/WorkspaceSidebarMenu.vue';
import WorkspaceFileListSection from '@/app/views/components/workspace/WorkspaceFileList.vue';
import { IWorkspaceService } from '@/app/code/workspace/common/workspace-service';
import { EditorInstance } from '@/app/code/editor/browser/editor';
import { provide, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const editor = new EditorInstance('');
const workspaceService = window.workbench.getService(IWorkspaceService);

const workspaceId = route.params.workspaceId as string;
const workspace = await workspaceService.loadWorkspacebyId(workspaceId);

provide('workspace', workspace);
provide('editor', editor);

workspace.connection.onMessage(() => {
    editor.renderer.clear();
    editor.renderer.setText('import test');
})

onMounted(() => {
    editor.renderer.mount('#root');
    editor.renderer.clear();
    editor.renderer.body.setFormat('plain');
    editor.renderer.setTheme('dark');
    editor.renderer.display.setFullScreen();
});
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
