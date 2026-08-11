/* ===========================================================
   EXTENSÕES LOCAIS DA BASE INTERNACIONAL

   Este registro é a porta de entrada para uma lei nova, uma
   correção histórica ou um mecanismo ainda não publicado em
   date-holidays. Ele permanece vazio enquanto a fonte atende
   integralmente aos países cadastrados.

   Cada extensão pode fornecer:
   - exclude: regras que devem ser retiradas em certos anos;
   - createHolidays: função que calcula novas ocorrências;
   - translationRecords: nomes-fonte das regras acrescentadas.
=========================================================== */

const holidayCountryExtensions = Object.freeze({
  /* =========================================================
     REPÚBLICA DEMOCRÁTICA DO CONGO — 2016

     Em 2016, a homenagem de 16 de janeiro foi observada no
     dia 15. A fonte internacional trazia as duas linhas e um
     rótulo genérico; aqui elas se tornam uma única ocorrência.
  ========================================================= */

  CD: Object.freeze({
    exclude: Object.freeze([
      Object.freeze({
        rule: '01-16 and if sunday then next tuesday',
        validFrom: 2016,
        validTo: 2016,
      }),
      Object.freeze({
        rule: '2016-01-15',
        validFrom: 2016,
        validTo: 2016,
      }),
    ]),
    createHolidays: ({ year }) =>
      year === 2016
        ? [
            {
              date: '2016-01-15',
              name: 'Laurent Kabila Memorial Day',
              rule: 'extension CD Laurent Kabila Memorial Day observed 2016',
              type: 'public',
              substitute: false,
              movedFromDate: '2016-01-16',
              source: Object.freeze({
                title: 'Ordinance establishing public holidays in the DRC',
                url: 'http://www.ilo.org/dyn/natlex/docs/ELECTRONIC/101405/122159/F1802609849/COD-101405.pdf',
              }),
            },
          ]
        : [],
    translationRecords: Object.freeze([
      Object.freeze({
        rule: 'extension CD Laurent Kabila Memorial Day observed 2016',
        sourceName: 'Laurent Kabila Memorial Day',
      }),
    ]),
  }),
});

/* ===========================================================
   VALIDADE TEMPORAL DE UMA CORREÇÃO
=========================================================== */

function isActiveInYear(entry, year) {
  if (entry.validFrom && year < entry.validFrom) {
    return false;
  }

  if (entry.validTo && year > entry.validTo) {
    return false;
  }

  return true;
}

/* ===========================================================
   CORRESPONDÊNCIA DE UMA EXCLUSÃO
=========================================================== */

function matchesExclusion(holiday, exclusion, year) {
  if (!isActiveInYear(exclusion, year)) {
    return false;
  }

  return ['rule', 'name', 'date'].every(
    (field) => exclusion[field] === undefined || exclusion[field] === holiday[field],
  );
}

/* ===========================================================
   APLICAÇÃO DAS CORREÇÕES E DOS NOVOS MECANISMOS
=========================================================== */

export function applyHolidayCountryExtensions({ country, year, holidays }) {
  const countryCode = String(country || '')
    .trim()
    .toUpperCase();
  const extension = holidayCountryExtensions[countryCode];
  const sourceHolidays = Array.isArray(holidays) ? holidays : [];

  if (!extension) {
    return sourceHolidays;
  }

  const exclusions = extension.exclude || [];
  const retainedHolidays = sourceHolidays.filter(
    (holiday) => !exclusions.some((exclusion) => matchesExclusion(holiday, exclusion, year)),
  );
  const addedHolidays = extension.createHolidays?.({ year }) || [];

  return [...retainedHolidays, ...addedHolidays]
    .filter(Boolean)
    .sort((first, second) => String(first.date).localeCompare(String(second.date)));
}

/* ===========================================================
   NOMES DAS REGRAS ACRESCENTADAS

   O gerador de traduções consulta estes registros diretamente,
   sem simular uma faixa fixa de anos.
=========================================================== */

export function getHolidayCountryExtensionTranslationRecords(country) {
  const countryCode = String(country || '')
    .trim()
    .toUpperCase();

  return holidayCountryExtensions[countryCode]?.translationRecords || [];
}
