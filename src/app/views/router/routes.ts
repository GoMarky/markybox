import AppLayout from '@/app/views/layout/AppLayout.vue';
import { RouteName } from '@/app/code/vue/route-names';

const routes = [
  {
    name: 'AppLayout',
    path: '/',
    component: AppLayout,
    children: [
      {
        name: RouteName.HomePage,
        path: '/',
        component: () => import(/* webpackChunkName: "[HomePage]" */ '@/app/views/pages/HomePage.vue'),
      },
      {
        name: RouteName.LoginPage,
        path: '/login/',
        component: () => import(/* webpackChunkName: "[LoginPage]" */ '@/app/views/pages/LoginPage.vue')
      },
      {
        name: RouteName.RegistrationPage,
        path: '/registration/',
        component: () => import(/* webpackChunkName: "[RegistrationPage]" */ '@/app/views/pages/RegistrationPage.vue')
      },
      {
        name: RouteName.NotePage,
        path: '/notes/:id/',
        component: () => import(/* webpackChunkName: "[NotePage]" */ '@/app/views/pages/NotePage/NotePage.vue')
      },
      {
        name: RouteName.WorkspacePage,
        path: '/workspaces/:workspaceId/',
        component: () => import(/* webpackChunkName: "[WorkspacePage]" */ '@/app/views/pages/WorkspacePage/WorkspacePage.vue'),
      },
    ]
  },
];

export default routes;
