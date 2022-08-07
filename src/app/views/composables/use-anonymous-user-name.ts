import { ref } from 'vue';

const name = ref('');

export default function useAnonymousUserName() {
  return { name }
}
