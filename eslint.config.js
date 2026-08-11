import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import pluginQuasar from '@quasar/app-vite/eslint';
import prettierSkipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import tseslint from 'typescript-eslint';

/* ===========================================================
   REGRAS BASE DO JAVASCRIPT, TYPESCRIPT, VUE E QUASAR
=========================================================== */

export default [
  ...pluginQuasar.configs.recommended(),
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  /* Regras específicas dos arquivos-fonte do aplicativo. */
  {
    files: ['**/*.{js,cjs,mjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
      },
    },
    rules: {
      'prefer-promise-reject-errors': 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'vue/block-lang': [
        'error',
        {
          script: {
            lang: ['ts'],
            allowNoLang: true,
          },

          template: {
            allowNoLang: true,
          },

          style: {
            allowNoLang: true,
          },
        },
      ],
    },
  },

  /* Evita conflito entre as regras do ESLint e o Prettier. */
  prettierSkipFormatting,
];
