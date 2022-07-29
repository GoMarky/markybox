import { createWebHashHistory, createRouter, createWebHistory } from 'vue-router';
import routes from '@/app/views/router/routes';
import { isDev } from '@/base/platform';

const router = createRouter({
  history: isDev ? createWebHashHistory('/') : createWebHistory(''),
  routes: routes as any,
})

export default router;
