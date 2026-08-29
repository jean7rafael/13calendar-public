<template>
  <q-page class="education-page">
    <main>
      <section class="education-hero" aria-labelledby="education-title">
        <div class="education-hero__copy">
          <p class="education-eyebrow">{{ t('education.hero.eyebrow') }}</p>
          <h1 id="education-title">{{ t('education.hero.title') }}</h1>
          <p>{{ t('education.hero.description') }}</p>

          <div class="education-hero__actions">
            <q-btn
              no-caps
              unelevated
              icon-right="arrow_forward"
              class="app-action app-action--primary"
              :label="t('education.hero.openCalendars')"
              :to="{ name: 'home' }"
            />
            <q-btn
              no-caps
              unelevated
              icon-right="arrow_downward"
              class="app-action app-action--tertiary"
              :label="t('education.converter.title')"
              href="#education-converter"
            />
          </div>
        </div>

        <div class="education-today-block">
          <q-card
            flat
            bordered
            class="education-today"
            role="group"
            :aria-label="t('education.hero.todayTitle')"
          >
            <q-card-section>
              <div class="education-today__calendars" :class="todayComparisonFitClasses">
                <article class="education-today__calendar education-today__calendar--current">
                  <span>{{ t('education.hero.yourCalendar') }}</span>
                  <AppComparisonDateTitle :title="todayGregorianTitle" separator="" />
                  <small>{{ todayYear }}</small>
                  <p>
                    <strong>{{ gregorianMonthLength }}</strong>
                    {{ t('education.hero.daysThisMonth') }}
                  </p>
                </article>

                <div class="education-today__divider" aria-hidden="true">
                  <span>vs.</span>
                </div>

                <article class="education-today__calendar education-today__calendar--fixed">
                  <span>{{ t('education.hero.fixed') }}</span>
                  <AppComparisonDateTitle :title="todayFixedTitle" separator="" />
                  <small>{{ todayYear }}</small>
                  <p>
                    <strong>28</strong>
                    {{ t('education.hero.daysEveryMonth') }}
                  </p>
                </article>
              </div>
            </q-card-section>
          </q-card>

          <time :datetime="currentTime.toISOString()">{{ currentTimeLabel }}</time>

          <p class="education-today__summary">
            <strong>{{ t('education.hero.factLead') }}</strong>
            <span class="education-today__summary-middle">{{ t('education.hero.factWeek') }}</span>
            <span class="education-today__summary-last">{{ t('education.hero.factLegacy') }}</span>
          </p>
        </div>
      </section>

      <section class="education-section education-idea" aria-labelledby="education-idea-title">
        <div class="education-section__heading">
          <p class="education-eyebrow">{{ t('education.idea.eyebrow') }}</p>
          <h2 id="education-idea-title">{{ t('education.idea.title') }}</h2>
          <p>{{ t('education.idea.description') }}</p>
        </div>

        <div class="education-idea__facts" role="list">
          <article v-for="(fact, index) in ideaFacts" :key="fact.title" role="listitem">
            <q-icon :name="factIcons[index]" color="primary" aria-hidden="true" />
            <h3>{{ fact.title }}</h3>
            <p>{{ fact.text }}</p>
          </article>
        </div>

        <div class="education-month-showcase">
          <div class="education-month-grid__heading">
            <h3 id="education-month-template-title">{{ t('education.idea.monthTitle') }}</h3>
            <p>{{ t('education.idea.monthDescription') }}</p>
          </div>

          <div
            class="education-month-grid"
            role="table"
            aria-labelledby="education-month-template-title"
          >
            <div class="education-month-grid__weekdays" role="row">
              <span v-for="weekday in weekDaysShort" :key="weekday" role="columnheader">
                {{ weekday }}
              </span>
            </div>

            <div class="education-month-grid__days" role="rowgroup">
              <span v-for="day in 28" :key="day" role="cell" :class="dayCellClass(day)">
                {{ day }}
              </span>
            </div>

            <p class="education-month-grid__footnote">
              {{ t('education.idea.monthFootnote') }}
            </p>
          </div>
        </div>

        <div class="education-year">
          <div class="education-year__heading">
            <p class="education-eyebrow">{{ t('education.idea.yearEyebrow') }}</p>
            <h3>{{ educationYear }} {{ t('education.idea.yearAtGlance') }}</h3>
            <p>{{ t('education.idea.yearDescription') }}</p>
          </div>

          <div class="education-year__controls">
            <div class="education-year__navigation">
              <q-btn
                round
                flat
                icon="chevron_left"
                :aria-label="t('education.idea.previousYear', { year: educationYear - 1 })"
                @click="educationYear -= 1"
              />
              <strong aria-live="polite" aria-atomic="true">{{ educationYear }}</strong>
              <q-btn
                round
                flat
                icon="chevron_right"
                :aria-label="t('education.idea.nextYear', { year: educationYear + 1 })"
                @click="educationYear += 1"
              />
            </div>
            <q-btn
              no-caps
              unelevated
              class="app-action app-action--tertiary education-year__today"
              :class="{ 'education-year__today--hidden': educationYear === currentYear }"
              :label="t('education.idea.today')"
              :aria-label="t('education.idea.currentYear', { year: currentYear })"
              :aria-hidden="educationYear === currentYear ? 'true' : undefined"
              :tabindex="educationYear === currentYear ? -1 : undefined"
              @click="educationYear = currentYear"
            />
          </div>

          <div
            class="education-year__months"
            role="list"
            :aria-label="t('education.idea.allMonths', { year: educationYear })"
          >
            <article
              v-for="(month, index) in regularMonths"
              :key="`${month}-${index}`"
              role="listitem"
              :class="{ 'education-year__month--solaris': index === 6 }"
            >
              <header>
                <h4>{{ month }}</h4>
                <small>{{ index + 1 }}</small>
              </header>

              <div class="education-year__weekdays" role="row">
                <span v-for="weekday in weekDaysShort" :key="weekday" role="columnheader">
                  {{ weekday }}
                </span>
              </div>

              <div class="education-year__days" role="rowgroup">
                <span
                  v-for="day in 28"
                  :key="day"
                  role="cell"
                  :class="[
                    dayCellClass(day),
                    { 'education-year__day--today': isCurrentFixedDay(index + 1, day) },
                  ]"
                  :aria-current="isCurrentFixedDay(index + 1, day) ? 'date' : undefined"
                >
                  {{ day }}
                </span>
              </div>
            </article>

            <article id="special-days" class="education-year__month--special" role="listitem">
              <h4>{{ t('education.idea.specialDays') }}</h4>

              <p class="education-year__equation" aria-hidden="true">
                <strong>364</strong>
                <span>+</span>
                <strong class="education-year__count--year-day">1</strong>
                <template v-if="educationYearIsLeap">
                  <span>+</span>
                  <strong class="education-year__count--leap-day">1</strong>
                </template>
              </p>

              <small class="education-year__leap-status">
                {{
                  educationYearIsLeap
                    ? t('education.idea.leapYear', { year: educationYear })
                    : t('education.idea.commonYear', { year: educationYear })
                }}
              </small>

              <dl class="education-year__calculation">
                <div>
                  <dt>{{ t('education.idea.regularDays') }}</dt>
                  <dd>364</dd>
                </div>
                <div>
                  <dt>{{ t('calendar.specialDays.yearDay') }}</dt>
                  <dd class="education-year__count--year-day">+1</dd>
                </div>
                <div :class="{ 'education-year__calculation-row--inactive': !educationYearIsLeap }">
                  <dt>{{ t('calendar.specialDays.leapDay') }}</dt>
                  <dd class="education-year__count--leap-day">
                    {{ educationYearIsLeap ? '+1' : '—' }}
                  </dd>
                </div>
                <div class="education-year__total">
                  <dt>{{ t('education.idea.total') }}</dt>
                  <dd>{{ educationYearTotal }} {{ t('education.idea.days') }}</dd>
                </div>
              </dl>
            </article>
          </div>
        </div>
      </section>

      <EducationDateConverter />

      <EducationHistorySection />

      <EducationSabbathSection />

      <EducationImplementationSection />

      <EducationFeedback />

      <section class="education-cta" aria-labelledby="education-cta-title">
        <h2 id="education-cta-title">{{ t('education.cta.title') }}</h2>
        <p>{{ t('education.cta.description') }}</p>
        <div>
          <q-btn
            no-caps
            unelevated
            icon="calendar_month"
            class="app-action app-action--primary"
            :label="t('education.cta.calendars')"
            :to="{ name: 'home' }"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--secondary"
            icon="construction"
            :label="t('education.tools.toolbarTitle')"
            :to="{ name: 'tools' }"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--tertiary"
            icon="groups"
            :label="t('education.cta.community')"
            :to="{ name: 'community' }"
          />
        </div>
      </section>
    </main>

  </q-page>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useMeta } from 'quasar';
