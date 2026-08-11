/* ===========================================================
   TAMANHO PADRÃO DA JANELA DE ANOS

   O ano selecionado fica acompanhado por dois anos anteriores
   e dois posteriores. As regras completas permanecem na base;
   somente as ocorrências desta janela são calculadas.
=========================================================== */

export const DEFAULT_YEAR_WINDOW_RADIUS = 2;

/* ===========================================================
   CRIAÇÃO DA JANELA MÓVEL
=========================================================== */

export function createYearWindow(activeYear, radius = DEFAULT_YEAR_WINDOW_RADIUS) {
  const numericYear = Number(activeYear);
  const numericRadius = Number(radius);

  if (!Number.isInteger(numericYear) || !Number.isInteger(numericRadius) || numericRadius < 0) {
    return [];
  }

  const numberOfYears = numericRadius * 2 + 1;
  const firstYear = Math.max(1, numericYear - numericRadius);

  return Array.from({ length: numberOfYears }, (_, index) => firstYear + index);
}
