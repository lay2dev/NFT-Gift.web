import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('./pages/index/index.vue'),
    },
    {
      path: '/mine',
      name: 'mine',
      component: () => import('./pages/mine/index.vue'),
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('./pages/test/index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./pages/404.vue'),
    },
  ],
})

export default router
