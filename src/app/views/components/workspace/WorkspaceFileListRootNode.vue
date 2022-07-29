<template>
  <div class="root-node" v-if="rootFiles.length > 0 && currentFile">
    <workspace-file-list-item :current-file="currentFile" @choose-file="onChooseFile" v-for="file in rootFiles" :key="file.id" :file="file" />
  </div>
</template>

<script lang="ts">
import { IWorkspaceService } from '@/app/code/workspace/common/workspace-service';
import { IWorkspaceFile } from '@/app/code/workspace/common/workspace-file';
const workspaceService = window.workbench.getService(IWorkspaceService);

export default { name: 'WorkspaceFileListRootNode' };
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import WorkspaceFileListItem from '@/app/views/components/workspace/WorkspaceFileListItem.vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const rootFiles = ref<IWorkspaceFile[]>([]);
const currentFile = ref<IWorkspaceFile>();

onMounted(async () => {
  const workspace = await workspaceService.loadWorkspacebyId(workspaceId);

  rootFiles.value = workspace.files[0].children as IWorkspaceFile[];
  currentFile.value = rootFiles.value[0];
});


const emit = defineEmits<{
  (e: 'choose-file', file: IWorkspaceFile): void
}>();

const onChooseFile = (file: IWorkspaceFile) => {
  emit('choose-file', file);

  currentFile.value = file;
}
</script>

