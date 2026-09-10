/* Instante compartilhado pelos bundles de servidor e cliente para hidratação. */
declare const __APP_BUILD_TIMESTAMP__: string;

/* Tipos das variáveis fornecidas pelo Quasar ao aplicativo. */
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;
    VUE_ROUTER_BASE: string | undefined;
  }
}
