import { ref } from 'vue';

export interface IBottomNavItem {
  id: string;
  icon: string;
  name: string;
  routes: string[];
}

const items = ref<IBottomNavItem[]>([
  {
    id: 'Code',
    icon: 'IconSettings',
    name: 'Code',
    routes: ['CodePage'],
  },
  {
    id: 'Files',
    icon: 'IconSettings',
    name: 'Files',
    routes: ['CodePage'],
  },
  {
    id: 'Console',
    icon: 'IconSettings',
    name: 'Console',
    routes: ['CodePage'],
  },
  {
    id: 'Commands',
    icon: 'IconProfile',
    name: 'Commands',
    routes: ['CodePage'],
  },
]);

export const useBottomNavigationItems = () => items;
