/* ===========================================================
   CONTEÚDO EDUCACIONAL NATIVO

   O catálogo fica isolado para que a antiga página incorporada
   possa ser retirada sem misturar suas traduções ao aplicativo.
   Todos os idiomas recebem a mesma estrutura e conteúdo visual
   próprio. A auditoria impede que um catálogo volte silenciosamente
   a exibir o texto editorial em inglês.
=========================================================== */

import { localizedEditorialMessages } from './educationEditorialTranslations.js';
import { educationHistoryReferenceTranslations } from './educationHistoryReferenceTranslations.js';
import { educationFeedbackTranslations } from './educationFeedbackTranslations.js';
import { educationReferenceCopyTranslations } from './educationReferenceCopyTranslations.js';
import { educationMoonMethodologyTranslations } from './educationMoonMethodologyTranslations.js';
import { localizedToolMessages } from './educationToolsTranslations.js';

const english = {
  browserTitle: '13 Calendar — How the 13-month calendar works',
  toolbarTitle: 'How the 13-month calendar works',
  hero: {
    eyebrow: 'Explore the idea',
    title: 'A year that fits on one page',
    description:
      'Understand the International Fixed Calendar, compare dates and see where history, astronomy and our project choices differ.',
    todayTitle: 'Today in two calendars',
    gregorian: 'Gregorian',
    fixed: 'International Fixed Calendar',
    openCalendars: 'Open the calendars',
  },
  idea: {
    eyebrow: 'The structure',
    title: 'The whole idea in 30 seconds',
    description:
      'Thirteen equal months of 28 days make 364 regular days. Year Day, and Leap Day when needed, sit outside the months and the civil week.',
    facts: [
      {
        title: '13 equal months',
        text: 'Every regular month has exactly four weeks and the same layout.',
      },
      {
        title: 'A month called Solaris',
        text: 'Solaris is inserted between June and July without renaming the other months.',
      },
      {
        title: 'Year Day',
        text: 'The 365th day comes after December 28 and belongs to no month or civil weekday.',
      },
      {
        title: 'Leap Day',
        text: 'In leap years, the 366th day comes immediately after Year Day in this project’s convention.',
      },
    ],
    monthTitle: 'One reusable month',
    monthDescription: 'The first is always the first weekday; the 28th is always the last.',
    yearTitle: 'The complete civil year',
    regularDays: '364 regular days',
    specialDays: '1 or 2 Special Days',
  },
  converter: {
    eyebrow: 'Interactive converter',
    title: 'Try any date',
    description: 'Both directions use the same calculation engine as the main calendars.',
    gregorianToFixed: 'Gregorian → IFC',
    fixedToGregorian: 'IFC → Gregorian',
    gregorianDate: 'Gregorian date',
    fixedDate: 'IFC date',
    year: 'Year',
    month: 'Month',
    day: 'Day',
    ordinary: 'Regular day',
    yearDay: 'Year Day',
    leapDay: 'Leap Day',
    invalid: 'Choose a valid date.',
    position: 'Month {month} of 13 · Week {week} of 4',
    sharedEngine: 'Shared calculation engine',
    fact: 'In regular IFC dates, the same month and day always return to the same civil weekday.',
  },
  moon: {
    eyebrow: 'The Moon without myths',
    title: 'The Moon does not fit inside a 28-day month',
    intro:
      'The calendar divides the solar year into equal blocks. The Moon keeps its own average 29.53-day phase cycle, so the phases drift through the fixed months.',
    fixedMonth: 'Fixed month',
    synodicCycle: 'Average lunar phase cycle',
    phaseInterval: 'Average interval between main phases',
    days: '{value} days',
    driftTitle: 'About 1.53 days of drift per month',
    driftText:
      'If a New Moon happened on month 1, day 1, the next one would arrive around month 2, day 2.53 — and the difference would keep accumulating.',
    liveTitle: 'Full Moons in {year}',
    liveText:
      'These positions are calculated now with Astronomy Engine and converted by the project’s shared IFC engine.',
    phasePosition: '{gregorian} · {fixed}',
    specialPosition: '{gregorian} · {specialDay}',
    exactTitle: 'An exact instant, shown in your time zone',
    exactText:
      'A named phase is an astronomical instant. Its visible appearance changes gradually over several nights and its local date can differ by time zone.',
    claimsTitle: 'Astronomy is not a health protocol',
    claimsText:
      'The project does not claim that lunar phases detoxify the body, control hormones, treat parasites or impose a universal menstrual cycle. Cultural traditions may be described only when clearly separated from scientific evidence.',
    methodology: 'Read the scientific and editorial policy',
    noFullMoons: 'No Full Moon was found for this year.',
  },
  history: {
    eyebrow: 'History and adoption',
    title: 'A practical proposal, not a hidden ancient calendar',
    description:
      'The fixed calendar was developed as a modern civil reform. Its advantages were real, but coordination and religious objections were also real.',
    events: [
      {
        year: '1902',
        title: 'Cotsworth publishes the proposal',
        text: 'Moses B. Cotsworth presents a 13-month plan with equal months.',
      },
      {
        year: '1923',
        title: 'Calendar reform gains an organization',
        text: 'George Eastman supports the International Fixed Calendar League.',
      },
      {
        year: '1928–1989',
        title: 'Kodak uses it internally',
        text: 'Kodak kept the system for accounting and planning while using Gregorian dates externally.',
      },
      {
        year: '1937',
        title: 'International reform loses momentum',
        text: 'Religious objections to days outside the weekly cycle were a central obstacle.',
      },
    ],
  },
  sabbath: {
    title: 'What about the uninterrupted seven-day cycle?',
    intro:
      'Year Day and Leap Day outside the civil week make every regular date predictable, but they conflict with traditions that count every seventh sunrise without interruption.',
    civilTitle: 'Fixed civil weekdays',
    civilText:
      'Keep the special days outside the civil week. Monthly dates remain permanently aligned.',
    continuousTitle: 'Continuous seven-day count',
    continuousText:
      'Give every elapsed day a weekday position. Religious and civil counting stay aligned, but monthly weekdays shift after a Special Day.',
    conclusion:
      'This is a genuine social choice, not a problem that mathematics can settle for everyone.',
  },
  feedback: {
    title: 'What do you think of this idea?',
    question: 'Would you switch to a 13-month calendar?',
    options: ['Love it', 'Good', 'Not convinced', 'Strongly against'],
    results: 'Results',
    voteCount: '{count} vote | {count} votes',
    success: 'Your vote was saved. You can change it at any time.',
    unavailable: 'Voting is not configured in this publication.',
    loadError: 'The current totals could not be loaded. Check your connection and try again.',
    saveError: 'Your vote could not be saved. The previous choice was restored; please try again.',
    selected: 'Your choice',
  },
  sources: {
    eyebrow: 'Methodology',
    title: 'Sources before certainty',
    description:
      'Conversions are tested locally, Moon phases come from Astronomy Engine and the educational claims link to primary or authoritative sources.',
    nasa: 'NASA Moon phases',
    calendarPolicy: 'Calendar convention',
    productRoadmap: 'Product and lunar policy',
  },
  resources: {
    eyebrow: 'News and the wider web',
    title: 'What others publish about 13-month calendars',
    description:
      'A curated map of reporting, historical coverage, reference pages and independent projects. Links go to the original publisher; Google is used only to discover new items.',
    news: 'Articles and reporting',
    sites: 'Projects and websites',
    open: 'Open original source',
    searchGoogle: 'Search the topic on Google',
    searchNews: 'Search recent coverage on Google News',
    updated: 'List reviewed on {date}',
    notice:
      'Being listed is not an endorsement. Commercial offers, opinions and scientific claims remain the responsibility of each publisher.',
    types: {
      reporting: 'Reporting',
      discussion: 'Community discussion',
      historical: 'Historical coverage',
      explainer: 'Explainer',
      project: 'Independent project',
      reference: 'Reference',
      commercial: 'Commercial project',
    },
  },
  cta: {
    title: 'Now compare a date yourself',
    description: 'Open the full calendars or see the voluntary, privacy-preserving community.',
    calendars: 'Open calendars',
    community: 'See the community',
  },
  tools: {
    browserTitle: '13 Calendar — Free calendar tools',
    toolbarTitle: 'Free calendar tools',
    hero: {
      eyebrow: 'Use the idea',
      title: 'Turn calendar theory into something useful',
      description:
        'Create a date card, compare a birthday, plan a whole year, export events and explore astronomical layers without an account or payment.',
      start: 'Open the tools',
      map: 'Tool shortcuts',
    },
    share: {
      eyebrow: 'Shareable date',
      title: 'Today in two calendars',
      description: 'Download a private image generated in your browser or share the current link.',
      date: 'Date on the card',
      download: 'Download image',
      native: 'Share',
      copy: 'Copy link',
      copied: 'Link copied.',
      downloaded: 'Image downloaded.',
      shared: 'Sharing opened.',
      unavailable: 'Sharing is not available here; the link was copied instead.',
      cardTitle: 'Today in two calendars',
      cardFooter: 'Free, independent and privacy-friendly',
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      x: 'X/Twitter',
      telegram: 'Telegram',
      networks: 'Share on social networks',
    },
    birthday: {
      eyebrow: 'Birthday converter',
      title: 'When is your birthday in the 13-month calendar?',
      description:
        'Choose the celebration year first, then the birthday day and month. The calendar will show the weekdays for that year, and the calculation stays in your browser.',
      original: 'Birthday day and month',
      celebrationYear: 'Celebration year',
      gregorian: 'Gregorian birthday',
      fixed: 'IFC birthday',
      weekdayFact: 'Regular IFC birthdays always return to the same IFC weekday.',
      invalidLeap: 'February 29 does not exist in the selected Gregorian year.',
      cardTitle: 'My birthday in the 13-month calendar',
      chooseDate: 'Choose your birth date.',
      download: 'Download birthday card',
      copy: 'Copy birthday link',
      copied: 'Birthday link copied.',
      downloaded: 'Birthday card downloaded.',
    },
    planner: {
      eyebrow: 'Annual planner',
      title: 'Compare the complete year',
      description:
        'Each IFC month is mapped to its Gregorian start and end. Export the month starts or print this planner as a PDF.',
      year: 'Planner year',
      fixedMonth: 'IFC month',
      gregorianRange: 'Gregorian range',
      weekday: 'Fixed weekday',
      specialDays: 'Special Days',
      exportIcs: 'Export ICS',
      printPdf: 'Print / save PDF',
      exported: 'Calendar file downloaded.',
      yearDay: 'Year Day',
      leapDay: 'Leap Day',
    },
    astronomy: {
      eyebrow: 'Astronomical layers',
      title: 'The solar year around the calendar',
      description:
        'Equinoxes, solstices, perihelion and aphelion are calculated for the selected year. Sunrise and sunset are optional and require a location.',
      year: 'Astronomy year',
      localTime: 'Times shown in your time zone',
      marchEquinox: 'March equinox',
      juneSolstice: 'June solstice',
      septemberEquinox: 'September equinox',
      decemberSolstice: 'December solstice',
      perihelion: 'Perihelion',
      aphelion: 'Aphelion',
      distance: '{value} million km',
      locationTitle: 'Sunrise and sunset',
      locationText:
        'Coordinates are used only in this browser for the selected date and are never sent to our server.',
      useLocation: 'Use my location',
      latitude: 'Latitude',
      longitude: 'Longitude',
      date: 'Date',
      sunrise: 'Sunrise',
      sunset: 'Sunset',
      locationDenied: 'Location was not available. Enter latitude and longitude manually.',
      invalidCoordinates: 'Enter a valid latitude from −90 to 90 and longitude from −180 to 180.',
      noSunEvent: 'No event on this date',
    },
    favorites: {
      eyebrow: 'Local favorites',
      title: 'Keep important dates on this device',
      description:
        'Favorites stay only in this browser. No account, email or server storage is used.',
      label: 'Optional label',
      date: 'Gregorian date',
      add: 'Save favorite',
      remove: 'Remove',
      empty: 'No favorite dates saved yet.',
      saved: 'Favorite saved on this device.',
      duplicate: 'This date is already saved.',
    },
    widget: {
      eyebrow: 'Free widget',
      title: 'Show today’s IFC date on another site',
      description:
        'Copy the iframe code. The compact view has no tracking of its own and always credits the source.',
      copy: 'Copy embed code',
      copied: 'Embed code copied.',
      preview: 'Widget preview',
      credit: 'Open 13 Calendar',
      theme: 'Widget theme',
      auto: 'Automatic',
      light: 'Light',
      dark: 'Dark',
      embedCode: 'Iframe code',
    },
    pwa: {
      eyebrow: 'Offline access',
      title: 'Install and use the last opened pages offline',
      description:
        'The app stores its interface on your device. Live news and community totals still need an internet connection.',
      install: 'Install app',
      instructions: 'See installation steps',
      ready: 'Installation is available in your browser menu.',
      available: 'The app is ready to install.',
      installed: 'The app is already installed.',
      privacy: 'Saved pages remain on this device and can be removed with browser data.',
      helpTitle: 'Install 13 Calendar',
      guides: {
        iosSafari: 'In Safari: Share > Add to Home Screen > Open as Web App > Add.',
        iosOther:
          'On iPhone or iPad, open this page in Safari, then use Share > Add to Home Screen > Add.',
        androidFirefox: 'In Firefox: menu ⋮ > Install. If unavailable, use Add to Home screen.',
        androidChromium: 'Open menu ⋮, choose Install app or Add to Home screen, and confirm.',
        desktop:
          'Choose Install 13 Calendar in the browser menu. On Safari for Mac: File > Add to Dock.',
      },
      close: 'Close',
      update: 'A newer version is ready.',
      refresh: 'Update now',
    },
    editorial: {
      eyebrow: 'Editorial cards',
      title: 'Useful facts, ready to share',
      description:
        'Download square cards with the scientific and historical context behind the project.',
      moonEyebrow: 'Astronomy',
      moonTitle: 'A 28-day month is not a lunar cycle',
      moonText:
        'The average cycle from one New Moon to the next lasts 29.53 days, so phases drift through fixed months.',
      kodakEyebrow: 'History',
      kodakTitle: 'Kodak used a fixed calendar for 61 years',
      kodakText:
        'From 1928 to 1989, Kodak used the system internally for accounting and planning while keeping Gregorian dates outside.',
      download: 'Download card',
      downloaded: 'Editorial card downloaded.',
      previousCard: 'Previous card',
      nextCard: 'Next card',
    },
    cta: {
      title: 'Free tools, without an account',
      description:
        'Everything here runs in your browser. Return to the full calendars or see the voluntary community.',
    },
  },
};

