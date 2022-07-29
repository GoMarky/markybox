<template>
  <teleport to="#modal-app">
    <div class="user-login">
      <h3 class="user-login__title">
        Sign in
      </h3>
      <div class="user-login__input">
        <UIInput
          id="user-email"
          placeholder="email"
          :value="email"
          @update:value="email = $event"
          type="email"
          autocomplete="on"
          name="email" />
      </div>
      <div class="user-login__input">
        <UIInput
          id="user-password"
          placeholder="password"
          :value="password"
          @update:value="password = $event"
          type="password"
          autocomplete="on"
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
import UIInput from '@/app/views/components/ui/UIInput.vue';
import UIButton from '@/app/views/components/ui/UIButton.vue';
import { ISessionService } from '@/app/code/session/common/session';
import { ILayoutService } from '@/app/platform/layout/common/layout';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);

  return defineComponent({
    components: {
      UIInput,
      UIButton,
    },
    name: 'UserLoginModal',
    setup() {
      const email = ref('');
      const password = ref('');

      async function login() {
        try {
          await sessionService.login(email.value, password.value);

          layoutService.modal.close();
        } catch (error) {
          console.error(error.toString());
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
