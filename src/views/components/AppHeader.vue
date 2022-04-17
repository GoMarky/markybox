<template>
  <header class="page-header">
    <router-link :to="{ name: 'HomePage' }" class="page-header__logo">
      <div class="page-header__logo-wrapper">
        LOGO HERE
      </div>
      <div class="page-header__logo-title">
        markybox
      </div>
    </router-link>
    <nav class="page-header__navigation">
      <ul class="page-header__nav-list">
        <li class="page-header__nav-item">
          <a href="#" @click.prevent="createNote()" class="page-header__nav-link">
            Create note
          </a>
        </li>
        <li class="page-header__nav-item">
          <a v-if="isAuth" href="#" @click.prevent="openUserProfileModal()" class="page-header__nav-link">
            {{ name }}
          </a>
          <a v-else href="#" @click.prevent="openLoginModal()" class="page-header__nav-link">
            Login
          </a>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ILayoutService } from '@/platform/layout/common/layout';
import { INoteService } from '@/code/notes/common/notes';
import { useRouter } from 'vue-router';
import { AppRoute } from '@/views/router/router';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);
  const noteService = accessor.get(INoteService);

  return defineComponent({
    name: Component.AppHeader,
    setup() {
      const { name, isAuth, notes } = sessionService.profile;

      const router = useRouter();

      function openUserProfileModal(): void {
        layoutService.modal.open('UserProfileModal');
      }

      function openLoginModal(): void {
        layoutService.modal.open('UserLoginModal');
      }

      async function createNote(): Promise<void> {
        const noteId = await noteService.createNote(`Title - #${notes.value.length}`);

        await router.push({ name: AppRoute.CodePage, params: { id: noteId } })
      }

      return { isAuth, name, openUserProfileModal, openLoginModal, createNote }
    },
  })
});
</script>

<style lang="sass" scoped>
@import "./src/views/styles/global/_mixins.sass"
@import "./src/views/styles/global/_theme.sass"

.page-header
  display: flex
  flex-direction: column
  padding: 9.5px 0
  background-color: $base-background
  align-items: center
  position: relative
  z-index: $z-index-page-header
  min-height: 40px
  box-sizing: border-box

.page-header__logo
  @include offset
  display: flex
  flex-direction: row
  margin-right: auto
  padding-left: 1.25rem
  font-size: 0
  outline-color: $yellow-color

.page-header__logo-wrapper
  margin-right: 7px
  margin-top: 3px

.page-header__logo-title
  @include offset
  font-size: 1.125rem
  color: $white-color
  font-weight: bold
  line-height: 1
  text-align: left

.page-header__toggle-menu
  background: none
  border: none
  font-size: 0
  width: 16px
  height: 16px
  @include offset
  right: 20px
  top: 17px
  position: absolute
  cursor: pointer
  display: block
  outline: 0

.main-show-nav .page-header__toggle-menu > span
  background: 0 0

  &::before
    transform: rotate(45deg)
    top: -1px
    height: 6px
    transition: top .1s, transform .1s .2s
    transform-origin: 50% 50%

  &::after
    transform: rotate(135deg)
    bottom: -1px
    height: 6px
    transition: top .1s, transform .1s .2s
    transform-origin: 50% 50%

.page-header__toggle-menu > span
  position: relative
  width: 16px
  height: 4px
  background-color: $black-color
  display: inline-block
  transition: background .1s .1s

  &::before
    content: ""
    position: absolute
    width: 16px
    height: 4px
    background-color: $black-color
    top: 6px
    left: 0
    transition: top .3s .3s, transform .3s

  &::after
    content: ""
    position: absolute
    width: 16px
    height: 4px
    background-color: $black-color
    bottom: 6px
    left: 0
    transition: top .3s .3s, transform .3s

.page-header__navigation
  width: 100%
  text-align: center
  padding-top: 15px
  z-index: 10
  display: none
  position: absolute
  top: 50px
  left: 0
  background-color: $header-background

  &--is-visible
    display: block

  &--no-js
    position: static
    display: block

.page-header__nav-list
  @include offset
  margin-left: 3.125%
  margin-right: 3.125%

.page-header__nav-item
  @include offset
  list-style: none

  &:last-child
    border-bottom: none

.page-header__nav-link
  display: block
  font-size: 1.5rem
  color: $white-color
  line-height: 1
  text-align: center
  padding-top: 26px
  padding-bottom: 22.5px
  outline-color: $yellow-color
  border-bottom: 2px solid $black-color

  &--is-active
    border-bottom-color: $yellow-color

  &--tel
    color: $white-color
    font-size: 1.125rem

@media (min-width: $tablet-width)
  .page-header
    flex-direction: row
    justify-content: space-between
    z-index: 3

  .page-header__logo
    flex-basis: 20.5%
    flex-grow: 0

  .page-header__navigation
    top: 0
    position: static
    background-color: inherit
    display: block
    padding-top: 0
    flex-basis: 66%
    padding-right: 0.25rem
    width: auto
    margin-left: 35px

  .page-header__nav-list
    display: flex
    flex-direction: row
    margin: 0

  .page-header__nav-item
    border-bottom: none
    margin-right: 1.5rem
    position: relative

    &:nth-last-child(2)
      margin-right: 0

    &:last-child
      margin-left: auto
      margin-right: 1rem

  .page-header__nav-link
    @include offset
    font-size: 0.79rem
    line-height: 1
    border-bottom: none

    &::before
      content: ''
      position: absolute
      bottom: -18px
      left: 0
      width: 0
      border-bottom: 2px solid $black-color
      transition: 0.4s

    &--is-active::before
      width: 100%

    &:hover::before
      width: 100%

    &:hover::before
      display: block

    &--tel::before
      display: none
      color: $white-color

    &--tel:hover::before
      display: none

  .page-header__toggle-menu
    display: none

@media (min-width: 900px)
  .page-header__navigation
    flex-basis: 61%

@media (min-width: $desktop-width)
  .page-header__nav-item
    margin-right: 1.5rem

  .page-header__nav-link
    font-size: 0.9rem

@media (min-width: $full-desktop-width)
  .page-header__navigation
    flex-basis: 58%

</style>

