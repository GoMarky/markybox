<template>
  <main class="page-code">
    <component :is="currentSection" />
  </main>
</template>

<script lang="ts">
import Code from './_Code.vue';
import Commands from './_Commands.vue';

export default { name: 'NotePage', components: { Code, Commands } };
</script>


<script lang="ts" setup>
import useCodeSectionNavigation from '@/views/composables/useCodeSectionNavigation';

const { currentSection } = useCodeSectionNavigation();
</script>