import AppComparisonDateTitle from 'src/components/AppComparisonDateTitle.vue';
import EducationDateConverter from 'src/components/EducationDateConverter.vue';
import EducationFeedback from 'src/components/EducationFeedback.vue';
import EducationHistorySection from 'src/components/EducationHistorySection.vue';
import EducationImplementationSection from 'src/components/EducationImplementationSection.vue';
import EducationSabbathSection from 'src/components/EducationSabbathSection.vue';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import { buildDateComparisonPresentation, splitComparisonTitle } from 'src/utils/calendarTools';
import { isGregorianLeapYear } from '../../shared/internationalFixedCalendar.js';

const { t, tm, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysShort, weekDaysComparison } = useCalendarTranslations();
const canonicalUrl = 'https://13calendar.pages.dev/learn';

const currentTime = ref(new Date());
const currentYear = new Date().getFullYear();
const educationYear = ref(currentYear);
const clockInterval = window.setInterval(() => {
  currentTime.value = new Date();
}, 1_000);

onBeforeUnmount(() => window.clearInterval(clockInterval));

useMeta(() => {
  const title = t('education.browserTitle');
  const description = t('education.hero.description');

  return {
    script: {
      structuredData: {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: canonicalUrl,
          isAccessibleForFree: true,
          about: [
            'International Fixed Calendar',
            '13-month calendar',
            'calendar reform',
            'lunar phases',
          ],
        }),
      },
    },
  };
});

