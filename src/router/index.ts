import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

/* ===========================================================
   CRIAÇÃO DO ROTEADOR

   O histórico respeita o modo definido em quasar.config.ts e
   mantém compatibilidade com uma eventual execução no servidor.
=========================================================== */

export default defineRouter(function () {
  /* Links publicados antes da migração usavam `/#/rota`. O
     fragmento é convertido uma única vez no endereço real antes
     que o Vue Router leia a página, preservando códigos privados
     e favoritos antigos sem manter dois modos de roteamento. */
  if (
    !process.env.SERVER &&
    process.env.VUE_ROUTER_MODE === 'history' &&
    window.location.hash.startsWith('#/')
  ) {
    const legacyRoute = window.location.hash.slice(1);
    const migratedUrl = new URL(legacyRoute, window.location.origin);

    window.history.replaceState(
      window.history.state,
      '',
      `${migratedUrl.pathname}${migratedUrl.search}`,
    );
  }

  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) return savedPosition;
      if (to.hash) return { el: to.hash, top: 74, behavior: 'smooth' };
      if (to.path === from.path) return false;
      return { left: 0, top: 0 };
    },
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  return Router;
});
