/* ===========================================================
   FONTE DOS EVENTOS ASTRONÔMICOS
=========================================================== */

const astronomySource = Object.freeze({
  title: 'Astronomy Engine — Equinócios e Solstícios',

  url: 'https://github.com/cosinekitty/astronomy',
});

/* ===========================================================
   EVENTOS QUE DEFINEM AS ESTAÇÕES

   O instante astronômico é o mesmo no planeta inteiro.
   O hemisfério determina qual estação começa naquele instante.
=========================================================== */

const seasonEvents = Object.freeze([
  {
    id: 'MARCH_EQUINOX',
    event: 'mar_equinox',

    north: {
      nameId: 'springBegins',
      emoji: '🍀',
    },

    south: {
      nameId: 'autumnBegins',
      emoji: '🍁',
    },
  },

  {
    id: 'JUNE_SOLSTICE',
    event: 'jun_solstice',

    north: {
      nameId: 'summerBegins',
      emoji: '☀️',
    },

    south: {
      nameId: 'winterBegins',
      emoji: '❄️',
    },
  },

  {
    id: 'SEPTEMBER_EQUINOX',
    event: 'sep_equinox',

    north: {
      nameId: 'autumnBegins',
      emoji: '🍁',
    },

    south: {
      nameId: 'springBegins',
      emoji: '🍀',
    },
  },

  {
    id: 'DECEMBER_SOLSTICE',
    event: 'dec_solstice',

    north: {
      nameId: 'winterBegins',
      emoji: '❄️',
    },

    south: {
      nameId: 'summerBegins',
      emoji: '☀️',
    },
  },
]);

/* ===========================================================
   CRIAÇÃO DAS ESTAÇÕES PARA O PAÍS SELECIONADO
=========================================================== */

export function createSeasonDefinitions(countryConfig) {
  const { code: countryCode, hemisphere } = countryConfig;

  if (hemisphere !== 'north' && hemisphere !== 'south') {
    throw new Error(`Hemisfério inválido para ${countryCode}: ${hemisphere}`);
  }

  return seasonEvents.map((event) => {
    const season = event[hemisphere];

    return {
      id: `${countryCode}_${event.id}`,

      country: countryCode,

      nameCatalog: 'SEASONS',

      nameId: season.nameId,

      emoji: season.emoji,

      type: 'astronomical',

      scope: 'global',

      hemisphere,

      rule: {
        kind: 'seasonEvent',
        event: event.event,
      },

      source: astronomySource,
    };
  });
}
