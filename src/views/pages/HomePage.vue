<template>
  <main class="main-content page-home">
    <section class="page-home__top-content page-home-text">
      <p>
        {{ $t('home.top.text') }}
      </p>
    </section>
    <section class="page-home__coding">
      <div class="page-home__coding-content">
        <button class="btn btn_primary" type="button" @click="createNote()">
          {{ isAuth ? $t('home.coding.button.create.auth', { userName: name }) : $t('home.coding.button.create') }}
        </button>
        <button v-if="!isAuth" type="button" class="btn btn_secondary" @click="openLoginModal()">
          {{ $t('home.coding.button.login.create') }}
        </button>
      </div>
    </section>
    <section class="page-home__footer-content page-home-text">
      {{ $t('home.footer.text') }}
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { RouteName } from '@/code/vue/common/route-names';
import { INoteService } from '@/code/notes/common/notes';
import { ILayoutService } from '@/platform/layout/common/layout';
import { ISessionService } from '@/code/session/common/session';

export default window.workbench.createComponent((accessor) => {
  const noteService = accessor.get(INoteService);
  const sessionService = accessor.get(ISessionService);
  const layoutService = accessor.get(ILayoutService);

  return defineComponent({
    name: RouteName.HomePage,
    setup() {
      const { profile } = sessionService;
      const { isAuth, name } = profile;

      function openLoginModal(): void {
        layoutService.modal.open('UserLoginModal');
      }

      async function createNote(): Promise<void> {
        const noteId = await noteService.createNote();

        console.log(noteId);
      }

      return {
        name,
        isAuth,
        createNote,
        openLoginModal,
      }
    },
  })
})
</script>

<style lang="sass">
.page-home
  display: grid
  grid-gap: 10px
  flex-direction: column
  align-items: center
  justify-content: center
  text-align: center
  margin-top: 20%

  &__coding-content
    display: flex
    flex-direction: row
    gap: 10px
    justify-content: center

.page-home-text
  font-size: 20px
</style>
