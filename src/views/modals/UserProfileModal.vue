<template>
  <teleport to="#modal-app">
    <div class="user-profile">
      <header class="user-profile__header">
        <h2 class="user-profile__header-title">
          User name: {{ userName }}
        </h2>
        <button class="btn btn_primary" @click="logout()">
          Logout
        </button>
      </header>
      <ul class="user-profile__notes-list">
        <router-link
          custom
          v-slot="{ navigate }"
          :to="{ name: 'CodePage', params: { id: note.id } }"
          v-for="note in notes" :key="note.id"
        >
          <li class="user-profile__note-item" @click="navigate(); closeModal()">
            <article class="user-profile__note-article">
              <div>
                <h3 class="user-profile__note-title">
                  {{ note.title }}
                </h3>
                <time class="user-profile__note-time"> <b>Created:</b> {{ $timestamp(note.createdAt) }}</time>
                <time class="user-profile__note-time"> <b>Last update:</b> {{ $timestamp(note.updatedAt) }}</time>
              </div>
              <button class="btn btn_secondary user-profile__note-delete" type="button" @click.stop="deleteNote(note.id)"> Delete</button>
            </article>
          </li>
        </router-link>
      </ul>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ISessionService } from '@/code/session/common/session';
import { ILayoutService } from '@/platform/layout/common/layout';
import { Component } from '@/code/vue/common/component-names';
import { INoteService } from '@/code/notes/common/notes';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);
  const noteService = accessor.get(INoteService);

  return defineComponent({
    name: Component.UserProfileModal,
    setup() {
      const { notes, name: userName } = sessionService.profile;

      function closeModal(): void {
        layoutService.modal.close();
      }

      async function logout(): Promise<void> {
        await sessionService.logout();

        closeModal();
      }

      async function deleteNote(noteId: string): Promise<void> {
        await noteService.deleteNote(noteId);
        sessionService.profile.removeNote(noteId);
      }

      return { notes, userName, closeModal, deleteNote, logout };
    }
  })
})
</script>

<style lang="sass">
@import "./src/views/styles/global/_base.sass"
@import "./src/views/styles/global/_helpers.sass"

.user-profile
  color: inherit

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
