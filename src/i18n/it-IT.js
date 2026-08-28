/* ===========================================================
   NOMES DOS MESES UTILIZADOS NESTE IDIOMA
=========================================================== */

const months12Long = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
];

const months12Short = [
  'GEN',
  'FEB',
  'MAR',
  'APR',
  'MAG',
  'GIU',
  'LUG',
  'AGO',
  'SET',
  'OTT',
  'NOV',
  'DIC',
];

/* ===========================================================
   CATÁLOGO DE TEXTOS DA INTERFACE
=========================================================== */

export default {
  app: {
    title: 'Conversione delle date: calendario gregoriano – calendario fisso internazionale',
    browserTitle: '13 Calendar — Convertitore di date',
  },

  introduction: {
    eyebrow: 'Conversione delle date',
    title: 'Una stessa data, due calendari',
    description:
      'Confronta il calendario gregoriano e il calendario fisso internazionale con festività per Paese, fasi lunari e date corrispondenti.',
  },

  footer: {
    ariaLabel: 'Piè di pagina informativo',
    title: 'Le date meritano un contesto',
    description: 'Confronta i calendari con fonti trasparenti e limiti dichiarati chiaramente.',
    sourcesTitle: 'Fonti',
    sourcesText:
      'I dati festivi combinano date-holidays con fonti ufficiali verificate. Le fasi lunari e le conversioni delle date sono calcolate localmente.',
    privacyTitle: 'Privacy',
    privacyText:
      'Non è richiesto alcun account. Le preferenze di lingua, tema e paese restano in questo browser.',
    limitationsTitle: 'Limiti dei dati',
    limitationsText:
      "La copertura delle festività governative varia in base al paese e all'anno. L'app segnala gli anni senza date ufficiali confermate.",
    disclaimer:
      'Complemento indipendente per il Calendario fisso internazionale. Non affiliato a 13months.net o ad alcun organismo di normazione.',
    linksLabel: 'Link del piè di pagina',
    dataSourcesLink: 'Fonti dei dati',
    wikipediaLink: 'Wikipedia',
    sourceCodeLink: 'Codice sorgente',
  },

  navigation: {
    menu: 'Menu',
    closeMenu: 'Chiudi menu',
    backToHome: 'Torna alla pagina iniziale',
  },

  language: {
    title: "Lingua dell'interfaccia",
  },

  theme: {
    useLight: 'Usa la modalità chiara',
    useDark: 'Usa la modalità scura',
  },

  holidaySettings: {
    countryTitle: 'Giorni festivi per paese',
    chooseCountry: 'Scegli il paese dei giorni festivi',
    countryHint: "La lingua dell'interfaccia e il paese dei giorni festivi possono essere diversi.",
    observedDateFor: 'Data osservata per {holiday}',
    coverage: {
      title: 'Copertura delle festività ufficiali',
      limitedYears: 'Le date ufficiali di questo paese sono confermate solo per {years}.',
      missingOfficialYear:
        'Non ci sono festività governative confermate per {year}. Anni pubblicati: {years}.',
      noCivilCalendar:
        'Non ci sono festività governative confermate per {year}.',
      futureYear:
        'Le festività governative del {year} usano le regole attuali e possono cambiare dopo nuove pubblicazioni ufficiali.',
      historicalYear:
        'Le festività governative del {year} sono state ricostruite con le regole disponibili; la fonte ufficiale di quell\'anno non è archiviata.',
      otherDatesRemain:
        'Gli eventi astronomici, le date religiose calcolabili e le ricorrenze restano disponibili.',
      openSource: 'Apri la fonte ufficiale',
      close: 'Chiudi avviso',
    },
    regionFilter: 'Regione',
    continents: {
      americas: 'Americhe',
      europe: 'Europa',
      africa: 'Africa',
      asia: 'Asia',
      oceania: 'Oceania',
      antarctica: 'Antartide',
    },
    regions: {
      all: 'Tutte le Regioni',
      americasNorth: 'America del Nord',
      americasCentral: 'America Centrale',
      americasCaribbean: 'Caraibi',
      americasSouth: 'America del Sud',
      africaNorth: 'Africa Settentrionale',
      africaWest: 'Africa Occidentale',
      africaCentral: 'Africa Centrale',
      africaEast: 'Africa Orientale',
      africaSouthern: 'Africa Australe',
      europeNorth: 'Europa Nordica',
      europeWest: 'Europa Occidentale',
      europeSouth: 'Europa Meridionale',
      europeEast: "Europa dell'Est",
      asiaWest: 'Medio Oriente',
      asiaCentral: 'Asia Centrale',
      asiaSouth: 'Asia Meridionale',
      asiaEast: 'Asia Orientale',
      asiaSoutheast: 'Sud-Est Asiatico',
      oceania: 'Oceania',
      antarctica: 'Antartide',
    },
    cancel: 'Annulla',
    calendar13Mode: {
      title: 'Date nel calendario di 13 mesi',
      native: 'Date adattate',
      nativeCaption: 'Riapplica date fisse e regole settimanali nel calendario di 13 mesi.',
      corresponding: 'Date corrispondenti',
      correspondingCaption: 'Mantiene lo stesso giorno fisico del calendario gregoriano.',
    },
    filters: {
      open: 'Apri filtri',
      title: "Mostra nell'elenco",
      public: 'Giorni festivi ufficiali',
      substitute: 'Giorni sostitutivi',
      optional: 'Date facoltative',
      observance: 'Ricorrenze',
      bank: 'Festività bancarie',
      school: 'Date scolastiche',
      commercial: 'Date commerciali',
      astronomical: 'Eventi astronomici',
      enableAll: 'Attiva tutti',
    },
  },

  calendar: {
    selectedDate: 'Data selezionata',
    noDate: 'Nessuna data selezionata',
    gregorian: 'Gregoriano',
    today: 'Oggi',
    goToToday: 'Vai alla data di oggi',
    gregorianTitle: 'Il Tuo Calendario',
    fixedCalendarTitle: 'Calendario Fisso Internazionale',
    calendar13Short: '13 mesi',
    mobileComparisonHint:
      'Ruota lo schermo o usa un display più grande per confrontare i due calendari affiancati.',
    daysThisMonth: '{count} giorni questo mese',
    daysEveryMonth: '{count} giorni ogni mese',

    weekDaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'Solaris',
      ...months12Long.slice(6),
      'Giorni speciali',
    ],

    months13Short: [...months12Short.slice(0, 6), 'SOL', ...months12Short.slice(6), 'GS'],

    specialDays: {
      title: 'Giorni speciali',
      yearDay: "Giorno dell'anno",
      yearDayTiming: 'Ogni anno · dopo il 28 dicembre',
      yearDayDescription:
        "Una festività mondiale fuori da qualsiasi settimana o mese. Il 365º giorno, che collega un anno al successivo.",
      leapDay: 'Giorno bisestile',
      leapYearTiming: "{year} è bisestile · dopo il Giorno dell'anno",
      commonYearTiming: '{year} non è bisestile',
      leapDayDescription:
        "Un giorno intercalare aggiuntivo inserito ogni 4 anni subito dopo il Giorno dell'anno. Anche fuori dal ciclo settimanale.",
      regularDays: 'Giorni regolari',
      total: 'Totale',
      totalDays: '{count} giorni',
    },
  },

  panels: {
    holidays: 'Giorni festivi',
    moonPhases: 'Fasi lunari',
    noHolidays: 'Nessun giorno festivo questo mese!',
    noMoonPhases: 'Nessuna fase lunare questo mese!',
    loadError: 'Errore durante il caricamento',
  },

  moonPhases: {
    new: 'Luna Nuova',
    waxing: 'Primo Quarto',
    full: 'Luna Piena',
    waning: 'Ultimo Quarto',
    filters: {
      open: 'Apri i filtri delle fasi lunari',
      title: 'Mostra nel riquadro',
      showTime: "Mostra l'orario delle fasi",
      timeCaption: 'Ora locale del dispositivo',
    },
  },
};
