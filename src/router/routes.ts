import type { RouteRecordRaw } from 'vue-router';

/* ===========================================================
   ROTAS DO APLICATIVO
=========================================================== */

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'community',
        name: 'community',
        component: () => import('pages/CommunityPage.vue'),
      },
      {
        path: 'community-admin',
        name: 'community-admin',
        component: () => import('pages/CommunityAdminPage.vue'),
      },
    ],
  },

  /* Rota final para endereços inexistentes. */
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
