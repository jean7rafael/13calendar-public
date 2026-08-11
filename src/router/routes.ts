import type { RouteRecordRaw } from 'vue-router';

/* ===========================================================
   ROTAS DO APLICATIVO
=========================================================== */

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  /* Rota final para endereços inexistentes. */
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