const ideaFacts = computed(() => tm('education.idea.facts'));
const factIcons = ['view_module', 'wb_sunny', 'event_available', 'event_repeat', 'date_range'];
const regularMonths = computed(() => months13Long.value.slice(0, 13));
const educationYearIsLeap = computed(() => isGregorianLeapYear(educationYear.value));
const educationYearTotal = computed(() => (educationYearIsLeap.value ? 366 : 365));
const todayLabels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));
const todayComparison = computed(() =>
  buildDateComparisonPresentation(
    {
      year: currentTime.value.getFullYear(),
      month: currentTime.value.getMonth() + 1,
      day: currentTime.value.getDate(),
    },
    locale.value,
    todayLabels.value,
  ),
);
const todayYear = computed(() => todayComparison.value?.year || '');
const todayGregorianTitle = computed(
  () => todayComparison.value?.gregorianTitle || t('calendar.noDate'),
);
const todayFixedTitle = computed(
  () => todayComparison.value?.fixedTitle || t('calendar.noDate'),
);
const todayComparisonFitClasses = computed(() => {
  const titleParts = [todayGregorianTitle.value, todayFixedTitle.value]
    .map((title) => splitComparisonTitle(title))
    .filter(Boolean);

  return [
    `education-today__calendars--weekday-${comparisonFitTier(
      titleParts.map(({ weekday }) => weekday),
    )}`,
    `education-today__calendars--date-${comparisonFitTier(
      titleParts.map(({ date }) => date),
    )}`,
  ];
});
const gregorianMonthLength = computed(() =>
  new Date(
    currentTime.value.getFullYear(),
    currentTime.value.getMonth() + 1,
    0,
  ).getDate(),
);

const currentTimeLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).format(currentTime.value),
);

function comparisonFitTier(values) {
  const maximumLength = Math.max(
    0,
    ...values.map((value) => Array.from(String(value || '').replace(/\s/gu, '')).length),
  );

  if (maximumLength >= 11) return 'dense';
  if (maximumLength >= 8) return 'compact';

  return 'regular';
}

function dayCellClass(day) {
  return {
    'education-month-grid__day--sunday': day % 7 === 1,
    'education-month-grid__day--saturday': day % 7 === 0,
  };
}

