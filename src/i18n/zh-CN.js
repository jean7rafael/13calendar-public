/* ===========================================================
   此语言使用的月份名称
=========================================================== */

const months12Long = [
  '一月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '十二月',
];

const months12Short = [...months12Long];

/* ===========================================================
   界面文本目录
=========================================================== */

export default {
  app: {
    title: '日期转换：公历 – 国际固定历',
    browserTitle: '13 Calendar — 日期转换器',
  },

  introduction: {
    eyebrow: '日期转换',
    title: '同一日期，两种日历',
    description:
      '比较公历与国际固定历，并查看各国节假日、月相和对应日期。',
  },

  footer: {
    ariaLabel: '信息页脚',
    title: '日期需要语境',
    description: '通过透明的数据来源和明确的限制说明比较不同日历。',
    sourcesTitle: '数据来源',
    sourcesText:
      '节假日数据结合了 date-holidays 与经审核的官方来源。月相和日期转换均在本地计算。',
    privacyTitle: '隐私',
    privacyText: '无需账户。您的语言、主题和国家偏好仅保存在此浏览器中。',
    limitationsTitle: '数据限制',
    limitationsText:
      '政府节假日的覆盖范围因国家和年份而异。应用会标记尚无已确认官方日期的年份。',
    disclaimer:
      '国际固定历的独立辅助工具，与 13months.net 及任何标准化机构均无隶属关系。',
    linksLabel: '页脚链接',
    dataSourcesLink: '数据来源',
    wikipediaLink: '维基百科',
    sourceCodeLink: '源代码',
  },

  navigation: {
    menu: '菜单',
    closeMenu: '关闭菜单',
    backToHome: '返回首页',
  },

  language: {
    title: '界面语言',
  },

  theme: {
    useLight: '使用浅色模式',
    useDark: '使用深色模式',
  },

  holidaySettings: {
    countryTitle: '按国家查看节假日',
    chooseCountry: '选择节假日所属国家',
    countryHint: '界面语言可以与节假日国家不同。',
    observedDateFor: '{holiday}的调休日期',
    coverage: {
      title: '官方节假日覆盖范围',
      limitedYears: '该国家的官方日期仅已确认 {years} 年。',
      missingOfficialYear: '尚无 {year} 年已确认的政府节假日。已发布年份：{years}。',
      noCivilCalendar:
        '尚无 {year} 年已确认的政府节假日。',
      futureYear: '{year} 年的政府节假日使用现行规则，可能会随新的官方公告而变更。',
      historicalYear:
        '{year} 年的政府节假日由现有规则重建；本数据库未归档该年官方来源。',
      otherDatesRemain: '天文事件、可计算的宗教日期和纪念日仍然可用。',
      openSource: '打开官方来源',
      close: '关闭提示',
    },
    regionFilter: '地区',
    continents: {
      americas: '美洲',
      europe: '欧洲',
      africa: '非洲',
      asia: '亚洲',
      oceania: '大洋洲',
      antarctica: '南极洲',
    },
    regions: {
      all: '所有地区',
      americasNorth: '北美洲',
      americasCentral: '中美洲',
      americasCaribbean: '加勒比地区',
      americasSouth: '南美洲',
      africaNorth: '北非',
      africaWest: '西非',
      africaCentral: '中非',
      africaEast: '东非',
      africaSouthern: '南部非洲',
      europeNorth: '北欧国家',
      europeWest: '西欧',
      europeSouth: '南欧',
      europeEast: '东欧',
      asiaWest: '中东',
      asiaCentral: '中亚',
      asiaSouth: '南亚',
      asiaEast: '东亚',
      asiaSoutheast: '东南亚',
      oceania: '大洋洲',
      antarctica: '南极洲',
    },
    cancel: '取消',
    calendar13Mode: {
      title: '十三月历中的日期',
      native: '适配日期',
      nativeCaption: '在十三月历中重新应用固定日期和星期规则。',
      corresponding: '对应日期',
      correspondingCaption: '保留与公历相同的实际日期。',
    },
    filters: {
      open: '打开筛选器',
      title: '在列表中显示',
      public: '法定节假日',
      substitute: '调休日',
      optional: '可选节假日',
      observance: '纪念日',
      bank: '银行假日',
      school: '学校假期',
      commercial: '商业日期',
      astronomical: '天文事件',
      enableAll: '全部启用',
    },
  },

  calendar: {
    selectedDate: '已选日期',
    noDate: '未选择日期',
    gregorian: '公历',
    today: '今天',
    goToToday: '转到今天',
    gregorianTitle: '您的日历',
    fixedCalendarTitle: '国际固定历',
    calendar13Short: '13个月',
    mobileComparisonHint: '旋转屏幕或使用更大的显示器，即可并排比较两个日历。',
    daysThisMonth: '本月 {count} 天',
    daysEveryMonth: '每个月 {count} 天',

    weekDaysShort: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],

    months12Long,
    months12Short,

    months13Long: [...months12Long.slice(0, 6), '索拉里斯', ...months12Long.slice(6), '特殊日'],

    months13Short: [...months12Short.slice(0, 6), '索拉里斯', ...months12Short.slice(6), '特殊日'],

    specialDays: {
      title: '特殊日',
      yearDay: '年度日',
      yearDayTiming: '每年 · 12月28日之后',
      yearDayDescription:
        '一个不属于任何星期或月份的全球节日。连接两年的第365天。',
      leapDay: '闰日',
      leapYearTiming: '{year}年是闰年 · 年度日之后',
      commonYearTiming: '{year}年不是闰年',
      leapDayDescription:
        '每4年在年度日之后紧接着增加的一个闰日，也不属于每周循环。',
      regularDays: '常规日',
      total: '总计',
      totalDays: '{count}天',
    },
  },

  panels: {
    holidays: '节假日',
    moonPhases: '月相',
    noHolidays: '本月没有节假日！',
    noMoonPhases: '本月没有月相！',
    loadError: '加载时出错',
  },

  moonPhases: {
    new: '新月',
    waxing: '上弦月',
    full: '满月',
    waning: '下弦月',
    filters: {
      open: '打开月相筛选器',
      title: '在卡片中显示',
      showTime: '显示月相时间',
      timeCaption: '设备本地时间',
    },
  },
};
