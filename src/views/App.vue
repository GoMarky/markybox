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

const { isDrawerShown } = useDrawer();
const { isBottomNavShown } = useBottomNav();
const { isHeaderShown } = useHeader();

</script>

<script lang="ts">
export default { name: 'App' };
</script>

<style lang="sass">
@import 'styles/base'

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
