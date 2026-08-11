/* ===========================================================
   CONTEXTO GLOBAL PARA NOMES CURTOS OU CULTURAIS

   A frase ampliada preserva o nome próprio e explica o seu
   significado antes que o tradutor automático seja chamado.
=========================================================== */

const globalTranslationSources = Object.freeze({
  Ascension: 'Ascension of Jesus Christ',
  Assumption: 'Assumption of Mary',
  'Ambedkar Jayanti': 'Ambedkar Jayanti — Birthday of B. R. Ambedkar',
  'ANZAC Day': 'ANZAC Day — Commemoration of Australian and New Zealand military personnel',
  'Anzac Day': 'ANZAC Day — Commemoration of Australian and New Zealand military personnel',
  'Boxing Day': 'Boxing Day — Holiday celebrated on the day after Christmas',
  'Early May bank holiday': 'Early May Bank Holiday — First Monday in May',
  Bundesfeiertag: 'Swiss National Day',
  Deepavali: 'Deepavali — Hindu Festival of Lights',
  'Eid al-Adha': 'Eid al-Adha — Islamic Feast of Sacrifice',
  Epiphany: 'Epiphany of the Lord',
  'Gandhi Jayanti': 'Gandhi Jayanti — Birthday of Mahatma Gandhi',
  'Hari Raya Haji': 'Hari Raya Haji — Islamic Feast of Sacrifice',
  'Hari Raya Puasa': 'Hari Raya Puasa — Celebration marking the end of Ramadan',
  'Lundi de Pâques': 'Easter Monday',
  'Lundi de Pentecôte': 'Whit Monday',
  'Magal de Touba':
    'Magal de Touba — Senegalese religious pilgrimage commemorating Sheikh Ahmadou Bamba',
  Matariki: 'Matariki — Māori New Year',
  Nauryz: 'Nauryz — Traditional Kazakh spring New Year celebration',
  Pentecost: 'Pentecost Sunday',
  'Spring bank holiday': 'Spring Bank Holiday — Last Monday in May',
  'Santa Rosa de Lima': 'Feast of Saint Rose of Lima',
  Staatsfeiertag: 'Austrian National Holiday',
  Vätertag: "Father's Day",
  'Victoria Day': 'Queen Victoria Day — Canadian holiday honoring Queen Victoria',
  'Waitangi Day': 'Waitangi Day — New Zealand national day commemorating the Treaty of Waitangi',
  Whitsunday: 'Pentecost Sunday',
});

/* ===========================================================
   NOMES NACIONAIS PARA O FERIADO DE 26 DE DEZEMBRO

   A base internacional compartilha o rótulo inglês
   “Boxing Day” entre países que usam nomes oficiais
   culturalmente diferentes. Estes grupos recuperam o conceito
   local antes que o texto seja enviado ao tradutor.
=========================================================== */

const secondChristmasDayCountries = Object.freeze([
  'AW',
  'AX',
  'BA',
  'BG',
  'BQ',
  'CW',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FO',
  'GL',
  'GR',
  'HU',
  'IS',
  'LT',
  'LV',
  'NL',
  'NO',
  'PL',
  'RO',
  'SE',
  'SK',
  'SR',
]);

const saintStephenDayCountries = Object.freeze(['AD', 'AT', 'CH', 'HR', 'LI', 'LU']);

function resolveGroupedCountryNameTranslationSource(countryCode, name) {
  if (name !== 'Boxing Day') {
    return null;
  }

  if (secondChristmasDayCountries.includes(countryCode)) {
    return 'Second Day of Christmas';
  }

  if (saintStephenDayCountries.includes(countryCode)) {
    return "Saint Stephen's Day";
  }

  if (countryCode === 'ME') {
    return 'Second Day of Orthodox Christmas';
  }

  return null;
}

/* ===========================================================
   CONTEXTO POR PAÍS E NOME

   Estas entradas resolvem rótulos que são oficiais, porém
   vagos quando aparecem sozinhos no cartão do calendário.
=========================================================== */

