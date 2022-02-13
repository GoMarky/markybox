import { createWebHashHistory, createRouter } from 'vue-router';
import routes from '@/views/router/routes';

export enum AppRoute {
  CodePage = 'CodePage',
  HomePage = 'HomePage',
}

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
