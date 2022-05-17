<template>
  <main class="main-content page-home">
    <section class="page-home__top-content page-home-text">
      <p>
        {{ $t('home.top.text') }}
      </p>
    </section>
    <section class="page-home__coding">
      <div class="page-home__coding-content">
        <button class="btn btn_primary" type="button">
          {{ $t('home.coding.button.create') }}
        </button>
        <button class="btn btn_secondary" type="button">
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
import { useRouter } from 'vue-router';
import { RouteName } from '@/code/vue/common/route-names';
import { INoteService } from '@/code/notes/common/notes';

export default window.workbench.createComponent((accessor) => {
  const noteService = accessor.get(INoteService);

  return defineComponent({
    name: RouteName.HomePage,
    setup() {
      const { push } = useRouter();
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
    display: grid
    grid-template-columns: 1fr 1fr
    grid-gap: 10px

.page-home-text
  font-size: 20px
</style>
