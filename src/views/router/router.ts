import { createWebHashHistory, createRouter, createWebHistory } from 'vue-router';
import routes from '@/views/router/routes';
import { isDev } from '@/base/platform';

const router = createRouter({
  history: isDev ? createWebHashHistory('/') : createWebHistory(''),
  routes,
})

export default router;
