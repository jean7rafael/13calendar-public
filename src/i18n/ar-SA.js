/* ===========================================================
   أسماء الأشهر المستخدمة في هذه اللغة
=========================================================== */

const months12Long = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const months12Short = [
  'ينا',
  'فبر',
  'مار',
  'أبر',
  'ماي',
  'يون',
  'يول',
  'أغس',
  'سبت',
  'أكت',
  'نوف',
  'ديس',
];

/* ===========================================================
   دليل نصوص الواجهة
=========================================================== */

export default {
  app: {
    title: 'تحويل التواريخ: التقويم الغريغوري – التقويم الثابت الدولي',
    browserTitle: '13 Calendar — محوّل التواريخ',
  },

  introduction: {
    eyebrow: 'التكامل البصري',
    title: 'رفيق طبيعي لموقع 13months.net',
    description:
      'تستخدم هذه الصفحة مجموعة الألوان والتباين والحدود والأشكال نفسها في المشروع المرجعي دون تغيير الشاشة الرئيسية للتطبيق.',
  },

  footer: {
    ariaLabel: 'تذييل معلوماتي',
    title: 'التواريخ تحتاج إلى سياق',
    description: 'قارن بين التقاويم مع مصادر شفافة وقيود موضحة بشكل صريح.',
    sourcesTitle: 'المصادر',
    sourcesText:
      'تجمع بيانات العطل بين date-holidays ومصادر رسمية تمت مراجعتها. وتُحسب أطوار القمر وتحويلات التواريخ محليًا.',
    privacyTitle: 'الخصوصية',
    privacyText:
      'لا حاجة إلى حساب. تبقى تفضيلات اللغة والمظهر والدولة في هذا المتصفح.',
    limitationsTitle: 'قيود البيانات',
    limitationsText:
      'تختلف تغطية العطل الحكومية حسب الدولة والسنة. ويوضح التطبيق السنوات التي لا تتوفر لها تواريخ رسمية مؤكدة.',
    disclaimer:
      'أداة مستقلة مكملة للتقويم الثابت الدولي. غير تابعة لموقع 13months.net أو لأي هيئة معايير.',
    linksLabel: 'روابط التذييل',
    dataSourcesLink: 'مصادر البيانات',
    sourceCodeLink: 'الشفرة المصدرية',
  },

  navigation: {
    menu: 'القائمة',
    backToHome: 'العودة إلى الصفحة الرئيسية',
  },

  language: {
    title: 'لغة الواجهة',
  },

  theme: {
    useLight: 'استخدام الوضع الفاتح',
    useDark: 'استخدام الوضع الداكن',
  },

  holidaySettings: {
    countryTitle: 'العطل حسب الدولة',
    chooseCountry: 'اختر دولة العطل',
    countryHint: 'يمكن أن تختلف لغة الواجهة عن دولة العطل.',
    observedDateFor: 'التاريخ المُعتمد للاحتفال بـ {holiday}',
    coverage: {
      title: 'تغطية العطل الرسمية',
      limitedYears: 'التواريخ الرسمية لهذا البلد مؤكدة فقط للأعوام {years}.',
      missingOfficialYear:
        'لا توجد عطل حكومية مؤكدة لعام {year}. الأعوام المنشورة: {years}.',
      noCivilCalendar:
        'لا توجد عطل حكومية مؤكدة لعام {year}.',
      futureYear:
        'تستخدم العطل الحكومية لعام {year} القواعد الحالية وقد تتغير بعد صدور منشورات رسمية جديدة.',
      historicalYear:
        'أُعيد بناء العطل الحكومية لعام {year} من القواعد المتاحة؛ ولا يتوفر أرشيف للمصدر الرسمي لذلك العام.',
      otherDatesRemain:
        'تظل الأحداث الفلكية والتواريخ الدينية القابلة للحساب والمناسبات متاحة.',
      openSource: 'فتح المصدر الرسمي',
      close: 'إغلاق التنبيه',
    },
    regionFilter: 'المنطقة',
    continents: {
      americas: 'الأمريكتان',
      europe: 'أوروبا',
      africa: 'أفريقيا',
      asia: 'آسيا',
      oceania: 'أوقيانوسيا',
      antarctica: 'القارة القطبية الجنوبية',
    },
    regions: {
      all: 'جميع المناطق',
      americasNorth: 'أمريكا الشمالية',
      americasCentral: 'أمريكا الوسطى',
      americasCaribbean: 'منطقة البحر الكاريبي',
      americasSouth: 'أمريكا الجنوبية',
      africaNorth: 'شمال أفريقيا',
      africaWest: 'غرب أفريقيا',
      africaCentral: 'وسط أفريقيا',
      africaEast: 'شرق أفريقيا',
      africaSouthern: 'الجنوب الأفريقي',
      europeNorth: 'بلدان الشمال الأوروبي',
      europeWest: 'غرب أوروبا',
      europeSouth: 'جنوب أوروبا',
      europeEast: 'شرق أوروبا',
      asiaWest: 'الشرق الأوسط',
      asiaCentral: 'آسيا الوسطى',
      asiaSouth: 'جنوب آسيا',
      asiaEast: 'شرق آسيا',
      asiaSoutheast: 'جنوب شرق آسيا',
      oceania: 'أوقيانوسيا',
      antarctica: 'القارة القطبية الجنوبية',
    },
    cancel: 'إلغاء',
    calendar13Mode: {
      title: 'التواريخ في تقويم الأشهر الثلاثة عشر',
      native: 'تواريخ مكيّفة',
      nativeCaption: 'يعيد تطبيق التواريخ الثابتة وقواعد أيام الأسبوع في تقويم الأشهر الثلاثة عشر.',
      corresponding: 'تواريخ مقابلة',
      correspondingCaption: 'يحافظ على اليوم الفعلي نفسه في التقويم الغريغوري.',
    },
    filters: {
      open: 'فتح عوامل التصفية',
      title: 'إظهار في القائمة',
      public: 'العطل الرسمية',
      substitute: 'أيام العطل البديلة',
      optional: 'العطل الاختيارية',
      observance: 'المناسبات التذكارية',
      bank: 'العطل المصرفية',
      school: 'المناسبات المدرسية',
      commercial: 'المناسبات التجارية',
      astronomical: 'الأحداث الفلكية',
      enableAll: 'تفعيل الكل',
    },
  },

  calendar: {
    selectedDate: 'التاريخ المحدد',
    noDate: 'لم يتم تحديد تاريخ',
    gregorian: 'غريغوري',
    today: 'اليوم',
    goToToday: 'الانتقال إلى اليوم',
    gregorianTitle: 'تقويمك',
    fixedCalendarTitle: 'التقويم الثابت الدولي',
    daysThisMonth: '{count} يومًا في هذا الشهر',
    daysEveryMonth: '{count} يومًا في كل شهر',

    weekDaysShort: ['أحد', 'إثن', 'ثلا', 'أرب', 'خمي', 'جمع', 'سبت'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      'سولاريس',
      ...months12Long.slice(6),
      'الأيام الخاصة',
    ],

    months13Short: [...months12Short.slice(0, 6), 'سول', ...months12Short.slice(6), 'خاصة'],

    specialDays: {
      title: 'الأيام الخاصة',
      yearDay: 'يوم السنة',
      yearDayTiming: 'كل عام · بعد 28 ديسمبر',
      yearDayDescription:
        'عطلة عالمية خارج أي أسبوع أو شهر. اليوم 365 الذي يصل بين عام والعام الذي يليه.',
      leapDay: 'اليوم الكبيس',
      leapYearTiming: 'السنة {year} كبيسة · بعد يوم السنة',
      commonYearTiming: 'السنة {year} غير كبيسة',
      leapDayDescription:
        'يوم إضافي يُضاف كل 4 سنوات مباشرة بعد يوم السنة، وهو أيضًا خارج الدورة الأسبوعية.',
      regularDays: 'الأيام العادية',
      total: 'المجموع',
      totalDays: '{count} يومًا',
    },
  },

  panels: {
    holidays: 'العطل',
    moonPhases: 'أطوار القمر',
    noHolidays: 'لا توجد عطل هذا الشهر!',
    noMoonPhases: 'لا توجد أطوار للقمر هذا الشهر!',
    loadError: 'خطأ أثناء التحميل',
  },

  moonPhases: {
    new: 'محاق',
    waxing: 'التربيع الأول',
    full: 'بدر',
    waning: 'التربيع الأخير',
    filters: {
      open: 'فتح عوامل تصفية أطوار القمر',
      title: 'عرض في البطاقة',
      showTime: 'عرض أوقات أطوار القمر',
      timeCaption: 'التوقيت المحلي للجهاز',
    },
  },
};
