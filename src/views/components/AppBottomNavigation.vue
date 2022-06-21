<template>
  <div class="f-bottom-nav" :class="{ 'is-hidden': !isBottomNavShown }">
    <div
      v-for="item in bottomMenuItems"
      :key="item.id"
      class="f-bottom-nav__item"
      :class="{ 'is-active': activeMenuItem === item }"
      @click="onNavItemClick(item)"
    >
      <component :is="item.icon" class="f-bottom-nav__icon" />
      <div class="f-bottom-nav__item-title">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  ref,
  onMounted,
  watch,
  onUnmounted,
} from 'vue';
import { useRouter } from 'vue-router';
import { IBottomNavItem, useBottomNavigationItems } from '@/views/composables/use-bottom-navigation-items';

enum ScrollDirection {
  None,
  Up,
  Down,
}

const router = useRouter();
const route = router.currentRoute;
const bottomMenuItems = useBottomNavigationItems();
const activeMenuItem = ref<IBottomNavItem>(bottomMenuItems.value[0]);

function onNavItemClick(item: IBottomNavItem) {
  if (item === activeMenuItem.value || item.routes.length === 0) {
    return;
  }

  activeMenuItem.value = item;

  void router.push({ name: item.routes?.[0] });
}

let container: HTMLElement | null;
let lastScrollTop = 0;

const scrollDirection = ref<ScrollDirection>(ScrollDirection.None);
const isBottomNavShown = ref(false);

function onScroll() {
  if (!container) {
    return;
  }

  // убираем всякий оверскролл сафари. в смысле убираем из логики вычисления скролла
  // убрать его из системы может лишь Стив Джобс
  if (
    container.scrollTop < 0 ||
    container.scrollTop + container.offsetHeight > container.scrollHeight
  ) {
    return;
  }

  if (container.scrollTop > lastScrollTop) {
    scrollDirection.value = ScrollDirection.Down;
  } else {
    scrollDirection.value = ScrollDirection.Up;
  }

  lastScrollTop = container.scrollTop;
}

function onScrollDirectionChange(newScrollDirection: ScrollDirection) {
  if (newScrollDirection === ScrollDirection.Up) {
    isBottomNavShown.value = true;
  }
  if (newScrollDirection === ScrollDirection.Down) {
    isBottomNavShown.value = false;
  }
}

watch(scrollDirection, onScrollDirectionChange);

// следим за тапами, чтобы не случилось такого, что контент на странице поменялся,
// и больше не поскроллишь, чтобы вернуть меню
function onTap(): void {
  if (!container) {
    return;
  }

  // если навигация показана, то и хорошо, цель достигнута
  if (isBottomNavShown.value) {
    return;
  }

  // если есть скролл, то этим уже управляет функция onScroll
  if (container.scrollHeight > container.clientHeight) {
    return;
  }

  isBottomNavShown.value = true;
}

onMounted(() => {
  container = document.querySelector('body');

  if (!container) {
    console.warn('Could not find scroll container');
    return;
  }

  container.addEventListener('scroll', onScroll, { passive: true });
  container.addEventListener('mousedown', onTap);
  container.addEventListener('touchstart', onTap);
});

onUnmounted(() => {
  if (!container) {
    return;
  }

  container.removeEventListener('scroll', onScroll);
  container.removeEventListener('mousedown', onTap);
  container.removeEventListener('touchstart', onTap);
});
</script>

<script lang="ts">
export default { name: 'AppBottomNavigation' };
</script>

<style lang="sass">
.f-bottom-nav
  position: fixed
  bottom: 0
  left: 0
  right: 0
  display: flex
  justify-content: space-between
  height: 50px
  background-color: var(--c-nav-bg-tabbar)
  overflow: hidden
  z-index: var(--z-index-bottom-nav)
  transition: transform 0.3s ease
  border-top: 1px solid var(--c-nav-divider)

  &__item
    flex-grow: 1
    flex-basis: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-between
    height: 100%
    padding: 5px 0
    font-size: 24px
    color: var(--c-nav-secondary)

    &-title
      font-weight: 500
      font-size: 10px
      line-height: 10px
      text-align: center
      margin-top: 4px


    &.is-active
      color: var(--c-nav-primary-accent-tabbar)


  &__icon
    width: 24px
    height: 24px


  &.is-hidden
    transform: translateY(100%)

</style>
