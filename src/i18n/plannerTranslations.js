/* ===========================================================
   PLANEJADOR E CALENDÁRIOS ICS

   Textos adicionais da experiência paginada e do seletor de
   calendários. Todos os idiomas são completos para que o PDF
   nunca dependa de fallback em inglês.
=========================================================== */

export const plannerExtensionMessages = {
  'pt-BR': {
    ics: {
      title: 'O que você quer adicionar ao calendário?',
      milestonesTitle: 'Marcos do ano',
      milestonesText: 'Os 13 inícios de mês, o Dia do Ano e o Dia Bissexto, quando houver.',
      dailyTitle: 'Calendário diário completo',
      dailyWarning:
        'Esta opção cria 365 ou 366 eventos e pode deixar o calendário visualmente carregado.',
    },
    print: {
      notes: 'Anotações',
      priorities: 'Prioridades do mês',
      noLeapDay: 'Este ano não possui Dia Bissexto.',
    },
    pdf: {
      title: 'Baixar o planejador em PDF',
      description:
        'Escolha o ano. O arquivo sempre terá 40 páginas A4 e não depende da impressão do navegador.',
      commonModel: 'Modelo para ano normal',
      leapModel: 'Modelo para ano bissexto',
      pageCount: '{count} páginas prontas para salvar ou imprimir',
      download: 'Baixar PDF',
      progress: 'Preparando página {current} de {total}…',
      downloaded: 'PDF de {count} páginas baixado.',
      failed: 'Não foi possível gerar o PDF neste dispositivo. Tente novamente.',
    },
  },
  'en-US': {
    ics: {
      title: 'What would you like to add to your calendar?',
      milestonesTitle: 'Year milestones',
      milestonesText: 'The 13 month starts, Year Day, and Leap Day when applicable.',
      dailyTitle: 'Complete daily calendar',
      dailyWarning: 'This option creates 365 or 366 events and may make your calendar look busy.',
    },
    print: {
      notes: 'Notes',
      priorities: 'Monthly priorities',
      noLeapDay: 'This year has no Leap Day.',
    },
    pdf: {
      title: 'Download the PDF planner',
      description:
        'Choose the year. The file always has 40 A4 pages and does not depend on browser printing.',
      commonModel: 'Common-year model',
      leapModel: 'Leap-year model',
      pageCount: '{count} pages ready to save or print',
      download: 'Download PDF',
      progress: 'Preparing page {current} of {total}…',
      downloaded: '{count}-page PDF downloaded.',
      failed: 'The PDF could not be generated on this device. Please try again.',
    },
  },
  'es-ES': {
    ics: {
      title: '¿Qué quieres añadir a tu calendario?',
      milestonesTitle: 'Hitos del año',
      milestonesText: 'Los 13 inicios de mes, el Día del Año y el Día Bisiesto cuando corresponda.',
      dailyTitle: 'Calendario diario completo',
      dailyWarning:
        'Esta opción crea 365 o 366 eventos y puede recargar visualmente tu calendario.',
    },
    print: {
      notes: 'Notas',
      priorities: 'Prioridades del mes',
      noLeapDay: 'Este año no tiene Día Bisiesto.',
    },
    pdf: {
      title: 'Descargar el planificador en PDF',
      description:
        'Elige el año. El archivo siempre tendrá 40 páginas A4 y no depende de la impresión del navegador.',
      commonModel: 'Modelo para año común',
      leapModel: 'Modelo para año bisiesto',
      pageCount: '{count} páginas listas para guardar o imprimir',
      download: 'Descargar PDF',
      progress: 'Preparando la página {current} de {total}…',
      downloaded: 'PDF de {count} páginas descargado.',
      failed: 'No se pudo generar el PDF en este dispositivo. Inténtalo de nuevo.',
    },
  },
  'fr-FR': {
    ics: {
      title: 'Que souhaitez-vous ajouter à votre calendrier ?',
      milestonesTitle: 'Repères de l’année',
      milestonesText: 'Les 13 débuts de mois, le Jour de l’An et le Jour bissextile si nécessaire.',
      dailyTitle: 'Calendrier quotidien complet',
      dailyWarning: 'Cette option crée 365 ou 366 événements et peut encombrer votre calendrier.',
    },
    print: {
      notes: 'Notes',
      priorities: 'Priorités du mois',
      noLeapDay: 'Cette année n’a pas de Jour bissextile.',
    },
    pdf: {
      title: 'Télécharger le planificateur PDF',
      description:
        'Choisissez l’année. Le fichier contient toujours 40 pages A4 et ne dépend pas de l’impression du navigateur.',
      commonModel: 'Modèle pour année commune',
      leapModel: 'Modèle pour année bissextile',
      pageCount: '{count} pages prêtes à enregistrer ou imprimer',
      download: 'Télécharger le PDF',
      progress: 'Préparation de la page {current} sur {total}…',
      downloaded: 'PDF de {count} pages téléchargé.',
      failed: 'Impossible de générer le PDF sur cet appareil. Réessayez.',
    },
  },
  'de-DE': {
    ics: {
      title: 'Was möchten Sie zu Ihrem Kalender hinzufügen?',
      milestonesTitle: 'Jahresmarken',
      milestonesText: 'Die 13 Monatsanfänge, der Jahrestag und gegebenenfalls der Schalttag.',
      dailyTitle: 'Vollständiger Tageskalender',
      dailyWarning:
        'Diese Option erstellt 365 oder 366 Ereignisse und kann den Kalender sehr voll wirken lassen.',
    },
    print: {
      notes: 'Notizen',
      priorities: 'Monatsprioritäten',
      noLeapDay: 'Dieses Jahr hat keinen Schalttag.',
    },
    pdf: {
      title: 'PDF-Planer herunterladen',
      description:
        'Wählen Sie das Jahr. Die Datei hat immer 40 A4-Seiten und ist nicht vom Browserdruck abhängig.',
      commonModel: 'Modell für ein normales Jahr',
      leapModel: 'Modell für ein Schaltjahr',
      pageCount: '{count} Seiten zum Speichern oder Drucken',
      download: 'PDF herunterladen',
      progress: 'Seite {current} von {total} wird vorbereitet…',
      downloaded: 'PDF mit {count} Seiten heruntergeladen.',
      failed: 'Das PDF konnte auf diesem Gerät nicht erstellt werden. Versuchen Sie es erneut.',
    },
  },
  'it-IT': {
    ics: {
      title: 'Che cosa vuoi aggiungere al calendario?',
      milestonesTitle: 'Punti chiave dell’anno',
      milestonesText:
        'I 13 inizi del mese, il Giorno dell’Anno e il Giorno Bisestile quando presente.',
      dailyTitle: 'Calendario giornaliero completo',
      dailyWarning:
        'Questa opzione crea 365 o 366 eventi e può rendere il calendario molto affollato.',
    },
    print: {
      notes: 'Note',
      priorities: 'Priorità del mese',
      noLeapDay: 'Quest’anno non ha il Giorno Bisestile.',
    },
    pdf: {
      title: 'Scarica il planner in PDF',
      description:
        'Scegli l’anno. Il file avrà sempre 40 pagine A4 e non dipende dalla stampa del browser.',
      commonModel: 'Modello per anno comune',
      leapModel: 'Modello per anno bisestile',
      pageCount: '{count} pagine pronte da salvare o stampare',
      download: 'Scarica PDF',
      progress: 'Preparazione pagina {current} di {total}…',
      downloaded: 'PDF di {count} pagine scaricato.',
      failed: 'Impossibile generare il PDF su questo dispositivo. Riprova.',
    },
  },
  'ru-RU': {
    ics: {
      title: 'Что добавить в календарь?',
      milestonesTitle: 'Основные даты года',
      milestonesText: 'Начало 13 месяцев, День года и Високосный день, если он есть.',
      dailyTitle: 'Полный ежедневный календарь',
      dailyWarning:
        'Будет создано 365 или 366 событий, поэтому календарь может выглядеть перегруженным.',
    },
    print: {
      notes: 'Заметки',
      priorities: 'Приоритеты месяца',
      noLeapDay: 'В этом году нет Високосного дня.',
    },
    pdf: {
      title: 'Скачать планировщик в PDF',
      description:
        'Выберите год. Файл всегда содержит 40 страниц A4 и не зависит от печати браузера.',
      commonModel: 'Модель обычного года',
      leapModel: 'Модель високосного года',
      pageCount: '{count} страниц для сохранения или печати',
      download: 'Скачать PDF',
      progress: 'Подготовка страницы {current} из {total}…',
      downloaded: 'PDF на {count} страниц загружен.',
      failed: 'Не удалось создать PDF на этом устройстве. Повторите попытку.',
    },
  },
  'ar-SA': {
    ics: {
      title: 'ما الذي تريد إضافته إلى تقويمك؟',
      milestonesTitle: 'محطات السنة',
      milestonesText: 'بدايات الأشهر الثلاثة عشر ويوم السنة ويوم الكبيسة عند وجوده.',
      dailyTitle: 'تقويم يومي كامل',
      dailyWarning: 'ينشئ هذا الخيار 365 أو 366 حدثًا وقد يجعل التقويم مزدحمًا.',
    },
    print: {
      notes: 'ملاحظات',
      priorities: 'أولويات الشهر',
      noLeapDay: 'لا يوجد يوم كبيس في هذا العام.',
    },
    pdf: {
      title: 'تنزيل المخطط بصيغة PDF',
      description: 'اختر السنة. يتكون الملف دائمًا من 40 صفحة A4 ولا يعتمد على طباعة المتصفح.',
      commonModel: 'نموذج السنة العادية',
      leapModel: 'نموذج السنة الكبيسة',
      pageCount: '{count} صفحة جاهزة للحفظ أو الطباعة',
      download: 'تنزيل PDF',
      progress: 'جارٍ إعداد الصفحة {current} من {total}…',
      downloaded: 'تم تنزيل ملف PDF من {count} صفحة.',
      failed: 'تعذر إنشاء ملف PDF على هذا الجهاز. حاول مرة أخرى.',
    },
  },
  'hi-IN': {
    ics: {
      title: 'आप अपने कैलेंडर में क्या जोड़ना चाहते हैं?',
      milestonesTitle: 'वर्ष के प्रमुख पड़ाव',
      milestonesText: '13 महीनों की शुरुआत, वर्ष दिवस और लागू होने पर लीप दिवस।',
      dailyTitle: 'पूरा दैनिक कैलेंडर',
      dailyWarning: 'यह विकल्प 365 या 366 इवेंट बनाता है और कैलेंडर भरा हुआ लग सकता है।',
    },
    print: {
      notes: 'नोट्स',
      priorities: 'महीने की प्राथमिकताएँ',
      noLeapDay: 'इस वर्ष लीप दिवस नहीं है।',
    },
    pdf: {
      title: 'PDF प्लानर डाउनलोड करें',
      description:
        'वर्ष चुनें। फ़ाइल में हमेशा 40 A4 पृष्ठ होंगे और यह ब्राउज़र प्रिंटिंग पर निर्भर नहीं है।',
      commonModel: 'सामान्य वर्ष का मॉडल',
      leapModel: 'लीप वर्ष का मॉडल',
      pageCount: 'सहेजने या प्रिंट करने के लिए {count} पृष्ठ',
      download: 'PDF डाउनलोड करें',
      progress: 'पृष्ठ {current} / {total} तैयार हो रहा है…',
      downloaded: '{count} पृष्ठों का PDF डाउनलोड हुआ।',
      failed: 'इस डिवाइस पर PDF नहीं बन सका। फिर से कोशिश करें।',
    },
  },
  'zh-CN': {
    ics: {
      title: '你想向日历添加什么？',
      milestonesTitle: '年度节点',
      milestonesText: '13 个月的月初、年日，以及适用时的闰日。',
      dailyTitle: '完整每日历',
      dailyWarning: '此选项会创建 365 或 366 个事件，可能使日历显得拥挤。',
    },
    print: {
      notes: '笔记',
      priorities: '本月重点',
      noLeapDay: '今年没有闰日。',
    },
    pdf: {
      title: '下载 PDF 年度计划',
      description: '选择年份。文件始终包含 40 页 A4，不依赖浏览器打印分页。',
      commonModel: '平年模板',
      leapModel: '闰年模板',
      pageCount: '{count} 页，可保存或打印',
      download: '下载 PDF',
      progress: '正在准备第 {current} / {total} 页…',
      downloaded: '已下载 {count} 页 PDF。',
      failed: '无法在此设备上生成 PDF，请重试。',
    },
  },
  'ja-JP': {
    ics: {
      title: 'カレンダーに何を追加しますか？',
      milestonesTitle: '年間の節目',
      milestonesText: '13か月の月初、年の日、該当する場合はうるう日。',
      dailyTitle: '完全な日別カレンダー',
      dailyWarning: '365件または366件の予定が作成され、カレンダーが混み合う場合があります。',
    },
    print: {
      notes: 'メモ',
      priorities: '今月の優先事項',
      noLeapDay: 'この年にはうるう日がありません。',
    },
    pdf: {
      title: 'PDFプランナーをダウンロード',
      description:
        '年を選択してください。ファイルは常にA4・40ページで、ブラウザーの印刷機能には依存しません。',
      commonModel: '平年モデル',
      leapModel: 'うるう年モデル',
      pageCount: '保存または印刷できる{count}ページ',
      download: 'PDFをダウンロード',
      progress: '{total}ページ中{current}ページを準備しています…',
      downloaded: '{count}ページのPDFをダウンロードしました。',
      failed: 'この端末ではPDFを生成できませんでした。もう一度お試しください。',
    },
  },
  'ko-KR': {
    ics: {
      title: '캘린더에 무엇을 추가할까요?',
      milestonesTitle: '한 해의 기준점',
      milestonesText: '13개 월의 시작일, 연말일, 해당되는 경우 윤일을 추가합니다.',
      dailyTitle: '전체 일일 캘린더',
      dailyWarning: '365개 또는 366개의 일정이 생성되어 캘린더가 복잡해 보일 수 있습니다.',
    },
    print: {
      notes: '메모',
      priorities: '이번 달 우선순위',
      noLeapDay: '이 해에는 윤일이 없습니다.',
    },
    pdf: {
      title: 'PDF 플래너 다운로드',
      description:
        '연도를 선택하세요. 파일은 항상 A4 40쪽이며 브라우저 인쇄 페이지 나누기에 의존하지 않습니다.',
      commonModel: '평년 모델',
      leapModel: '윤년 모델',
      pageCount: '저장하거나 인쇄할 수 있는 {count}쪽',
      download: 'PDF 다운로드',
      progress: '{total}쪽 중 {current}쪽 준비 중…',
      downloaded: '{count}쪽 PDF를 다운로드했습니다.',
      failed: '이 기기에서 PDF를 만들 수 없습니다. 다시 시도하세요.',
    },
  },
};
