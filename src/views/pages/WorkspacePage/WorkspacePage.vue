<template>
  <div class="workspace">
    <WorkspaceSidebarMenu class="workspace__section workspace__section_sidebar" />
    <WorkspaceFileListSection class="workspace__section" />
  </div>
</template>

<script lang="ts" setup>
import WorkspaceSidebarMenu from '@/views/components/workspace/WorkspaceSidebarMenu.vue';
import WorkspaceFileListSection from '@/views/components/workspace/WorkspaceFileList.vue';

</script>

<script lang="ts">
export default { name: 'WorkspacePage' };
</script>

<style lang="sass">
.workspace
  &__section
    position: absolute
    background-color: var(--background-default)
    border-left: 1px solid var(--accent-blue-default)
    border-right: 1px solid var(--accent-blue-default)

    &_sidebar
      border-left: 0
</style>
