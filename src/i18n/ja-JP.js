/* ===========================================================
   この言語で使用する月名
=========================================================== */

const months12Long = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
];

const months12Short = [...months12Long];

/* ===========================================================
   インターフェース文字列カタログ
=========================================================== */

export default {
  app: {
    title: '日付変換：グレゴリオ暦 – 国際固定暦',
  },

  introduction: {
    eyebrow: 'ビジュアル統合',
    title: '13months.net を自然に補完するツール',
    description:
      'このページでは、アプリのメイン画面を変えることなく、参照プロジェクトと同じ系統の配色、コントラスト、境界線、形状を取り入れています。',
  },

  footer: {
    ariaLabel: '情報フッター',
    title: '日付には文脈が必要です',
    description: '透明な出典と明確なデータの制限とともにカレンダーを比較できます。',
    sourcesTitle: '出典',
    sourcesText:
      '祝日データは date-holidays と確認済みの公式情報を組み合わせています。月相と日付変換はローカルで計算されます。',
    privacyTitle: 'プライバシー',
    privacyText:
      'アカウントは不要です。言語、テーマ、国の設定はこのブラウザ内に保存されます。',
    limitationsTitle: 'データの制限',
    limitationsText:
      '政府の祝日データの収録範囲は国と年によって異なります。公式日付が確認できない年はアプリ内で表示されます。',
    disclaimer:
      '国際固定暦の独立した補助ツールです。13months.net または標準化団体との提携関係はありません。',
    linksLabel: 'フッターリンク',
    dataSourcesLink: 'データ出典',
    sourceCodeLink: 'ソースコード',
  },

  navigation: {
    menu: 'メニュー',
    backToHome: 'ホームページに戻る',
  },

  language: {
    title: '表示言語',
  },

  theme: {
    useLight: 'ライトモードを使用',
    useDark: 'ダークモードを使用',
  },

  holidaySettings: {
    countryTitle: '国別の祝日',
    chooseCountry: '祝日の国を選択',
    countryHint: '表示言語と祝日の国は別々に選択できます。',
    observedDateFor: '{holiday}の振替日',
    coverage: {
      title: '公式の祝日の収録範囲',
      limitedYears: 'この国の公式日付は {years} 年分のみ確認済みです。',
      missingOfficialYear: '{year} 年の政府の祝日は確認されていません。公開済みの年：{years}。',
      noCivilCalendar:
        '{year} 年の政府の祝日は確認されていません。',
      futureYear: '{year} 年の政府の祝日は現行ルールに基づき、今後の公式発表で変更される場合があります。',
      historicalYear:
        '{year} 年の政府の祝日は利用可能なルールから復元したもので、その年の公式資料は未収録です。',
      otherDatesRemain: '天文現象、計算可能な宗教上の日付、記念日は引き続き表示されます。',
      openSource: '公式ソースを開く',
      close: 'お知らせを閉じる',
    },
    regionFilter: '地域',
    continents: {
      americas: 'アメリカ',
      europe: 'ヨーロッパ',
      africa: 'アフリカ',
      asia: 'アジア',
      oceania: 'オセアニア',
      antarctica: '南極',
    },
    regions: {
      all: 'すべての地域',
      americasNorth: '北アメリカ',
      americasCentral: '中央アメリカ',
      americasCaribbean: 'カリブ海地域',
      americasSouth: '南アメリカ',
      africaNorth: '北アフリカ',
      africaWest: '西アフリカ',
      africaCentral: '中央アフリカ',
      africaEast: '東アフリカ',
      africaSouthern: '南部アフリカ',
      europeNorth: '北欧諸国',
      europeWest: '西ヨーロッパ',
      europeSouth: '南ヨーロッパ',
      europeEast: '東ヨーロッパ',
      asiaWest: '中東',
      asiaCentral: '中央アジア',
      asiaSouth: '南アジア',
      asiaEast: '東アジア',
      asiaSoutheast: '東南アジア',
      oceania: 'オセアニア',
      antarctica: '南極',
    },
    cancel: 'キャンセル',
    calendar13Mode: {
      title: '13か月暦の日付',
      native: '適応した日付',
      nativeCaption: '固定日と曜日の規則を13か月暦で再適用します。',
      corresponding: '対応する日付',
      correspondingCaption: 'グレゴリオ暦と同じ物理的な日を維持します。',
    },
    filters: {
      open: 'フィルターを開く',
      title: '一覧に表示',
      public: '祝祭日',
      substitute: '振替休日',
      optional: '任意の休日',
      observance: '記念日',
      bank: '銀行休業日',
      school: '学校行事',
      commercial: '商業イベント',
      astronomical: '天文現象',
      enableAll: 'すべて有効にする',
    },
  },

  calendar: {
    selectedDate: '選択した日付',
    noDate: '日付が選択されていません',
    gregorian: 'グレゴリオ暦',
    today: '今日',
    goToToday: '今日へ移動',

    weekDaysShort: ['日', '月', '火', '水', '木', '金', '土'],

    months12Long,
    months12Short,

    months13Long: [...months12Long.slice(0, 6), 'ソラリス', ...months12Long.slice(6), '特別な日'],

    months13Short: [...months12Short.slice(0, 6), 'ソラリス', ...months12Short.slice(6), '特別日'],

    specialDays: {
      title: '特別な日',
      yearDay: '年の日',
      yearDayTiming: '毎年・12月28日の後',
      yearDayDescription:
        'どの週や月にも属さない世界共通の休日。1年と次の年をつなぐ365日目です。',
      leapDay: 'うるう日',
      leapYearTiming: '{year}年はうるう年・年の日の後',
      commonYearTiming: '{year}年はうるう年ではありません',
      leapDayDescription:
        '4年ごとに年の日の直後に加えられる特別な1日。週の周期にも属しません。',
      regularDays: '通常の日',
      total: '合計',
      totalDays: '{count}日',
    },
  },

  panels: {
    holidays: '祝日',
    moonPhases: '月の満ち欠け',
    noHolidays: '今月の祝日はありません！',
    noMoonPhases: '今月の月相はありません！',
    loadError: '読み込みエラー',
  },

  moonPhases: {
    new: '新月',
    waxing: '上弦',
    full: '満月',
    waning: '下弦',
    filters: {
      open: '月相フィルターを開く',
      title: 'カードに表示',
      showTime: '月相の時刻を表示',
      timeCaption: '端末の現地時刻',
    },
  },
};
