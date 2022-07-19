<template>
  <div class="root-node" v-if="rootFiles.length > 0">
    <workspace-file-list-item @choose-file="onChooseFile" v-for="file in rootFiles" :key="file.id" :file="file" />
  </div>
</template>

<script lang="ts">
import { IWorkspaceService } from '@/code/workspace/common/workspace-service';
import { IWorkspaceFile } from '@/code/workspace/common/workspace-file';
const workspaceService = window.workbench.getService(IWorkspaceService);

export default { name: 'WorkspaceFileListRootNode' };
</script>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import WorkspaceFileListItem from '@/views/components/workspace/WorkspaceFileListItem.vue'
import { useRoute } from 'vue-router';

const route = useRoute();
const workspaceId = route.params.workspaceId as string;
const rootFiles = ref<IWorkspaceFile[]>([]);

onMounted(async () => {
  const workspace = await workspaceService.loadWorkspacebyId(workspaceId);

  rootFiles.value = workspace.files[0].children as IWorkspaceFile[];
});


const emit = defineEmits<{
  (e: 'choose-file', file: IWorkspaceFile): void
}>();

const onChooseFile = (file: IWorkspaceFile) => {
  emit('choose-file', file);
}
</script>