const portuguese = {
  browserTitle: '13 Calendar — Como funciona o calendário de 13 meses',
  toolbarTitle: 'Como funciona o calendário de 13 meses',
  hero: {
    eyebrow: 'Explore a ideia',
    title: 'Um ano que cabe em uma página',
    description:
      'Entenda o Calendário Fixo Internacional, compare datas e veja onde história, astronomia e escolhas do nosso projeto são diferentes.',
    todayTitle: 'Hoje em dois calendários',
    gregorian: 'Gregoriano',
    fixed: 'Calendário Fixo Internacional',
    openCalendars: 'Abrir os calendários',
  },
  idea: {
    eyebrow: 'A estrutura',
    title: 'A ideia toda em 30 segundos',
    description:
      'Treze meses iguais de 28 dias formam 364 dias regulares. O Dia do Ano e, quando necessário, o Dia Bissexto ficam fora dos meses e da semana civil.',
    facts: [
      {
        title: '13 meses iguais',
        text: 'Todo mês regular tem exatamente quatro semanas e a mesma disposição.',
      },
      {
        title: 'Um mês chamado Solaris',
        text: 'Solaris entra entre junho e julho sem renomear os demais meses.',
      },
      {
        title: 'Dia do Ano',
        text: 'O 365º dia vem depois de 28 de dezembro e não pertence a mês nem dia da semana civil.',
      },
      {
        title: 'Dia Bissexto',
        text: 'Nos anos bissextos, o 366º dia vem logo após o Dia do Ano na convenção deste projeto.',
      },
    ],
    monthTitle: 'Um único mês reutilizável',
    monthDescription: 'O dia 1 sempre ocupa o primeiro dia da semana; o 28, o último.',
    yearTitle: 'O ano civil completo',
    regularDays: '364 dias regulares',
    specialDays: '1 ou 2 Dias Especiais',
  },
  converter: {
    eyebrow: 'Conversor interativo',
    title: 'Experimente qualquer data',
    description: 'As duas direções usam o mesmo motor de cálculo dos calendários principais.',
    gregorianToFixed: 'Gregoriano → IFC',
    fixedToGregorian: 'IFC → Gregoriano',
    gregorianDate: 'Data gregoriana',
    fixedDate: 'Data IFC',
    year: 'Ano',
    month: 'Mês',
    day: 'Dia',
    ordinary: 'Dia regular',
    yearDay: 'Dia do Ano',
    leapDay: 'Dia Bissexto',
    invalid: 'Escolha uma data válida.',
    position: 'Mês {month} de 13 · Semana {week} de 4',
    sharedEngine: 'Motor de cálculo compartilhado',
    fact: 'Nas datas regulares do IFC, o mesmo mês e dia sempre voltam ao mesmo dia da semana civil.',
  },
  moon: {
    eyebrow: 'A Lua sem mitos',
    title: 'A Lua não cabe em um mês de 28 dias',
    intro:
      'O calendário divide o ano solar em blocos iguais. A Lua mantém seu próprio ciclo médio de fases de 29,53 dias; por isso as fases atravessam os meses fixos.',
    fixedMonth: 'Mês fixo',
    synodicCycle: 'Ciclo lunar médio de fases',
    phaseInterval: 'Intervalo médio entre fases principais',
    days: '{value} dias',
    driftTitle: 'Cerca de 1,53 dia de deslocamento por mês',
    driftText:
      'Se uma Lua Nova ocorresse no mês 1, dia 1, a seguinte chegaria perto do mês 2, dia 2,53 — e a diferença continuaria acumulando.',
    liveTitle: 'Luas Cheias em {year}',
    liveText:
      'Estas posições são calculadas agora pelo Astronomy Engine e convertidas pelo motor IFC compartilhado do projeto.',
    phasePosition: '{gregorian} · {fixed}',
    specialPosition: '{gregorian} · {specialDay}',
    exactTitle: 'Um instante exato, exibido no seu fuso',
    exactText:
      'Uma fase nomeada é um instante astronômico. Sua aparência muda gradualmente por várias noites e a data local pode variar conforme o fuso.',
    claimsTitle: 'Astronomia não é protocolo de saúde',
    claimsText:
      'O projeto não afirma que as fases da Lua desintoxicam o corpo, controlam hormônios, tratam parasitas ou impõem um ciclo menstrual universal. Tradições culturais só podem ser descritas quando claramente separadas da evidência científica.',
    methodology: 'Ler a política científica e editorial',
    noFullMoons: 'Nenhuma Lua Cheia foi encontrada neste ano.',
  },
  history: {
    eyebrow: 'História e adoção',
    title: 'Uma proposta prática, não um calendário antigo escondido',
    description:
      'O calendário fixo foi desenvolvido como uma reforma civil moderna. Suas vantagens eram reais, mas a coordenação e as objeções religiosas também eram.',
    events: [
      {
        year: '1902',
        title: 'Cotsworth publica a proposta',
        text: 'Moses B. Cotsworth apresenta um plano de 13 meses iguais.',
      },
      {
        year: '1923',
        title: 'A reforma ganha uma organização',
        text: 'George Eastman apoia a Liga do Calendário Fixo Internacional.',
      },
      {
        year: '1928–1989',
        title: 'A Kodak usa internamente',
        text: 'A Kodak manteve o sistema em contabilidade e planejamento, usando datas gregorianas externamente.',
      },
      {
        year: '1937',
        title: 'A reforma internacional perde impulso',
        text: 'Objeções religiosas aos dias fora do ciclo semanal foram um obstáculo central.',
      },
    ],
  },
  sabbath: {
    title: 'E o ciclo ininterrupto de sete dias?',
    intro:
      'O Dia do Ano e o Dia Bissexto fora da semana civil tornam as datas regulares previsíveis, mas entram em conflito com tradições que contam cada sétimo nascer do Sol sem interrupção.',
    civilTitle: 'Dias da semana civil fixos',
    civilText:
      'Manter os Dias Especiais fora da semana civil. As datas mensais permanecem alinhadas para sempre.',
    continuousTitle: 'Contagem contínua de sete dias',
    continuousText:
      'Dar uma posição semanal a todo dia transcorrido. As contagens religiosa e civil ficam alinhadas, mas os dias da semana dos meses mudam após um Dia Especial.',
    conclusion:
      'Esta é uma escolha social verdadeira, não um problema que a matemática possa resolver para todos.',
  },
  feedback: {
    title: 'O que você acha dessa ideia?',
    question: 'Você mudaria para um calendário de 13 meses?',
    options: ['Adorei', 'Gostei', 'Não me convenceu', 'Sou totalmente contra'],
    results: 'Resultados',
    voteCount: '{count} voto | {count} votos',
    success: 'Seu voto foi salvo. Você pode mudá-lo a qualquer momento.',
    unavailable: 'A votação não está configurada nesta publicação.',
    loadError: 'Não foi possível carregar os totais atuais. Confira a conexão e tente novamente.',
    saveError:
      'Não foi possível salvar seu voto. A escolha anterior foi restaurada; tente novamente.',
    selected: 'Sua escolha',
  },
  sources: {
    eyebrow: 'Metodologia',
    title: 'Fontes antes da certeza',
    description:
      'As conversões são testadas localmente, as fases da Lua vêm do Astronomy Engine e as afirmações educativas apontam para fontes primárias ou oficiais.',
    nasa: 'Fases da Lua — NASA',
    calendarPolicy: 'Convenção do calendário',
    productRoadmap: 'Roteiro de produto e política lunar',
  },
  resources: {
    eyebrow: 'Notícias e outros sites',
    title: 'O que outras pessoas publicam sobre calendários de 13 meses',
    description:
      'Um mapa editorial de reportagens, cobertura histórica, páginas de referência e projetos independentes. Os links levam à publicação original; o Google serve apenas para descobrir novos itens.',
    news: 'Notícias e reportagens',
    sites: 'Projetos e sites',
    open: 'Abrir fonte original',
    searchGoogle: 'Pesquisar o tema no Google',
    searchNews: 'Pesquisar cobertura recente no Google Notícias',
    updated: 'Lista revisada em {date}',
    notice:
      'A presença na lista não representa endosso. Ofertas comerciais, opiniões e alegações científicas continuam sob responsabilidade de cada publicação.',
    types: {
      reporting: 'Reportagem',
      discussion: 'Discussão comunitária',
      historical: 'Cobertura histórica',
      explainer: 'Explicação',
      project: 'Projeto independente',
      reference: 'Referência',
      commercial: 'Projeto comercial',
    },
  },
  cta: {
    title: 'Agora compare uma data você mesmo',
    description:
      'Abra os calendários completos ou conheça a comunidade voluntária e respeitosa à privacidade.',
    calendars: 'Abrir calendários',
    community: 'Ver a comunidade',
  },
  tools: {
    browserTitle: '13 Calendar — Ferramentas gratuitas de calendário',
    toolbarTitle: 'Ferramentas gratuitas',
    hero: {
      eyebrow: 'Use a ideia',
      title: 'Transforme a teoria do calendário em algo útil',
      description:
        'Crie um cartão de data, compare um aniversário, planeje o ano inteiro, exporte eventos e explore camadas astronômicas sem conta nem pagamento.',
      start: 'Abrir as ferramentas',
      map: 'Atalhos das ferramentas',
    },
    share: {
      eyebrow: 'Data compartilhável',
      title: 'Hoje em dois calendários',
      description: 'Baixe uma imagem privada gerada no seu navegador ou compartilhe o link atual.',
      date: 'Data do cartão',
      download: 'Baixar imagem',
      native: 'Compartilhar',
      copy: 'Copiar link',
      copied: 'Link copiado.',
      downloaded: 'Imagem baixada.',
      shared: 'Compartilhamento aberto.',
      unavailable: 'O compartilhamento não está disponível aqui; o link foi copiado.',
      cardTitle: 'Hoje em dois calendários',
      cardFooter: 'Gratuito, independente e respeitoso à privacidade',
      whatsapp: 'WhatsApp',
      facebook: 'Facebook',
      x: 'X/Twitter',
      telegram: 'Telegram',
      networks: 'Compartilhar nas redes sociais',
    },
    birthday: {
      eyebrow: 'Conversor de aniversário',
      title: 'Quando é seu aniversário no calendário de 13 meses?',
      description:
        'Escolha primeiro o ano da comemoração e depois o dia e o mês do aniversário. O calendário mostrará os dias da semana daquele ano, e o cálculo permanece no seu navegador.',
      original: 'Dia e mês do aniversário',
      celebrationYear: 'Ano da comemoração',
      gregorian: 'Aniversário gregoriano',
      fixed: 'Aniversário IFC',
      weekdayFact: 'Aniversários IFC regulares sempre voltam ao mesmo dia da semana no IFC.',
      invalidLeap: '29 de fevereiro não existe no ano gregoriano selecionado.',
      cardTitle: 'Meu aniversário no calendário de 13 meses',
      chooseDate: 'Escolha sua data de nascimento.',
      download: 'Baixar cartão de aniversário',
      copy: 'Copiar link do aniversário',
      copied: 'Link do aniversário copiado.',
      downloaded: 'Cartão de aniversário baixado.',
    },
    planner: {
      eyebrow: 'Planejador anual',
      title: 'Compare o ano completo',
      description:
        'Cada mês IFC é associado ao início e ao fim gregoriano. Exporte os inícios dos meses ou imprima este planejador como PDF.',
      year: 'Ano do planejador',
      fixedMonth: 'Mês IFC',
      gregorianRange: 'Intervalo gregoriano',
      weekday: 'Dia da semana fixo',
      specialDays: 'Dias Especiais',
      exportIcs: 'Exportar ICS',
      printPdf: 'Imprimir / salvar PDF',
      exported: 'Arquivo de calendário baixado.',
      yearDay: 'Dia do Ano',
      leapDay: 'Dia Bissexto',
    },
    astronomy: {
      eyebrow: 'Camadas astronômicas',
      title: 'O ano solar ao redor do calendário',
      description:
        'Equinócios, solstícios, periélio e afélio são calculados para o ano escolhido. Nascer e pôr do Sol são opcionais e exigem uma localização.',
      year: 'Ano da astronomia',
      localTime: 'Horários exibidos no seu fuso',
      marchEquinox: 'Equinócio de março',
      juneSolstice: 'Solstício de junho',
      septemberEquinox: 'Equinócio de setembro',
      decemberSolstice: 'Solstício de dezembro',
      perihelion: 'Periélio',
      aphelion: 'Afélio',
      distance: '{value} milhões de km',
      locationTitle: 'Nascer e pôr do Sol',
      locationText:
        'As coordenadas são usadas somente neste navegador para a data escolhida e nunca são enviadas ao nosso servidor.',
      useLocation: 'Usar minha localização',
      latitude: 'Latitude',
      longitude: 'Longitude',
      date: 'Data',
      sunrise: 'Nascer do Sol',
      sunset: 'Pôr do Sol',
      locationDenied:
        'A localização não ficou disponível. Digite latitude e longitude manualmente.',
      invalidCoordinates: 'Digite latitude válida entre −90 e 90 e longitude entre −180 e 180.',
      noSunEvent: 'Nenhum evento nesta data',
    },
    favorites: {
      eyebrow: 'Favoritos locais',
      title: 'Guarde datas importantes neste dispositivo',
      description:
        'Os favoritos ficam somente neste navegador. Não usamos conta, e-mail nem armazenamento no servidor.',
      label: 'Rótulo opcional',
      date: 'Data gregoriana',
      add: 'Salvar favorito',
      remove: 'Remover',
      empty: 'Nenhuma data favorita foi salva ainda.',
      saved: 'Favorito salvo neste dispositivo.',
      duplicate: 'Esta data já está salva.',
    },
    widget: {
      eyebrow: 'Widget gratuito',
      title: 'Mostre a data IFC de hoje em outro site',
      description:
        'Copie o código do iframe. A visualização compacta não possui rastreamento próprio e sempre credita a fonte.',
      copy: 'Copiar código de incorporação',
      copied: 'Código de incorporação copiado.',
      preview: 'Prévia do widget',
      credit: 'Abrir o 13 Calendar',
      theme: 'Tema do widget',
      auto: 'Automático',
      light: 'Claro',
      dark: 'Escuro',
      embedCode: 'Código do iframe',
    },
    pwa: {
      eyebrow: 'Acesso offline',
      title: 'Instale e use offline as últimas páginas abertas',
      description:
        'O aplicativo guarda a interface no dispositivo. Notícias ao vivo e totais da comunidade ainda exigem internet.',
      install: 'Instalar aplicativo',
      instructions: 'Ver como instalar',
      ready: 'A instalação está disponível no menu do navegador.',
      available: 'O aplicativo está pronto para instalar.',
      installed: 'O aplicativo já está instalado.',
      privacy:
        'As páginas salvas ficam neste dispositivo e podem ser removidas com os dados do navegador.',
      helpTitle: 'Instale o 13 Calendar',
      guides: {
        iosSafari:
          'No Safari: Compartilhar > Adicionar à Tela de Início > Abrir como App da Web > Adicionar.',
        iosOther:
          'No iPhone ou iPad, abra esta página no Safari e use Compartilhar > Adicionar à Tela de Início > Adicionar.',
        androidFirefox:
          'No Firefox: menu ⋮ > Instalar. Se não aparecer, use Adicionar à tela inicial.',
        androidChromium:
          'Abra o menu ⋮, escolha Instalar aplicativo ou Adicionar à tela inicial e confirme.',
        desktop:
          'Escolha Instalar 13 Calendar no menu do navegador. No Safari do Mac: Arquivo > Adicionar ao Dock.',
      },
      close: 'Fechar',
      update: 'Uma versão mais nova está pronta.',
      refresh: 'Atualizar agora',
    },
    editorial: {
      eyebrow: 'Cartões editoriais',
      title: 'Informações úteis, prontas para compartilhar',
      description:
        'Baixe cartões quadrados com o contexto científico e histórico por trás do projeto.',
      moonEyebrow: 'Astronomia',
      moonTitle: 'Um mês de 28 dias não é um ciclo lunar',
      moonText:
        'O ciclo médio entre uma Lua Nova e a seguinte dura 29,53 dias; por isso as fases atravessam os meses fixos.',
      kodakEyebrow: 'História',
      kodakTitle: 'A Kodak usou um calendário fixo por 61 anos',
      kodakText:
        'De 1928 a 1989, a Kodak usou o sistema internamente na contabilidade e no planejamento, mantendo datas gregorianas externamente.',
      download: 'Baixar cartão',
      downloaded: 'Cartão editorial baixado.',
      previousCard: 'Cartão anterior',
      nextCard: 'Próximo cartão',
    },
    cta: {
      title: 'Ferramentas gratuitas, sem conta',
      description:
        'Tudo aqui funciona no seu navegador. Volte aos calendários completos ou conheça a comunidade voluntária.',
    },
  },
};

