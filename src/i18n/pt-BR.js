/* ===========================================================
   NOMES DOS MESES UTILIZADOS NESTE IDIOMA
=========================================================== */

const months12Long = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const months12Short = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
];

/* ===========================================================
   CATÁLOGO DE TEXTOS DA INTERFACE
=========================================================== */

export default {
  app: {
    title: 'Tradução de datas: Calendário Gregoriano – Calendário Fixo Internacional',
    browserTitle: '13 Calendar — Conversor de Datas',
  },

  introduction: {
    eyebrow: 'Conversão de datas',
    title: 'Uma data, dois calendários',
    description:
      'Compare o Calendário Gregoriano e o Calendário Fixo Internacional com feriados por país, fases da Lua e datas correspondentes.',
  },

  footer: {
    ariaLabel: 'Rodapé informativo',
    title: 'Datas merecem contexto',
    description: 'Compare calendários com fontes transparentes e limites claramente informados.',
    sourcesTitle: 'Fontes',
    sourcesText:
      'Os feriados combinam a base date-holidays com fontes oficiais revisadas. As fases da Lua e as conversões de datas são calculadas localmente.',
    privacyTitle: 'Privacidade',
    privacyText:
      'Nenhuma conta é necessária. Suas preferências de idioma, tema e país permanecem neste navegador.',
    limitationsTitle: 'Limitações dos dados',
    limitationsText:
      'A cobertura de feriados governamentais varia por país e ano. O aplicativo identifica anos sem datas oficiais confirmadas.',
    disclaimer:
      'Complemento independente para o Calendário Fixo Internacional. Sem afiliação com o 13months.net ou qualquer organismo de padronização.',
    linksLabel: 'Links do rodapé',
    dataSourcesLink: 'Fontes dos dados',
    wikipediaLink: 'Wikipédia',
    sourceCodeLink: 'Código-fonte',
  },

  navigation: {
    menu: 'Menu',
    closeMenu: 'Fechar menu',
    backToHome: 'Voltar para a página inicial',
  },

  language: {
    title: 'Idioma da interface',
  },

  theme: {
    useLight: 'Usar modo claro',
    useDark: 'Usar modo escuro',
  },

  holidaySettings: {
    countryTitle: 'Feriados por país',
    chooseCountry: 'Escolha o país dos feriados',
    countryHint: 'O idioma da interface e o país dos feriados podem ser diferentes.',
    observedDateFor: 'Data observada para {holiday}',
    coverage: {
      title: 'Cobertura de feriados oficiais',
      limitedYears: 'As datas oficiais deste país estão confirmadas apenas para {years}.',
      missingOfficialYear:
        'Não há feriados governamentais confirmados para {year}. Anos publicados: {years}.',
      noCivilCalendar:
        'Não há feriados governamentais confirmados para {year}.',
      futureYear:
        'Os feriados governamentais de {year} usam as regras atuais e podem mudar após novas publicações oficiais.',
      historicalYear:
        'Os feriados governamentais de {year} foram reconstruídos com as regras disponíveis; a fonte oficial daquele ano não está arquivada.',
      otherDatesRemain:
        'Eventos astronômicos, datas religiosas calculáveis e datas comemorativas continuam disponíveis.',
      openSource: 'Abrir fonte oficial',
      close: 'Fechar aviso',
    },
    regionFilter: 'Região',
    continents: {
      americas: 'Américas',
      europe: 'Europa',
      africa: 'África',
      asia: 'Ásia',
      oceania: 'Oceania',
      antarctica: 'Antártida',
    },
    regions: {
      all: 'Todas as Regiões',
      americasNorth: 'América do Norte',
      americasCentral: 'América Central',
      americasCaribbean: 'Caribe',
      americasSouth: 'América do Sul',
      africaNorth: 'África do Norte',
      africaWest: 'África Ocidental',
      africaCentral: 'África Central',
      africaEast: 'África Oriental',
      africaSouthern: 'África Austral',
      europeNorth: 'Europa Nórdica',
      europeWest: 'Europa Ocidental',
      europeSouth: 'Europa Meridional',
      europeEast: 'Leste Europeu',
      asiaWest: 'Oriente Médio',
      asiaCentral: 'Ásia Central',
      asiaSouth: 'Ásia Meridional',
      asiaEast: 'Ásia Oriental',
      asiaSoutheast: 'Sudeste Asiático',
      oceania: 'Oceania',
      antarctica: 'Antártida',
    },
    cancel: 'Cancelar',
    calendar13Mode: {
      title: 'Datas no calendário 13',
      native: 'Datas adaptadas',
      nativeCaption: 'Reaplica datas fixas e regras semanais no calendário de 13 meses.',
      corresponding: 'Datas correspondentes',
      correspondingCaption: 'Mantém o mesmo dia físico do calendário gregoriano.',
    },
    filters: {
      open: 'Abrir filtros',
      title: 'Exibir no encarte',
      public: 'Feriados oficiais',
      substitute: 'Datas substitutivas',
      optional: 'Datas facultativas',
      observance: 'Datas comemorativas',
      bank: 'Feriados bancários',
      school: 'Datas escolares',
      commercial: 'Datas comerciais',
      astronomical: 'Eventos astronômicos',
      enableAll: 'Ativar todos',
    },
  },

  calendar: {
    selectedDate: 'Data selecionada',
    noDate: 'Nenhuma data',
    gregorian: 'Gregoriano',
    today: 'Hoje',
    goToToday: 'Ir para hoje',
    gregorianTitle: 'Seu Calendário',
    fixedCalendarTitle: 'Calendário Fixo Internacional',
    calendar13Short: '13 meses',
    mobileComparisonHint:
      'Gire a tela ou use uma tela maior para comparar os dois calendários lado a lado.',
    daysThisMonth: '{count} dias neste mês',
    daysEveryMonth: '{count} dias em todos os meses',

    weekDaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'Solaris',
      ...months12Long.slice(6),
      'Dias Especiais',
    ],

    months13Short: [...months12Short.slice(0, 6), 'SOL', ...months12Short.slice(6), 'ESP'],

    specialDays: {
      title: 'Dias Especiais',
      yearDay: 'Dia do Ano',
      yearDayTiming: 'Todo ano · após 28 de dezembro',
      yearDayDescription:
        'Um feriado mundial fora de qualquer semana ou mês. O 365º dia, conectando um ano ao próximo.',
      leapDay: 'Dia Bissexto',
      leapYearTiming: '{year} é bissexto · após o Dia do Ano',
      commonYearTiming: '{year} não é bissexto',
      leapDayDescription:
        'Um dia intercalar extra adicionado a cada 4 anos logo após o Dia do Ano. Também fora do ciclo semanal.',
      regularDays: 'Dias regulares',
      total: 'Total',
      totalDays: '{count} dias',
    },
  },

  panels: {
    holidays: 'Feriados',
    moonPhases: 'Fases da Lua',
    noHolidays: 'Sem feriados neste mês!',
    noMoonPhases: 'Sem fases da Lua neste mês!',
    loadError: 'Erro ao carregar',
  },

  moonPhases: {
    new: 'Lua Nova',
    waxing: 'Lua Crescente',
    full: 'Lua Cheia',
    waning: 'Lua Minguante',
    filters: {
      open: 'Abrir filtros das fases da Lua',
      title: 'Exibir no encarte',
      showTime: 'Exibir horário das fases',
      timeCaption: 'Horário local do dispositivo',
    },
  },
};
