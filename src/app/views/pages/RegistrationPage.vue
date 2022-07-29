<template>
  <main class="page-registration">
    <div class="page-registration__wrapper">
      <h3 class="page-registration__title">
        Create a markybox account
      </h3>
      <div class="page-registration__input">
        <UIInput
          id="user-name"
          placeholder="User name"
          :value="username"
          input-class="ui-input__block-color-white"
          @update:value="username = $event"
          type="text"
          autocomplete="chrome-off"
          name="username" />
      </div>
      <div class="page-registration__input">
        <UIInput
          id="user-email"
          placeholder="email"
          :value="email"
          input-class="ui-input__block-color-white"
          @update:value="email = $event"
          type="email"
          name="email" />
      </div>
      <div class="page-registration__input">
        <UIInput
          id="user-password"
          placeholder="password"
          :value="password"
          input-class="ui-input__block-color-white"
          @update:value="password = $event"
          type="password"
          name="password" />
      </div>
      <div class="page-registration__submit">
        <UIButton :disabled="!isValidForm" @click.native="register()">
          Sign up
        </UIButton>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import { RouteName } from '@/app/code/vue/route-names';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import UIInput from '@/app/views/components/ui/UIInput.vue';
import UIButton from '@/app/views/components/ui/UIButton.vue';
import { ISessionService } from '@/app/code/session/common/session';

export default window.workbench.createComponent((accessor) => {
  const sessionService = accessor.get(ISessionService);

  return defineComponent({
    components: {
      UIInput,
      UIButton,
    },
    name: RouteName.RegistrationPage,
    setup() {
      const router = useRouter();

      const email = ref('');
      const password = ref('');
      const username = ref('');

      const isValidForm = computed(() => email.value && password.value && username.value);

      async function register(): Promise<void> {
        if (!isValidForm.value) {
          return;
        }

        await sessionService.registerUser({ email: email.value, password: password.value, userName: username.value })

        await router.push({ name: RouteName.HomePage })
      }

      return {
        register,
        isValidForm,
        email,
        password,
        username,
      }
    },
  })
})
</script>

<style lang="sass">
.page-registration
  color: #ffffff

  &__wrapper
    max-width: 320px
    margin: 0 auto

  &__input
    margin-bottom: 10px

</style>
