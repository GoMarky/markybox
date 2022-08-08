import { computed, ref } from 'vue';

const name = ref('');

const isFilledName = computed(() => {
  return Boolean(name.value);
});

export default function useAnonymousUser() {
  return { name, isFilledName }
}
