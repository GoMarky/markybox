<template>
  <main class="page-code" v-if="canShowNoteContainer">
    <component :is="currentSection" />
  </main>
</template>

<script lang="ts">
import Code from './_Code.vue';
import Commands from './_Commands.vue';
import { ISessionService } from '@/app/code/session/common/session';

const sessionService = window.workbench.getService(ISessionService);

export default { name: 'NotePage', components: { Code, Commands } };
</script>


<script lang="ts" setup>
import useCodeSectionNavigation from '@/app/views/composables/useCodeSectionNavigation';
import { computed, onBeforeMount } from 'vue';

const { currentSection } = useCodeSectionNavigation();
const profile = sessionService.profile;

const canShowNoteContainer = computed(() => {
  if (profile.isAuth.value) {
    return true;
  }

  return false;
})

const showEnterNameModal = (): void => {
  console.log('enter-name');
}

onBeforeMount(() => {
  if (!profile.isAuth.value) {
    showEnterNameModal();
  }
})
</script>
