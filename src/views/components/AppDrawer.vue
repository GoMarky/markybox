<template>
  <div class="m-drawer">
    <div class="m-drawer__content" ref="contentRef">
      <div class="m-drawer__top-container">

      </div>

      <div class="m-drawer__logout">
        <UIButton is-outline>{{ $t('profile.settings.logout') }}</UIButton>
      </div>

      <div>
        <div class="m-drawer__build-date">Built on</div>
        <div style="font-size: 13px; font-weight: 500">{{ 123123123 }}</div>
      </div>
    </div>
    <button class="m-drawer__button" type="button" @click="closeDrawer()">
      <IconClose />
    </button>
  </div>
</template>

<script lang="ts" setup>
import UIButton from '@/views/components/ui/UIButton.vue';
import IconClose from '@/views/components/icons/IconClose.vue';
import useDrawer from '@/views/composables/use-drawer';

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

  &__build-date


  &__content
    position: relative
    width: calc(100% - 36px)
    height: 100%
    background-color: #ffffff
    overflow-y: auto
    padding-bottom: 50px

  &__button
    font-size: 12px
    line-height: 0
    color: var(--g-color-secondary)
    margin-top: 25px
    margin-left: 25px


  &__logout
    margin: 8px 16px 16px


  &__top-container
    border-bottom: 1px solid #222
    background-color: #fff
    position: sticky
    top: 0
    z-index: 1

</style>
