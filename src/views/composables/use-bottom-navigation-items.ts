import { AppRoute } from '@/views/router/router';
import { ref } from 'vue';

export interface IBottomNavItem {
  id: string;
  icon: string;
  name: string;
  routes: string[];
}

const homePageItem: IBottomNavItem = {
  id: 'home',
  icon: 'IconNavTop',
  name: 'Home',
  routes: ['HomePage'],
};

const items = ref<IBottomNavItem[]>([homePageItem])

export const useBottomNavigationItems = () => items;
