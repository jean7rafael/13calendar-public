/* ===========================================================
   POLÍTICA DE OCORRÊNCIA DOS FERIADOS

   Algumas fontes publicam, ao mesmo tempo:
   - a data civil ou comemorativa do feriado;
   - o dia útil usado apenas para folga, folha ou expediente.

   A política padrão continua respeitando a transferência legal
   praticada pelo país. As exceções abaixo preservam a data civil
   e identificam separadamente a folga observada.
=========================================================== */

/* O padrão global preserva as duas informações. A lista existe
   para uma futura exceção sustentada por fonte oficial que declare
   expressamente que a data original deixa de existir. */
const MOVE_ONLY_COUNTRIES = new Set([]);

export function shouldKeepObservedHolidayAlongsideNominal({ country }) {
  const countryCode = String(country || '')
    .trim()
    .toUpperCase();

  return !MOVE_ONLY_COUNTRIES.has(countryCode);
}