function mergeSection(base = {}, override = {}) {
  return { ...base, ...override };
}

function createLocale(override = {}) {
  return {
    ...english,
    ...override,
    hero: mergeSection(english.hero, override.hero),
    idea: mergeSection(english.idea, override.idea),
    converter: mergeSection(english.converter, override.converter),
    moon: mergeSection(english.moon, override.moon),
    history: mergeSection(english.history, override.history),
    sabbath: mergeSection(english.sabbath, override.sabbath),
    feedback: mergeSection(english.feedback, override.feedback),
    sources: mergeSection(english.sources, override.sources),
    resources: {
      ...english.resources,
      ...override.resources,
      types: mergeSection(english.resources.types, override.resources?.types),
    },
    cta: mergeSection(english.cta, override.cta),
    tools: {
      ...english.tools,
      ...override.tools,
      hero: mergeSection(english.tools.hero, override.tools?.hero),
      share: mergeSection(english.tools.share, override.tools?.share),
      birthday: mergeSection(english.tools.birthday, override.tools?.birthday),
      planner: mergeSection(english.tools.planner, override.tools?.planner),
      astronomy: mergeSection(english.tools.astronomy, override.tools?.astronomy),
      favorites: mergeSection(english.tools.favorites, override.tools?.favorites),
      widget: mergeSection(english.tools.widget, override.tools?.widget),
      pwa: mergeSection(english.tools.pwa, override.tools?.pwa),
      editorial: mergeSection(english.tools.editorial, override.tools?.editorial),
      cta: mergeSection(english.tools.cta, override.tools?.cta),
    },
  };
}

