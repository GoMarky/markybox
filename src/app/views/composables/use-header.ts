import { ref } from 'vue';

const isHeaderShown = ref(true);
const openHeader = () => {
  isHeaderShown.value = true;
};
const closeHeader = () => {
  isHeaderShown.value = false;
};

const useHeader = () => {
  return {
    isHeaderShown,
    openHeader,
    closeHeader,
  };
};

export default useHeader;
