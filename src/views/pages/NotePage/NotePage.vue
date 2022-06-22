<template>
  <main class="page-code">
    <component :is="currentSection" />
  </main>
</template>

<script lang="ts" setup>
import useCodeSectionNavigation from '@/views/composables/useCodeSectionNavigation';

const { currentSection } = useCodeSectionNavigation();
</script>

<script lang="ts">
import Code from './_Code.vue';
import Commands from './_Commands.vue';
import Console from './_Console.vue';
import Files from './_Files.vue';

export default { name: 'CodePage', components: { Code, Commands, Console, Files } };
</script>

<style lang="sass">
.marky
  display: flex
  position: relative
  overflow: scroll
  direction: ltr
  text-align: left
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0)

@keyframes blinker
  50%
    opacity: 0.0

</style>
