/* ===========================================================
   NOMES DOS MESES UTILIZADOS NESTE IDIOMA
=========================================================== */

const months12Long = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const months12Short = [
  'ENE',
  'FEB',
  'MAR',
  'ABR',
  'MAY',
  'JUN',
  'JUL',
  'AGO',
  'SEP',
  'OCT',
  'NOV',
  'DIC',
];

/* ===========================================================
   CATÁLOGO DE TEXTOS DA INTERFACE
=========================================================== */

export default {
  app: {
    title: 'Conversión de fechas: calendario gregoriano – calendario fijo internacional',
    browserTitle: '13 Calendar — Conversor de fechas',
  },

  introduction: {
    eyebrow: 'Integración visual',
    title: 'Un complemento natural para 13months.net',
    description:
      'Esta página explora la misma familia de colores, contrastes, bordes y formas del proyecto de referencia sin modificar la pantalla principal de la aplicación.',
  },

  footer: {
    ariaLabel: 'Pie de página informativo',
    title: 'Las fechas merecen contexto',
    description: 'Compara calendarios con fuentes transparentes y limitaciones claramente indicadas.',
    sourcesTitle: 'Fuentes',
    sourcesText:
      'Los festivos combinan la base date-holidays con fuentes oficiales revisadas. Las fases de la Luna y las conversiones de fechas se calculan localmente.',
    privacyTitle: 'Privacidad',
    privacyText:
      'No se necesita una cuenta. Tus preferencias de idioma, tema y país permanecen en este navegador.',
    limitationsTitle: 'Limitaciones de los datos',
    limitationsText:
      'La cobertura de festivos gubernamentales varía según el país y el año. La aplicación identifica los años sin fechas oficiales confirmadas.',
    disclaimer:
      'Complemento independiente para el Calendario Fijo Internacional. Sin afiliación con 13months.net ni con ningún organismo de normalización.',
    linksLabel: 'Enlaces del pie de página',
    dataSourcesLink: 'Fuentes de datos',
    sourceCodeLink: 'Código fuente',
  },

  navigation: {
    menu: 'Menú',
    backToHome: 'Volver a la página de inicio',
  },

  language: {
    title: 'Idioma de la interfaz',
  },

  theme: {
    useLight: 'Usar modo claro',
    useDark: 'Usar modo oscuro',
  },

  holidaySettings: {
    countryTitle: 'Días festivos por país',
    chooseCountry: 'Elija el país de los días festivos',
    countryHint: 'El idioma de la interfaz y el país de los días festivos pueden ser diferentes.',
    observedDateFor: 'Fecha observada de {holiday}',
    coverage: {
      title: 'Cobertura de festivos oficiales',
      limitedYears: 'Las fechas oficiales de este país solo están confirmadas para {years}.',
      missingOfficialYear:
        'No hay festivos gubernamentales confirmados para {year}. Años publicados: {years}.',
      noCivilCalendar:
        'No hay festivos gubernamentales confirmados para {year}.',
      futureYear:
        'Los festivos gubernamentales de {year} usan las reglas actuales y pueden cambiar tras nuevas publicaciones oficiales.',
      historicalYear:
        'Los festivos gubernamentales de {year} se reconstruyeron con las reglas disponibles; la fuente oficial de ese año no está archivada.',
      otherDatesRemain:
        'Los eventos astronómicos, las fechas religiosas calculables y las conmemoraciones siguen disponibles.',
      openSource: 'Abrir fuente oficial',
      close: 'Cerrar aviso',
    },
    regionFilter: 'Región',
    continents: {
      americas: 'Américas',
      europe: 'Europa',
      africa: 'África',
      asia: 'Asia',
      oceania: 'Oceanía',
      antarctica: 'Antártida',
    },
    regions: {
      all: 'Todas las Regiones',
      americasNorth: 'América del Norte',
      americasCentral: 'América Central',
      americasCaribbean: 'Caribe',
      americasSouth: 'América del Sur',
      africaNorth: 'África del Norte',
      africaWest: 'África Occidental',
      africaCentral: 'África Central',
      africaEast: 'África Oriental',
      africaSouthern: 'África Austral',
      europeNorth: 'Europa Nórdica',
      europeWest: 'Europa Occidental',
      europeSouth: 'Europa Meridional',
      europeEast: 'Europa del Este',
      asiaWest: 'Oriente Medio',
      asiaCentral: 'Asia Central',
      asiaSouth: 'Asia Meridional',
      asiaEast: 'Asia Oriental',
      asiaSoutheast: 'Sudeste Asiático',
      oceania: 'Oceanía',
      antarctica: 'Antártida',
    },
    cancel: 'Cancelar',
    calendar13Mode: {
      title: 'Fechas en el calendario de 13 meses',
      native: 'Fechas adaptadas',
      nativeCaption:
        'Vuelve a aplicar fechas fijas y reglas semanales en el calendario de 13 meses.',
      corresponding: 'Fechas correspondientes',
      correspondingCaption: 'Mantiene el mismo día físico que el calendario gregoriano.',
    },
    filters: {
      open: 'Abrir filtros',
      title: 'Mostrar en la lista',
      public: 'Festivos oficiales',
      substitute: 'Días sustitutivos',
      optional: 'Días facultativos',
      observance: 'Conmemoraciones',
      bank: 'Festivos bancarios',
      school: 'Fechas escolares',
      commercial: 'Fechas comerciales',
      astronomical: 'Eventos astronómicos',
      enableAll: 'Activar todos',
    },
  },

  calendar: {
    selectedDate: 'Fecha seleccionada',
    noDate: 'Ninguna fecha seleccionada',
    gregorian: 'Gregoriano',
    today: 'Hoy',
    goToToday: 'Ir a la fecha de hoy',
    gregorianTitle: 'Tu Calendario',
    fixedCalendarTitle: 'Calendario Fijo Internacional',
    daysThisMonth: '{count} días este mes',
    daysEveryMonth: '{count} días todos los meses',

    weekDaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'Solaris',
      ...months12Long.slice(6),
      'Días Especiales',
    ],

    months13Short: [...months12Short.slice(0, 6), 'SOL', ...months12Short.slice(6), 'ESP'],

    specialDays: {
      title: 'Días Especiales',
      yearDay: 'Día del Año',
      yearDayTiming: 'Cada año · después del 28 de diciembre',
      yearDayDescription:
        'Un feriado mundial fuera de cualquier semana o mes. El día 365, que conecta un año con el siguiente.',
      leapDay: 'Día Bisiesto',
      leapYearTiming: '{year} es bisiesto · después del Día del Año',
      commonYearTiming: '{year} no es bisiesto',
      leapDayDescription:
        'Un día intercalar adicional añadido cada 4 años justo después del Día del Año. También fuera del ciclo semanal.',
      regularDays: 'Días regulares',
      total: 'Total',
      totalDays: '{count} días',
    },
  },

  panels: {
    holidays: 'Días festivos',
    moonPhases: 'Fases de la Luna',
    noHolidays: '¡No hay días festivos este mes!',
    noMoonPhases: '¡No hay fases lunares este mes!',
    loadError: 'Error al cargar',
  },

  moonPhases: {
    new: 'Luna Nueva',
    waxing: 'Cuarto Creciente',
    full: 'Luna Llena',
    waning: 'Cuarto Menguante',
    filters: {
      open: 'Abrir filtros de fases lunares',
      title: 'Mostrar en la tarjeta',
      showTime: 'Mostrar la hora de las fases',
      timeCaption: 'Hora local del dispositivo',
    },
  },
};
