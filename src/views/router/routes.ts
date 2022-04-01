import AppLayout from '@/views/layout/AppLayout.vue';
import { RouteName } from '@/code/vue/common/route-names';

const routes = [
  {
    name: 'AppLayout',
    path: '/',
    component: AppLayout,
    children: [
      {
        name: RouteName.HomePage,
        path: '/',
        component: () => import(/* webpackChunkName: "[HomePage]" */ '@/views/pages/HomePage.vue'),
      },
      {
        name: RouteName.CodePage,
        path: '/:id',
        component: () => import(/* webpackChunkName: "[CodePage]" */ '@/views/pages/CodePage.vue')
      }
    ]
  },
];

export default routes;
