import { defineConfig } from '@quasar/app-vite';
import { fileURLToPath } from 'node:url';

/* Cada publicação recebe a revisão do próprio commit. O identificador muda a
   URL do service worker sem depender de limpezas manuais no navegador. */
const appReleaseId =
  process.env.GITHUB_SHA?.slice(0, 12) ||
  process.env.CF_PAGES_COMMIT_SHA?.slice(0, 12) ||
  process.env.APP_RELEASE_ID ||
  'local';

/* O mesmo instante inicial é compilado no HTML e no cliente para que o card
   dinâmico da página educacional hidrate sem divergência. Depois da montagem,
   ele passa imediatamente a usar o relógio local do visitante. */
const appBuildTimestamp = process.env.APP_BUILD_TIMESTAMP || new Date().toISOString();

export default defineConfig((ctx) => ({
  /* =========================================================
     INICIALIZAÇÃO E ESTILOS GLOBAIS
  ========================================================= */

  boot: [
    'theme',
    'i18n',
    { path: 'buttonLayout', server: false },
    { path: 'pwa', server: false },
    { path: 'cloudflareAnalytics', server: false },
  ],

  css: ['app.scss'],

  /* =========================================================
     FONTES E ÍCONES UTILIZADOS PELA INTERFACE
  ========================================================= */

  extras: ['roboto-font', 'material-icons'],

  /* =========================================================
     COMPILAÇÃO DO APLICATIVO SPA
  ========================================================= */

  build: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
    },
    publicPath: process.env.PUBLIC_PATH || '/',
    env: {
      /* O @quasar/app-vite v3 expõe ao navegador somente QCLI_ por padrão e
         não carrega arquivos específicos do modo automaticamente. As três
         integrações VITE_ abaixo são valores públicos deliberados; o arquivo
         de produção precisa entrar no build para que API, Turnstile e Web
         Analytics não desapareçam do pacote publicado. */
      clientPrefix: ['QCLI_', 'VITE_'],
      file: ctx.prod ? ['.env.production'] : [],
    },
    defineEnv: {
      APP_RELEASE_ID: appReleaseId,
    },

    /* O catálogo internacional forma um chunk assíncrono conhecido. O limite
       evita o aviso genérico do Vite; o orçamento real continua sendo validado
       por scripts/auditProductionBundle.mjs em todo npm run verify. */
    extendViteConf(viteConf) {
      viteConf.build ??= {};
      viteConf.build.chunkSizeWarningLimit = 1800;
      viteConf.define ??= {};
      viteConf.define.__APP_BUILD_TIMESTAMP__ = JSON.stringify(appBuildTimestamp);
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
     GERAÇÃO ESTÁTICA E HIDRATAÇÃO

     O host entrega as sete páginas indexáveis já renderizadas. O
     404 é desabilitado para que o fallback history do Cloudflare
     Pages continue atendendo widget e rotas privadas no cliente.
  ========================================================= */

  ssg: {
    error404HtmlFilename: false,
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
    plugins: ['Meta'],
  },

  animations: [],
}));
