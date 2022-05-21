<template>
  <div class="app">
    <router-view />
    <app-modal />
    <div
      class="overlay"
      :class="{
        'overlay--is-visible': isOpenModal,
      }"
    ></div>
    <component :is="currentModal"></component>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted, watch } from 'vue';
import AppModal from '@/views/components/AppModal.vue';
import UserLoginModal from '@/views/modals/UserLoginModal.vue';
import UserProfileModal from '@/views/modals/UserProfileModal.vue';
import UserSettingsModal from '@/views/modals/UserSettingsModal.vue';
import { ILayoutService } from '@/platform/layout/common/layout';

export default window.workbench.createComponent((accessor) => {
  const layoutService = accessor.get(ILayoutService);

  return defineComponent({
    components: {
      UserProfileModal,
      UserLoginModal,
      UserSettingsModal,
      AppModal,
    },
    name: 'App',
    setup() {
      const { isOpen: isOpenModal, currentModal } = layoutService.modal;

      return { isOpenModal, currentModal }
    },
  });
})
</script>

<style lang="sass">
@import "./src/views/styles/global/_base.sass"
@import "./src/views/styles/global/_helpers.sass"
</style>
