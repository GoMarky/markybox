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

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);

  return defineComponent({
    components: {
      UIInput,
      UIButton,
    },
    name: Component.UserLoginModal,
    setup() {
      const email = ref('');
      const password = ref('');

      async function login() {
        await sessionService.login(email.value, password.value);
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
.user-login
  padding: 20px

.user-login__input
  padding-bottom: 10px
</style>
