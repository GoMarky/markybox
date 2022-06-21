<template>
  <div class="m-app">
    <div v-if="isHeaderShown" class="m-app__header">
      <app-header />
    </div>

    <div v-if="isDrawerShown" class="m-app__aside">
      <app-drawer />
    </div>

    <div v-if="isBottomNavShown" class="m-app__bottom-nav">
      <app-bottom-navigation />
    </div>

    <div class="m-app__body" id="scroll-container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import AppHeader from '@/views/components/AppHeader.vue';
import AppDrawer from '@/views/components/AppDrawer.vue';
import AppBottomNavigation from '@/views/components/AppBottomNavigation.vue';

import useDrawer from '@/views/composables/use-drawer';
import useBottomNav from '@/views/composables/use-bottom-navigation';
import useHeader from '@/views/composables/use-header';

const { isDrawerShown } = useDrawer();
const { isBottomNavShown } = useBottomNav();
const { isHeaderShown } = useHeader();

</script>

<style lang="sass">
.m-app

  &__bottom-nav
    position: fixed
    bottom: 0
    left: 0
    right: 0
    height: 50px
    background-color: var(--c-nav-bg-tabbar)
    overflow: hidden
    z-index: var(--z-index-bottom-nav)
    transition: transform .3s ease
    border-top: 1px solid var(--c-nav-divider)

    &__aside
      position: absolute
      top: 0
      bottom: 0
      left: 0
      right: 0
</style>

<script lang="ts">
export default { name: 'AppLayout' };
</script>

