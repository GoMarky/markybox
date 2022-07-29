<template>
    <main class="workspace-mobile">
        <component :is="currentComponent" />
    </main>
</template>

<script lang="ts">
export default { name: 'WorkspaceMobilePage' };
</script>

<script lang="ts" setup>
import { computed } from 'vue';
import useCodeSectionNavigation from '@/app/views/composables/useCodeSectionNavigation';
import Code from './_Code.vue';
import Commands from './_Commands.vue';
import Files from './_Files.vue';
import Console from './_Console.vue';

const { currentSection } = useCodeSectionNavigation();

const currentComponent = computed(() => {
    switch (currentSection.value) {
        case 'Code':
            return Code;
        case 'Commands':
            return Commands;
        case 'Console':
            return Console;
        case 'Files':
            return Files;
        default:
            throw new ReferenceError('Expect mounting exist component');
    }
})
</script>
