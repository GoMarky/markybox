<template>
  <div class="m-bottom-nav" :class="{ 'is-hidden': !isBottomNavShown }">
    <div
      v-for="item in bottomMenuItems"
      :key="item.id"
      class="m-bottom-nav__item"
      :class="{ 'is-active': activeMenuItem === item }"
      @click="onNavItemClick(item)"
    >
      <component :is="item.icon" class="m-bottom-nav__icon" />
      <div class="m-bottom-nav__item-title">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  onUnmounted,
} from 'vue';
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { IBottomNavItem, useBottomNavigationItems } from '@/views/composables/use-bottom-navigation-items';
import useBottomNav from '@/views/composables/use-bottom-navigation';
import useCodeSectionNavigation, { CodeSection } from '@/views/composables/useCodeSectionNavigation';

enum ScrollDirection {
  None,
  Up,
  Down,
}

const router = useRouter();
const route = useRoute();

const bottomMenuItems = useBottomNavigationItems();
const { isBottomNavShown, openBottomNav, closeBottomNav } = useBottomNav();
const { setSection } = useCodeSectionNavigation();
const activeMenuItem = ref<IBottomNavItem>(bottomMenuItems.value[0]);

function onNavItemClick(item: IBottomNavItem) {
  activeMenuItem.value = item;

  if (['Code, Files, Commands, Console'].includes(item.id)) {
    return setSection(item.id as CodeSection);
  }

  if (item === activeMenuItem.value || item.routes.length === 0) {
    return;
  }

  void router.push({ name: item.routes?.[0] });
}

let container: HTMLElement | null;
let lastScrollTop = 0;

function onRouteChange(newRoute: RouteLocationNormalizedLoaded) {
  const item = bottomMenuItems.value.find(item =>
    item.routes.includes(newRoute.name as string)
  );

  if (item) {
    openBottomNav()
    activeMenuItem.value = item;
  } else {
    closeBottomNav();
  }
}

watch(route, onRouteChange, { immediate: true });

const scrollDirection = ref<ScrollDirection>(ScrollDirection.None);

function onScroll() {
  if (!container) {
    return;
  }

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
    openBottomNav();
  }
  if (newScrollDirection === ScrollDirection.Down) {
    closeBottomNav();
  }
}

watch(scrollDirection, onScrollDirectionChange);

function onTap(): void {
  if (!container) {
    return;
  }

  if (isBottomNavShown.value) {
    return;
  }

  if (container.scrollHeight > container.clientHeight) {
    return;
  }

  openBottomNav();
}

onMounted(() => {
  container = document.querySelector('#scroll-container');

  if (!container) {
    return console.warn('Could not find scroll container');
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
import IconProfile from '@/views/components/icons/IconProfile.vue';
import IconSettings from '@/views/components/icons/IconSettings.vue';

export default {
  name: 'AppBottomNavigation', components: { IconProfile, IconSettings },
};
</script>

<style lang="sass">
.m-bottom-nav
  position: fixed
  bottom: 0
  left: 0
  right: 0
  display: flex
  justify-content: space-between
  height: 50px
  background-color: var(--accent-blue-dimmest)
  overflow: hidden
  z-index: var(--z-index-app-bottom-nav)
  transition: transform 0.3s ease
  border-top: 1px solid var(--accent-primary-dimmest)

  &__item
    flex-grow: 1
    flex-basis: 0
    display: flex
    flex-direction: column
    align-items: center
    justify-content: space-between
    padding: 5px 0
    font-size: 24px
    color: var(--foreground-dimmest)

    &-title
      font-weight: 500
      font-size: 10px
      line-height: 10px
      text-align: center
      margin-top: 4px

    &.is-active
      color: var(--accent-blurple-dimmer)

  &__icon
    width: 24px
    height: 24px

  &.is-hidden
    transform: translateY(100%)

</style>
