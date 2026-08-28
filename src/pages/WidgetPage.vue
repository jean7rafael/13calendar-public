<template>
  <div class="widget-page">
    <main>
      <div class="widget-page__brand" aria-hidden="true">13</div>
      <div class="widget-page__date">
        <span>{{ t('education.hero.gregorian') }}</span>
        <AppComparisonDateTitle :title="gregorianTitle" />
        <small>{{ comparisonYear }}</small>
      </div>
      <div class="widget-page__divider" aria-hidden="true">↔</div>
      <div class="widget-page__date widget-page__date--fixed">
        <span>{{ t('education.hero.fixed') }}</span>
        <AppComparisonDateTitle :title="fixedTitle" />
        <small>{{ comparisonYear }}</small>
      </div>
      <a href="https://13calendar.pages.dev/tools" target="_blank" rel="noopener noreferrer">
        {{ t('education.tools.widget.credit') }}
      </a>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useMeta, useQuasar } from 'quasar';
import AppComparisonDateTitle from 'src/components/AppComparisonDateTitle.vue';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import { buildDateComparisonPresentation } from 'src/utils/calendarTools';

const supportedLocales = new Set([
  'pt-BR',
  'en-US',
  'fr-FR',
  'es-ES',
  'de-DE',
  'ru-RU',
  'it-IT',
  'zh-CN',
  'ja-JP',
  'ar-SA',
  'hi-IN',
  'ko-KR',
]);

const route = useRoute();
const quasar = useQuasar();
const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();
const currentTime = ref(new Date());
let clockInterval;

useMeta(() => ({
  title: t('education.tools.widget.title'),
  meta: {
    robots: { name: 'robots', content: 'noindex, follow' },
  },
}));

const gregorianParts = computed(() => ({
  year: currentTime.value.getFullYear(),
  month: currentTime.value.getMonth() + 1,
  day: currentTime.value.getDate(),
}));
const labels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));
const comparison = computed(() =>
  buildDateComparisonPresentation(gregorianParts.value, locale.value, labels.value),
);
const gregorianTitle = computed(() => comparison.value?.gregorianTitle || '');
const fixedTitle = computed(() => comparison.value?.fixedTitle || '');
const comparisonYear = computed(() => comparison.value?.year || '');

onMounted(() => {
  const requestedLocale = String(route.query.lang || '');
  if (supportedLocales.has(requestedLocale)) {
    locale.value = requestedLocale;
    document.documentElement.lang = requestedLocale;
    document.documentElement.dir = requestedLocale === 'ar-SA' ? 'rtl' : 'ltr';
  }

  const requestedTheme = String(route.query.theme || 'auto');
  quasar.dark.set(['light', 'dark'].includes(requestedTheme) ? requestedTheme === 'dark' : 'auto');
  clockInterval = window.setInterval(() => {
    currentTime.value = new Date();
  }, 60_000);
});

onBeforeUnmount(() => window.clearInterval(clockInterval));
</script>

<style scoped>
.widget-page {
  min-height: 100vh !important;
  display: grid;
  place-items: center;
  padding: 16px;
  color: var(--app-text);
  background: var(--app-page-gradient);
}

.widget-page main {
  width: min(100%, 760px);
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 18px;
  padding: 24px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 20px;
  box-shadow: var(--app-card-shadow);
}

.widget-page__brand {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  color: white;
  background: linear-gradient(
    135deg,
    var(--app-accent-purple-strong),
    var(--app-accent-purple)
  );
  border-radius: 15px;
  font-size: 19px;
  font-weight: 850;
}

.widget-page__date {
  min-width: 0;
  display: grid;
  justify-items: center;
  gap: 4px;
  text-align: center;
}

.widget-page__date > span {
  min-height: 3.75em;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  color: var(--app-text-faint);
  font-size: 9px;
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.widget-page__date > strong {
  min-height: 2.5em;
  font-size: clamp(14px, 3vw, 19px);
  line-height: 1.25;
  white-space: normal;
}

.widget-page__date small {
  min-height: 1.4em;
  color: var(--app-text-muted);
  font-size: 10px;
  line-height: 1.4;
}

.widget-page__date--fixed strong {
  color: var(--app-primary-text);
}

.widget-page__divider {
  color: var(--app-text-faint);
}

.widget-page a {
  grid-column: 2 / -1;
  color: var(--app-primary-text);
  font-size: 11px;
  font-weight: 700;
  text-align: center;
  text-decoration: none;
}

@media (max-width: 520px) {
  .widget-page main {
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
  }

  .widget-page__brand {
    grid-row: 1 / 3;
  }

  .widget-page__divider {
    display: none;
  }

  .widget-page__date > span {
    min-height: 0;
  }

  .widget-page a {
    grid-column: 1 / -1;
    text-align: center;
  }
}
</style>
