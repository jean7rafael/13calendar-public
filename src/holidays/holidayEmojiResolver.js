/* ===========================================================
   EMOJIS GENÉRICOS POR TIPO

   Estes símbolos são o último recurso. A auditoria global
   informa quais nomes ainda dependem deles para que a lista de
   conceitos possa ser refinada sem decisões isoladas por país.
=========================================================== */

export const DEFAULT_HOLIDAY_EMOJI_BY_TYPE = Object.freeze({
  public: '🎉',
  substitute: '↪️',
  bank: '🏦',
  school: '🎓',
  optional: '📌',
  observance: '🗓️',
  commercial: '🛍️',
});

/* ===========================================================
   NORMALIZAÇÃO DO NOME CANÔNICO
=========================================================== */

function normalizeHolidayName(name) {
  return String(name || '')
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replaceAll('’', "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ===========================================================
   BANDEIRA DO PAÍS

   Datas nacionais seguem a convenção que já existia nos seis
   países originais. O código precisa ter exatamente duas letras
   para que caracteres inválidos não sejam produzidos.
=========================================================== */

function countryCodeToFlag(countryCode) {
  const normalizedCountry = String(countryCode || '').toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCountry)) {
    return DEFAULT_HOLIDAY_EMOJI_BY_TYPE.public;
  }

  return normalizedCountry.replace(/./g, (character) =>
    String.fromCodePoint(127397 + character.charCodeAt(0)),
  );
}

/* ===========================================================
   CONCEITOS SEMÂNTICOS INTERNACIONAIS

   Cada conceito reúne nomes diferentes para a mesma família de
   datas. A ordem é importante: eventos específicos devem vir
   antes de palavras amplas. Os emojis já adotados nos seis
   catálogos editoriais permanecem como referência principal.
=========================================================== */