function isCurrentFixedDay(month, day) {
  const fixed = todayComparison.value?.fixed;

  return (
    educationYear.value === currentYear &&
    fixed &&
    !fixed.isYearDay &&
    !fixed.isLeapDay &&
    fixed.month === month &&
    fixed.day === day
  );
}
</script>

<style scoped>
.education-page {
  color: var(--app-text);
}

.education-page main {
  overflow: hidden;
}

.education-hero {
  min-height: min(760px, calc(100vh - 58px));
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(420px, 1.1fr);
  align-items: center;
  gap: clamp(32px, 6vw, 90px);
  max-width: 1240px;
  margin: 0 auto;
  padding: 80px 34px;
}

.education-hero__copy h1 {
  max-width: 680px;
  margin: 10px 0 18px;
  font-size: clamp(44px, 7vw, 82px);
  font-weight: 850;
  line-height: 0.98;
  letter-spacing: -0.055em;
}

.education-hero__copy > p:not(.education-eyebrow) {
  max-width: 660px;
  margin: 0;
  color: var(--app-text-muted);
  font-size: clamp(16px, 2vw, 20px);
  line-height: 1.65;
}

.education-hero__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 18px;
  margin-top: 30px;
}

.education-hero__actions .q-btn {
  max-width: 100%;
  flex: 0 0 auto;
  white-space: nowrap;
}

.education-hero__actions :deep(.q-btn__content) {
  flex-wrap: nowrap;
}

.education-today-block {
  min-width: 0;
  text-align: center;
}

.education-today {
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 28px;
  box-shadow: var(--app-card-shadow);
}

.education-today .q-card__section {
  padding: clamp(26px, 4vw, 46px);
}

.education-today__calendars {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: stretch;
  gap: clamp(12px, 2.5vw, 28px);
}

.education-today__calendar {
  min-width: 0;
  display: grid;
  grid-template-rows: 48px minmax(124px, auto) 28px 44px;
  align-items: center;
  text-align: center;
}

.education-today__calendar > span {
  width: 100%;
  min-width: 0;
  height: 48px;
  display: grid;
  place-items: start center;
  padding-inline: 2px;
  box-sizing: border-box;
  color: var(--app-text-faint);
  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: 0.13em;
  overflow-wrap: normal;
  text-wrap: balance;
  word-break: normal;
  text-transform: uppercase;
}

.education-today__calendar :deep(.app-comparison-date-title) {
  --app-comparison-date-row-gap: 4px;

  min-height: 124px;
  display: grid;
  place-items: center;
  align-content: center;
  font-weight: 800;
}

.education-today__calendar :deep(.app-comparison-date-title > span:first-child) {
  font-size: clamp(27px, 4vw, 48px);
  line-height: 1.18;
  letter-spacing: -0.035em;
}

.education-today__calendars--weekday-compact
  .education-today__calendar
  :deep(.app-comparison-date-title > span:first-child) {
  font-size: clamp(23px, 3.2vw, 38px);
}

.education-today__calendars--weekday-dense
  .education-today__calendar
  :deep(.app-comparison-date-title > span:first-child) {
  font-size: clamp(20px, 2.7vw, 32px);
}

.education-today__calendar :deep(.app-comparison-date-title > span:last-child) {
  color: var(--app-text);
  font-size: clamp(21px, 3vw, 36px);
  line-height: 1.2;
  letter-spacing: -0.025em;
}

.education-today__calendars--date-compact
  .education-today__calendar
  :deep(.app-comparison-date-title > span:last-child) {
  font-size: clamp(19px, 2.5vw, 30px);
}

.education-today__calendars--date-dense
  .education-today__calendar
  :deep(.app-comparison-date-title > span:last-child) {
  font-size: clamp(17px, 2.2vw, 26px);
}