const countryNameTranslationSources = Object.freeze({
  AR: Object.freeze({
    'Bridge Day': 'Tourism Non-Working Day — Designated to promote domestic tourism',
  }),
  CA: Object.freeze({
    'Civic Holiday': 'Canadian Civic Holiday — Regional holiday on the first Monday of August',
  }),
  BE: Object.freeze({
    Assomption: 'Assumption of Mary',
    'Fête du Roi': "Belgian King's Feast",
  }),
  BJ: Object.freeze({
    'Fête du Vodoun': 'Vodoun Festival',
  }),
  CG: Object.freeze({
    'Fête de la commémoration de la conférence nationale souveraine':
      'Commemoration of the Sovereign National Conference of Congo',
    'Journée nationale de la République': 'Republic Day of Congo',
  }),
  CR: Object.freeze({
    'Gesta Heroica de Juan Santamaría':
      'Juan Santamaría Day — Commemoration of the Costa Rican national hero',
  }),
  DK: Object.freeze({
    Fastelavn: 'Fastelavn — Nordic Carnival',
  }),
  DE: Object.freeze({
    'National Holiday': 'German Unity Day',
  }),
  GB: Object.freeze({
    'Early May bank holiday': 'Early May Bank Holiday — First Monday in May',
    'Spring bank holiday': 'Spring Bank Holiday — Last Monday in May',
  }),
  IE: Object.freeze({
    'First Monday in June': 'June Bank Holiday — First Monday in June',
    'First Monday in August': 'August Bank Holiday — First Monday in August',
    'October Bank Holiday': 'October Bank Holiday — Last Monday in October',
  }),
  HN: Object.freeze({
    'Día de las Américas': 'Day of the Americas',
  }),
  IC: Object.freeze({
    'Día de la Constitución Española': 'Spanish Constitution Day',
    'Fiesta Nacional de España': 'National Day of Spain',
  }),
  IS: Object.freeze({
    Bolludagur: 'Bolludagur — Icelandic Cream Bun Day',
    Bóndadagur: "Bóndadagur — Icelandic Husbands' Day",
    Sprengidagur: 'Sprengidagur — Icelandic Shrove Tuesday',
  }),
  IT: Object.freeze({
    'Boxing Day': "Saint Stephen's Day",
    'Francis of Assisi': 'Feast of Saint Francis of Assisi',
  }),
  LI: Object.freeze({
    Feiertagsbrücke: 'Bridge Holiday — Day connecting a public holiday and a weekend',
    'Mariä Geburt': 'Nativity of Mary',
  }),
  ML: Object.freeze({
    "Jour de l'Afrique": 'Africa Day',
  }),
  NC: Object.freeze({
    "Jour de l'an": "New Year's Day",
  }),
  PA: Object.freeze({
    'Primer Grito de Independencia': 'First Cry of Independence of Panama',
  }),
  PT: Object.freeze({
    'Implantação da República': 'Establishment of the Portuguese Republic',
    'Restauração da Independência': 'Restoration of Portuguese Independence',
  }),
  SE: Object.freeze({
    Vasaloppet: 'Vasaloppet — Swedish Cross-Country Ski Race',
  }),
  SV: Object.freeze({
    'Celebración del Divino Salvador del Mundo': 'Feast of the Divine Savior of the World',
    'Día de la Mujer': "Women's Day",
    'Día del Maestro': "Teachers' Day",
    'Firma de los Acuerdos de Paz': 'Signing of the Peace Accords',
  }),
  TN: Object.freeze({
    'Fête de la Révolution et de la Jeunesse': 'Tunisian Revolution and Youth Day',
    "Fête de l'Indépendance": 'Tunisian Independence Day',
    'Fête des Martyrs': "Tunisian Martyrs' Day",
    'Fête de la République': 'Tunisian Republic Day',
    'Fête de la Femme': "Tunisian Women's Day",
    'عيد الإستقلال': 'Tunisian Independence Day',
    'عيد الثورة و الشباب': 'Tunisian Revolution and Youth Day',
    'عيد الجلاء': 'Tunisian Evacuation Day',
    'عيد الجمهورية': 'Tunisian Republic Day',
    'عيد الشهداء': "Tunisian Martyrs' Day",
    'عيد المرأة': "Tunisian Women's Day",
  }),
  SM: Object.freeze({
    'Boxing Day': "Saint Stephen's Day",
    'Cerimonia di investitura dei Capitani Reggenti': 'Investiture of the two Captains Regent',
    'Commemoration of the deceased': "All Souls' Day",
    'Inauguration Ceremony': 'Investiture of the two Captains Regent',
    'The Feast of San Marino and the Republic':
      'Feast of Saint Marinus and Foundation of the Republic of San Marino',
  }),
  VA: Object.freeze({
    'Boxing Day': "Saint Stephen's Day",
    'In Albis Tuesday': 'Easter Tuesday (In Albis)',
    'St. John': 'Feast of Saint John the Apostle',
    'Summer holiday': 'Vatican Summer Recess',
  }),
  VU: Object.freeze({
    'Fête de Famille': 'Family Day of Vanuatu',
    'Fête des chefs coutumiers': "Vanuatu Custom Chiefs' Day",
    "Jour de l'Unité": 'Vanuatu Unity Day',
    'Journée Mondiale des Enfants': "World Children's Day",
    "Mémoire du père de l'indépendance Rév. Dr. W.H. Lini":
      'Walter Lini Memorial Day — Father of the Independence of Vanuatu',
  }),
});

/* ===========================================================
   CONTEXTO POR PAÍS E REGRA

   Regras diferentes podem chegar da biblioteca com o mesmo
   nome genérico. A regra permite recuperar o evento correto
   sem depender do ano ou do idioma exibido.
=========================================================== */

