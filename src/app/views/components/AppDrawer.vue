<template>
  <div class="m-drawer">
    <div class="m-drawer__content" ref="contentRef">
      <div class="m-drawer__top-container">

      </div>

      <div class="m-drawer__logout">
        <UIButton is-outline>{{ $t('drawer.note.create') }}</UIButton>
      </div>

      <div>
        <div class="m-drawer__build-date">Built on</div>
        <div>{{ 123123123 }}</div>
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
import useDrawer from '@/app/views/composables/use-drawer';

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
    padding-bottom: 50px

  &__button
    font-size: 12px
    background: none
    border: 0
    line-height: 0
    margin-top: 10px
    margin-left: 5px
    color: var(--foreground-default)

  &__logout
    margin: 8px 16px 16px

  &__top-container
    border-bottom: 1px solid #222
    background-color: #fff
    position: sticky
    top: 0

</style>
