/* ===========================================================
   CORREÇÕES MANUAIS DAS TRADUÇÕES AUTOMÁTICAS

   Este arquivo deve conter somente traduções que precisem
   substituir o resultado produzido pelo tradutor automático.

   Estrutura:
   PAÍS → IDIOMA → IDENTIFICADOR DO FERIADO
=========================================================== */

export const holidayTranslationOverrides = Object.freeze({
  /*
    RU: Object.freeze({
      pt: Object.freeze({
        victoryDay:
          'Dia da Vitória'
      })
    })
    */
});

/* ===========================================================
   TRADUÇÕES COMPARTILHADAS PELO TEXTO-FONTE

   Use este registro quando o mesmo feriado da base
   internacional aparecer em muitos países. O contexto longo
   continua disponível ao tradutor, mas o cartão recebe apenas
   o nome curto e consistente definido para cada idioma.
=========================================================== */

export const holidaySourceTranslationOverrides = Object.freeze({
  'Thanksgiving Day': Object.freeze({
    pt: 'Dia de Ação de Graças',
  }),
  'Boxing Day — Holiday celebrated on the day after Christmas': Object.freeze({
    de: 'Boxing Day',
    en: 'Boxing Day',
    es: 'Boxing Day',
    fr: 'Boxing Day',
    it: 'Boxing Day',
    pt: 'Boxing Day',
    ru: 'День подарков (Boxing Day)',
  }),
  'Second Day of Christmas': Object.freeze({
    de: 'Zweiter Weihnachtsfeiertag',
    en: 'Second Day of Christmas',
    es: 'Segundo día de Navidad',
    fr: 'Deuxième jour de Noël',
    it: 'Secondo giorno di Natale',
    pt: 'Segundo dia de Natal',
    ru: 'Второй день Рождества',
  }),
  "Saint Stephen's Day": Object.freeze({
    de: 'Stephanstag',
    en: "Saint Stephen's Day",
    es: 'Día de San Esteban',
    fr: 'Saint-Étienne',
    it: 'Santo Stefano',
    pt: 'Dia de Santo Estêvão',
    ru: 'День святого Стефана',
  }),
  'Second Day of Orthodox Christmas': Object.freeze({
    de: 'Zweiter Tag des orthodoxen Weihnachtsfestes',
    en: 'Second Day of Orthodox Christmas',
    es: 'Segundo día de la Navidad ortodoxa',
    fr: 'Deuxième jour de Noël orthodoxe',
    it: 'Secondo giorno del Natale ortodosso',
    pt: 'Segundo dia do Natal Ortodoxo',
    ru: 'Второй день православного Рождества',
  }),
});
