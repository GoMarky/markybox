<template>
    <main class="workspace-mobile">
        <component :is="currentSection" />
    </main>
</template>

<script lang="ts">
import Code from './_Code.vue';
import Commands from './_Commands.vue';
import Files from './_Files.vue';
import Console from './_Console.vue';

export default { name: 'WorkspaceMobilePage', components: { Code, Commands, Files, Console } };
</script>

<script lang="ts" setup>
import { onUnmounted } from 'vue';
import useCodeSectionNavigation from '@/views/composables/useCodeSectionNavigation';

const { currentSection } = useCodeSectionNavigation();
</script>

<style lang="sass">

</style>