/* Os títulos e as mensagens essenciais abaixo acompanham os 12
   idiomas. Os complementos editoriais completos são mesclados
   depois dos cabeçalhos de cada idioma. */
const localizedEssentials = {
  'es-ES': {
    browserTitle: '13 Calendar — Cómo funciona el calendario de 13 meses',
    toolbarTitle: 'Cómo funciona el calendario de 13 meses',
    hero: {
      eyebrow: 'Explora la idea',
      title: 'Un año que cabe en una página',
      description:
        'Comprende el Calendario Fijo Internacional y compara fechas, historia y astronomía.',
      todayTitle: 'Hoy en dos calendarios',
      gregorian: 'Gregoriano',
      fixed: 'Calendario Fijo Internacional',
      openCalendars: 'Abrir los calendarios',
    },
    idea: {
      eyebrow: 'La estructura',
      title: 'Toda la idea en 30 segundos',
      description:
        'Trece meses iguales de 28 días forman 364 días regulares. Los Días Especiales quedan fuera de los meses y de la semana civil.',
      monthTitle: 'Un mes reutilizable',
      monthDescription: 'El día 1 siempre ocupa el primer día de la semana; el 28, el último.',
      yearTitle: 'El año civil completo',
      regularDays: '364 días regulares',
      specialDays: '1 o 2 Días Especiales',
    },
    converter: {
      eyebrow: 'Conversor interactivo',
      title: 'Prueba cualquier fecha',
      description:
        'Ambas direcciones usan el mismo motor de cálculo de los calendarios principales.',
      gregorianDate: 'Fecha gregoriana',
      fixedDate: 'Fecha IFC',
      year: 'Año',
      month: 'Mes',
      day: 'Día',
      ordinary: 'Día regular',
      yearDay: 'Día del Año',
      leapDay: 'Día Bisiesto',
      invalid: 'Elige una fecha válida.',
      position: 'Mes {month} de 13 · Semana {week} de 4',
    },
    moon: {
      eyebrow: 'La Luna sin mitos',
      title: 'La Luna no cabe en un mes de 28 días',
      intro:
        'El calendario divide el año solar en bloques iguales. La Luna mantiene su ciclo medio de fases de 29,53 días, por eso las fases atraviesan los meses fijos.',
      fixedMonth: 'Mes fijo',
      synodicCycle: 'Ciclo lunar medio',
      phaseInterval: 'Intervalo medio entre fases principales',
      days: '{value} días',
      liveTitle: 'Lunas llenas en {year}',
      noFullMoons: 'No se encontró ninguna Luna llena este año.',
      methodology: 'Leer la política científica y editorial',
    },
    history: {
      eyebrow: 'Historia y adopción',
      title: 'Una propuesta práctica, no un calendario antiguo oculto',
    },
    feedback: {
      title: '¿Qué opinas de esta idea?',
      question: '¿Cambiarías a un calendario de 13 meses?',
      options: ['Me encanta', 'Me gusta', 'No me convence', 'Totalmente en contra'],
      results: 'Resultados',
      voteCount: '{count} voto | {count} votos',
      success: 'Tu voto se guardó. Puedes cambiarlo cuando quieras.',
      unavailable: 'La votación no está configurada en esta publicación.',
      loadError: 'No se pudieron cargar los totales. Comprueba la conexión e inténtalo de nuevo.',
      saveError: 'No se pudo guardar el voto. Se restauró la opción anterior; inténtalo de nuevo.',
      selected: 'Tu elección',
    },
    cta: {
      title: 'Ahora compara una fecha',
      description: 'Abre los calendarios completos o conoce la comunidad voluntaria.',
      calendars: 'Abrir calendarios',
      community: 'Ver la comunidad',
    },
  },
  'fr-FR': {
    browserTitle: '13 Calendar — Comprendre le calendrier de 13 mois',
    toolbarTitle: 'Comprendre le calendrier de 13 mois',
    hero: {
      eyebrow: 'Explorer l’idée',
      title: 'Une année qui tient sur une page',
      description:
        'Comprenez le Calendrier fixe international et comparez dates, histoire et astronomie.',
      todayTitle: 'Aujourd’hui dans deux calendriers',
      gregorian: 'Grégorien',
      fixed: 'Calendrier fixe international',
      openCalendars: 'Ouvrir les calendriers',
    },
    idea: {
      eyebrow: 'La structure',
      title: 'Toute l’idée en 30 secondes',
      description:
        'Treize mois égaux de 28 jours forment 364 jours ordinaires. Les Jours spéciaux restent hors des mois et de la semaine civile.',
      monthTitle: 'Un mois réutilisable',
      monthDescription: 'Le 1er occupe toujours le premier jour de la semaine, le 28 le dernier.',
      yearTitle: 'L’année civile complète',
      regularDays: '364 jours ordinaires',
      specialDays: '1 ou 2 Jours spéciaux',
    },
    converter: {
      eyebrow: 'Convertisseur interactif',
      title: 'Essayez n’importe quelle date',
      description:
        'Les deux sens utilisent le même moteur de calcul que les calendriers principaux.',
      gregorianDate: 'Date grégorienne',
      fixedDate: 'Date IFC',
      year: 'Année',
      month: 'Mois',
      day: 'Jour',
      ordinary: 'Jour ordinaire',
      yearDay: 'Jour de l’An',
      leapDay: 'Jour bissextile',
      invalid: 'Choisissez une date valide.',
      position: 'Mois {month} sur 13 · Semaine {week} sur 4',
    },
    moon: {
      eyebrow: 'La Lune sans mythes',
      title: 'La Lune ne tient pas dans un mois de 28 jours',
      intro:
        'Le calendrier divise l’année solaire en blocs égaux. La Lune garde son cycle moyen de 29,53 jours et ses phases traversent donc les mois fixes.',
      fixedMonth: 'Mois fixe',
      synodicCycle: 'Cycle lunaire moyen',
      phaseInterval: 'Intervalle moyen entre phases principales',
      days: '{value} jours',
      liveTitle: 'Pleines Lunes en {year}',
      noFullMoons: 'Aucune Pleine Lune trouvée cette année.',
      methodology: 'Lire la politique scientifique et éditoriale',
    },
    history: {
      eyebrow: 'Histoire et adoption',
      title: 'Une proposition pratique, pas un ancien calendrier caché',
    },
    feedback: {
      title: 'Que pensez-vous de cette idée ?',
      question: 'Passeriez-vous à un calendrier de 13 mois ?',
      options: ['J’adore', 'Bien', 'Pas convaincu', 'Totalement opposé'],
      results: 'Résultats',
      voteCount: '{count} vote | {count} votes',
      success: 'Votre vote a été enregistré. Vous pouvez le modifier à tout moment.',
      unavailable: 'Le vote n’est pas configuré dans cette publication.',
      loadError: 'Impossible de charger les totaux. Vérifiez la connexion et réessayez.',
      saveError: 'Impossible d’enregistrer le vote. Le choix précédent a été restauré ; réessayez.',
      selected: 'Votre choix',
    },
    cta: {
      title: 'Comparez maintenant une date',
      description: 'Ouvrez les calendriers complets ou découvrez la communauté volontaire.',
      calendars: 'Ouvrir les calendriers',
      community: 'Voir la communauté',
    },
  },
  'de-DE': {
    browserTitle: '13 Calendar — So funktioniert der 13-Monats-Kalender',
    toolbarTitle: 'So funktioniert der 13-Monats-Kalender',
    hero: {
      eyebrow: 'Die Idee erkunden',
      title: 'Ein Jahr auf einer Seite',
      description:
        'Verstehen Sie den Internationalen Fixkalender und vergleichen Sie Daten, Geschichte und Astronomie.',
      todayTitle: 'Heute in zwei Kalendern',
      gregorian: 'Gregorianisch',
      fixed: 'Internationaler Fixkalender',
      openCalendars: 'Kalender öffnen',
    },
    idea: {
      eyebrow: 'Die Struktur',
      title: 'Die ganze Idee in 30 Sekunden',
      description:
        'Dreizehn gleiche Monate mit je 28 Tagen ergeben 364 reguläre Tage. Sondertage liegen außerhalb der Monate und der bürgerlichen Woche.',
      monthTitle: 'Ein wiederverwendbarer Monat',
      monthDescription: 'Der 1. ist immer der erste, der 28. immer der letzte Wochentag.',
      yearTitle: 'Das vollständige bürgerliche Jahr',
      regularDays: '364 reguläre Tage',
      specialDays: '1 oder 2 Sondertage',
    },
    converter: {
      eyebrow: 'Interaktiver Umrechner',
      title: 'Beliebiges Datum ausprobieren',
      description: 'Beide Richtungen nutzen dieselbe Berechnung wie die Hauptkalender.',
      gregorianDate: 'Gregorianisches Datum',
      fixedDate: 'IFC-Datum',
      year: 'Jahr',
      month: 'Monat',
      day: 'Tag',
      ordinary: 'Regulärer Tag',
      yearDay: 'Jahrestag',
      leapDay: 'Schalttag',
      invalid: 'Wählen Sie ein gültiges Datum.',
      position: 'Monat {month} von 13 · Woche {week} von 4',
    },
    moon: {
      eyebrow: 'Der Mond ohne Mythen',
      title: 'Der Mond passt nicht in einen 28-Tage-Monat',
      intro:
        'Der Kalender teilt das Sonnenjahr in gleiche Blöcke. Der Mond behält seinen mittleren Phasenzyklus von 29,53 Tagen; seine Phasen wandern daher durch die festen Monate.',
      fixedMonth: 'Fester Monat',
      synodicCycle: 'Mittlerer Mondzyklus',
      phaseInterval: 'Mittlerer Abstand der Hauptphasen',
      days: '{value} Tage',
      liveTitle: 'Vollmonde im Jahr {year}',
      noFullMoons: 'Für dieses Jahr wurde kein Vollmond gefunden.',
      methodology: 'Wissenschaftliche und redaktionelle Richtlinie lesen',
    },
    history: {
      eyebrow: 'Geschichte und Nutzung',
      title: 'Ein praktischer Vorschlag, kein verborgener antiker Kalender',
    },
    feedback: {
      title: 'Wie finden Sie diese Idee?',
      question: 'Würden Sie zu einem 13-Monats-Kalender wechseln?',
      options: ['Großartig', 'Gut', 'Nicht überzeugt', 'Strikt dagegen'],
      results: 'Ergebnisse',
      voteCount: '{count} Stimme | {count} Stimmen',
      success: 'Ihre Stimme wurde gespeichert und kann jederzeit geändert werden.',
      unavailable: 'Die Abstimmung ist in dieser Veröffentlichung nicht eingerichtet.',
      loadError: 'Die aktuellen Summen konnten nicht geladen werden. Prüfen Sie die Verbindung.',
      saveError:
        'Ihre Stimme konnte nicht gespeichert werden. Die vorherige Auswahl wurde wiederhergestellt.',
      selected: 'Ihre Wahl',
    },
    cta: {
      title: 'Jetzt selbst ein Datum vergleichen',
      description:
        'Öffnen Sie die vollständigen Kalender oder besuchen Sie die freiwillige Gemeinschaft.',
      calendars: 'Kalender öffnen',
      community: 'Gemeinschaft ansehen',
    },
  },
  'it-IT': {
    browserTitle: '13 Calendar — Come funziona il calendario di 13 mesi',
    toolbarTitle: 'Come funziona il calendario di 13 mesi',
    hero: {
      eyebrow: 'Esplora l’idea',
      title: 'Un anno in una sola pagina',
      description:
        'Comprendi il Calendario Fisso Internazionale e confronta date, storia e astronomia.',
      todayTitle: 'Oggi in due calendari',
      gregorian: 'Gregoriano',
      fixed: 'Calendario Fisso Internazionale',
      openCalendars: 'Apri i calendari',
    },
    idea: {
      eyebrow: 'La struttura',
      title: 'L’intera idea in 30 secondi',
      description:
        'Tredici mesi uguali di 28 giorni formano 364 giorni regolari. I Giorni speciali restano fuori dai mesi e dalla settimana civile.',
      monthTitle: 'Un mese riutilizzabile',
      monthDescription: 'Il giorno 1 è sempre il primo della settimana; il 28 è sempre l’ultimo.',
      yearTitle: 'L’intero anno civile',
      regularDays: '364 giorni regolari',
      specialDays: '1 o 2 Giorni speciali',
    },
    converter: {
      eyebrow: 'Convertitore interattivo',
      title: 'Prova qualsiasi data',
      description: 'Entrambe le direzioni usano lo stesso motore dei calendari principali.',
      gregorianDate: 'Data gregoriana',
      fixedDate: 'Data IFC',
      year: 'Anno',
      month: 'Mese',
      day: 'Giorno',
      ordinary: 'Giorno regolare',
      yearDay: 'Giorno dell’Anno',
      leapDay: 'Giorno Bisestile',
      invalid: 'Scegli una data valida.',
      position: 'Mese {month} di 13 · Settimana {week} di 4',
    },
    moon: {
      eyebrow: 'La Luna senza miti',
      title: 'La Luna non entra in un mese di 28 giorni',
      intro:
        'Il calendario divide l’anno solare in blocchi uguali. La Luna conserva il proprio ciclo medio di 29,53 giorni, quindi le fasi attraversano i mesi fissi.',
      fixedMonth: 'Mese fisso',
      synodicCycle: 'Ciclo lunare medio',
      phaseInterval: 'Intervallo medio tra le fasi principali',
      days: '{value} giorni',
      liveTitle: 'Lune piene nel {year}',
      noFullMoons: 'Nessuna Luna piena trovata per quest’anno.',
      methodology: 'Leggi la politica scientifica ed editoriale',
    },
    history: {
      eyebrow: 'Storia e adozione',
      title: 'Una proposta pratica, non un antico calendario nascosto',
    },
    feedback: {
      title: 'Cosa ne pensi di questa idea?',
      question: 'Passeresti a un calendario di 13 mesi?',
      options: ['Lo adoro', 'Buono', 'Non convinto', 'Fortemente contrario'],
      results: 'Risultati',
      voteCount: '{count} voto | {count} voti',
      success: 'Il tuo voto è stato salvato e può essere cambiato in qualsiasi momento.',
      unavailable: 'Il voto non è configurato in questa pubblicazione.',
      loadError: 'Impossibile caricare i totali. Controlla la connessione e riprova.',
      saveError: 'Impossibile salvare il voto. La scelta precedente è stata ripristinata.',
      selected: 'La tua scelta',
    },
    cta: {
      title: 'Ora confronta una data',
      description: 'Apri i calendari completi o scopri la comunità volontaria.',
      calendars: 'Apri calendari',
      community: 'Vedi la comunità',
    },
  },
};

