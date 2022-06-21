<template>
  <header class="page-header">
    <div class="page-header__menu">
      <icon-burger-menu />
    </div>
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
          <UISelect
            label="Lang"
            :value="currentEditorLang"
            @update:value="currentEditorLang = $event"
            v-model="currentEditorLang"
            :options="editorLanguages"
          ></UISelect>
        </li>
        <li class="page-header__nav-item">
          <button type="button" @click.prevent="copyNoteLink()"
                  class="btn btn_primary page-header__nav-link">
            Share link
          </button>
        </li>
        <li class="page-header__nav-item">
          <button type="button" @click.prevent="clearNote()"
                  class="btn btn_primary page-header__nav-link">
            Clear
          </button>
        </li>
        <li class="page-header__nav-item">
          <button type="button" v-if="isAuth" @click.prevent="openUserProfileModal()"
                  class="btn btn_primary page-header__nav-link">
            Profile
          </button>
          <button v-else type="button" @click.prevent="openLoginModal()" class="btn btn_primary page-header__nav-link">
            Login
          </button>
        </li>
        <li v-if="!isAuth" class="page-header__nav-item">
          <router-link
            :to="{ name: $RouteName.RegistrationPage }"
            type="button"
            class="btn btn_primary page-header__nav-link">
            Sign up
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ILayoutService } from '@/platform/layout/common/layout';
import { INoteService } from '@/code/notes/common/notes';
import { useRouter } from 'vue-router';
import { Mime } from '@/base/string';
import * as markybox from '@/core';
import { IEditorService } from '@/code/editor/common/editor-service';
import { useNotifications } from '@/views/components/notification/use-notifications';

import UISelect from '@/views/components/ui/UISelect.vue';
import IconBurgerMenu from '@/views/components/icons/IconBurgerMenu.vue';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);
  const noteService = accessor.get(INoteService);
  const editorService = accessor.get(IEditorService);

  return defineComponent({
    name: Component.AppHeader,
    components: {
      UISelect,
      IconBurgerMenu,
    },
    setup() {
      const router = useRouter();
      const { name, isAuth } = sessionService.profile;
      const currentEditorLang = ref<markybox.EditorLang>('plain');
      const { addNotification } = useNotifications();

      const editorLanguages: markybox.EditorLang[] = markybox.getSupportedSyntaxes();


      function openUserProfileModal(): void {
        layoutService.modal.open('UserProfileModal');
      }

      function openLoginModal(): void {
        layoutService.modal.open('UserLoginModal');
      }

      async function clearNote(): Promise<void> {
        const noteId = router.currentRoute.value.params.id as string;

        if (noteId) {
          await noteService.updateNote(noteId, '');
          editorService.renderer.clear();
        }
      }

      watch(noteService.store.currentNote, (note) => {
        currentEditorLang.value = note?.lang as markybox.EditorLang;
      })

      watch(currentEditorLang, async (lang: markybox.EditorLang) => {
        const noteId = router.currentRoute.value.params.id as string;
        const text = editorService.renderer.getText() as string;

        await noteService.updateNote(noteId, text, lang);
        editorService.renderer.body.setFormat(lang);
      })

      async function copyNoteLink(): Promise<void> {
        const link = window.location.href;

        const type: Mime = 'text/plain';
        const blob: Blob = new window.Blob([link], { type });
        const data: ClipboardItem[] = [new ClipboardItem({ [type]: blob })];

        await window.navigator.clipboard.write(data);

        addNotification({
          title: 'Link copied',
          hideAfter: 1500,
        })
      }

      return {
        currentEditorLang,
        editorLanguages,
        isAuth,
        name,
        openUserProfileModal,
        openLoginModal,
        clearNote,
        copyNoteLink
      }
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
  position: sticky
  top: 0
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

.page-header__menu
  font-size: 24px

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
    justify-content: flex-end
    margin: 0

  .page-header__nav-item
    border-bottom: none
    margin-right: 1.5rem
    position: relative

  .page-header__nav-link
    font-size: 0.79rem
    line-height: 1

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