.education-today__calendar--current :deep(.app-comparison-date-title > span:first-child) {
  color: transparent;
  background: linear-gradient(90deg, #94a3b8, #e2e8f0, #94a3b8);
  background-clip: text;
}

.education-today__calendar--fixed > span {
  color: var(--app-primary-text);
}

.education-today__calendar--fixed :deep(.app-comparison-date-title > span:first-child) {
  color: transparent;
  background: linear-gradient(90deg, #818cf8, #8b5cf6, #c084fc);
  background-clip: text;
}

.education-today__calendar > small {
  color: var(--app-text-muted);
  font-size: 15px;
}

.education-today__calendar > p {
  align-self: end;
  margin: 0;
  color: var(--calendar-current-summary);
  font-size: 13px;
}

.education-today__calendar > p strong {
  color: var(--calendar-current-summary-number);
  font-size: inherit;
  font-weight: 700;
}

.education-today__calendar--fixed > p {
  color: var(--calendar-fixed-summary);
}

.education-today__calendar--fixed > p strong {
  color: var(--calendar-fixed-summary-number);
}

.education-today__divider {
  min-height: 230px;
  display: grid;
  grid-template-rows: 1fr auto 1fr;
  place-items: stretch center;
  color: var(--app-text-faint);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.education-today__divider::before,
.education-today__divider::after {
  width: 1px;
  content: '';
  background: linear-gradient(180deg, transparent, var(--app-border-strong));
}

.education-today__divider::after {
  background: linear-gradient(180deg, var(--app-border-strong), transparent);
}

.education-today__divider span {
  padding-block: 9px;
}

.education-today-block > time {
  display: block;
  margin-top: 28px;
  color: var(--app-text-faint);
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: clamp(22px, 3vw, 30px);
  text-align: center;
}

.education-today__summary {
  max-width: 610px;
  margin: 28px auto 0;
  color: var(--app-text-muted);
  font-size: 15px;
  line-height: 1.7;
  text-align: center;
}

.education-today__summary strong {
  display: block;
  color: var(--app-text);
}

.education-today__summary-middle,
.education-today__summary-last {
  display: block;
}

.education-today__summary-last {
  color: var(--app-text-faint);
}

.education-section.education-idea {
  padding-inline: max(18px, calc((100vw - 1740px) / 2));
}

.education-idea__facts {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
  max-width: 1120px;
  margin: 0 auto 78px;
}

.education-idea__facts article {
  grid-column: span 3;
  padding: 30px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 20px;
}

.education-idea__facts article:nth-child(n + 3) {
  grid-column: span 2;
}

.education-idea__facts .q-icon {
  font-size: 28px;
}

.education-idea__facts h3 {
  margin: 15px 0 9px;
  font-size: 19px;
}

.education-idea__facts p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 15px;
  line-height: 1.65;
}

.education-month-showcase {
  margin-bottom: 84px;
}

.education-month-grid {
  max-width: 410px;
  margin: 0 auto;
  padding: 24px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 22px;
  box-shadow: var(--app-card-shadow);
}

.education-month-grid__heading,
.education-year__heading {
  margin-bottom: 28px;
  text-align: center;
}

.education-month-grid__heading h3,
.education-year__heading h3 {
  margin: 0;
  font-size: clamp(24px, 4vw, 36px);
}

.education-month-grid__heading p,
.education-year__heading p {
  max-width: 680px;
  margin: 8px auto 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.55;
}

.education-month-grid__weekdays,
.education-month-grid__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 5px;
}

.education-month-grid__weekdays span {
  padding: 5px 0;
  color: var(--app-text-faint);
  font-size: 10px;
  font-weight: 700;
  text-align: center;
}

.education-month-grid__days span {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  background: var(--calendar-weekday-cell);
  border-radius: 8px;
  font-size: 12px;
}

.education-month-grid__day--saturday {
  color: var(--calendar-weekend-text);
  background: var(--calendar-weekend-cell) !important;
}

.education-month-grid__day--sunday {
  color: var(--calendar-sunday-text) !important;
  background: var(--calendar-sunday-cell) !important;
}

.education-month-grid__footnote {
  margin: 18px 0 0;
  color: var(--app-text-faint);
  font-size: 12px;
  text-align: center;
}

.education-year {
  max-width: 1700px;
  margin: 0 auto;
}

.education-year__heading .education-eyebrow {
  margin-bottom: 8px;
  color: var(--app-accent-green-strong);
}

.education-year__controls {
  min-height: 48px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  margin: 0 auto 34px;
}

.education-year__navigation {
  grid-column: 2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.education-year__navigation > strong {
  min-width: 5ch;
  font-size: 20px;
  font-variant-numeric: tabular-nums;
  text-align: center;
}

.education-year__navigation > .q-btn {
  color: var(--app-text-muted);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
}

.education-year__today {
  grid-column: 3;
  justify-self: start;
  min-height: 38px;
  margin-inline-start: 12px;
  padding-inline: 16px;
}

.education-year__today--hidden {
  visibility: hidden;
  pointer-events: none;
}

.education-year__months {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 10px;
}

.education-year__months article {
  min-width: 0;
  padding: 14px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 15px;
}

.education-year__months article:not(.education-year__month--special) {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr);
}

.education-year__months header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 8px;
}

