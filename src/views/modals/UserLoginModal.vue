<template>
  <teleport to="#modal-app">
    <div class="user-login">
      <div class="user-login__input">
        <UIInput
          id="user-email"
          placeholder="email"
          :value="email"
          @update:value="email = $event"
          type="email"
          name="email" />
      </div>
      <div class="user-login__input">
        <UIInput
          id="user-password"
          placeholder="password"
          :value="password"
          @update:value="password = $event"
          type="password"
          name="password" />
      </div>
      <div class="user-login__submit">
        <UIButton @click.native="login()">
          Login
        </UIButton>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Component } from '@/code/vue/common/component-names';
import UIInput from '@/views/components/ui/UIInput.vue';
import UIButton from '@/views/components/ui/UIButton.vue';
import { ISessionService } from '@/code/session/common/session';
import { ILayoutService } from '@/platform/layout/common/layout';
import { getLastElement } from '@/base/array';
import { INoteInfo } from '@/code/notes/common/notes';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);

  return defineComponent({
    components: {
      UIInput,
      UIButton,
    },
    name: Component.UserLoginModal,
    setup() {
      const email = ref('');
      const password = ref('');

      const { notes } = sessionService.profile;

      async function login() {
        try {
          await sessionService.login(email.value, password.value);

          layoutService.modal.close();

          const lastRecord = getLastElement(notes.value) as INoteInfo;
          window.$editor?.setText(lastRecord.data);
        } catch (error) {
          console.error(error);
        }
      }

      return {
        login,
        email,
        password,
      }
    }
  })
})
</script>

<style lang="sass">
.user-login__input
  padding-bottom: 10px
</style>
