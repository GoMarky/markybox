<template>
  <div class="app">
    <app-modal />
    <notification-container />
    <div
      class="overlay"
      :class="{
        'overlay--is-visible': isOpenModal,
      }"
    ></div>
    <component :is="currentModal"></component>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppModal from '@/views/components/AppModal.vue';
import UserLoginModal from '@/views/modals/UserLoginModal.vue';
import UserProfileModal from '@/views/modals/UserProfileModal.vue';
import NotificationContainer from '@/views/components/notification/NotificationContainer.vue';
import { ILayoutService } from '@/platform/layout/common/layout';

export default window.workbench.createComponent((accessor) => {
  const layoutService = accessor.get(ILayoutService);

  return defineComponent({
    components: {
      UserProfileModal,
      UserLoginModal,
      AppModal,
      NotificationContainer,
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
