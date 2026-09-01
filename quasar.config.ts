import { defineConfig } from '#q-app/wrappers';

/* Cada publicação recebe a revisão do próprio commit. O identificador muda a
   URL do service worker sem depender de limpezas manuais no navegador. */
const appReleaseId =
  process.env.GITHUB_SHA?.slice(0, 12) ||
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 12) ||
  process.env.APP_RELEASE_ID ||
  'local';

export default defineConfig(() => ({
  /* =========================================================
     INICIALIZAÇÃO E ESTILOS GLOBAIS
  ========================================================= */

  boot: ['theme', 'i18n', 'buttonLayout', 'pwa', 'cloudflareAnalytics'],

  css: ['app.scss'],

  /* =========================================================
     FONTES E ÍCONES UTILIZADOS PELA INTERFACE
  ========================================================= */

  extras: ['roboto-font', 'material-icons'],

  /* =========================================================
     COMPILAÇÃO DO APLICATIVO SPA
  ========================================================= */

  build: {
    publicPath: process.env.PUBLIC_PATH || '/',
    env: {
      APP_RELEASE_ID: appReleaseId,
    },

    /* O catálogo internacional forma um chunk assíncrono conhecido. O limite
       evita o aviso genérico do Vite; o orçamento real continua sendo validado
       por scripts/auditProductionBundle.mjs em todo npm run verify. */
    extendViteConf(viteConf) {
      viteConf.build ??= {};
      viteConf.build.chunkSizeWarningLimit = 1800;
    },

    target: {
      browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
      node: 'node20',
    },

    typescript: {
      strict: true,
      vueShim: true,
    },

    vueRouterMode: 'history',
  },

  /* =========================================================
     SERVIDOR LOCAL DE DESENVOLVIMENTO
  ========================================================= */

  devServer: {
    open: false,
  },

  /* =========================================================
     CONFIGURAÇÃO PADRÃO DO QUASAR
  ========================================================= */

  framework: {
    config: {},
    lang: 'pt-BR',
    plugins: [],
  },

  animations: [],
}));
