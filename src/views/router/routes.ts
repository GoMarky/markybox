import AppLayout from '@/views/layout/AppLayout.vue';
import { RouteName } from '@/code/vue/route-names';

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
        name: RouteName.LoginPage,
        path: '/login/',
        component: () => import(/* webpackChunkName: "[LoginPage]" */ '@/views/pages/LoginPage.vue')
      },
      {
        name: RouteName.RegistrationPage,
        path: '/registration/',
        component: () => import(/* webpackChunkName: "[RegistrationPage]" */ '@/views/pages/RegistrationPage.vue')
      },
      {
        name: RouteName.NotePage,
        path: '/notes/:id/',
        component: () => import(/* webpackChunkName: "[NotePage]" */ '@/views/pages/NotePage/NotePage.vue')
      },
      {
        name: RouteName.WorkspacePage,
        path: '/workspaces/:workspaceId/',
        component: () => import(/* webpackChunkName: "[WorkspacePage]" */ '@/views/pages/WorkspacePage/WorkspacePage.vue'),
      },
    ]
  },
];

export default routes;