const languageHeaders = {
  'ru-RU': [
    'Как работает 13-месячный календарь',
    'Год на одной странице',
    'Луна не помещается в 28-дневный месяц',
    'Попробуйте любую дату',
    'Григорианский календарь',
    'Международный фиксированный календарь',
    'Месяц {month} из 13 · Неделя {week} из 4',
  ],
  'zh-CN': [
    '13个月历如何运作',
    '一页容纳一整年',
    '月相周期无法装进28天的月份',
    '试试任意日期',
    '公历',
    '国际固定历',
    '月份 {month}/13 · 周 {week}/4',
  ],
  'ja-JP': [
    '13か月暦の仕組み',
    '1ページに収まる1年',
    '月の満ち欠けは28日月には収まりません',
    '日付を試す',
    'グレゴリオ暦',
    '国際固定暦',
    '月 {month}/13 · 週 {week}/4',
  ],
  'ar-SA': [
    'كيف يعمل تقويم الأشهر الثلاثة عشر',
    'سنة كاملة في صفحة واحدة',
    'دورة القمر لا تتسع في شهر من 28 يومًا',
    'جرّب أي تاريخ',
    'التقويم الميلادي',
    'التقويم الدولي الثابت',
    'الشهر {month} من 13 · الأسبوع {week} من 4',
  ],
  'hi-IN': [
    '13 महीने वाला कैलेंडर कैसे काम करता है',
    'एक पन्ने में पूरा वर्ष',
    'चंद्र चक्र 28 दिन के महीने में नहीं समाता',
    'कोई भी तारीख आज़माएँ',
    'ग्रेगोरियन',
    'अंतरराष्ट्रीय स्थिर कैलेंडर',
    '13 में से महीना {month} · 4 में से सप्ताह {week}',
  ],
  'ko-KR': [
    '13개월 달력의 원리',
    '한 페이지에 담긴 1년',
    '달의 위상 주기는 28일 달에 맞지 않습니다',
    '날짜 변환해 보기',
    '그레고리력',
    '국제 고정 달력',
    '월 {month}/13 · 주 {week}/4',
  ],
};

