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
      <workspace-file-list-root-node @choose-file="onChooseFile" />
    </article>
  </section>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import { IWorkspaceFile } from '@/app/code/workspace/common/workspace-file';
import IconAdd from '@/app/views/components/icons/IconAdd.vue';
import IconAddFile from '@/app/views/components/icons/IconAddFile.vue';
import WorkspaceFileListRootNode from '@/app/views/components/workspace/WorkspaceFileListRootNode.vue';
import { Workspace } from '@/app/code/workspace/browser/workspace-service';
import { EditorInstance } from '@/app/code/editor/browser/editor';
import { getValuableSyntax } from '@gomarky/markybox-core';

const workspace = inject<Workspace>('workspace') as Workspace;
const editor = inject<EditorInstance>('editor') as EditorInstance;

const onChooseFile = (file: IWorkspaceFile) => {
  workspace.requestFile('');

  const lang = getValuableSyntax(file.name);
  editor.renderer.body.setFormat(lang);
}
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
