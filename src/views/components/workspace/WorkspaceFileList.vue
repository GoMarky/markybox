<template>
  <section class="workspace-file-list">
    <header class="workspace-file-list__header">
      <h3 class="workspace-file-list__title">
        Files
      </h3>
      <ul class="workspace-file-list__actions">
        <li class="workspace-file-list__action-item">
          <icon-add />
        </li>
        <li class="workspace-file-list__action-item">
          <icon-add-file />
        </li>
      </ul>
    </header>
    <article class="workspace-file-list__body">
      <workspace-file-list-root-node />
    </article>
  </section>
</template>

<script lang="ts" setup>
import IconAdd from '@/views/components/icons/IconAdd.vue';
import IconAddFile from '@/views/components/icons/IconAddFile.vue';
import WorkspaceFileListRootNode from '@/views/components/workspace/WorkspaceFileListRootNode.vue';
</script>

<script lang="ts">
export default { name: 'WorkspaceFileList' };
</script>

<style lang="sass">
.workspace-file-list
  width: 195px
  height: 100%
  max-height: 100vh
  left: 50px

  &__title
    margin: 0 auto 0 0
    padding: 0

  &__header
    display: flex
    align-items: center
    justify-content: flex-start
    flex-wrap: nowrap
    padding: var(--space-8)
    background-color: var(--background-default)

  &__actions
    display: flex
    align-items: center
    gap: 10px
    list-style: none
    margin: 0 10px 0 0
    padding: 0

  &__action-item
    font-size: 16px
    margin: 0
    padding: 0
</style>