.education-year__months h4 {
  margin: 0;
  font-size: 13px;
}

.education-year__months header small {
  color: var(--app-text-faint);
  font-size: 11px;
}

.education-year__weekdays,
.education-year__days {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 1px;
}

.education-year__days {
  grid-template-rows: repeat(4, minmax(18px, 1fr));
  align-items: stretch;
}

.education-year__weekdays span {
  min-width: 0;
  padding-block: 2px;
  overflow: hidden;
  color: var(--app-text-faint);
  font-size: 8px;
  letter-spacing: -0.04em;
  text-align: center;
  text-overflow: clip;
  white-space: nowrap;
}

.education-year__days span {
  min-height: 18px;
  display: grid;
  place-items: center;
  background: transparent;
  border-radius: 5px;
  font-size: 9px;
}

.education-year__days .education-month-grid__day--sunday,
.education-year__days .education-month-grid__day--saturday {
  background: transparent !important;
}

.education-year__days .education-year__day--today {
  color: white !important;
  background: var(--calendar-current-day-cell) !important;
  box-shadow: none;
  font-weight: 800;
}

.education-year__days
  .education-year__day--today.education-month-grid__day--sunday {
  background: var(--calendar-current-sunday-cell) !important;
}

.education-year__month--solaris {
  color: var(--app-accent-amber-text);
  background: var(--app-accent-amber-soft) !important;
  border-color: var(--app-accent-amber-border) !important;
}

.education-year__month--solaris
  .education-year__days
  span:not(.education-month-grid__day--sunday):not(.education-month-grid__day--saturday) {
  color: var(--app-text);
}

.education-year__month--special {
  color: var(--app-accent-green-text);
  background: color-mix(in srgb, var(--app-accent-green-soft) 70%, var(--app-surface)) !important;
  border-color: var(--app-accent-green-border) !important;
}

.education-year__month--special > h4 {
  font-size: 14px;
}

