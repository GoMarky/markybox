<template>
  <main class="page-code" v-if="canShowNoteContainer">
    <component :is="currentSection" />
  </main>
</template>

<script lang="ts">
import Code from './_Code.vue';
import Commands from './_Commands.vue';
import { ISessionService } from '@/app/code/session/common/session';
import { ILayoutService } from '@/app/platform/layout/common/layout';

const sessionService = window.workbench.getService(ISessionService);
const layoutService = window.workbench.getService(ILayoutService);

export default { name: 'NotePage', components: { Code, Commands } };
</script>


<script lang="ts" setup>
import useCodeSectionNavigation from '@/app/views/composables/useCodeSectionNavigation';
import useAnonymousUser from '@/app/views/composables/use-anonymous-user';
import { computed, onBeforeMount, provide } from 'vue';
import { NoteStorageInstance } from '@/base/storage';
import { useRoute } from 'vue-router';

const { currentSection } = useCodeSectionNavigation();
const profile = sessionService.profile;
const { isFilledName } = useAnonymousUser();
const route = useRoute();

const canShowNoteContainer = computed(() => {
  if (profile.isAuth.value) {
    return true;
  }

  return Boolean(isFilledName.value);
});

const id = route.params.id as string;
const storage = new NoteStorageInstance(id);

provide('storage', storage);

const showEnterNameModal = (): void => {
  layoutService.modal.open('EnterNameModal');
}

onBeforeMount(() => {
  if (!profile.isAuth.value) {
    showEnterNameModal();
  }
});
</script>
