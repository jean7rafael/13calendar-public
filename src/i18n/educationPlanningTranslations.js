/* ===========================================================
   PLANEJAMENTO FISCAL, ACADÊMICO E DOS DIAS ENTRE ANOS

   Estas propostas separam a matemática estável do calendário
   das escolhas legais e culturais que cada sociedade precisaria
   regulamentar. A auditoria exige a mesma estrutura nos 12 idiomas.
=========================================================== */

export const educationPlanningTranslations = {
  'pt-BR': {
    fiscal: {
      eyebrow: 'Planejamento sem forçar os meses',
      title: 'Como encaixar períodos fiscais e acadêmicos?',
      introduction:
        'Treze meses iguais não se dividem perfeitamente em metades, terços ou quartos pela quantidade de meses. A unidade estável é a semana: os 364 dias regulares formam exatamente 52 semanas.',
      formulaRegular: '364 dias regulares',
      formulaWeeks: '52 semanas',
      formulaQuarters: '4 trimestres de 13 semanas',
      cards: [
        {
          title: 'Quatro trimestres fiscais iguais',
          text: 'Cada trimestre teria 13 semanas, ou 91 dias regulares. O fechamento pode cair dentro de um mês fixo, mas todos os relatórios cobririam períodos iguais.',
          detail: '4 × 13 semanas = 52 semanas',
        },
        {
          title: 'Relatórios a cada três ou quatro meses',
          text: 'Os 13 meses continuam servindo ao detalhamento mensal. Nas consolidações, a empresa publicaria o intervalo de semanas e as datas civis correspondentes, sem criar grupos desiguais de meses.',
          detail: 'Meses para detalhar; semanas para consolidar',
        },
        {
          title: 'Bimestres, trimestres e semestres',
          text: 'Primeiro se define a quantidade de semanas letivas. Em um exemplo de 40 semanas, seriam dois semestres de 20, quatro bimestres de 10 ou três trimestres de 13, 14 e 13 semanas; o restante do ano fica para férias, exames e transições.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Férias e calendários acadêmicos',
          text: 'O ano letivo não precisa ocupar todo o ano civil. Aulas, avaliações, férias e recessos podem ser marcados por semanas e depois adaptados às exigências locais.',
          detail: 'A legislação local continua prevalecendo',
        },
      ],
      note: 'Este é um modelo operacional, não uma regra contábil ou jurídica automática. A adoção exigiria que cada país, bolsa, empresa e sistema de ensino publicasse a conversão oficial.',
      sources:
        'Exemplos oficiais de anos fiscais e períodos escolares organizados por semanas ou blocos letivos',
    },
    yearEnd: {
      eyebrow: 'A passagem entre dois anos',
      title: 'O que acontece com os dias fora dos meses?',
      introduction:
        'O Dia do Ano — e o Dia Bissexto, quando existir — fica depois do sábado 28 do décimo terceiro mês e antes do domingo 1 do novo ano. Por isso, seu status social e trabalhista precisa ser definido explicitamente.',
      cards: [
        {
          title: 'Celebração e transição coletiva',
          text: 'O Dia do Ano pode ser um feriado público para festas comunitárias, família, cultura e encerramento do ano civil.',
        },
        {
          title: 'Descanso com serviços essenciais',
          text: 'O descanso remunerado é o padrão mais claro. Saúde, segurança, transporte e outros serviços essenciais funcionariam por escala e compensação.',
        },
        {
          title: 'Dia Bissexto com a mesma proteção',
          text: 'Nos anos bissextos, o dia adicional pode seguir a mesma regra, com uma programação mais leve de voluntariado, cultura ou atividades ambientais.',
        },
        {
          title: 'Trabalho normal ainda seria possível',
          text: 'Um país ou empregador poderia tratá-los como dias comuns, mas teria de definir remuneração, prazos, descanso semanal e sistemas, pois eles não possuem rótulo de dia da semana.',
        },
      ],
      proposalTitle: 'Uma proposta inicial equilibrada',
      proposalText:
        'Tornar o Dia do Ano um feriado público remunerado e o Dia Bissexto, quando existir, um dia cívico com a mesma proteção. Serviços essenciais continuam com compensação, e cada comunidade escolhe suas festas sem impor significado religioso.',
      saturday: 'Sábado 28',
      yearDay: 'Dia do Ano',
      leapDay: 'Dia Bissexto',
      leapQualifier: 'somente em anos bissextos',
      sunday: 'Domingo 1',
    },
  },
  'en-US': {
    fiscal: {
      eyebrow: 'Planning without forcing the months',
      title: 'How do fiscal and academic periods fit?',
      introduction:
        'Thirteen equal months do not divide cleanly into halves, thirds or quarters by month count. The stable unit is the week: the 364 regular days make exactly 52 weeks.',
      formulaRegular: '364 regular days',
      formulaWeeks: '52 weeks',
      formulaQuarters: '4 quarters of 13 weeks',
      cards: [
        {
          title: 'Four equal fiscal quarters',
          text: 'Each quarter would have 13 weeks, or 91 regular days. Closing may fall inside a fixed month, but every report would cover an equal period.',
          detail: '4 × 13 weeks = 52 weeks',
        },
        {
          title: 'Three- or four-month reports',
          text: 'The 13 months still serve monthly detail. For consolidation, a company would publish the week interval and corresponding civil dates instead of creating unequal groups of months.',
          detail: 'Months for detail; weeks for consolidation',
        },
        {
          title: 'Two-month periods, terms and semesters',
          text: 'First define the number of teaching weeks. In a 40-week example, that means two 20-week semesters, four 10-week periods or three terms of 13, 14 and 13 weeks; the rest of the year remains for vacations, exams and transitions.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Vacations and academic calendars',
          text: 'The school year does not need to occupy the entire civil year. Classes, assessments, vacations and recesses can be scheduled by week and then adapted to local requirements.',
          detail: 'Local law still prevails',
        },
      ],
      note: 'This is an operational model, not an automatic accounting or legal rule. Adoption would require every country, exchange, company and education system to publish its official conversion.',
      sources:
        'Official examples of fiscal years and school periods organized by weeks or teaching blocks',
    },
    yearEnd: {
      eyebrow: 'The passage between two years',
      title: 'What happens to the days outside the months?',
      introduction:
        'Year Day — and Leap Day when present — sits after Saturday 28 of the thirteenth month and before Sunday 1 of the new year. Its social and labor status therefore needs to be defined explicitly.',
      cards: [
        {
          title: 'Celebration and shared transition',
          text: 'Year Day can be a public holiday for community celebrations, family, culture and the close of the civil year.',
        },
        {
          title: 'Rest with essential services',
          text: 'Paid rest is the clearest default. Health, safety, transport and other essential services would operate with shifts and compensation.',
        },
        {
          title: 'Leap Day with the same protection',
          text: 'In leap years, the additional day can follow the same rule, with a lighter program of volunteering, culture or environmental activities.',
        },
        {
          title: 'Regular work would remain possible',
          text: 'A country or employer could treat them as ordinary workdays, but would need rules for pay, deadlines, weekly rest and systems because they have no weekday label.',
        },
      ],
      proposalTitle: 'A balanced starting proposal',
      proposalText:
        'Make Year Day a paid public holiday and Leap Day, when present, an equally protected civic day. Essential services continue with compensation, while each community chooses its celebrations without imposing a religious meaning.',
      saturday: 'Saturday 28',
      yearDay: 'Year Day',
      leapDay: 'Leap Day',
      leapQualifier: 'leap years only',
      sunday: 'Sunday 1',
    },
  },
  'fr-FR': {
    fiscal: {
      eyebrow: 'Planifier sans forcer les mois',
      title: 'Comment organiser les périodes fiscales et scolaires ?',
      introduction:
        'Treize mois égaux ne se divisent pas exactement en moitiés, tiers ou quarts par nombre de mois. L’unité stable est la semaine : les 364 jours ordinaires forment exactement 52 semaines.',
      formulaRegular: '364 jours ordinaires',
      formulaWeeks: '52 semaines',
      formulaQuarters: '4 trimestres de 13 semaines',
      cards: [
        {
          title: 'Quatre trimestres fiscaux égaux',
          text: 'Chaque trimestre compterait 13 semaines, soit 91 jours ordinaires. La clôture peut tomber au milieu d’un mois fixe, mais chaque rapport couvre une période égale.',
          detail: '4 × 13 semaines = 52 semaines',
        },
        {
          title: 'Rapports tous les trois ou quatre mois',
          text: 'Les 13 mois servent toujours au détail mensuel. Pour consolider, l’entreprise publierait l’intervalle de semaines et les dates civiles correspondantes sans créer de groupes de mois inégaux.',
          detail: 'Les mois pour le détail ; les semaines pour consolider',
        },
        {
          title: 'Périodes, trimestres et semestres',
          text: 'Il faut d’abord définir le nombre de semaines de cours. Dans un exemple de 40 semaines : deux semestres de 20, quatre périodes de 10 ou trois trimestres de 13, 14 et 13 semaines ; le reste sert aux vacances, examens et transitions.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Vacances et calendriers scolaires',
          text: 'L’année scolaire ne doit pas occuper toute l’année civile. Cours, évaluations, vacances et congés peuvent être fixés par semaine puis adaptés aux règles locales.',
          detail: 'Le droit local reste prioritaire',
        },
      ],
      note: 'Il s’agit d’un modèle opérationnel, pas d’une règle comptable ou juridique automatique. Chaque pays, bourse, entreprise et système éducatif devrait publier sa conversion officielle.',
      sources:
        'Exemples officiels d’années fiscales et de périodes scolaires organisées par semaines ou blocs pédagogiques',
    },
    yearEnd: {
      eyebrow: 'Le passage entre deux années',
      title: 'Que deviennent les jours hors des mois ?',
      introduction:
        'Le Jour de l’Année — et le Jour Bissextile lorsqu’il existe — se place après le samedi 28 du treizième mois et avant le dimanche 1 de la nouvelle année. Son statut social et professionnel doit donc être explicite.',
      cards: [
        {
          title: 'Célébration et transition collective',
          text: 'Le Jour de l’Année peut être férié pour les fêtes locales, la famille, la culture et la clôture de l’année civile.',
        },
        {
          title: 'Repos avec services essentiels',
          text: 'Le repos rémunéré est le principe le plus clair. Santé, sécurité, transports et autres services essentiels fonctionneraient par roulement avec compensation.',
        },
        {
          title: 'Jour Bissextile protégé de la même façon',
          text: 'Les années bissextiles, le jour supplémentaire peut suivre la même règle, avec un programme léger de bénévolat, de culture ou d’activités environnementales.',
        },
        {
          title: 'Le travail ordinaire resterait possible',
          text: 'Un pays ou un employeur pourrait les traiter comme jours ouvrés, mais devrait régler salaires, délais, repos hebdomadaire et systèmes puisqu’ils n’ont pas de nom de jour de semaine.',
        },
      ],
      proposalTitle: 'Une proposition initiale équilibrée',
      proposalText:
        'Faire du Jour de l’Année un jour férié payé et du Jour Bissextile, lorsqu’il existe, un jour civique également protégé. Les services essentiels continuent avec compensation et chaque communauté choisit ses fêtes sans imposer de sens religieux.',
      saturday: 'Samedi 28',
      yearDay: 'Jour de l’Année',
      leapDay: 'Jour Bissextile',
      leapQualifier: 'années bissextiles seulement',
      sunday: 'Dimanche 1',
    },
  },
  'es-ES': {
    fiscal: {
      eyebrow: 'Planificar sin forzar los meses',
      title: '¿Cómo encajan los periodos fiscales y académicos?',
      introduction:
        'Trece meses iguales no se dividen exactamente en mitades, tercios o cuartos por cantidad de meses. La unidad estable es la semana: los 364 días regulares forman exactamente 52 semanas.',
      formulaRegular: '364 días regulares',
      formulaWeeks: '52 semanas',
      formulaQuarters: '4 trimestres de 13 semanas',
      cards: [
        {
          title: 'Cuatro trimestres fiscales iguales',
          text: 'Cada trimestre tendría 13 semanas, o 91 días regulares. El cierre puede caer dentro de un mes fijo, pero todos los informes abarcarían periodos iguales.',
          detail: '4 × 13 semanas = 52 semanas',
        },
        {
          title: 'Informes cada tres o cuatro meses',
          text: 'Los 13 meses siguen sirviendo para el detalle mensual. Al consolidar, la empresa publicaría el intervalo de semanas y las fechas civiles correspondientes sin crear grupos desiguales de meses.',
          detail: 'Meses para detallar; semanas para consolidar',
        },
        {
          title: 'Bimestres, trimestres y semestres',
          text: 'Primero se define el número de semanas lectivas. En un ejemplo de 40 semanas: dos semestres de 20, cuatro bimestres de 10 o tres trimestres de 13, 14 y 13 semanas; el resto queda para vacaciones, exámenes y transiciones.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Vacaciones y calendarios académicos',
          text: 'El curso no necesita ocupar todo el año civil. Clases, evaluaciones, vacaciones y recesos pueden fijarse por semana y adaptarse después a las exigencias locales.',
          detail: 'La normativa local sigue prevaleciendo',
        },
      ],
      note: 'Este es un modelo operativo, no una regla contable o jurídica automática. Cada país, bolsa, empresa y sistema educativo tendría que publicar su conversión oficial.',
      sources:
        'Ejemplos oficiales de años fiscales y periodos escolares organizados por semanas o bloques lectivos',
    },
    yearEnd: {
      eyebrow: 'El paso entre dos años',
      title: '¿Qué ocurre con los días fuera de los meses?',
      introduction:
        'El Día del Año —y el Día Bisiesto cuando exista— queda después del sábado 28 del decimotercer mes y antes del domingo 1 del nuevo año. Por eso su condición social y laboral debe definirse expresamente.',
      cards: [
        {
          title: 'Celebración y transición colectiva',
          text: 'El Día del Año puede ser festivo para celebraciones comunitarias, familia, cultura y cierre del año civil.',
        },
        {
          title: 'Descanso con servicios esenciales',
          text: 'El descanso remunerado es el criterio más claro. Salud, seguridad, transporte y otros servicios esenciales funcionarían por turnos y con compensación.',
        },
        {
          title: 'Día Bisiesto con la misma protección',
          text: 'En años bisiestos, el día adicional puede seguir la misma regla, con un programa más ligero de voluntariado, cultura o actividades ambientales.',
        },
        {
          title: 'El trabajo normal seguiría siendo posible',
          text: 'Un país o empleador podría tratarlos como días laborables, pero tendría que regular salario, plazos, descanso semanal y sistemas porque no tienen nombre de día de semana.',
        },
      ],
      proposalTitle: 'Una propuesta inicial equilibrada',
      proposalText:
        'Convertir el Día del Año en festivo público remunerado y el Día Bisiesto, cuando exista, en día cívico con igual protección. Los servicios esenciales continúan con compensación y cada comunidad elige sus fiestas sin imponer un significado religioso.',
      saturday: 'Sábado 28',
      yearDay: 'Día del Año',
      leapDay: 'Día Bisiesto',
      leapQualifier: 'solo en años bisiestos',
      sunday: 'Domingo 1',
    },
  },
  'de-DE': {
    fiscal: {
      eyebrow: 'Planung ohne erzwungene Monatsgrenzen',
      title: 'Wie passen Geschäfts- und Schulperioden hinein?',
      introduction:
        'Dreizehn gleich lange Monate lassen sich nach Monatszahl nicht genau halbieren, dritteln oder vierteln. Die stabile Einheit ist die Woche: 364 reguläre Tage ergeben genau 52 Wochen.',
      formulaRegular: '364 reguläre Tage',
      formulaWeeks: '52 Wochen',
      formulaQuarters: '4 Quartale zu 13 Wochen',
      cards: [
        {
          title: 'Vier gleich lange Geschäftsquartale',
          text: 'Jedes Quartal hätte 13 Wochen oder 91 reguläre Tage. Der Abschluss kann innerhalb eines festen Monats liegen, doch jeder Bericht deckt denselben Zeitraum ab.',
          detail: '4 × 13 Wochen = 52 Wochen',
        },
        {
          title: 'Drei- oder Viermonatsberichte',
          text: 'Die 13 Monate bleiben für Monatsdetails erhalten. Für Zusammenfassungen veröffentlicht das Unternehmen Wochenintervall und entsprechende Zivildaten, statt ungleiche Monatsgruppen zu bilden.',
          detail: 'Monate für Details; Wochen zum Zusammenfassen',
        },
        {
          title: 'Lernabschnitte, Trimester und Semester',
          text: 'Zuerst wird die Zahl der Unterrichtswochen festgelegt. Bei 40 Wochen wären das zwei Semester zu 20, vier Perioden zu 10 oder drei Trimester zu 13, 14 und 13 Wochen; der Rest bleibt für Ferien, Prüfungen und Übergänge.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Ferien und akademische Kalender',
          text: 'Das Schuljahr muss nicht das ganze Ziviljahr belegen. Unterricht, Prüfungen, Ferien und Pausen können nach Wochen geplant und an örtliche Vorgaben angepasst werden.',
          detail: 'Örtliches Recht hat weiterhin Vorrang',
        },
      ],
      note: 'Dies ist ein Betriebsmodell, keine automatische Bilanz- oder Rechtsregel. Jedes Land, jede Börse, jedes Unternehmen und Bildungssystem müsste die offizielle Umrechnung veröffentlichen.',
      sources:
        'Amtliche Beispiele für Geschäftsjahre und Schulperioden nach Wochen oder Unterrichtsblöcken',
    },
    yearEnd: {
      eyebrow: 'Der Übergang zwischen zwei Jahren',
      title: 'Was geschieht mit den Tagen außerhalb der Monate?',
      introduction:
        'Der Jahrestag — und in Schaltjahren der Schalttag — liegt nach Samstag, dem 28. des dreizehnten Monats, und vor Sonntag, dem 1. des neuen Jahres. Sein gesellschaftlicher und arbeitsrechtlicher Status muss daher ausdrücklich geregelt werden.',
      cards: [
        {
          title: 'Feier und gemeinsamer Übergang',
          text: 'Der Jahrestag kann ein Feiertag für Gemeinschaft, Familie, Kultur und den Abschluss des Ziviljahres sein.',
        },
        {
          title: 'Ruhe mit wesentlichen Diensten',
          text: 'Bezahlte Ruhe ist die klarste Grundregel. Gesundheit, Sicherheit, Verkehr und andere wesentliche Dienste arbeiten in Schichten mit Ausgleich.',
        },
        {
          title: 'Gleicher Schutz für den Schalttag',
          text: 'In Schaltjahren kann der zusätzliche Tag derselben Regel folgen, mit einem leichteren Programm aus Ehrenamt, Kultur oder Umweltaktivitäten.',
        },
        {
          title: 'Normale Arbeit bliebe möglich',
          text: 'Ein Land oder Arbeitgeber könnte beide als Arbeitstage behandeln, müsste aber Lohn, Fristen, Wochenruhe und Systeme regeln, da sie keinen Wochentagsnamen tragen.',
        },
      ],
      proposalTitle: 'Ein ausgewogener Ausgangsvorschlag',
      proposalText:
        'Den Jahrestag als bezahlten Feiertag und den Schalttag, wenn vorhanden, als ebenso geschützten Bürgertag festlegen. Wesentliche Dienste laufen mit Ausgleich weiter; Gemeinden wählen ihre Feiern ohne vorgeschriebene religiöse Bedeutung.',
      saturday: 'Samstag 28',
      yearDay: 'Jahrestag',
      leapDay: 'Schalttag',
      leapQualifier: 'nur in Schaltjahren',
      sunday: 'Sonntag 1',
    },
  },
  'ru-RU': {
    fiscal: {
      eyebrow: 'Планирование без подгонки месяцев',
      title: 'Как разместить финансовые и учебные периоды?',
      introduction:
        'Тринадцать равных месяцев нельзя точно разделить по числу месяцев на половины, трети или четверти. Стабильная единица — неделя: 364 обычных дня составляют ровно 52 недели.',
      formulaRegular: '364 обычных дня',
      formulaWeeks: '52 недели',
      formulaQuarters: '4 квартала по 13 недель',
      cards: [
        {
          title: 'Четыре равных финансовых квартала',
          text: 'Каждый квартал длится 13 недель, или 91 обычный день. Закрытие может попасть внутрь фиксированного месяца, но все отчёты охватывают равные периоды.',
          detail: '4 × 13 недель = 52 недели',
        },
        {
          title: 'Отчёты каждые три или четыре месяца',
          text: '13 месяцев сохраняются для месячной детализации. При консолидации компания указывает интервал недель и соответствующие гражданские даты, не создавая неравные группы месяцев.',
          detail: 'Месяцы для деталей; недели для сводки',
        },
        {
          title: 'Учебные периоды, триместры и семестры',
          text: 'Сначала определяется число учебных недель. Например, 40 недель дают два семестра по 20, четыре периода по 10 или три триместра по 13, 14 и 13 недель; оставшееся время отводится каникулам, экзаменам и переходам.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Каникулы и учебные календари',
          text: 'Учебный год не обязан занимать весь гражданский год. Уроки, экзамены, каникулы и перерывы можно планировать по неделям и адаптировать к местным требованиям.',
          detail: 'Местные нормы сохраняют приоритет',
        },
      ],
      note: 'Это рабочая модель, а не автоматическая бухгалтерская или правовая норма. Каждая страна, биржа, компания и система образования должна опубликовать официальное соответствие.',
      sources:
        'Официальные примеры финансовых лет и учебных периодов, организованных по неделям или учебным блокам',
    },
    yearEnd: {
      eyebrow: 'Переход между двумя годами',
      title: 'Что происходит с днями вне месяцев?',
      introduction:
        'День года — и Високосный день, когда он есть, — находится после субботы 28-го дня тринадцатого месяца и перед воскресеньем 1-го дня нового года. Его общественный и трудовой статус нужно определить явно.',
      cards: [
        {
          title: 'Праздник и общий переход',
          text: 'День года может быть государственным выходным для общих праздников, семьи, культуры и завершения гражданского года.',
        },
        {
          title: 'Отдых при работе важных служб',
          text: 'Оплачиваемый отдых — самое ясное правило. Здравоохранение, безопасность, транспорт и другие важные службы работают посменно с компенсацией.',
        },
        {
          title: 'Та же защита для Високосного дня',
          text: 'В високосные годы дополнительный день может следовать тому же правилу с лёгкой программой волонтёрства, культуры или экологических мероприятий.',
        },
        {
          title: 'Обычная работа остаётся возможной',
          text: 'Страна или работодатель могут считать эти дни рабочими, но должны определить оплату, сроки, еженедельный отдых и работу систем, поскольку у дней нет названия дня недели.',
        },
      ],
      proposalTitle: 'Сбалансированное исходное предложение',
      proposalText:
        'Сделать День года оплачиваемым праздником, а Високосный день, когда он есть, таким же защищённым гражданским днём. Важные службы работают с компенсацией, а сообщества выбирают праздники без навязывания религиозного смысла.',
      saturday: 'Суббота 28',
      yearDay: 'День года',
      leapDay: 'Високосный день',
      leapQualifier: 'только в високосные годы',
      sunday: 'Воскресенье 1',
    },
  },
  'it-IT': {
    fiscal: {
      eyebrow: 'Pianificare senza forzare i mesi',
      title: 'Come si inseriscono i periodi fiscali e scolastici?',
      introduction:
        'Tredici mesi uguali non si dividono esattamente in metà, terzi o quarti contando i mesi. L’unità stabile è la settimana: i 364 giorni regolari formano esattamente 52 settimane.',
      formulaRegular: '364 giorni regolari',
      formulaWeeks: '52 settimane',
      formulaQuarters: '4 trimestri di 13 settimane',
      cards: [
        {
          title: 'Quattro trimestri fiscali uguali',
          text: 'Ogni trimestre avrebbe 13 settimane, cioè 91 giorni regolari. La chiusura può cadere dentro un mese fisso, ma ogni relazione copre lo stesso periodo.',
          detail: '4 × 13 settimane = 52 settimane',
        },
        {
          title: 'Relazioni ogni tre o quattro mesi',
          text: 'I 13 mesi restano utili per il dettaglio mensile. Per consolidare, l’impresa pubblica l’intervallo di settimane e le date civili corrispondenti senza creare gruppi di mesi disuguali.',
          detail: 'Mesi per il dettaglio; settimane per consolidare',
        },
        {
          title: 'Periodi, trimestri e semestri',
          text: 'Prima si definisce il numero di settimane di lezione. In un esempio di 40 settimane: due semestri di 20, quattro periodi di 10 o tre trimestri di 13, 14 e 13 settimane; il resto serve a vacanze, esami e transizioni.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'Vacanze e calendari accademici',
          text: 'L’anno scolastico non deve occupare tutto l’anno civile. Lezioni, valutazioni, vacanze e pause possono essere fissate per settimana e adattate alle regole locali.',
          detail: 'Le norme locali continuano a prevalere',
        },
      ],
      note: 'È un modello operativo, non una regola contabile o giuridica automatica. Ogni paese, borsa, impresa e sistema educativo dovrebbe pubblicare la conversione ufficiale.',
      sources:
        'Esempi ufficiali di anni fiscali e periodi scolastici organizzati per settimane o blocchi didattici',
    },
    yearEnd: {
      eyebrow: 'Il passaggio tra due anni',
      title: 'Che cosa accade ai giorni fuori dai mesi?',
      introduction:
        'Il Giorno dell’Anno — e il Giorno Bisestile quando esiste — viene dopo sabato 28 del tredicesimo mese e prima di domenica 1 del nuovo anno. Il suo status sociale e lavorativo deve quindi essere definito chiaramente.',
      cards: [
        {
          title: 'Festa e transizione collettiva',
          text: 'Il Giorno dell’Anno può essere una festività pubblica dedicata a comunità, famiglia, cultura e chiusura dell’anno civile.',
        },
        {
          title: 'Riposo con servizi essenziali',
          text: 'Il riposo retribuito è la regola più chiara. Sanità, sicurezza, trasporti e altri servizi essenziali funzionerebbero a turni con compensazione.',
        },
        {
          title: 'Stessa tutela per il Giorno Bisestile',
          text: 'Negli anni bisestili, il giorno aggiuntivo può seguire la stessa regola con un programma leggero di volontariato, cultura o attività ambientali.',
        },
        {
          title: 'Il lavoro normale resterebbe possibile',
          text: 'Un paese o datore di lavoro potrebbe considerarli giorni lavorativi, ma dovrebbe regolare paga, scadenze, riposo settimanale e sistemi perché non hanno un nome di giorno della settimana.',
        },
      ],
      proposalTitle: 'Una proposta iniziale equilibrata',
      proposalText:
        'Rendere il Giorno dell’Anno una festività pubblica retribuita e il Giorno Bisestile, quando esiste, un giorno civico ugualmente protetto. I servizi essenziali continuano con compensazione e ogni comunità sceglie le proprie feste senza imporre un significato religioso.',
      saturday: 'Sabato 28',
      yearDay: 'Giorno dell’Anno',
      leapDay: 'Giorno Bisestile',
      leapQualifier: 'solo negli anni bisestili',
      sunday: 'Domenica 1',
    },
  },
  'zh-CN': {
    fiscal: {
      eyebrow: '不勉强按月份切分的规划',
      title: '财务周期和学期如何安排？',
      introduction:
        '按月份数量计算，十三个等长月份无法被二、三或四整除。稳定单位是周：364个常规日正好组成52周。',
      formulaRegular: '364个常规日',
      formulaWeeks: '52周',
      formulaQuarters: '4个十三周期',
      cards: [
        {
          title: '四个等长财务季度',
          text: '每季度13周，即91个常规日。结账日可能落在固定月份中间，但每份报告覆盖相同长度。',
          detail: '4 × 13周 = 52周',
        },
        {
          title: '每三个月或四个月的报告',
          text: '十三个月仍用于月度明细。汇总时，公司公布周区间和对应民用日期，不必强行组成不等长的月份组。',
          detail: '月份用于明细；周用于汇总',
        },
        {
          title: '双月期、学季和学期',
          text: '先确定教学周数。以40周为例，可分成两个20周学期、四个10周期，或13、14、13周的三个学期；其余时间用于假期、考试和过渡。',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: '假期与教学日历',
          text: '学年不必占满整个民用年。课程、考试、假期和休息期可按周安排，再适应当地要求。',
          detail: '当地法规仍然优先',
        },
      ],
      note: '这是操作模型，不是自动生效的会计或法律规则。采用时，每个国家、交易所、企业和教育系统都要公布正式换算方式。',
      sources: '按周或教学块组织财年与学期的官方实例',
    },
    yearEnd: {
      eyebrow: '两个年份之间的过渡',
      title: '月份之外的日子如何处理？',
      introduction:
        '年度日——以及存在时的闰日——位于第十三个月的星期六28日之后、新年星期日1日之前。因此必须明确其社会和劳动属性。',
      cards: [
        {
          title: '庆祝与共同过渡',
          text: '年度日可以成为公共假日，用于社区庆典、家庭、文化和民用年收尾。',
        },
        {
          title: '休息并维持基本服务',
          text: '带薪休息是最清晰的默认规则。医疗、安全、交通等基本服务通过轮班和补偿继续运行。',
        },
        {
          title: '闰日享有同等保护',
          text: '在闰年，新增日可遵循同一规则，并安排较轻量的志愿、文化或环保活动。',
        },
        {
          title: '仍可规定为正常工作日',
          text: '国家或雇主也可将其视为工作日，但由于它们没有星期标签，必须明确薪酬、期限、周休和系统规则。',
        },
      ],
      proposalTitle: '一个平衡的起点方案',
      proposalText:
        '将年度日定为带薪公共假日；闰日存在时，定为同等受保护的公民日。基本服务在补偿下继续运行，各社区自行选择庆祝方式，不强加宗教含义。',
      saturday: '星期六 28',
      yearDay: '年度日',
      leapDay: '闰日',
      leapQualifier: '仅闰年',
      sunday: '星期日 1',
    },
  },
  'ja-JP': {
    fiscal: {
      eyebrow: '月数を無理に分けない計画',
      title: '会計期間と学期をどう組み込む？',
      introduction:
        '13の同じ長さの月は、月数では二分、三分、四分できません。安定した単位は週で、364の通常日はちょうど52週です。',
      formulaRegular: '364の通常日',
      formulaWeeks: '52週',
      formulaQuarters: '13週ずつの4四半期',
      cards: [
        {
          title: '同じ長さの4会計四半期',
          text: '各四半期は13週、つまり91通常日です。締め日は固定月の途中でも、すべての報告期間は同じ長さになります。',
          detail: '4 × 13週 = 52週',
        },
        {
          title: '3か月または4か月ごとの報告',
          text: '13か月は月次明細に使えます。連結時は不均等な月の組を作らず、週の範囲と対応する民間日付を示します。',
          detail: '詳細は月、集計は週',
        },
        {
          title: '学期、三学期、二学期',
          text: 'まず授業週数を定めます。40週なら、20週の2学期、10週の4期、または13・14・13週の3学期にでき、残りは休暇、試験、移行期間に使います。',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: '休暇と教育カレンダー',
          text: '学年が民間年全体を占める必要はありません。授業、評価、休暇、休校期間を週で定め、地域の要件に合わせられます。',
          detail: '地域の規則が引き続き優先',
        },
      ],
      note: 'これは運用モデルであり、自動的な会計・法規則ではありません。国、取引所、企業、教育制度ごとに公式の換算を公表する必要があります。',
      sources: '週または教育期間で会計年や学期を構成する公式例',
    },
    yearEnd: {
      eyebrow: '2つの年の間',
      title: '月に属さない日はどうなる？',
      introduction:
        'イヤー・デイと、存在する年の閏日は、第13月の土曜日28日と新年の日曜日1日の間にあります。そのため社会・労働上の扱いを明示する必要があります。',
      cards: [
        {
          title: '祝祭と共同の節目',
          text: 'イヤー・デイは地域行事、家族、文化、民間年の締めくくりのための祝日にできます。',
        },
        {
          title: '基幹サービスを保つ休息日',
          text: '有給の休息が最も明確な原則です。医療、安全、交通などは交代制と補償で継続します。',
        },
        {
          title: '閏日にも同じ保護',
          text: '閏年の追加日は同じ規則とし、ボランティア、文化、環境活動など軽い行事を設けられます。',
        },
        {
          title: '通常勤務も選択可能',
          text: '国や雇用主は勤務日にできますが、曜日名がないため、賃金、期限、週休、システムの規則を明示する必要があります。',
        },
      ],
      proposalTitle: 'バランスの取れた出発案',
      proposalText:
        'イヤー・デイを有給祝日とし、閏日がある年は同等に保護された市民の日とします。基幹サービスは補償付きで続け、宗教的意味を強制せず地域が行事を選びます。',
      saturday: '土曜日 28',
      yearDay: 'イヤー・デイ',
      leapDay: '閏日',
      leapQualifier: '閏年のみ',
      sunday: '日曜日 1',
    },
  },
  'ar-SA': {
    fiscal: {
      eyebrow: 'تخطيط من دون فرض حدود الأشهر',
      title: 'كيف نوزع الفترات المالية والدراسية؟',
      introduction:
        'لا تنقسم الأشهر الثلاثة عشر المتساوية بالتساوي إلى أنصاف أو أثلاث أو أرباع بحسب عدد الأشهر. الوحدة الثابتة هي الأسبوع: 364 يومًا عاديًا تساوي 52 أسبوعًا تمامًا.',
      formulaRegular: '364 يومًا عاديًا',
      formulaWeeks: '52 أسبوعًا',
      formulaQuarters: '4 أرباع من 13 أسبوعًا',
      cards: [
        {
          title: 'أربعة أرباع مالية متساوية',
          text: 'يضم كل ربع 13 أسبوعًا، أي 91 يومًا عاديًا. قد يقع الإقفال داخل شهر ثابت، لكن كل تقرير يغطي مدة متساوية.',
          detail: '4 × 13 أسبوعًا = 52 أسبوعًا',
        },
        {
          title: 'تقارير كل ثلاثة أو أربعة أشهر',
          text: 'تبقى الأشهر الثلاثة عشر للتفصيل الشهري. وعند التجميع تنشر الشركة نطاق الأسابيع والتواريخ المدنية المقابلة بدل تكوين مجموعات أشهر غير متساوية.',
          detail: 'الأشهر للتفصيل؛ والأسابيع للتجميع',
        },
        {
          title: 'الفترات والفصول وأنصاف السنة',
          text: 'يُحدد أولًا عدد أسابيع الدراسة. في مثال من 40 أسبوعًا: نصفان من 20، أو أربع فترات من 10، أو ثلاثة فصول من 13 و14 و13 أسبوعًا؛ ويُترك الباقي للإجازات والاختبارات والانتقال.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'الإجازات والتقاويم الدراسية',
          text: 'لا يلزم أن تشغل السنة الدراسية السنة المدنية كلها. يمكن جدولة الدروس والتقييمات والإجازات والاستراحات بالأسابيع ثم تكييفها مع المتطلبات المحلية.',
          detail: 'تظل القواعد المحلية مقدمة',
        },
      ],
      note: 'هذا نموذج تشغيلي وليس قاعدة محاسبية أو قانونية تلقائية. يلزم كل بلد وبورصة وشركة ونظام تعليمي نشر التحويل الرسمي.',
      sources: 'أمثلة رسمية لسنوات مالية وفترات مدرسية منظمة بالأسابيع أو الكتل التعليمية',
    },
    yearEnd: {
      eyebrow: 'العبور بين عامين',
      title: 'ماذا يحدث للأيام الواقعة خارج الأشهر؟',
      introduction:
        'يقع يوم السنة — ويوم الكبيس عند وجوده — بعد السبت 28 من الشهر الثالث عشر وقبل الأحد 1 من العام الجديد. لذلك يجب تحديد وضعه الاجتماعي والعملي صراحة.',
      cards: [
        {
          title: 'احتفال وانتقال مشترك',
          text: 'يمكن أن يكون يوم السنة عطلة عامة للاحتفالات المجتمعية والعائلة والثقافة واختتام العام المدني.',
        },
        {
          title: 'راحة مع استمرار الخدمات الأساسية',
          text: 'الراحة المدفوعة هي القاعدة الأوضح. تعمل الصحة والأمن والنقل والخدمات الأساسية الأخرى بالمناوبات والتعويض.',
        },
        {
          title: 'الحماية نفسها ليوم الكبيس',
          text: 'في السنوات الكبيسة يمكن أن يتبع اليوم الإضافي القاعدة نفسها مع برنامج أخف للتطوع أو الثقافة أو الأنشطة البيئية.',
        },
        {
          title: 'يبقى العمل المعتاد ممكنًا',
          text: 'يمكن لبلد أو جهة عمل اعتباره يوم عمل، لكن عليها تحديد الأجر والمواعيد والراحة الأسبوعية والأنظمة لأنه بلا اسم ليوم من الأسبوع.',
        },
      ],
      proposalTitle: 'مقترح أولي متوازن',
      proposalText:
        'جعل يوم السنة عطلة عامة مدفوعة، ويوم الكبيس عند وجوده يومًا مدنيًا بالحماية نفسها. تستمر الخدمات الأساسية مع التعويض وتختار كل جماعة احتفالاتها من دون فرض معنى ديني.',
      saturday: 'السبت 28',
      yearDay: 'يوم السنة',
      leapDay: 'يوم الكبيس',
      leapQualifier: 'في السنوات الكبيسة فقط',
      sunday: 'الأحد 1',
    },
  },
  'hi-IN': {
    fiscal: {
      eyebrow: 'महीनों को जबरन बाँटे बिना योजना',
      title: 'वित्तीय और शैक्षणिक अवधियाँ कैसे बैठेंगी?',
      introduction:
        'महीनों की संख्या से तेरह समान महीनों को आधे, तिहाई या चौथाई में ठीक-ठीक नहीं बाँटा जा सकता। स्थिर इकाई सप्ताह है: 364 नियमित दिन ठीक 52 सप्ताह बनाते हैं।',
      formulaRegular: '364 नियमित दिन',
      formulaWeeks: '52 सप्ताह',
      formulaQuarters: '13 सप्ताह की 4 तिमाहियाँ',
      cards: [
        {
          title: 'चार समान वित्तीय तिमाहियाँ',
          text: 'हर तिमाही 13 सप्ताह या 91 नियमित दिनों की होगी। समापन किसी निश्चित महीने के बीच आ सकता है, लेकिन हर रिपोर्ट समान अवधि कवर करेगी।',
          detail: '4 × 13 सप्ताह = 52 सप्ताह',
        },
        {
          title: 'हर तीन या चार महीने की रिपोर्ट',
          text: '13 महीने मासिक विवरण के लिए बने रहते हैं। समेकन में कंपनी असमान महीने समूह बनाने के बजाय सप्ताह-अंतराल और संबंधित नागरिक तिथियाँ प्रकाशित करेगी।',
          detail: 'विवरण के लिए महीने; समेकन के लिए सप्ताह',
        },
        {
          title: 'अवधियाँ, तिमाहियाँ और सेमेस्टर',
          text: 'पहले शिक्षण सप्ताह तय किए जाते हैं। 40 सप्ताह के उदाहरण में 20-20 सप्ताह के दो सेमेस्टर, 10-10 के चार खंड, या 13, 14 और 13 सप्ताह के तीन खंड होंगे; बाकी समय छुट्टियों, परीक्षाओं और संक्रमण के लिए रहेगा।',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: 'छुट्टियाँ और शैक्षणिक कैलेंडर',
          text: 'शैक्षणिक वर्ष को पूरा नागरिक वर्ष घेरना आवश्यक नहीं है। कक्षाएँ, परीक्षाएँ, छुट्टियाँ और अवकाश सप्ताह से तय कर स्थानीय नियमों के अनुरूप किए जा सकते हैं।',
          detail: 'स्थानीय नियम ही प्राथमिक रहेंगे',
        },
      ],
      note: 'यह संचालन मॉडल है, अपने-आप लागू होने वाला लेखा या कानूनी नियम नहीं। हर देश, बाज़ार, कंपनी और शिक्षा व्यवस्था को आधिकारिक रूपांतरण प्रकाशित करना होगा।',
      sources:
        'सप्ताह या शिक्षण खंडों से आयोजित वित्तीय वर्षों और स्कूल अवधियों के आधिकारिक उदाहरण',
    },
    yearEnd: {
      eyebrow: 'दो वर्षों के बीच का संक्रमण',
      title: 'महीनों से बाहर के दिनों का क्या होगा?',
      introduction:
        'वर्ष दिवस — और मौजूद होने पर लीप दिवस — तेरहवें महीने के शनिवार 28 के बाद और नए वर्ष के रविवार 1 से पहले आता है। इसलिए उसकी सामाजिक और श्रम स्थिति स्पष्ट रूप से तय करनी होगी।',
      cards: [
        {
          title: 'उत्सव और साझा संक्रमण',
          text: 'वर्ष दिवस सामुदायिक उत्सव, परिवार, संस्कृति और नागरिक वर्ष के समापन के लिए सार्वजनिक अवकाश हो सकता है।',
        },
        {
          title: 'आवश्यक सेवाओं के साथ विश्राम',
          text: 'वेतन सहित अवकाश सबसे स्पष्ट नियम है। स्वास्थ्य, सुरक्षा, परिवहन और दूसरी आवश्यक सेवाएँ पाली और क्षतिपूर्ति से चलेंगी।',
        },
        {
          title: 'लीप दिवस को समान सुरक्षा',
          text: 'लीप वर्ष में अतिरिक्त दिन इसी नियम पर चल सकता है, साथ में स्वयंसेवा, संस्कृति या पर्यावरण गतिविधियों का हल्का कार्यक्रम रखा जा सकता है।',
        },
        {
          title: 'सामान्य काम भी संभव रहेगा',
          text: 'देश या नियोक्ता इन्हें कार्यदिवस मान सकता है, लेकिन सप्ताह-दिन नाम न होने के कारण वेतन, समय-सीमा, साप्ताहिक विश्राम और प्रणालियों के नियम तय करने होंगे।',
        },
      ],
      proposalTitle: 'एक संतुलित प्रारंभिक प्रस्ताव',
      proposalText:
        'वर्ष दिवस को वेतन सहित सार्वजनिक अवकाश और लीप दिवस को, जब वह हो, समान रूप से सुरक्षित नागरिक दिन बनाया जाए। आवश्यक सेवाएँ क्षतिपूर्ति के साथ चलें और समुदाय बिना धार्मिक अर्थ थोपे अपने उत्सव चुनें।',
      saturday: 'शनिवार 28',
      yearDay: 'वर्ष दिवस',
      leapDay: 'लीप दिवस',
      leapQualifier: 'केवल लीप वर्षों में',
      sunday: 'रविवार 1',
    },
  },
  'ko-KR': {
    fiscal: {
      eyebrow: '달을 억지로 나누지 않는 계획',
      title: '회계 기간과 학사 기간을 어떻게 맞출까?',
      introduction:
        '13개의 같은 길이의 달은 달 수만으로 절반, 3등분, 4등분할 수 없습니다. 안정적인 단위는 주이며 364개의 일반일은 정확히 52주입니다.',
      formulaRegular: '364개의 일반일',
      formulaWeeks: '52주',
      formulaQuarters: '13주씩 4분기',
      cards: [
        {
          title: '같은 길이의 네 회계 분기',
          text: '각 분기는 13주, 즉 91개의 일반일입니다. 마감일이 고정 월 중간에 올 수 있지만 모든 보고서는 같은 기간을 다룹니다.',
          detail: '4 × 13주 = 52주',
        },
        {
          title: '3개월 또는 4개월 보고',
          text: '13개월은 월별 세부 내역에 계속 쓰입니다. 연결 보고에는 불균등한 월 묶음 대신 주 구간과 대응하는 민간 날짜를 함께 표시합니다.',
          detail: '세부는 달로, 연결은 주로',
        },
        {
          title: '학기, 3학기제와 2학기제',
          text: '먼저 수업 주 수를 정합니다. 40주라면 20주씩 두 학기, 10주씩 네 기간, 또는 13·14·13주의 세 학기로 나누고 나머지는 방학, 시험과 전환 기간으로 둡니다.',
          detail: '40 = 2 × 20 = 4 × 10 = 13 + 14 + 13',
        },
        {
          title: '방학과 학사 일정',
          text: '학년이 민간 연도 전체를 차지할 필요는 없습니다. 수업, 평가, 방학과 휴식 기간을 주로 정한 뒤 지역 요건에 맞출 수 있습니다.',
          detail: '지역 규정이 계속 우선합니다',
        },
      ],
      note: '이는 운영 모델이지 자동으로 적용되는 회계 또는 법률 규칙이 아닙니다. 각 국가, 거래소, 기업과 교육 체계가 공식 변환 기준을 공표해야 합니다.',
      sources: '주 또는 수업 구간으로 구성한 회계연도와 학기의 공식 사례',
    },
    yearEnd: {
      eyebrow: '두 해 사이의 전환',
      title: '달 밖의 날은 어떻게 보낼까?',
      introduction:
        '연말일과, 있는 해의 윤일은 열세 번째 달 토요일 28일 뒤이자 새해 일요일 1일 앞에 있습니다. 따라서 사회적·노동상의 지위를 명시해야 합니다.',
      cards: [
        {
          title: '축하와 공동의 전환',
          text: '연말일은 공동체 행사, 가족, 문화와 민간 연도 마무리를 위한 공휴일이 될 수 있습니다.',
        },
        {
          title: '필수 서비스를 유지하는 휴식',
          text: '유급 휴식이 가장 명확한 기본안입니다. 의료, 안전, 교통 등 필수 서비스는 교대와 보상으로 운영합니다.',
        },
        {
          title: '윤일도 같은 보호',
          text: '윤년의 추가일은 같은 규칙을 따르고 봉사, 문화 또는 환경 활동 같은 가벼운 프로그램을 둘 수 있습니다.',
        },
        {
          title: '정상 근무도 가능',
          text: '국가나 고용주가 근무일로 정할 수 있지만 요일 이름이 없으므로 급여, 기한, 주간 휴식과 시스템 규칙을 명시해야 합니다.',
        },
      ],
      proposalTitle: '균형 잡힌 출발 제안',
      proposalText:
        '연말일을 유급 공휴일로, 윤일이 있는 해에는 윤일을 같은 보호를 받는 시민의 날로 둡니다. 필수 서비스는 보상과 함께 계속하고, 종교적 의미를 강요하지 않은 채 공동체가 행사를 선택합니다.',
      saturday: '토요일 28',
      yearDay: '연말일',
      leapDay: '윤일',
      leapQualifier: '윤년에만',
      sunday: '일요일 1',
    },
  },
};
