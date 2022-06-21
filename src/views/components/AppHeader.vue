<template>
  <header class="page-header">
    <div class="page-header__menu" @click="openDrawer()">
      <icon-burger-menu />
    </div>
    <router-link :to="{ name: 'HomePage' }" class="page-header__logo">
      <div class="page-header__logo-wrapper">
        <img class="page-header__logo-image" :src="require('@/assets/gomarky-logo.png').default">
      </div>
      <div class="page-header__logo-title">
        markybox
      </div>
    </router-link>
    <nav class="page-header__navigation">
      <ul class="page-header__nav-list">
        <li class="page-header__nav-item">
          <button type="button" class="btn btn_primary page-header__nav-link">
            <icon-settings />
          </button>
<!--          <UISelect-->
<!--            label="Lang"-->
<!--            :value="currentEditorLang"-->
<!--            @update:value="currentEditorLang = $event"-->
<!--            v-model="currentEditorLang"-->
<!--            :options="editorLanguages"-->
<!--          ></UISelect>-->
        </li>
        <li class="page-header__nav-item">
          <button
            type="button"
            @click.prevent="copyNoteLink()"
            class="btn btn_primary page-header__nav-link">
            <icon-share />
          </button>
        </li>
        <li class="page-header__nav-item">
          <button
            v-if="isAuth"
            @click.prevent="openUserProfileModal()"
            type="button"
            class="btn btn_primary page-header__nav-link">
            <icon-profile />
          </button>
          <button v-else @click.prevent="openLoginModal()" type="button" class="btn btn_primary page-header__nav-link">
            {{ $t('header.login.title') }}
          </button>
        </li>
        <li v-if="!isAuth" class="page-header__nav-item">
          <router-link
            :to="{ name: $RouteName.RegistrationPage }"
            type="button"
            class="btn btn_primary page-header__nav-link">
            {{ $t('header.registration.title') }}
          </router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import * as markybox from '@/core';
import { useRouter } from 'vue-router';

import { ISessionService } from '@/code/session/common/session';
import { Component } from '@/code/vue/common/component-names';
import { ILayoutService } from '@/platform/layout/common/layout';
import { INoteService } from '@/code/notes/common/notes';
import { Mime } from '@/base/string';
import { IEditorService } from '@/code/editor/common/editor-service';

import { useNotifications } from '@/views/components/notification/use-notifications';
import useDrawer from '@/views/composables/use-drawer';

import UISelect from '@/views/components/ui/UISelect.vue';
import IconBurgerMenu from '@/views/components/icons/IconBurgerMenu.vue';
import IconProfile from '@/views/components/icons/IconProfile.vue';
import IconShare from '@/views/components/icons/IconShare.vue';
import IconSettings from '@/views/components/icons/IconSettings.vue';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);
  const noteService = accessor.get(INoteService);
  const editorService = accessor.get(IEditorService);

  return defineComponent({
    name: Component.AppHeader,
    components: {
      UISelect,
      IconProfile,
      IconSettings,
      IconShare,
      IconBurgerMenu,
    },
    setup() {
      const router = useRouter();
      const { name, isAuth } = sessionService.profile;
      const currentEditorLang = ref<markybox.EditorLang>('plain');
      const { addNotification } = useNotifications();
      const { openDrawer } = useDrawer();

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
        openDrawer,
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
  flex-direction: row
  overflow: hidden
  height: 40px
  padding: 10px
  flex-shrink: 0
  background-color: $base-background
  align-items: center
  position: sticky
  z-index: $z-index-page-header
  min-height: 40px
  box-sizing: border-box

  &__logo
    @include offset
    display: flex
    flex-direction: row
    align-items: center
    margin-right: auto
    font-size: 0
    outline-color: $yellow-color

  &__logo-wrapper
    margin-right: 7px

  &__logo-image
    width: 32px
    height: 32px

  &__logo-title
    @include offset
    font-size: 1.125rem
    color: $white-color
    font-weight: bold
    line-height: 1
    text-align: left

.page-header__menu
  display: flex
  font-size: 28px

.page-header__navigation
  text-align: center
  z-index: 10
  display: block
  top: 0
  position: static
  background-color: inherit
  padding-top: 0
  flex-basis: 66%
  padding-right: 0.25rem
  width: auto
  margin-left: 35px

.page-header__nav-list
  @include offset
  display: flex
  flex-direction: row
  justify-content: flex-end
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

@media (min-width: $tablet-width)
  .page-header
    flex-direction: row
    justify-content: space-between
    z-index: 3

  .page-header__logo
    flex-basis: 20.5%
    flex-grow: 0

  .page-header__navigation

  .page-header__nav-list

  .page-header__nav-item
    border-bottom: none
    margin-right: 1.5rem
    position: relative

  .page-header__nav-link
    font-size: 0.79rem
    line-height: 1

@media (min-width: 900px)
  .page-header__navigation

@media (min-width: $desktop-width)
  .page-header__nav-item

  .page-header__nav-link

@media (min-width: $full-desktop-width)
  .page-header__navigation

</style>

