<template>
  <div
    class="app"
    :class="{
      'app_has-drawer': isDrawerShown,
      'app_has-bottom-nav': isBottomNavShown,
      'app_has-header': isHeaderShown,
    }"
  >
    <div class="app__main-content">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useDrawer from '@/views/composables/use-drawer';
import useBottomNav from '@/views/composables/use-bottom-navigation';
import useHeader from '@/views/composables/use-header';
import { provide } from 'vue';
import { isMobileDevice } from '@/base/platform';

const { isDrawerShown } = useDrawer();
const { isBottomNavShown } = useBottomNav();
const { isHeaderShown } = useHeader();

provide('isMobile', isMobileDevice);

</script>

<script lang="ts">
export default { name: 'App' };
</script>

<style lang="sass" src="./styles/base.sass"></style>
