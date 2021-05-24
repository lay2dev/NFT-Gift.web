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
      path: '/login',
      name: 'login',
      component: () => import('./pages/login/index.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('./pages/404.vue'),
    },
  ],
})

export default router
