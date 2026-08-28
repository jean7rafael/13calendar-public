import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { formatComparisonWeekday } from 'src/utils/calendarTools';

/* ===========================================================
   CHAVES DE TRADUÇÃO DAS FASES DA LUA
=========================================================== */

const moonPhaseTranslationKeys = {
  Nova: 'new',
  Crescente: 'waxing',
  Cheia: 'full',
  Minguante: 'waning',
};

/* ===========================================================
   CRIAÇÃO DE LISTAS NUMERADAS DO CATÁLOGO I18N
=========================================================== */

function createTranslatedList(t, path, length) {
  return Array.from({ length }, (_, index) => t(`${path}.${index}`));
}

/* ===========================================================
   TEXTOS REATIVOS UTILIZADOS PELOS CALENDÁRIOS
=========================================================== */

export function useCalendarTranslations() {
  const { t, locale } = useI18n({
    useScope: 'global',
  });

  const months12Long = computed(() => createTranslatedList(t, 'calendar.months12Long', 12));

  const months12Short = computed(() => createTranslatedList(t, 'calendar.months12Short', 12));

  const months13Long = computed(() => createTranslatedList(t, 'calendar.months13Long', 14));

  const months13Short = computed(() => createTranslatedList(t, 'calendar.months13Short', 14));

  const weekDaysShort = computed(() => createTranslatedList(t, 'calendar.weekDaysShort', 7));

  const weekDaysComparison = computed(() =>
    Array.from({ length: 7 }, (_, index) => formatComparisonWeekday(index, locale.value)),
  );

  /* Traduz o nome interno de uma fase ou preserva o desconhecido. */
  function translateMoonPhase(name) {
    if (!name) return '';

    const translationKey = moonPhaseTranslationKeys[name];

    return translationKey ? t(`moonPhases.${translationKey}`) : name;
  }

  /* Apresenta o instante astronômico no fuso e no formato
     de horário naturais do idioma atual do usuário. */
  function formatMoonPhaseTime(instant) {
    const date = new Date(instant);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  return {
    months12Long,
    months12Short,
    months13Long,
    months13Short,
    weekDaysShort,
    weekDaysComparison,
    translateMoonPhase,
    formatMoonPhaseTime,
  };
}
