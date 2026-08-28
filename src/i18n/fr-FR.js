/* ===========================================================
   NOMES DOS MESES UTILIZADOS NESTE IDIOMA
=========================================================== */

const months12Long = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

const months12Short = [
  'JAN',
  'FÉV',
  'MAR',
  'AVR',
  'MAI',
  'JUIN',
  'JUIL',
  'AOÛ',
  'SEP',
  'OCT',
  'NOV',
  'DÉC',
];

/* ===========================================================
   CATÁLOGO DE TEXTOS DA INTERFACE
=========================================================== */

export default {
  app: {
    title: 'Conversion de dates : calendrier grégorien – calendrier fixe international',
    browserTitle: '13 Calendar — Convertisseur de dates',
  },

  introduction: {
    eyebrow: 'Conversion de dates',
    title: 'Une même date, deux calendriers',
    description:
      'Comparez le calendrier grégorien et le calendrier fixe international avec les jours fériés par pays, les phases de la Lune et les dates correspondantes.',
  },

  footer: {
    ariaLabel: 'Pied de page informatif',
    title: 'Les dates méritent leur contexte',
    description: 'Comparez les calendriers avec des sources transparentes et des limites clairement indiquées.',
    sourcesTitle: 'Sources',
    sourcesText:
      'Les jours fériés associent la base date-holidays à des sources officielles vérifiées. Les phases de la Lune et les conversions de dates sont calculées localement.',
    privacyTitle: 'Confidentialité',
    privacyText:
      'Aucun compte n’est requis. Vos préférences de langue, de thème et de pays restent dans ce navigateur.',
    limitationsTitle: 'Limites des données',
    limitationsText:
      'La couverture des jours fériés officiels varie selon le pays et l’année. L’application signale les années sans dates officielles confirmées.',
    disclaimer:
      'Complément indépendant pour le Calendrier fixe international. Sans affiliation avec 13months.net ni aucun organisme de normalisation.',
    linksLabel: 'Liens du pied de page',
    dataSourcesLink: 'Sources des données',
    wikipediaLink: 'Wikipédia',
    sourceCodeLink: 'Code source',
  },

  navigation: {
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    backToHome: "Retourner à la page d'accueil",
  },

  language: {
    title: "Langue de l'interface",
  },

  theme: {
    useLight: 'Utiliser le mode clair',
    useDark: 'Utiliser le mode sombre',
  },

  holidaySettings: {
    countryTitle: 'Jours fériés par pays',
    chooseCountry: 'Choisissez le pays des jours fériés',
    countryHint: "La langue de l'interface et le pays des jours fériés peuvent être différents.",
    observedDateFor: "Date d'observation de {holiday}",
    coverage: {
      title: 'Couverture des jours fériés officiels',
      limitedYears: 'Les dates officielles de ce pays ne sont confirmées que pour {years}.',
      missingOfficialYear:
        'Aucun jour férié gouvernemental n\'est confirmé pour {year}. Années publiées : {years}.',
      noCivilCalendar:
        'Aucun jour férié gouvernemental n\'est confirmé pour {year}.',
      futureYear:
        'Les jours fériés gouvernementaux de {year} utilisent les règles actuelles et peuvent changer après de nouvelles publications officielles.',
      historicalYear:
        'Les jours fériés gouvernementaux de {year} ont été reconstitués avec les règles disponibles ; la source officielle de cette année n\'est pas archivée.',
      otherDatesRemain:
        'Les événements astronomiques, les dates religieuses calculables et les commémorations restent disponibles.',
      openSource: 'Ouvrir la source officielle',
      close: "Fermer l'avis",
    },
    regionFilter: 'Région',
    continents: {
      americas: 'Amériques',
      europe: 'Europe',
      africa: 'Afrique',
      asia: 'Asie',
      oceania: 'Océanie',
      antarctica: 'Antarctique',
    },
    regions: {
      all: 'Toutes les Régions',
      americasNorth: 'Amérique du Nord',
      americasCentral: 'Amérique Centrale',
      americasCaribbean: 'Caraïbes',
      americasSouth: 'Amérique du Sud',
      africaNorth: 'Afrique du Nord',
      africaWest: "Afrique de l'Ouest",
      africaCentral: 'Afrique Centrale',
      africaEast: "Afrique de l'Est",
      africaSouthern: 'Afrique Australe',
      europeNorth: 'Europe Nordique',
      europeWest: "Europe de l'Ouest",
      europeSouth: 'Europe du Sud',
      europeEast: "Europe de l'Est",
      asiaWest: 'Moyen-Orient',
      asiaCentral: 'Asie Centrale',
      asiaSouth: 'Asie du Sud',
      asiaEast: "Asie de l'Est",
      asiaSoutheast: 'Asie du Sud-Est',
      oceania: 'Océanie',
      antarctica: 'Antarctique',
    },
    cancel: 'Annuler',
    calendar13Mode: {
      title: 'Dates dans le calendrier à 13 mois',
      native: 'Dates adaptées',
      nativeCaption:
        'Réapplique les dates fixes et les règles hebdomadaires au calendrier à 13 mois.',
      corresponding: 'Dates correspondantes',
      correspondingCaption: 'Conserve le même jour physique que le calendrier grégorien.',
    },
    filters: {
      open: 'Ouvrir les filtres',
      title: 'Afficher dans la liste',
      public: 'Jours fériés officiels',
      substitute: 'Jours de remplacement',
      optional: 'Jours facultatifs',
      observance: 'Commémorations',
      bank: 'Jours fériés bancaires',
      school: 'Dates scolaires',
      commercial: 'Dates commerciales',
      astronomical: 'Événements astronomiques',
      enableAll: 'Tout activer',
    },
  },

  calendar: {
    selectedDate: 'Date sélectionnée',
    noDate: 'Aucune date sélectionnée',
    gregorian: 'Grégorien',
    today: "Aujourd'hui",
    goToToday: "Aller à la date d'aujourd'hui",
    gregorianTitle: 'Votre Calendrier',
    fixedCalendarTitle: 'Calendrier Fixe International',
    calendar13Short: '13 mois',
    mobileComparisonHint:
      'Faites pivoter l’écran ou utilisez un écran plus grand pour comparer les deux calendriers côte à côte.',
    daysThisMonth: '{count} jours ce mois-ci',
    daysEveryMonth: '{count} jours chaque mois',

    weekDaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'Solaris',
      ...months12Long.slice(6),
      'Jours spéciaux',
    ],

    months13Short: [...months12Short.slice(0, 6), 'SOL', ...months12Short.slice(6), 'SPÉ'],

    specialDays: {
      title: 'Jours spéciaux',
      yearDay: "Jour de l'année",
      yearDayTiming: 'Chaque année · après le 28 décembre',
      yearDayDescription:
        "Un jour férié mondial en dehors de toute semaine ou de tout mois. Le 365e jour, reliant une année à la suivante.",
      leapDay: 'Jour bissextile',
      leapYearTiming: "{year} est bissextile · après le Jour de l'année",
      commonYearTiming: "{year} n'est pas bissextile",
      leapDayDescription:
        "Un jour intercalaire supplémentaire ajouté tous les 4 ans juste après le Jour de l'année. Également hors du cycle hebdomadaire.",
      regularDays: 'Jours ordinaires',
      total: 'Total',
      totalDays: '{count} jours',
    },
  },

  panels: {
    holidays: 'Jours fériés',
    moonPhases: 'Phases de la Lune',
    noHolidays: 'Aucun jour férié ce mois-ci !',
    noMoonPhases: 'Aucune phase lunaire ce mois-ci !',
    loadError: 'Erreur de chargement',
  },

  moonPhases: {
    new: 'Nouvelle Lune',
    waxing: 'Premier Quartier',
    full: 'Pleine Lune',
    waning: 'Dernier Quartier',
    filters: {
      open: 'Ouvrir les filtres des phases lunaires',
      title: "Afficher dans l'encart",
      showTime: "Afficher l'heure des phases",
      timeCaption: "Heure locale de l'appareil",
    },
  },
};
