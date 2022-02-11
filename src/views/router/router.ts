import { createWebHashHistory, createRouter } from 'vue-router';
import routes from '@/views/router/routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router;