const countryRuleTranslationSources = Object.freeze({
  AE: Object.freeze({
    '12-02': 'United Arab Emirates National Day',
  }),
  AT: Object.freeze({
    '10-26': 'Austrian National Day — Commemoration of permanent neutrality',
  }),
  BE: Object.freeze({
    '07-21': 'Belgian National Day — Constitutional oath of King Leopold I',
  }),
  BH: Object.freeze({
    '12-16': 'Bahrain National Day',
  }),
  BI: Object.freeze({
    '2015-07-24': '2015 Senate Election Day',
  }),
  BN: Object.freeze({
    '02-23': 'Brunei National Day',
  }),
  CD: Object.freeze({
    '2016-01-15': 'Laurent Kabila Memorial Day',
  }),
  CL: Object.freeze({
    '09-18': 'Chilean Independence Day — First National Government Junta of Chile',
    '09-20 on friday': 'Additional Holiday for Chilean Fiestas Patrias — 20 September',
    '01-02 on monday since 2017': "Additional New Year's Holiday — 2 January",
    '09-17 on friday, monday since 2017':
      'Additional Holiday for Chilean Fiestas Patrias — 17 September',
    '2022-09-16': 'Additional Holiday for Chilean Fiestas Patrias — 16 September',
  }),
  CM: Object.freeze({
    '05-20': 'Cameroon National Unity Day',
  }),
  CN: Object.freeze({
    '10-01': 'National Day of China',
    '10-02': 'National Day Holiday — Day 2',
    '10-03': 'National Day Holiday — Day 3',
    '2021-10-04': 'National Day Holiday — Day 4',
    '2021-10-05': 'National Day Holiday — Day 5',
    '2021-10-06': 'National Day Holiday — Day 6',
    '2021-10-07': 'National Day Holiday — Day 7',
  }),
  CY: Object.freeze({
    '10-28': 'Ohi Day',
  }),
  CV: Object.freeze({
    '09-12': 'Cape Verde National Day — Commemoration of the birthday of Amílcar Cabral',
  }),
  GL: Object.freeze({
    '06-21': 'Greenland National Day',
  }),
  GN: Object.freeze({
    '04-03': 'Second Republic Day of Guinea',
  }),
  GR: Object.freeze({
    '10-28': 'Ohi Day',
  }),
  HK: Object.freeze({
    '10-01 not on Sunday': 'National Day of China',
  }),
  HR: Object.freeze({
    '05-30': 'Croatian Statehood Day',
  }),
  HU: Object.freeze({
    '03-15': 'Memorial Day of the 1848 Hungarian Revolution',
    '10-23': 'Memorial Day of the 1956 Hungarian Revolution',
  }),
  IT: Object.freeze({
    '2011-03-17': '150th Anniversary of Italian Unification',
  }),
  LC: Object.freeze({
    '12-13': 'Saint Lucia National Day',
  }),
  LK: Object.freeze({
    '02-04': 'Sri Lanka Independence Day',
  }),
  LU: Object.freeze({
    '01-23': "Grand Duchess Charlotte's Birthday — Historical Luxembourg National Day",
    '06-23': "Luxembourg National Day — Official celebration of the Grand Duke's birthday",
  }),
  MU: Object.freeze({
    '03-12': 'Mauritius Independence and Republic Day',
  }),
  RO: Object.freeze({
    '12-01': 'Great Union Day of Romania',
  }),
  RW: Object.freeze({
    '01-02': "Day after New Year's Day",
  }),
  SA: Object.freeze({
    '09-23 since 2005': 'Saudi National Day',
  }),
  SC: Object.freeze({
    '06-18': 'Seychelles Constitution Day',
  }),
  SE: Object.freeze({
    '06-06 since 2005': 'National Day of Sweden',
    '06-06 since 1983 prior to 2005': 'National Day of Sweden',
  }),
  SG: Object.freeze({
    '08-09': 'Singapore National Day — Independence Day',
  }),
  SN: Object.freeze({
    '04-04': 'Senegal Independence Day',
  }),
  VN: Object.freeze({
    '09-02': 'Vietnam National Day',
  }),
  VU: Object.freeze({
    '02-22': 'Walter Lini Memorial Holiday',
    '08-16': 'Assumption Day Holiday',
    '12-27': 'Family Day Holiday',
  }),
  ZA: Object.freeze({
    '2024-05-29': '2024 South African General Election Day',
  }),
});

/* ===========================================================
   RESOLUÇÃO DO TEXTO-FONTE

   Prioridade:
   1. país + regra exata;
   2. país + nome recebido;
   3. grupo cultural do país;
   4. contexto cultural global;
   5. nome original da biblioteca.
=========================================================== */

export function resolveHolidayTranslationSource({ country, rule, name }) {
  const countryCode = String(country || '')
    .trim()
    .toUpperCase();

  return (
    countryRuleTranslationSources[countryCode]?.[rule] ||
    countryNameTranslationSources[countryCode]?.[name] ||
    resolveGroupedCountryNameTranslationSource(countryCode, name) ||
    globalTranslationSources[name] ||
    name
  );
}
