<template>
  <teleport to="#modal-app">
    <div class="user-login">
      <h3 class="user-login__title">
        Settings
      </h3>
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
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Component } from '@/code/vue/common/component-names';
import UIButton from '@/views/components/ui/UIButton.vue';
import { INoteService } from '@/code/notes/common/notes';
import UISelect from '@/views/components/ui/UISelect.vue';

export default window.workbench.createComponent((accessor) => {
  const noteService = accessor.get(INoteService);

  return defineComponent({
    components: {
      UIButton,
      UISelect,
    },
    name: Component.UserSettingsModal,
    setup() {
      const currentEditorTheme = ref('light');
      const currentEditorLang = ref('js');

      const editorThemes = [
        'light',
        'dark'
      ];

      const editorLanguages = [
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

      return {
        editorThemes,
        editorLanguages,
        currentEditorTheme,
        currentEditorLang,
        save,
      }
    }
  })
})
</script>

<style lang="sass">
.user-login__input
  padding-bottom: 10px
</style>
