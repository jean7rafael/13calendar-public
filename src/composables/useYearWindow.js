import { computed, unref } from 'vue';

import { DEFAULT_YEAR_WINDOW_RADIUS, createYearWindow } from 'src/utils/yearWindow';

/* ===========================================================
   JANELA DINÂMICA DE ANOS

   Mantém renderizado apenas um pequeno conjunto de anos ao
   redor do ano ativo. Isso evita intervalos fixos como
   1900–2100 e reduz a quantidade de slides na página.
=========================================================== */

export function useYearWindow(activeYear, radius = DEFAULT_YEAR_WINDOW_RADIUS) {
  const yearsRange = computed(() => createYearWindow(unref(activeYear), radius));

  return {
    yearsRange,
  };
}
