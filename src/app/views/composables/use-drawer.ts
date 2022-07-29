import { ref } from 'vue';

const isDrawerShown = ref(false);
const openDrawer = () => {
  isDrawerShown.value = true;
};
const closeDrawer = () => {
  isDrawerShown.value = false;
};

const useDrawer = () => {
  return {
    isDrawerShown,
    openDrawer,
    closeDrawer,
  };
};

export default useDrawer;
