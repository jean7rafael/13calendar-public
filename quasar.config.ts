import { defineConfig } from '#q-app/wrappers';

export default defineConfig(() => ({
  /* =========================================================
     INICIALIZAÇÃO E ESTILOS GLOBAIS
  ========================================================= */

  boot: ['theme', 'i18n'],

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
    target: {
      browser: ['es2022', 'firefox115', 'chrome115', 'safari14'],
      node: 'node20',
    },

    typescript: {
      strict: true,
      vueShim: true,
    },

    vueRouterMode: 'hash',
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
