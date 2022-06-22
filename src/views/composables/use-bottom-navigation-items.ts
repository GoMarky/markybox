import { ref } from 'vue';
import { RouteName } from '@/code/vue/route-names';

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
    routes: [RouteName.WorkspacePage],
  },
  {
    id: 'Files',
    icon: 'IconSettings',
    name: 'Files',
    routes: [RouteName.WorkspacePage],
  },
  {
    id: 'Console',
    icon: 'IconSettings',
    name: 'Console',
    routes: [RouteName.WorkspacePage],
  },
  {
    id: 'Commands',
    icon: 'IconProfile',
    name: 'Commands',
    routes: [RouteName.WorkspacePage],
  },
]);

export const useBottomNavigationItems = () => items;
