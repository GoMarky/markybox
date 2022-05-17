<template>
  <div class="page-home">
    <section class="page-home__top-content">
      <p>
        {{ $t('home.top.text') }}
      </p>
    </section>
    <section class="page-home__coding">
      <div class="page-home__coding-content">
        <button class="btn" type="button">
          {{ $t('home.coding.button.create') }}
        </button>
        <button class="btn" type="button">
          {{ $t('home.coding.button.login.create') }}
        </button>
      </div>
    </section>
    <section class="page-home__footer-content">
      {{ $t('home.footer.text') }}
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default window.workbench.createComponent(() => {
  return defineComponent({
    name: 'HomePage',
    setup() {
      const { push } = useRouter();
    },
  })
})
</script>

<style>
.page-home {

}
</style>
