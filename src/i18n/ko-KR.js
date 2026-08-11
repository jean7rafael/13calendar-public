/* ===========================================================
   이 언어에서 사용하는 월 이름
=========================================================== */

const months12Long = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

const months12Short = [...months12Long];

/* ===========================================================
   인터페이스 텍스트 목록
=========================================================== */

export default {
  app: {
    title: '날짜 변환: 그레고리력 – 국제 고정력',
  },

  introduction: {
    eyebrow: '시각적 통합',
    title: '13months.net을 자연스럽게 보완하는 도구',
    description:
      '이 페이지는 애플리케이션의 기본 화면을 변경하지 않으면서 참조 프로젝트와 같은 계열의 색상, 대비, 테두리, 형태를 사용합니다.',
  },

  footer: {
    ariaLabel: '정보 푸터',
    title: '날짜에는 맥락이 필요합니다',
    description: '투명한 출처와 명확히 안내된 한계와 함께 달력을 비교하세요.',
    sourcesTitle: '출처',
    sourcesText:
      '공휴일 데이터는 date-holidays와 검토된 공식 출처를 결합합니다. 달의 위상과 날짜 변환은 로컬에서 계산됩니다.',
    privacyTitle: '개인정보 보호',
    privacyText:
      '계정이 필요하지 않습니다. 언어, 테마, 국가 설정은 이 브라우저에만 저장됩니다.',
    limitationsTitle: '데이터 한계',
    limitationsText:
      '정부 공휴일 제공 범위는 국가와 연도에 따라 다릅니다. 공식 날짜가 확인되지 않은 연도는 앱에서 표시합니다.',
    disclaimer:
      '국제 고정력을 위한 독립적인 보조 도구입니다. 13months.net 또는 표준화 기관과 관련이 없습니다.',
    linksLabel: '푸터 링크',
    dataSourcesLink: '데이터 출처',
    sourceCodeLink: '소스 코드',
  },

  navigation: {
    menu: '메뉴',
    backToHome: '홈페이지로 돌아가기',
  },

  language: {
    title: '인터페이스 언어',
  },

  theme: {
    useLight: '라이트 모드 사용',
    useDark: '다크 모드 사용',
  },

  holidaySettings: {
    countryTitle: '국가별 공휴일',
    chooseCountry: '공휴일 국가 선택',
    countryHint: '인터페이스 언어와 공휴일 국가를 다르게 선택할 수 있습니다.',
    observedDateFor: '{holiday} 대체 휴일',
    coverage: {
      title: '공식 공휴일 제공 범위',
      limitedYears: '이 국가의 공식 날짜는 {years}년만 확인되었습니다.',
      missingOfficialYear: '{year}년의 확인된 정부 공휴일이 없습니다. 공개된 연도: {years}.',
      noCivilCalendar:
        '{year}년의 확인된 정부 공휴일이 없습니다.',
      futureYear: '{year}년 정부 공휴일은 현재 규칙을 사용하며 새로운 공식 발표 후 변경될 수 있습니다.',
      historicalYear:
        '{year}년 정부 공휴일은 사용 가능한 규칙으로 재구성했으며 해당 연도의 공식 자료는 보관되지 않았습니다.',
      otherDatesRemain: '천문 현상, 계산 가능한 종교 날짜, 기념일은 계속 제공됩니다.',
      openSource: '공식 출처 열기',
      close: '안내 닫기',
    },
    regionFilter: '지역',
    continents: {
      americas: '아메리카',
      europe: '유럽',
      africa: '아프리카',
      asia: '아시아',
      oceania: '오세아니아',
      antarctica: '남극',
    },
    regions: {
      all: '모든 지역',
      americasNorth: '북아메리카',
      americasCentral: '중앙아메리카',
      americasCaribbean: '카리브해 지역',
      americasSouth: '남아메리카',
      africaNorth: '북아프리카',
      africaWest: '서아프리카',
      africaCentral: '중앙아프리카',
      africaEast: '동아프리카',
      africaSouthern: '남부 아프리카',
      europeNorth: '북유럽 국가',
      europeWest: '서유럽',
      europeSouth: '남유럽',
      europeEast: '동유럽',
      asiaWest: '중동',
      asiaCentral: '중앙아시아',
      asiaSouth: '남아시아',
      asiaEast: '동아시아',
      asiaSoutheast: '동남아시아',
      oceania: '오세아니아',
      antarctica: '남극',
    },
    cancel: '취소',
    calendar13Mode: {
      title: '13개월 달력의 날짜',
      native: '조정된 날짜',
      nativeCaption: '13개월 달력에서 고정 날짜와 요일 규칙을 다시 적용합니다.',
      corresponding: '대응 날짜',
      correspondingCaption: '그레고리력과 동일한 실제 날짜를 유지합니다.',
    },
    filters: {
      open: '필터 열기',
      title: '목록에 표시',
      public: '공휴일',
      substitute: '대체 공휴일',
      optional: '선택 휴일',
      observance: '기념일',
      bank: '은행 휴일',
      school: '학교 일정',
      commercial: '상업 일정',
      astronomical: '천문 현상',
      enableAll: '모두 활성화',
    },
  },

  calendar: {
    selectedDate: '선택한 날짜',
    noDate: '선택한 날짜 없음',
    gregorian: '그레고리력',
    today: '오늘',
    goToToday: '오늘로 이동',
    gregorianTitle: '현재 달력 — 그레고리력',
    fixedCalendarTitle: '국제 고정 달력',
    daysThisMonth: '이번 달 {count}일',
    daysEveryMonth: '모든 달은 28일',

    weekDaysShort: ['일', '월', '화', '수', '목', '금', '토'],

    months12Long,
    months12Short,

    months13Long: [
      ...months12Long.slice(0, 6),
      '솔라리스',
      ...months12Long.slice(6),
      '특별한 날',
    ],

    months13Short: [...months12Short.slice(0, 6), '솔', ...months12Short.slice(6), '특별일'],

    specialDays: {
      title: '특별한 날',
      yearDay: '해의 날',
      yearDayTiming: '매년 · 12월 28일 이후',
      yearDayDescription:
        '어떤 주나 달에도 속하지 않는 전 세계 공휴일. 한 해와 다음 해를 잇는 365번째 날입니다.',
      leapDay: '윤일',
      leapYearTiming: '{year}년은 윤년 · 해의 날 이후',
      commonYearTiming: '{year}년은 윤년이 아님',
      leapDayDescription:
        '4년마다 해의 날 직후에 추가되는 윤일입니다. 주간 주기에도 속하지 않습니다.',
      regularDays: '일반 날짜',
      total: '합계',
      totalDays: '{count}일',
    },
  },

  panels: {
    holidays: '공휴일',
    moonPhases: '달의 위상',
    noHolidays: '이번 달에는 공휴일이 없습니다!',
    noMoonPhases: '이번 달에는 달의 위상이 없습니다!',
    loadError: '로드 중 오류',
  },

  moonPhases: {
    new: '삭',
    waxing: '상현',
    full: '보름달',
    waning: '하현',
    filters: {
      open: '달의 위상 필터 열기',
      title: '카드에 표시',
      showTime: '달의 위상 시각 표시',
      timeCaption: '기기의 현지 시각',
    },
  },
};
