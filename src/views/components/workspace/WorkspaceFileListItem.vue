<template>
  <div class="workspace-file" @click="onClick()">
   <div class="workspace-file__content">
    <div class="workspace-file__icon">
        <component :is="iconComponent"/>
    </div>
    <span class="workspace-file__name">
        {{ props.file.name }}
    </span>
   </div>
  </div>
</template>

<script lang="ts" setup>
import { IWorkspaceFile, FileExtension } from '@/code/workspace/common/workspace-file';
import IconFileJavascript from '@/views/components/icons/IconFileJavascript.vue';
import IconFileJSON from '@/views/components/icons/IconFileJSON.vue';
import IconFileDefault from '@/views/components/icons/IconFileDefault.vue';
import { computed } from '@vue/reactivity';

const props = defineProps<{
  file: IWorkspaceFile,
}>();

const emit = defineEmits<{
  (e: 'choose-file', file: IWorkspaceFile): void
}>()

const onClick = () => {
    emit('choose-file', props.file);
}

const iconComponent = computed(() => {
    const name = props.file.name;

    switch (true) {
        case FileExtension.isJavascript(name):
            return IconFileJavascript;
        case FileExtension.isJSON(name):
            return IconFileJSON;
        default:
            return IconFileDefault;
    }
});
</script>

<script lang="ts">
export default { name: 'WorkspaceFileListItem' };
</script>

<style lang="sass">
.workspace-file
    cursor: pointer

    &:hover
        background-color: var(--background-higher)
        color: var(--foreground-default)

    &__content
        display: flex
        align-items: center
        padding: 5px

    &__icon
        margin-right: 15px
</style>
