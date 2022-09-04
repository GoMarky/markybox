<template>
  <div class="m-drawer">
    <div class="m-drawer__content" ref="contentRef">
      <div class="m-drawer__top-container">
        <app-drawer-user-section v-if="isAuth" />
      </div>

      <div class="m-drawer__create">
        <UIButton is-outline>{{ $t('drawer.note.create') }}</UIButton>
      </div>

      <div class="m-drawer__navigation">
        <app-drawer-navigation-menu />
      </div>

      <div class="m-drawer__build">
        <b class="m-drawer__build-date">Built date: </b>
        <span>{{ new Date().toUTCString() }}</span>
      </div>
    </div>
    <button class="m-drawer__button" type="button" @click="closeDrawer()">
      <IconClose />
    </button>
  </div>
</template>

<script lang="ts" setup>
import UIButton from '@/app/views/components/ui/UIButton.vue';
import IconClose from '@/app/views/components/icons/IconClose.vue';
import AppDrawerUserSection from '@/app/views/components/AppDrawerUserSection.vue';
import AppDrawerNavigationMenu from '@/app/views/components/AppDrawerNavigationMenu.vue';
import useDrawer from '@/app/views/composables/use-drawer';
import useSession from '@/app/views/composables/use-session';

const { isAuth } = useSession();

const { closeDrawer } = useDrawer();
</script>

<script lang="ts">
export default { name: 'AppDrawer' };
</script>

<style lang="sass">
.m-drawer
  width: 100%
  height: 100%
  display: flex
  align-items: flex-start
  overflow: hidden

  &__content
    position: relative
    width: 240px
    height: 100%
    background-color: var(--accent-blurple-dimmest)
    overflow-y: auto
    padding: 8px 8px 50px

  &__build
    margin-top: 16px

  &__button
    font-size: 12px
    background: none
    border: 0
    line-height: 0
    margin-top: 10px
    margin-left: 5px
    color: var(--foreground-default)

  &__create
    width: 100%

    & > .ui-button > .btn
      width: 100%

  &__top-container
    position: sticky
    margin-bottom: 8px
    top: 0

</style>
