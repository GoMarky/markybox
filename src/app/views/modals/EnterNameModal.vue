<template>
  <teleport to="#modal-app">
    <div class="enter-name">
      <h3 class="enter-name__title">
        Please, introduce yourself
      </h3>
      <div class="enter-name__input">
        <UIInput
          id="user-name"
          placeholder="Your name"
          :value="name"
          @update:value="name = $event"
          type="text"
          autocomplete="off"
          name="name" />
      </div>
      <div class="enter-name__submit">
        <UIButton @click.native="submit()">
          Submit
        </UIButton>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { ILayoutService } from '@/app/platform/layout/common/layout';

const layoutService = window.workbench.getService(ILayoutService);

export default { name: 'EnterNameModal' }
</script>

<script lang="ts" setup>
import { ref } from 'vue';
import useAnonymousUserName from '@/app/views/composables/use-anonymous-user-name';
import UIInput from '@/app/views/components/ui/UIInput.vue';
import UIButton from '@/app/views/components/ui/UIButton.vue';

const { name: userName } = useAnonymousUserName();
const name = ref('');

async function submit() {
  userName.value = name.value;
  name.value = '';

  layoutService.modal.close();
}
</script>

<style lang="sass">
.enter-name__input
  padding-bottom: 10px
</style>
