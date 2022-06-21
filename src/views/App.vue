<template>
  <div
    class="app"
    :class="{
      'app_has-drawer': isDrawerShown,
      'app_has-bottom-nav': isBottomNavShown,
      'app_has-header': isHeaderShown,
    }"
  >
    <template>
      <app-modal />
      <div
        class="overlay"
        :class="{ 'overlay--is-visible': isOpenModal }"
      />
      <component :is="currentModal"></component>
    </template>

    <template>
      <notification-container />
    </template>

    <div class="app__main-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppModal from '@/views/components/AppModal.vue';
import UserLoginModal from '@/views/modals/UserLoginModal.vue';
import UserProfileModal from '@/views/modals/UserProfileModal.vue';
import NotificationContainer from '@/views/components/notification/NotificationContainer.vue';
import { ILayoutService } from '@/platform/layout/common/layout';
import useDrawer from '@/views/composables/use-drawer';
import useBottomNav from '@/views/composables/use-bottom-navigation';
import useHeader from '@/views/composables/use-header';

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

      const { isDrawerShown } = useDrawer();
      const { isBottomNavShown } = useBottomNav();
      const { isHeaderShown } = useHeader();

      return { isOpenModal, currentModal, isDrawerShown, isBottomNavShown, isHeaderShown }
    },
  });
})
</script>

<style lang="sass">
@import "./src/views/styles/global/_base.sass"
@import "./src/views/styles/global/_helpers.sass"

.app
  &__main-content
    display: flex
    width: 100%
    max-height: 100%
    position: relative
    flex-grow: 1
    flex-direction: column
    overflow: hidden

</style>