.education-year__equation {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 5px;
  margin: 16px 0 5px;
  color: var(--app-text-faint);
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

.education-year__equation strong {
  color: var(--app-text);
  font-size: 18px;
}

.education-year__leap-status {
  min-height: 32px;
  display: block;
  color: var(--app-text-muted);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.4;
  text-align: center;
  text-transform: uppercase;
}

.education-year__calculation {
  margin: 10px 0 0;
  padding-top: 8px;
  border-top: 1px solid var(--app-border);
}

.education-year__calculation > div {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  margin-top: 2px;
  color: var(--app-text-muted);
  font-size: 9px;
}

.education-year__calculation dd {
  margin: 0;
  color: var(--app-text);
  font-variant-numeric: tabular-nums;
}

.education-year__count--year-day {
  color: var(--app-accent-green-strong) !important;
}

.education-year__count--leap-day {
  color: var(--app-accent-amber-strong) !important;
}

.education-year__calculation-row--inactive,
.education-year__calculation-row--inactive .education-year__count--leap-day {
  color: var(--app-text-faint) !important;
}

.education-year__calculation > .education-year__total {
  margin-top: 6px;
  padding-top: 6px;
  color: var(--app-text);
  border-top: 1px solid var(--app-border);
  font-weight: 700;
}

.education-cta {
  max-width: 980px;
  margin: 20px auto 80px;
  padding: 56px 28px;
  color: white;
  background: linear-gradient(135deg, #312e81, #6d28d9);
  border-radius: 28px;
  box-shadow: 0 24px 60px rgb(76 29 149 / 24%);
  text-align: center;
}

.education-cta h2 {
  margin: 0;
  font-size: clamp(27px, 5vw, 42px);
}

.education-cta > p {
  max-width: 620px;
  margin: 12px auto 24px;
  color: rgb(255 255 255 / 74%);
  line-height: 1.65;
}

.education-cta > div {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.education-cta :deep(.q-btn--outline) {
  color: white !important;
}

@media (max-width: 1239px) {
  .education-hero {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-top: 70px;
  }

  .education-hero__copy {
    text-align: center;
  }

  .education-hero__copy h1,
  .education-hero__copy > p:not(.education-eyebrow) {
    margin-inline: auto;
  }

  .education-hero__actions {
    justify-content: center;
  }

  .education-idea__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .education-idea__facts article,
  .education-idea__facts article:nth-child(n + 3) {
    grid-column: span 1;
  }

  .education-idea__facts article:last-child {
    grid-column: 1 / -1;
  }

}

@media (max-width: 1579px) {
  .education-year__months {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (min-width: 1580px) {
  .education-year__months article {
    height: 100%;
  }
}

@media (max-width: 860px) {
  .education-year__months {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .education-year__month--special {
    grid-column: auto;
  }
}

@media (max-width: 620px) {
  .education-hero {
    padding: 52px 18px;
  }

  .education-hero__copy h1 {
    font-size: clamp(40px, 14vw, 58px);
  }

  .education-hero__actions,
  .education-cta > div {
    flex-direction: column;
  }

  .education-today .q-card__section {
    padding: 22px 16px;
  }

  .education-today__calendars {
    gap: 8px;
  }

  .education-today__calendar {
    grid-template-rows: 42px minmax(94px, auto) 24px 38px;
  }

  .education-today__calendar > span {
    height: 42px;
    font-size: 8px;
  }

  .education-today__calendar :deep(.app-comparison-date-title) {
    --app-comparison-date-row-gap: 3px;

    min-height: 94px;
  }

  .education-today__calendar :deep(.app-comparison-date-title > span:first-child) {
    font-size: clamp(18px, 6vw, 26px);
  }

  .education-today__calendar :deep(.app-comparison-date-title > span:last-child) {
    font-size: clamp(15px, 4.6vw, 21px);
  }

  .education-today__calendar > small,
  .education-today__calendar > p {
    font-size: 10px;
  }

  .education-today__divider {
    min-height: 188px;
    font-size: 9px;
  }

  .education-idea__facts {
    grid-template-columns: 1fr;
  }

  .education-idea__facts article,
  .education-idea__facts article:nth-child(n + 3),
  .education-idea__facts article:last-child {
    grid-column: span 1;
    padding: 24px;
  }

  .education-year__months {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .education-year__controls {
    grid-template-columns: 1fr;
    row-gap: 8px;
  }

  .education-year__navigation,
  .education-year__today {
    grid-column: 1;
    justify-self: center;
  }

  .education-year__today {
    grid-row: 2;
    margin-inline-start: 0;
  }

  .education-year__months article {
    padding: 12px;
  }

  .education-year__month--special {
    grid-column: auto;
  }

  .education-year__equation {
    margin: 10px 0 3px;
  }

  .education-year__leap-status {
    min-height: 24px;
    font-size: 7px;
  }

  .education-year__calculation {
    margin-top: 6px;
    padding-top: 6px;
  }

  .education-year__calculation > div {
    font-size: 8px;
    line-height: 1.25;
  }

  .education-year__calculation > .education-year__total {
    margin-top: 4px;
    padding-top: 4px;
  }

  .education-year__weekdays span {
    font-size: 8px;
  }

  .education-cta {
    margin-inline: 14px;
    border-radius: 22px;
  }
}

@media (max-width: 350px) {
  .education-today .q-card__section {
    padding-inline: 12px;
  }

  .education-today__calendar :deep(.app-comparison-date-title > span:first-child) {
    font-size: 16px !important;
  }

  .education-today__calendar :deep(.app-comparison-date-title > span:last-child) {
    font-size: 15px !important;
  }

  .education-month-grid {
    padding-inline: 14px;
  }

  .education-month-grid__weekdays,
  .education-month-grid__days {
    gap: 3px;
  }

  .education-year__months article {
    padding-inline: 9px;
  }

  .education-year__weekdays,
  .education-year__days {
    gap: 2px;
  }
}
</style>
