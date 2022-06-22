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
    routes: [RouteName.WorkspacePage, RouteName.NotePage],
  },
  {
    id: 'Files',
    icon: 'IconSettings',
    name: 'Files',
    routes: [RouteName.WorkspacePage, RouteName.NotePage],
  },
  {
    id: 'Console',
    icon: 'IconSettings',
    name: 'Console',
    routes: [RouteName.WorkspacePage, RouteName.NotePage],
  },
  {
    id: 'Commands',
    icon: 'IconProfile',
    name: 'Commands',
    routes: [RouteName.WorkspacePage, RouteName.NotePage],
  },
]);

export const useBottomNavigationItems = () => items;
