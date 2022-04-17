<template>
  <teleport to="#modal-app">
    <div class="user-profile">
      <header class="user-profile__header">
        <h2 class="user-profile__header-title">
          {{ userName }}
        </h2>
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
              <h3 class="user-profile__note-title">
                {{ note.title }} - {{ note.id }}
              </h3>
              <time class="user-profile__note-time"> Created {{ note.createdAt }}</time>
              <time class="user-profile__note-time"> Last update {{ note.updatedAt }}</time>
              <button class="user-profile__note-delete" type="button" @click="deleteNote(note.id)"> Delete</button>
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

      async function deleteNote(noteId: string): Promise<void> {
        await noteService.deleteNote(noteId);
      }

      return { notes, userName, closeModal, deleteNote };
    }
  })
})
</script>

<style lang="sass">
@import "./src/views/styles/global/_base.sass"
@import "./src/views/styles/global/_helpers.sass"

.user-profile
  color: inherit

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
