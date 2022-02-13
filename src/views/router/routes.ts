import AppLayout from '@/views/layout/AppLayout.vue';
import { AppRoute } from '@/views/router/router';

const routes = [
  {
    name: 'AppLayout',
    path: '',
    component: AppLayout,
    children: [
      {
        name: AppRoute.HomePage,
        path: '/',
        component: () => import(/* webpackChunkName: "[HomePage]" */ '@/views/pages/HomePage.vue')
      },
      {
        name: AppRoute.CodePage,
        path: '/:id',
        component: () => import(/* webpackChunkName: "[CodePage]" */ '@/views/pages/CodePage.vue')
      }
    ]
  },
];

export default routes;