for (const [
  locale,
  [toolbarTitle, heroTitle, moonTitle, converterTitle, gregorian, fixed, position],
] of Object.entries(languageHeaders)) {
  localizedEssentials[locale] = {
    browserTitle: `13 Calendar — ${toolbarTitle}`,
    toolbarTitle,
    hero: { title: heroTitle, gregorian, fixed },
    moon: { title: moonTitle },
    converter: { title: converterTitle, position },
  };
}

function mergeEditorialLocale(base = {}, editorial = {}) {
  return {
    ...base,
    ...editorial,
    hero: mergeSection(base.hero, editorial.hero),
    idea: mergeSection(base.idea, editorial.idea),
    converter: mergeSection(base.converter, editorial.converter),
    moon: mergeSection(base.moon, editorial.moon),
    history: mergeSection(base.history, editorial.history),
    sabbath: mergeSection(base.sabbath, editorial.sabbath),
    feedback: mergeSection(base.feedback, editorial.feedback),
    sources: mergeSection(base.sources, editorial.sources),
    resources: {
      ...base.resources,
      ...editorial.resources,
      types: mergeSection(base.resources?.types, editorial.resources?.types),
    },
    cta: mergeSection(base.cta, editorial.cta),
  };
}

for (const [locale, editorial] of Object.entries(localizedEditorialMessages)) {
  localizedEssentials[locale] = mergeEditorialLocale(localizedEssentials[locale], editorial);
}

for (const [locale, tools] of Object.entries(localizedToolMessages)) {
  localizedEssentials[locale] = {
    ...localizedEssentials[locale],
    tools,
  };
}

const educationMessagesBase = {
  'en-US': createLocale(),
  'pt-BR': createLocale(portuguese),
  ...Object.fromEntries(
    Object.entries(localizedEssentials).map(([locale, messages]) => [
      locale,
      createLocale(messages),
    ]),
  ),
};

/* Os trechos aprovados do antigo incorporado são mesclados por último para
   preservar sua redação e seu conjunto de cinco cards sem reativar vendor/. */
export const educationMessages = Object.fromEntries(
  Object.entries(educationMessagesBase).map(([locale, messages]) => [
    locale,
    {
      ...messages,
      hero: mergeSection(messages.hero, educationReferenceCopyTranslations[locale]?.hero),
      idea: mergeSection(messages.idea, educationReferenceCopyTranslations[locale]?.idea),
      history: mergeSection(messages.history, educationHistoryReferenceTranslations[locale]),
      feedback: mergeSection(messages.feedback, educationFeedbackTranslations[locale]),
      sources: mergeSection(messages.sources, educationMoonMethodologyTranslations[locale]),
    },
  ]),
);
