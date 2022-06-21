import { ref } from 'vue';

const isBottomNavShown = ref(false);
const openBottomNav = () => {
  isBottomNavShown.value = true;
};
const closeBottomNav = () => {
  isBottomNavShown.value = false;
};

const useBottomNav = () => {
  return {
    isBottomNavShown,
    openBottomNav,
    closeBottomNav,
  };
};

export default useBottomNav;
