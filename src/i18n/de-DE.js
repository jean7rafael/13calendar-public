/* ===========================================================
   NOMES DOS MESES UTILIZADOS NESTE IDIOMA
=========================================================== */

const months12Long = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember',
];

const months12Short = [
  'JAN',
  'FEB',
  'MÄR',
  'APR',
  'MAI',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OKT',
  'NOV',
  'DEZ',
];

/* ===========================================================
   CATÁLOGO DE TEXTOS DA INTERFACE
=========================================================== */

export default {
  app: {
    title: 'Datumsumrechnung: Gregorianischer Kalender – Internationaler Fixkalender',
    browserTitle: '13 Calendar — Datumskonverter',
  },

  introduction: {
    eyebrow: 'Datumsumrechnung',
    title: 'Ein Datum, zwei Kalender',
    description:
      'Vergleichen Sie den gregorianischen Kalender und den Internationalen Fixkalender mit Feiertagen nach Land, Mondphasen und entsprechenden Daten.',
  },

  footer: {
    ariaLabel: 'Informationsfußzeile',
    title: 'Daten brauchen Kontext',
    description: 'Vergleichen Sie Kalender mit transparenten Quellen und klar benannten Einschränkungen.',
    sourcesTitle: 'Quellen',
    sourcesText:
      'Die Feiertagsdaten verbinden date-holidays mit geprüften amtlichen Quellen. Mondphasen und Datumsumrechnungen werden lokal berechnet.',
    privacyTitle: 'Datenschutz',
    privacyText:
      'Es ist kein Konto erforderlich. Ihre Sprach-, Design- und Ländereinstellungen bleiben in diesem Browser.',
    limitationsTitle: 'Dateneinschränkungen',
    limitationsText:
      'Die Abdeckung staatlicher Feiertage unterscheidet sich je nach Land und Jahr. Die App kennzeichnet Jahre ohne bestätigte amtliche Daten.',
    disclaimer:
      'Unabhängige Ergänzung zum Internationalen Fixkalender. Keine Verbindung zu 13months.net oder einer Normungsorganisation.',
    linksLabel: 'Links in der Fußzeile',
    dataSourcesLink: 'Datenquellen',
    wikipediaLink: 'Wikipedia',
    sourceCodeLink: 'Quellcode',
  },

  navigation: {
    menu: 'Menü',
    closeMenu: 'Menü schließen',
    backToHome: 'Zurück zur Startseite',
  },

  language: {
    title: 'Sprache der Benutzeroberfläche',
  },

  theme: {
    useLight: 'Hellen Modus verwenden',
    useDark: 'Dunklen Modus verwenden',
  },

  holidaySettings: {
    countryTitle: 'Feiertage nach Land',
    chooseCountry: 'Land für die Feiertage auswählen',
    countryHint:
      'Die Sprache der Benutzeroberfläche und das Feiertagsland können unterschiedlich sein.',
    observedDateFor: 'Beobachtungstag für {holiday}',
    coverage: {
      title: 'Abdeckung amtlicher Feiertage',
      limitedYears: 'Amtliche Daten für dieses Land sind nur für {years} bestätigt.',
      missingOfficialYear:
        'Für {year} sind keine staatlichen Feiertage bestätigt. Veröffentlichte Jahre: {years}.',
      noCivilCalendar:
        'Für {year} sind keine staatlichen Feiertage bestätigt.',
      futureYear:
        'Die staatlichen Feiertage für {year} verwenden die aktuellen Regeln und können sich nach neuen amtlichen Veröffentlichungen ändern.',
      historicalYear:
        'Die staatlichen Feiertage für {year} wurden aus verfügbaren Regeln rekonstruiert; die amtliche Quelle dieses Jahres ist nicht archiviert.',
      otherDatesRemain:
        'Astronomische Ereignisse, berechenbare religiöse Daten und Gedenktage bleiben verfügbar.',
      openSource: 'Amtliche Quelle öffnen',
      close: 'Hinweis schließen',
    },
    regionFilter: 'Region',
    continents: {
      americas: 'Amerika',
      europe: 'Europa',
      africa: 'Afrika',
      asia: 'Asien',
      oceania: 'Ozeanien',
      antarctica: 'Antarktis',
    },
    regions: {
      all: 'Alle Regionen',
      americasNorth: 'Nordamerika',
      americasCentral: 'Mittelamerika',
      americasCaribbean: 'Karibik',
      americasSouth: 'Südamerika',
      africaNorth: 'Nordafrika',
      africaWest: 'Westafrika',
      africaCentral: 'Zentralafrika',
      africaEast: 'Ostafrika',
      africaSouthern: 'Südliches Afrika',
      europeNorth: 'Nordische Länder',
      europeWest: 'Westeuropa',
      europeSouth: 'Südeuropa',
      europeEast: 'Osteuropa',
      asiaWest: 'Naher Osten',
      asiaCentral: 'Zentralasien',
      asiaSouth: 'Südasien',
      asiaEast: 'Ostasien',
      asiaSoutheast: 'Südostasien',
      oceania: 'Ozeanien',
      antarctica: 'Antarktis',
    },
    cancel: 'Abbrechen',
    calendar13Mode: {
      title: 'Daten im 13-Monats-Kalender',
      native: 'Angepasste Daten',
      nativeCaption: 'Wendet feste Daten und Wochentagsregeln im 13-Monats-Kalender neu an.',
      corresponding: 'Entsprechende Daten',
      correspondingCaption: 'Behält denselben physischen Tag wie im gregorianischen Kalender bei.',
    },
    filters: {
      open: 'Filter öffnen',
      title: 'In der Liste anzeigen',
      public: 'Gesetzliche Feiertage',
      substitute: 'Ersatzfeiertage',
      optional: 'Optionale Feiertage',
      observance: 'Gedenk- und Aktionstage',
      bank: 'Bankfeiertage',
      school: 'Schultermine',
      commercial: 'Kommerzielle Anlässe',
      astronomical: 'Astronomische Ereignisse',
      enableAll: 'Alle aktivieren',
    },
  },

  calendar: {
    selectedDate: 'Ausgewähltes Datum',
    noDate: 'Kein Datum ausgewählt',
    gregorian: 'Gregorianisch',
    today: 'Heute',
    goToToday: 'Zum heutigen Datum wechseln',
    gregorianTitle: 'Ihr Kalender',
    fixedCalendarTitle: 'Internationaler Fixkalender',
    calendar13Short: '13 Monate',
    mobileComparisonHint:
      'Drehen Sie den Bildschirm oder verwenden Sie ein größeres Display, um beide Kalender nebeneinander zu vergleichen.',
    daysThisMonth: '{count} Tage in diesem Monat',
    daysEveryMonth: '{count} Tage in jedem Monat',

    weekDaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'Solaris',
      ...months12Long.slice(6),
      'Besondere Tage',
    ],

    months13Short: [...months12Short.slice(0, 6), 'SOL', ...months12Short.slice(6), 'BT'],

    specialDays: {
      title: 'Besondere Tage',
      yearDay: 'Tag des Jahres',
      yearDayTiming: 'Jedes Jahr · nach dem 28. Dezember',
      yearDayDescription:
        'Ein weltweiter Feiertag außerhalb jeder Woche und jedes Monats. Der 365. Tag verbindet ein Jahr mit dem nächsten.',
      leapDay: 'Schalttag',
      leapYearTiming: '{year} ist ein Schaltjahr · nach dem Tag des Jahres',
      commonYearTiming: '{year} ist kein Schaltjahr',
      leapDayDescription:
        'Ein zusätzlicher Schalttag, der alle 4 Jahre direkt nach dem Tag des Jahres eingefügt wird. Ebenfalls außerhalb des Wochenzyklus.',
      regularDays: 'Reguläre Tage',
      total: 'Gesamt',
      totalDays: '{count} Tage',
    },
  },

  panels: {
    holidays: 'Feiertage',
    moonPhases: 'Mondphasen',
    noHolidays: 'Keine Feiertage in diesem Monat!',
    noMoonPhases: 'Keine Mondphasen in diesem Monat!',
    loadError: 'Fehler beim Laden',
  },

  moonPhases: {
    new: 'Neumond',
    waxing: 'Erstes Viertel',
    full: 'Vollmond',
    waning: 'Letztes Viertel',
    filters: {
      open: 'Mondphasenfilter öffnen',
      title: 'In der Karte anzeigen',
      showTime: 'Uhrzeit der Mondphasen anzeigen',
      timeCaption: 'Ortszeit des Geräts',
    },
  },
};
