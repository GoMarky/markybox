import { translate } from '@/app/code/locales/translate';

declare module '*.png' {
  const value: string;
  export default value;
}
declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: typeof translate;
  }
}

export {}
