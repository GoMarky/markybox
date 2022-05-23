<template>
  <teleport to="#modal-app">
    <div class="user-profile">
      <header class="user-profile__header">
        <h2 class="user-profile__header-title">
          User name: {{ userName }}
        </h2>
        <button type="button" @click.prevent="createNote()"
                class="btn btn_primary page-header__nav-link">
          Create new
        </button>
        <button class="btn btn_primary" @click="logout()">
          Logout
        </button>
      </header>
      <section class="user-profile__settings">
        <div class="user-login__input">
          <UISelect
            label="Editor theme"
            :value="currentEditorTheme"
            @update:value="currentEditorTheme = $event"
            v-model="currentEditorTheme"
            :options="editorThemes"
          ></UISelect>
        </div>
        <div class="user-login__input">
          <UISelect
            label="Preferred editor language"
            :value="currentEditorLang"
            @update:value="currentEditorLang = $event"
            :options="editorLanguages"
          ></UISelect>
        </div>
        <div class="user-login__submit">
          <UIButton @click.native="save()">
            Save
          </UIButton>
        </div>
      </section>
      <ul class="user-profile__notes-list">
        <router-link
          custom
          v-slot="{ navigate }"
          :to="{ name: $RouteName.CodePage, params: { id: note.id } }"
          v-for="note in notes" :key="note.id"
        >
          <li class="user-profile__note-item" @click="navigate(); closeModal()">
            <article class="user-profile__note-article">
              <div>
                <h3 class="user-profile__note-title">
                  {{ note.title }}
                </h3>
                <time class="user-profile__note-time"><b>Created:</b> {{ $timestamp(note.createdAt) }}</time>
                <time class="user-profile__note-time"><b>Last update:</b> {{ $timestamp(note.updatedAt) }}</time>
              </div>
              <button class="btn btn_secondary user-profile__note-delete" type="button"
                      @click.stop="deleteNote(note.id)"> Delete
              </button>
            </article>
          </li>
        </router-link>
      </ul>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ISessionService } from '@/code/session/common/session';
import { ILayoutService } from '@/platform/layout/common/layout';
import { Component } from '@/code/vue/common/component-names';
import { INoteService } from '@/code/notes/common/notes';
import UISelect from '@/views/components/ui/UISelect.vue';
import UIButton from '@/views/components/ui/UIButton.vue';
import { EditorLang, EditorTheme } from '@/code/notes/browser/editor-settings';
import { AppRoute } from '@/views/router/router';
import { useRouter } from 'vue-router';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);
  const noteService = accessor.get(INoteService);

  return defineComponent({
    components: {
      UIButton,
      UISelect,
    },
    name: Component.UserProfileModal,
    setup() {
      const { notes, name: userName } = sessionService.profile;
      const router = useRouter();

      const currentEditorTheme = ref('light');
      const currentEditorLang = ref('js');

      const editorThemes: EditorTheme[] = [
        'light',
        'dark'
      ];

      const editorLanguages: EditorLang[] = [
        'cpp',
        'python',
        'js',
        'json'
      ];

      async function save(): Promise<void> {
        try {
        } catch (error) {
          console.error(error.toString());
        }
      }

      function closeModal(): void {
        layoutService.modal.close();
      }

      async function createNote(): Promise<void> {
        const noteId = await noteService.createNote(`Title - #${notes.value?.length || 1}`);

        await router.push({ name: AppRoute.CodePage, params: { id: noteId } })

        closeModal();
      }

      async function logout(): Promise<void> {
        await sessionService.logout();

        closeModal();
      }

      async function deleteNote(noteId: string): Promise<void> {
        await noteService.deleteNote(noteId);
        sessionService.profile.removeNote(noteId);
      }

      return {
        notes,
        userName,
        editorThemes,
        editorLanguages,
        currentEditorTheme,
        currentEditorLang,
        closeModal,
        deleteNote,
        logout,
        createNote,
        save,
      };
    }
  })
})
</script>

<style lang="sass">
@import "./src/views/styles/global/_base.sass"
@import "./src/views/styles/global/_helpers.sass"

.user-profile
  color: inherit

  &__settings
    margin-bottom: 10px

  &__header
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between

  &__note-article
    display: flex
    flex-direction: row
    align-items: center
    justify-content: space-between
    padding: 10px
    border: 1px dashed #222

.user-profile__notes-list
  @include offset
  padding: 5px

.user-profile__note-item
  @include offset
  cursor: pointer
  list-style: none
  margin-bottom: 10px

  &:hover
    opacity: 0.6

.user-profile__note-time
  display: block
</style>
