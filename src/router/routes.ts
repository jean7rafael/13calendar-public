import type { RouteRecordRaw } from 'vue-router';

/* ===========================================================
   ROTAS DO APLICATIVO
=========================================================== */

const routes: RouteRecordRaw[] = [
  {
    path: '/widget',
    name: 'widget',
    component: () => import('pages/WidgetPage.vue'),
  },
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
      {
        path: 'community-remove',
        name: 'community-remove',
        component: () => import('pages/CommunityRemovalPage.vue'),
      },
      {
        path: 'privacy',
        name: 'privacy',
        component: () => import('pages/PrivacyPage.vue'),
      },
      {
        path: 'learn',
        name: 'education',
        component: () => import('pages/EducationPage.vue'),
      },
      {
        path: 'tools',
        name: 'tools',
        component: () => import('pages/ToolsPage.vue'),
      },
      {
        path: 'moon',
        name: 'moon',
        component: () => import('pages/MoonPage.vue'),
      },
      {
        path: 'news',
        name: 'news',
        component: () => import('pages/NewsPage.vue'),
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
