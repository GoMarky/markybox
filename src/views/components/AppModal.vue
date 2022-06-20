<template>
  <div class="modal" :class="{ 'modal--is-visible': isOpenModal }">
    <div class="modal__content">
      <div class="modal__container">
        <header class="modal__header">
          <h3 class="modal__title"></h3>
          <button class="modal__close" type="button" @click="closeModal()"></button>
        </header>
        <div class="modal__main" id="modal-app">

        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from '@/code/vue/common/component-names';
import { defineComponent, onMounted, onUnmounted } from 'vue';
import { ILayoutService } from '@/platform/layout/common/layout';

export default window.workbench.createComponent((accessor) => {
  const layoutService = accessor.get(ILayoutService);

  return defineComponent({
    name: Component.AppModal,
    setup() {
      const { isOpen: isOpenModal } = layoutService.modal

      function closeModal(): void {
        layoutService.modal.close();
      }

      function onEscape(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
          closeModal();
        }
      }

      window.addEventListener('keyup', onEscape);

      return { isOpenModal, closeModal }
    },
  })
})
</script>

<style lang="sass">
@import './src/views/styles/global/_base.sass'
@import './src/views/styles/global/_theme.sass'

.modal
  -webkit-overflow-scrolling: touch
  overflow: auto
  position: fixed
  top: 0
  bottom: 0
  left: 0
  right: 0
  padding-top: 50px
  padding-bottom: 50px
  z-index: $z-index-modal
  display: none

  &--is-visible
    display: block

.modal__header
  min-height: 40px

  display: flex
  flex-direction: row
  align-items: center
  justify-content: space-between
  background-color: $yellow-color

.modal__title
  @include offset
  font-size: 1.35rem
  font-weight: lighter
  color: $black-color
  line-height: 2.1
  text-align: left
  padding-left: 12px
  padding-top: 4px

.modal__close
  background: none
  border: none
  font-size: 0
  width: 18px
  height: 18px
  @include offset
  right: 8px
  outline-color: $yellow-color
  top: 11px
  position: absolute
  cursor: pointer
  display: block

  &::before
    content: ""
    position: absolute
    width: 18px
    height: 7px
    background-color: $black-color
    top: 6px
    left: 0
    transform: rotate(45deg)

  &::after
    content: ""
    position: absolute
    width: 18px
    height: 7px
    background-color: $black-color
    bottom: 5px
    left: 0
    transform: rotate(135deg)

.modal__container
  position: sticky
  max-width: 800px
  width: 100%
  margin: 0 auto
  padding-bottom: 50px
  color: $black-color

.modal__content
  height: 100%
  margin: 0 auto

.modal__main
  background: $white-color
  padding: 20px
</style>