export const HOLIDAY_EMOJI_CONCEPTS = Object.freeze([
  /* Datas familiares e comerciais */
  {
    id: 'black_friday',
    pattern: /black friday|cyber monday|day after thanksgiving/,
    emoji: '🛍️',
  },
  { id: 'halloween', pattern: /halloween/, emoji: '🎃' },
  { id: 'valentines_day', pattern: /valentine|lovers'? day/, emoji: '💘' },
  { id: 'mothers_day', pattern: /mother(?:'s|s')? day|motherhood/, emoji: '❤️' },
  { id: 'fathers_day', pattern: /father(?:'s|s')? day|fatherhood/, emoji: '💙' },
  { id: 'womens_day', pattern: /women(?:'s|s')? day|woman's day/, emoji: '🌷' },
  { id: 'childrens_day', pattern: /children(?:'s|s')? day|child day/, emoji: '🧒' },
  { id: 'family_day', pattern: /family day|families day|parents'? day/, emoji: '👨‍👩‍👧' },

  /* Natal e calendário cristão */
  {
    id: 'second_christmas_day',
    pattern:
      /boxing day|day after christmas|second (?:day of )?(?:orthodox )?christmas|2nd (?:day of )?(?:the )?christmas|saint stephen(?:'s)? day|st\.? stephen(?:'s)? day|first weekday after christmas|second weekday after christmas/,
    emoji: '🎁',
  },
  { id: 'christmas', pattern: /christmas|nativity/, emoji: '🎄' },
  { id: 'holy_saturday', pattern: /day following good friday/, emoji: '✝️' },
  { id: 'good_friday', pattern: /good friday|holy friday/, emoji: '🩸' },
  { id: 'easter', pattern: /easter|pascha/, emoji: '🐰' },
  {
    id: 'christian_cross',
    pattern:
      /ash wednesday|ash sunday|maundy|holy thursday|palm sunday|corpus christi|ascension|crucifixion|reformation|finding of the true cross|meskel|holy week|clean monday|laetare sunday|white sunday|candlemas|baptism|iglesia ni cristo|ugly wednesday/,
    emoji: '✝️',
  },
  {
    id: 'mary',
    pattern: /assumption|immaculate|our lady|virgin mary|virgin of|mother of god|annunciation/,
    emoji: '🙏🏻',
  },
  {
    id: 'pentecost',
    pattern: /pentecost|whit monday|whitsun|whitsunday|holy spirit/,
    emoji: '🕊️',
  },
  { id: 'epiphany', pattern: /epiphany|three kings/, emoji: '👑' },
  {
    id: 'christian_remembrance',
    pattern:
      /all saints|all souls|day of the dead|commemoration of the deceased|totensonntag|sunday of the dead|death sunday/,
    emoji: '🕯️',
  },
  { id: 'sacred_heart', pattern: /sacred heart/, emoji: '❤️' },

  /* Outras tradições religiosas */
  {
    id: 'islamic_holiday',
    pattern:
      /eid|\bid[- ]|ramadan|ashura|ashoura|arbaeen|mawlid|maulid|milad|\bnabi\b|muhammad|mohammed|hari raya|arafat|laylat|al-qadr|mi'raj|isra and mi'raj|nuzul al-quran|islamic new year|hijri new year|korite|tabaski|youman nabi|(?:birthday|martyrdom) of (?:imam|fatima)|tasoua/,
    emoji: '🌙',
  },
  { id: 'diwali', pattern: /diwali|divali|deepavali|festival of lights/, emoji: '🪔' },
  { id: 'holi', pattern: /\bholi\b|phagwa|phagwah/, emoji: '🎨' },
  {
    id: 'hindu_holiday',
    pattern:
      /krishna janmashtami|durga puja|navratri|maha shivaratri|maha shivaratree|mahasivarathri|thaipoosam|ugadi|ganesh|hindu festival|raksha bandhan/,
    emoji: '🕉️',
  },
  {
    id: 'buddhist_holiday',
    pattern: /buddha|vesak|makha bucha|asalha puja|buddhist lent|kathina|bodhi day|poya day/,
    emoji: '🪷',
  },
  {
    id: 'jewish_holiday',
    pattern:
      /yom kippur|rosh hashana|passover|pesach|hanukkah|chanukah|purim|shavuot|sukkot|shemini atzeret|simchat torah|yom ha/,
    emoji: '✡️',
  },
  { id: 'magal_touba', pattern: /magal (?:de|of) touba/, emoji: '🙏🏿' },
  { id: 'nyepi', pattern: /nyepi|day of silence/, emoji: '🧘' },
  { id: 'prayer_day', pattern: /prayer day|day of prayer/, emoji: '🙏' },
  {
    id: 'deity_birthday',
    pattern: /(?:cheng huang|earth god|god of medicine|kuan kung|kuan yin|matsu)'s birthday/,
    emoji: '🙏',
  },

  /* Festas e tradições culturais */
  { id: 'carnival', pattern: /carnival|shrove|mardi gras|j'ouvert/, emoji: '🎭' },
  { id: 'labour_thanksgiving', pattern: /labou?r thanksgiving/, emoji: '🧰' },
  { id: 'korean_thanksgiving', pattern: /korean thanksgiving/, emoji: '🌾' },
  {
    id: 'religious_thanksgiving',
    pattern: /thanksgiving, repentance and prayer/,
    emoji: '🙏',
  },
  {
    id: 'military_thanksgiving',
    pattern: /victory and homeland thanksgiving/,
    emoji: '🎖️',
  },
  { id: 'thanksgiving', pattern: /thanksgiving/, emoji: '🦃' },
  { id: 'saint_patrick', pattern: /saint patrick|st\.? patrick/, emoji: '☘️' },
  {
    id: 'saint_john_apostle',
    pattern: /saint john the apostle|st\.? john the apostle/,
    emoji: '🙏',
  },
  {
    id: 'saint_john',
    pattern: /saint john(?:'s)? day|st\.? john(?:'s)? day|midsummer|midsummar/,
    emoji: '🪵',
  },
  { id: 'lantern_festival', pattern: /lantern festival/, emoji: '🏮' },
  { id: 'mid_autumn', pattern: /mid-autumn|moon festival/, emoji: '🌕' },
  { id: 'dragon_boat', pattern: /dragon boat|tuen ng/, emoji: '🐉' },
  { id: 'spring_festival', pattern: /spring festival/, emoji: '🐉' },
  { id: 'qingming', pattern: /qingming|ching ming|tomb[- ]sweeping/, emoji: '🕯️' },
  { id: 'qixi', pattern: /qixi festival/, emoji: '💘' },
  { id: 'seven_five_three', pattern: /seven-five-three festival/, emoji: '🧒' },
  { id: 'songkran', pattern: /songkran/, emoji: '💦' },

  /* Trabalho, educação e sociedade */
  {
    id: 'labour_day',
    pattern:
      /labou?r(?:'s|s')? day|labou?r and solidarity|worker(?:'s|s')? day|workers? day|international workers|may day|saint joseph the worker|day following labou?r day|2nd day of the labou?r day/,
    emoji: '🧰',
  },
  {
    id: 'teachers_day',
    pattern: /teacher(?:'s|s') day|teachers? day|educator/,
    emoji: '🎓',
  },
  {
    id: 'education',
    pattern: /education|literacy|knowledge day|alphabet day|student(?:'s|s)? day/,
    emoji: '🎓',
  },
  {
    id: 'language_literature',
    pattern: /language|literature|literary|translator|book day|alphabet/,
    emoji: '📚',
  },
  { id: 'youth_day', pattern: /youth day|young people/, emoji: '🌱' },
  { id: 'human_rights', pattern: /human rights|justice|ambedkar/, emoji: '⚖️' },
  {
    id: 'emancipation',
    pattern: /emancipation|abolition of slavery|freedom from slavery|schoelcher/,
    emoji: '⛓️‍💥',
  },
  { id: 'juneteenth', pattern: /juneteenth/, emoji: '✊🏿' },
  { id: 'indigenous_peoples', pattern: /indigenous|aboriginal|sami people/, emoji: '🌴' },
  { id: 'science', pattern: /science day/, emoji: '🔬' },
  { id: 'bank_holiday', pattern: /bank holiday/, emoji: '🏦' },
  { id: 'school_holiday', pattern: /school holiday/, emoji: '🎓' },
  { id: 'mens_day', pattern: /\bmen(?:'s|s')? day/, emoji: '👨' },
  { id: 'boys_day', pattern: /\bboy(?:'s|s')? day/, emoji: '🧒' },

  /* Estado, história e instituições */
  { id: 'constitution', pattern: /constitution/, emoji: '📜' },
  { id: 'republic', pattern: /republic|proclamation of the republic/, emoji: '📣' },
  { id: 'democracy', pattern: /democracy|election|voting|referendum/, emoji: '🗳️' },
  {
    id: 'unity',
    pattern: /\bunity\b|\bunification\b|reunification|solidarity day|great union day/,
    emoji: '🤝',
  },
  {
    id: 'peace',
    pattern: /armistice|peace day|martin luther king|gandhi|non-violence/,
    emoji: '🕊️',
  },
  {
    id: 'military_remembrance',
    pattern:
      /victory|veterans?|defender|armed forces|air force|defen[cs]e (?:forces?|day)|military|anti-fascist|fascism|world war|invasion|war in |anzac|battle|navy day|army day|soldier|resistance fighting|national hero|heroes|spla day|day of valor|ohi day/,
    emoji: '🎖️',
  },
  {
    id: 'martyrs',
    pattern: /martyr(?:'s|s')? day|martyrs day|day of the martyrs|first martyr|martyred/,
    emoji: '🕯️',
  },
  {
    id: 'memorial_mourning',
    pattern:
      /memorial|remembrance|mourning|commemoration|funeral|passing to immortality|anniversary of the death|demise|day of lament/,
    emoji: '🕯️',
  },
  { id: 'revolution', pattern: /revolution|uprising|revolt|coup d'etat/, emoji: '✊' },
  {
    id: 'freedom_liberation',
    pattern: /freedom|liberation|liberty day|demilitarization/,
    emoji: '🕊️',
  },
  { id: 'reconciliation', pattern: /reconciliation|goodwill/, emoji: '🤝' },
  { id: 'treaty', pattern: /treaty|accord|agreement day/, emoji: '📜' },
  {
    id: 'royalty',
    pattern:
      /\bkings?\b|\bqueen\b|kingdom day|royal|monarch|emperor|sultan.*birthday|birthday.*sultan|yang di-pertuan agong|crown prince|birthday of (?:crown )?prince(?:ss)?|prince(?:ss)? .*birthday|\bprince's day|\bprincess day|grand duchess|coronation|accession day|\bsovereign\b|enthronement|feast of the throne/,
    emoji: '👑',
  },
  { id: 'flag_day', pattern: /flag day|national flag/, emoji: null },
  {
    id: 'national_day',
    pattern:
      /independence|national day|national holiday|statehood|foundation|founding|founders day|autonomy|sovereignty|self determination|territory day|restoration of the state|special administrative region establishment/,
    emoji: null,
  },

  /* Natureza, ciência e atividades */
  { id: 'environment', pattern: /environment|earth day/, emoji: '🌎' },
  { id: 'groundhog_day', pattern: /groundhog day/, emoji: '🦫' },
  { id: 'africa_day', pattern: /africa day/, emoji: '🌍' },
  { id: 'europe_day', pattern: /europe day/, emoji: '🇪🇺' },
  { id: 'tree_nature', pattern: /arbor day|tree day|greenery day/, emoji: '🌳' },
  { id: 'mountain', pattern: /mountain day/, emoji: '🏔️' },
  { id: 'sea', pattern: /day of the sea|marine day|ocean day/, emoji: '🌊' },
  {
    id: 'agriculture',
    pattern: /harvest|farmer|agricultur|agrarian reform|thai pongal/,
    emoji: '🌾',
  },
  { id: 'space', pattern: /cosmonaut|space flight|space day/, emoji: '🚀' },
  { id: 'navigation_discovery', pattern: /columbus|discovery|landing of/, emoji: '⛵' },
  {
    id: 'sports',
    pattern: /sports? day|rugby|world cup|football|hockey|olympic|ski race|tourist trophy/,
    emoji: '🏆',
  },
  {
    id: 'heritage',
    pattern: /heritage|cultural diversity|culture day|cultural holiday/,
    emoji: '🏛️',
  },
  {
    id: 'tourism',
    pattern: /tourism.*non-working day|tourism purposes|tourism day|tourism week/,
    emoji: '🧳',
  },
  { id: 'washington_birthday', pattern: /washington's birthday/, emoji: '🇺🇸' },
  { id: 'birthday', pattern: /birthday|birth anniversary/, emoji: '🎂' },
  {
    id: 'advent',
    pattern:
      /sunday of advent|advent sunday|twelfth night|\b[1-4](?:st|nd|rd|th)?\.?\s+advent\b/,
    emoji: '🕯️',
  },
  { id: 'ghost_festival', pattern: /ghost festival/, emoji: '🕯️' },
  { id: 'equinox', pattern: /equinox/, emoji: '☀️' },
  {
    id: 'work_profession',
    pattern:
      /administrative professionals|bank employee|commerce day|journalist(?:'s|s')? day|seamen(?:'s|s')? day/,
    emoji: '💼',
  },
  { id: 'tax_day', pattern: /tax day/, emoji: '💰' },
  { id: 'older_people', pattern: /aged day|grandparents|granny/, emoji: '👵' },
  { id: 'coming_of_age', pattern: /coming of age/, emoji: '🧑' },
  { id: 'citizenship', pattern: /citizenship day/, emoji: '🪪' },
  { id: 'census', pattern: /census/, emoji: '📊' },
  { id: 'april_fools', pattern: /april fools/, emoji: '🤡' },
  { id: 'bridge_holiday', pattern: /bridge holiday|feiertagsbrucke/, emoji: '🌉' },
  {
    id: 'government_ceremony',
    pattern: /investiture|inauguration|change of .*government/,
    emoji: '🏛️',
  },
  { id: 'commonwealth', pattern: /commonwealth day/, emoji: '🤝' },
  { id: 'day_of_the_race', pattern: /day of (?:the )?race/, emoji: '🌎' },
  { id: 'black_awareness', pattern: /black awareness/, emoji: '✊🏿' },
  { id: 'awareness', pattern: /awareness day/, emoji: '👁️' },
  { id: 'national_police', pattern: /national police day/, emoji: '👮' },
  { id: 'national_anthem', pattern: /national anthem day/, emoji: '🎵' },
  { id: 'media_day', pattern: /radio and television day/, emoji: '📺' },
  { id: 'wine_day', pattern: /wine day/, emoji: '🍷' },
  { id: 'walpurgis', pattern: /walpurgis/, emoji: '🔥' },
  { id: 'parliament', pattern: /tynwald day/, emoji: '🏛️' },
  { id: 'custom_chiefs', pattern: /custom chiefs'? day/, emoji: '🏛️' },
  { id: 'saint_olav', pattern: /olsok|st\.?olav/, emoji: '🙏' },
  { id: 'childrens_rights', pattern: /protection of children rights/, emoji: '🧒' },
  { id: 'pupils_day', pattern: /pupil's day/, emoji: '🎓' },
  { id: 'presidency', pattern: /president/, emoji: '🏛️' },
  { id: 'ancestry', pattern: /ancestry day/, emoji: '🧬' },
  { id: 'summer_recess', pattern: /summer recess|summer holiday/, emoji: '🏖️' },
  { id: 'first_day_spring', pattern: /first day of spring/, emoji: '🌱' },
  { id: 'first_day_summer', pattern: /first day of summer/, emoji: '☀️' },
  { id: 'first_day_winter', pattern: /first day of winter/, emoji: '❄️' },
  { id: 'sweet_food_day', pattern: /cream bun day|fat thursday/, emoji: '🍩' },
  { id: 'husbands_day', pattern: /husband/, emoji: '💙' },
  {
    id: 'jewish_tradition',
    pattern:
      /aliyah|fast of|lag baomer|jerusalem day|tisha b'av|tenth of tevet|seventeenth of tamuz|tu b'av/,
    emoji: '✡️',
  },
  { id: 'indentured_labour', pattern: /indentured labou?r/, emoji: '⛓️‍💥' },
  { id: 'peaceful_union', pattern: /union dissolution/, emoji: '🤝' },
  { id: 'saint', pattern: /\bsaints?\b|\bst\.?\s|\barchbishop\b/, emoji: '🙏' },
  {
    id: 'religious_festival',
    pattern: /religious festival|gospel day|church day|feast of/,
    emoji: '🙏',
  },
  { id: 'festival', pattern: /festival|culturama|carnival week|reed dance/, emoji: '🎊' },
]);

/* ===========================================================
   RESOLUÇÃO DETALHADA

   A forma detalhada é usada pela auditoria para comparar países
   e distinguir um conceito conhecido do último recurso genérico.
=========================================================== */

export function resolveInternationalHolidayEmojiDetails({
  country,
  date,
  canonicalName,
  type,
  substitute,
}) {
  if (substitute || type === 'substitute') {
    return {
      concept: 'substitute',
      emoji: DEFAULT_HOLIDAY_EMOJI_BY_TYPE.substitute,
      generic: true,
    };
  }

  const normalizedName = normalizeHolidayName(canonicalName);

  const specialConcepts = [
    /* O feriado húngaro de Santo Estêvão ocorre em agosto e
       celebra a fundação do Estado; ele não é o feriado de
       26 de dezembro chamado assim em outros países. */
    ...(String(country).toUpperCase() === 'HU'
      ? [
          {
            id: 'national_day',
            pattern: /saint stephen's day/,
            emoji: countryCodeToFlag(country),
          },
        ]
      : []),
    { id: 'lunar_new_year', pattern: /chinese new year|lunar new year/, emoji: '🐉' },
    {
      id: 'nauryz',
      pattern: /nauryz|nowruz|navruz|sultan nevruz|sizdah bedar|sham el nessim/,
      emoji: '🌱',
    },
    { id: 'matariki', pattern: /matariki/, emoji: '✨' },
    {
      id: 'sports',
      pattern: /sports day|world football champions|national football team/,
      emoji: '🏆',
    },
    {
      id: 'national_day',
      pattern: /^[a-z][a-z .'-]+ national day(?:\b| -)/,
      emoji: countryCodeToFlag(country),
    },
    { id: 'national_day', pattern: /saint helena day/, emoji: countryCodeToFlag(country) },
    { id: 'military_remembrance', pattern: /st\.? george's caye day/, emoji: '🎖️' },
  ];
  const specialConcept = specialConcepts.find(({ pattern }) => pattern.test(normalizedName));

  if (specialConcept) {
    return { concept: specialConcept.id, emoji: specialConcept.emoji, generic: false };
  }

  if (/new year/.test(normalizedName)) {
    return {
      concept: 'new_year',
      emoji: String(date).endsWith('-01-01') ? '💥' : '🎆',
      generic: false,
    };
  }

  if (
    /canada day|australia day|portugal day|waitangi day|national sovereignty/.test(normalizedName)
  ) {
    return { concept: 'national_day', emoji: countryCodeToFlag(country), generic: false };
  }

  if (/bastille day/.test(normalizedName)) {
    return { concept: 'national_day', emoji: '🇫🇷', generic: false };
  }

  const semanticConcept = HOLIDAY_EMOJI_CONCEPTS.find(({ pattern }) =>
    pattern.test(normalizedName),
  );

  if (semanticConcept) {
    return {
      concept: semanticConcept.id,
      emoji: semanticConcept.emoji || countryCodeToFlag(country),
      generic: false,
    };
  }

  const fallbackEmoji =
    type === 'public'
      ? countryCodeToFlag(country)
      : DEFAULT_HOLIDAY_EMOJI_BY_TYPE[type] || DEFAULT_HOLIDAY_EMOJI_BY_TYPE.observance;

  return {
    concept: `generic_${type || 'observance'}`,
    emoji: fallbackEmoji,
    generic: true,
  };
}

/* ===========================================================
   ESCOLHA DO EMOJI INTERNACIONAL
=========================================================== */

export function resolveInternationalHolidayEmoji(options) {
  return resolveInternationalHolidayEmojiDetails(options).emoji;
}
