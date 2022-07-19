<template>
  <div class="root-node">
    <div class="root-node__item">
      <workspace-file-list-item 
      v-for="file in rootNode.children" 
      :key="file.id" 
      :file="file "/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getFirstElement } from '@/base/array';
import { IWorkspaceFile } from '@/code/workspace/common/workspace-file';
import { getMockFileTreeArray } from '@/code/workspace/common/workspace-mocks';
import WorkspaceFileListItem from '@/views/components/workspace/WorkspaceFileListItem.vue'

const files = getMockFileTreeArray();
const rootNode = getFirstElement(files) as IWorkspaceFile;
</script>

<script lang="ts">
export default { name: 'WorkspaceFileListRootNode' };
</script>
