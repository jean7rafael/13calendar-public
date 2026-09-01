<template>
  <div
    ref="plannerRoot"
    class="planner-print"
    :class="{ 'planner-print--export': exporting }"
    aria-hidden="true"
  >
    <article class="planner-print__page planner-print__page--cover">
      <div class="planner-print__brand-mark">13</div>
      <div class="planner-print__cover-copy">
        <p>13 Calendar</p>
        <h1>{{ t('education.hero.fixed') }}</h1>
        <strong>{{ year }}</strong>
      </div>
      <p class="planner-print__cover-note">{{ t('education.idea.description') }}</p>
    </article>

    <article class="planner-print__page planner-print__page--guide">
      <PlannerPrintHeader :year="year" />
      <div class="planner-print__guide-copy">
        <p class="planner-print__eyebrow">13 Calendar</p>
        <h2>{{ t('education.tools.planner.title') }}</h2>
        <p>{{ t('education.idea.facts.0.text') }}</p>
      </div>
      <div class="planner-print__legend">
        <h3>{{ t('education.idea.facts.0.title') }}</h3>
        <div class="planner-print__sample-day">
          <strong>17</strong>
          <span>{{ t('education.converter.fixedDate') }}</span>
          <small>{{ guideExampleGregorian }}</small>
          <span>{{ t('education.converter.gregorianDate') }}</span>
        </div>
      </div>
      <div class="planner-print__guide-panels">
        <section>
          <strong>13 × 28</strong>
          <span>{{ t('education.idea.description') }}</span>
        </section>
        <section>
          <strong>4 × 7</strong>
          <span>{{ t('education.tools.planner.print.priorities') }}</span>
        </section>
      </div>
      <PlannerPrintFooter />
    </article>

    <article class="planner-print__page planner-print__page--overview">
      <PlannerPrintHeader :year="year" />
      <div class="planner-print__page-title">
        <span># 0</span>
        <h2>{{ t('education.tools.planner.title') }}</h2>
        <p>{{ t('education.idea.description') }}</p>
      </div>
      <div class="planner-print__overview-grid">
        <section
          v-for="month in monthPages"
          :key="month.month"
          :class="`planner-print__accent--${month.accent}`"
        >
          <b>{{ month.month }}</b>
          <div>
            <strong>{{ month.name }}</strong>
            <span>{{ month.range }}</span>
          </div>
        </section>
        <section class="planner-print__overview-special planner-print__accent--green">
          <b>14</b>
          <div>
            <strong>{{ t('education.tools.planner.specialDays') }}</strong>
            <span>{{ specialDateSummary }}</span>
          </div>
        </section>
      </div>
      <PlannerPrintFooter />
    </article>

    <template v-for="month in monthPages" :key="`print-month-${month.month}`">
      <article
        class="planner-print__page planner-print__page--month"
        :class="`planner-print__accent--${month.accent}`"
      >
        <PlannerPrintHeader :year="year" />
        <div class="planner-print__month-heading">
          <div>
            <span># {{ month.month }}</span>
            <h2>{{ month.name }}</h2>
            <p>{{ month.range }}</p>
          </div>
          <b>{{ String(month.month).padStart(2, '0') }}</b>
        </div>
        <div class="planner-print__weekday-row">
          <span v-for="weekday in weekDaysShort" :key="weekday">{{ weekday }}</span>
        </div>
        <div class="planner-print__month-grid">
          <div v-for="day in month.days" :key="day.day" class="planner-print__day">
            <strong>{{ day.day }}</strong>
            <span>{{ day.gregorian }}</span>
          </div>
        </div>
        <div class="planner-print__month-notes">
          <section>
            <h3>{{ t('education.tools.planner.print.priorities') }}</h3>
            <i v-for="line in 3" :key="`priority-${line}`" />
          </section>
          <section>
            <h3>{{ t('education.tools.planner.print.notes') }}</h3>
            <i v-for="line in 3" :key="`note-${line}`" />
          </section>
        </div>
        <PlannerPrintFooter />
      </article>

      <article
        class="planner-print__page planner-print__page--month-companion"
        :class="`planner-print__accent--${month.accent}`"
      >
        <PlannerPrintHeader :year="year" />
        <div class="planner-print__companion-heading">
          <div>
            <span>{{ t('education.tools.planner.print.notes') }}</span>
            <h2>{{ month.name }}</h2>
          </div>
          <b>{{ String(month.month).padStart(2, '0') }}</b>
        </div>
        <div class="planner-print__companion-grid">
          <section v-for="day in month.days" :key="`companion-${day.day}`">
            <strong>{{ day.day }}</strong>
            <span>{{ day.gregorian }}</span>
            <i />
            <i />
          </section>
        </div>
        <PlannerPrintFooter />
      </article>
    </template>

    <article
      v-for="specialDay in specialDays"
      :key="specialDay.kind"
      class="planner-print__page planner-print__page--special"
      :class="[
        `planner-print__accent--${specialDay.accent}`,
        { 'planner-print__page--unavailable': specialDay.unavailable },
      ]"
    >
      <PlannerPrintHeader :year="year" />
      <div class="planner-print__page-title">
        <span># {{ specialDay.page }}</span>
        <h2>{{ specialDay.label }}</h2>
        <p>{{ t('education.idea.description') }}</p>
      </div>
      <div class="planner-print__special-grid">
        <section>
          <span>{{ specialDay.number }}</span>
          <div>
            <h3>{{ specialDay.label }}</h3>
            <p>{{ specialDay.gregorian }}</p>
          </div>
        </section>
      </div>
      <div class="planner-print__ruled planner-print__ruled--large">
        <h3>{{ t('education.tools.planner.print.notes') }}</h3>
        <i v-for="line in 10" :key="`annual-${line}`" />
      </div>
      <PlannerPrintFooter />
    </article>

    <article
      v-for="(notePage, notePageIndex) in notePages"
      :key="`organized-notes-${notePageIndex}`"
      class="planner-print__page planner-print__page--notes"
      :class="`planner-print__accent--${notePage[0].accent}`"
    >
      <PlannerPrintHeader :year="year" />
      <div class="planner-print__split-notes">
        <section
          v-for="noteSection in notePage"
          :key="noteSection.key"
          class="planner-print__note-half"
          :class="`planner-print__accent--${noteSection.accent}`"
        >
          <div class="planner-print__note-half-heading">
            <span>{{ noteSection.kicker }}</span>
            <h2>{{ noteSection.title }}</h2>
          </div>
          <div class="planner-print__note-half-lines">
            <i v-for="line in 8" :key="`${noteSection.key}-${line}`" />
          </div>
        </section>
      </div>
      <PlannerPrintFooter />
    </article>

    <article class="planner-print__page planner-print__page--sources">
      <PlannerPrintHeader :year="year" />
      <div class="planner-print__sources-copy">
        <p class="planner-print__eyebrow">13 Calendar</p>
        <h2>{{ t('education.sources.title') }}</h2>
        <p>{{ t('education.sources.description') }}</p>
        <p>{{ t('education.tools.cta.description') }}</p>
      </div>
      <div class="planner-print__source-card">
        <div class="planner-print__brand-mark planner-print__brand-mark--small">13</div>
        <strong>13calendar.pages.dev</strong>
        <span>International Fixed Calendar · {{ year }}</span>
      </div>
      <PlannerPrintFooter />
    </article>

    <article class="planner-print__page planner-print__page--back">
      <div class="planner-print__back-symbol">13</div>
      <p>{{ t('education.idea.description') }}</p>
      <strong>13calendar.pages.dev</strong>
    </article>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import PlannerPrintFooter from 'src/components/PlannerPrintFooter.vue';
import PlannerPrintHeader from 'src/components/PlannerPrintHeader.vue';
import {
  buildInternationalFixedYear,
  formatGregorianParts,
  gregorianPartsToUtcDate,
} from 'src/utils/calendarTools';

const props = defineProps({
  year: { type: Number, required: true },
  exporting: { type: Boolean, default: false },
});

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysShort } = useCalendarTranslations();
const accentOrder = ['purple', 'green', 'amber', 'pink'];
const plannerRoot = ref(null);

/* O componente pai recebe somente as folhas prontas. Esta fronteira impede
   que a biblioteca de PDF conheça ou replique a estrutura interna do planner. */
defineExpose({
  getPageElements: () =>
    Array.from(plannerRoot.value?.querySelectorAll('.planner-print__page') || []),
});

const plan = computed(() => buildInternationalFixedYear(props.year));

function addDays(parts, amount) {
  const date = gregorianPartsToUtcDate(parts);
  date.setUTCDate(date.getUTCDate() + amount);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

function shortDate(parts) {
  return formatGregorianParts(parts, locale.value, {
    year: undefined,
    month: 'short',
    day: 'numeric',
  });
}

function fullDate(parts) {
  return formatGregorianParts(parts, locale.value, {
    weekday: 'long',
  });
}

const monthPages = computed(() =>
  plan.value.months.map((month, index) => ({
    ...month,
    accent: accentOrder[index % accentOrder.length],
    name: months13Long.value[month.month - 1],
    range: `${shortDate(month.start)} – ${shortDate(month.end)}`,
    days: Array.from({ length: 28 }, (_, index) => ({
      day: index + 1,
      gregorian: shortDate(addDays(month.start, index)),
    })),
  })),
);

const specialDays = computed(() =>
  [
    ...plan.value.specialDays,
    ...(plan.value.specialDays.some((specialDay) => specialDay.kind === 'leap-day')
      ? []
      : [
          {
            kind: 'leap-day',
            gregorian: null,
            unavailable: true,
          },
        ]),
  ].map((specialDay, index) => ({
    ...specialDay,
    number: index + 1,
    page: 14 + index,
    accent: specialDay.kind === 'year-day' ? 'green' : 'amber',
    label: t(
      specialDay.kind === 'year-day'
        ? 'education.tools.planner.yearDay'
        : 'education.tools.planner.leapDay',
    ),
    gregorian: specialDay.unavailable
      ? t('education.tools.planner.print.noLeapDay')
      : fullDate(specialDay.gregorian),
    shortGregorian: specialDay.unavailable ? '—' : shortDate(specialDay.gregorian),
  })),
);

const specialDateSummary = computed(() =>
  specialDays.value.map((specialDay) => specialDay.shortGregorian).join(' · '),
);

const guideExampleGregorian = computed(() => shortDate(addDays(plan.value.months[8].start, 16)));

const noteSections = computed(() => [
  ...monthPages.value.map((month) => ({
    key: `month-${month.month}`,
    kicker: `${t('education.tools.planner.print.notes')} · # ${month.month}`,
    title: month.name,
    accent: month.accent,
  })),
  {
    key: 'special-days',
    kicker: `13 Calendar · ${props.year}`,
    title: t('education.tools.planner.specialDays'),
    accent: 'green',
  },
]);

const notePages = computed(() =>
  Array.from({ length: 7 }, (_, pageIndex) =>
    noteSections.value.slice(pageIndex * 2, pageIndex * 2 + 2),
  ),
);
</script>

<style scoped>
.planner-print {
  display: none;
}

/* O modelo só participa do layout durante a exportação. Ele fica fora da área
   visível, mas continua renderizável; `display:none` ou `visibility:hidden`
   produziriam páginas vazias no canvas. */
.planner-print.planner-print--export {
  position: fixed;
  z-index: -1;
  inset-block-start: 0;
  inset-inline-start: -10000px;
  width: 210mm;
  display: block !important;
  pointer-events: none;
  color: #111827;
  background: #ffffff;
  font-family: Inter, 'Noto Sans', Arial, sans-serif;
}

.planner-print__page {
  --planner-accent: #6e4fe0;
  --planner-accent-ink: #31216f;
  --planner-accent-soft: #f4f1ff;
  --planner-accent-border: #d9cffd;
  --planner-accent-faint: #e6e0fb;
  position: relative;
  width: 210mm;
  height: 297mm;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10mm 14mm 18mm;
  break-inside: avoid-page;
  page-break-inside: avoid;
  page-break-after: always;
  background: #ffffff;
}

.planner-print__page:last-child {
  page-break-after: auto;
}

.planner-print__accent--purple {
  --planner-accent: #6e4fe0;
  --planner-accent-ink: #31216f;
  --planner-accent-soft: #f4f1ff;
  --planner-accent-border: #d9cffd;
  --planner-accent-faint: #e6e0fb;
}

.planner-print__accent--green {
  --planner-accent: #0f9f7f;
  --planner-accent-ink: #075e54;
  --planner-accent-soft: #e8f8f3;
  --planner-accent-border: #9ddfcd;
  --planner-accent-faint: #d6f2e9;
}

.planner-print__accent--amber {
  --planner-accent: #e59a00;
  --planner-accent-ink: #7a4b00;
  --planner-accent-soft: #fff7dc;
  --planner-accent-border: #f5d573;
  --planner-accent-faint: #ffedb3;
}

.planner-print__page--unavailable {
  --planner-accent: #d5aa55;
  --planner-accent-ink: #8b6c31;
  --planner-accent-soft: #fffbef;
  --planner-accent-border: #eedfb8;
  --planner-accent-faint: #f8edcf;
}

.planner-print__page--unavailable .planner-print__special-grid,
.planner-print__page--unavailable .planner-print__ruled {
  opacity: 0.72;
}

.planner-print__accent--pink {
  --planner-accent: #d94685;
  --planner-accent-ink: #8f1749;
  --planner-accent-soft: #fff0f6;
  --planner-accent-border: #f4b4d0;
  --planner-accent-faint: #fbd8e7;
}

.planner-print__page:last-child {
  break-after: auto;
  page-break-after: auto;
}

.planner-print__header,
.planner-print__footer {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #667085;
  font-size: 9pt;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.planner-print__header {
  min-height: 8mm;
  padding-bottom: 4mm;
  border-bottom: 0.3mm solid #e5e7eb;
}

.planner-print__header strong {
  color: var(--planner-accent);
}

.planner-print__footer {
  position: absolute;
  right: 14mm;
  bottom: 7mm;
  left: 14mm;
  height: 7mm;
  box-sizing: border-box;
  padding-top: 4mm;
  border-top: 0.3mm solid #e5e7eb;
  font-size: 7.5pt;
}

.planner-print__brand-mark {
  width: 28mm;
  height: 28mm;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: linear-gradient(145deg, #865dff, #4f35d2 58%, #1b8476);
  border-radius: 8mm;
  font-size: 28pt;
  font-weight: 900;
}

.planner-print__brand-mark--small {
  width: 17mm;
  height: 17mm;
  border-radius: 5mm;
  font-size: 17pt;
}

.planner-print__page--cover,
.planner-print__page--back {
  isolation: isolate;
  color: #ffffff;
  background: #0d1528;
  overflow: visible;
}

.planner-print__page--cover::before,
.planner-print__page--back::before {
  content: '';
  position: absolute;
  z-index: 0;
  top: 0;
  right: 0;
  left: 0;
  height: 297mm;
  background:
    radial-gradient(circle at 82% 18%, rgb(18 184 134 / 32%), transparent 34%),
    radial-gradient(circle at 18% 78%, rgb(134 93 255 / 42%), transparent 38%), #0d1528;
}

.planner-print__page--cover > *,
.planner-print__page--back > * {
  position: relative;
  z-index: 1;
}

.planner-print__page--cover {
  justify-content: space-between;
  padding: 24mm;
}

.planner-print__cover-copy {
  max-width: 145mm;
}

.planner-print__cover-copy p,
.planner-print__eyebrow {
  margin: 0 0 5mm;
  color: #8d6bff;
  font-size: 10pt;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.planner-print__cover-copy h1 {
  margin: 0;
  font-size: 38pt;
  line-height: 1.04;
  letter-spacing: -0.04em;
}

.planner-print__cover-copy strong {
  display: block;
  margin-top: 10mm;
  color: #ffc247;
  font-size: 44pt;
}

.planner-print__cover-note {
  max-width: 105mm;
  margin: 0;
  color: #cbd5e1;
  font-size: 14pt;
  line-height: 1.5;
}

.planner-print__page-title,
.planner-print__guide-copy,
.planner-print__sources-copy {
  padding: 12mm 0 8mm;
}

.planner-print__page-title > span,
.planner-print__month-heading span {
  color: var(--planner-accent);
  font-size: 8pt;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.planner-print__page-title h2,
.planner-print__guide-copy h2,
.planner-print__sources-copy h2 {
  margin: 3mm 0;
  font-size: 26pt;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.planner-print__page-title p,
.planner-print__guide-copy > p:last-child,
.planner-print__sources-copy > p {
  max-width: 155mm;
  margin: 0;
  color: #667085;
  font-size: 11pt;
  line-height: 1.55;
}

.planner-print__legend {
  padding: 9mm;
  background: #f4f1ff;
  border: 0.4mm solid #d9cffd;
  border-radius: 5mm;
}

.planner-print__legend h3,
.planner-print__month-notes h3,
.planner-print__ruled h3 {
  margin: 0 0 5mm;
  font-size: 11pt;
}

.planner-print__sample-day {
  display: grid;
  grid-template-columns: 18mm 1fr 28mm 1fr;
  align-items: center;
  gap: 4mm;
}

.planner-print__sample-day strong {
  color: #4f35d2;
  font-size: 28pt;
}

.planner-print__sample-day small {
  color: #0f766e;
  font-size: 12pt;
  font-weight: 700;
}

.planner-print__sample-day span {
  color: #667085;
  font-size: 9pt;
}

.planner-print__guide-panels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6mm;
  margin-top: 7mm;
}

.planner-print__guide-panels section {
  min-height: 45mm;
  display: grid;
  align-content: center;
  gap: 3mm;
  padding: 8mm;
  color: #ffffff;
  background: #121f36;
  border-radius: 5mm;
}

.planner-print__guide-panels strong {
  color: #ffc247;
  font-size: 24pt;
}

.planner-print__guide-panels span {
  color: #d9e1ee;
  font-size: 10pt;
  line-height: 1.45;
}

.planner-print__overview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3mm;
}

.planner-print__overview-grid section {
  min-height: 21mm;
  display: grid;
  grid-template-columns: 12mm 1fr;
  align-items: center;
  gap: 4mm;
  padding: 3mm 4mm;
  background: var(--planner-accent-soft);
  border: 0.35mm solid var(--planner-accent-border);
  border-radius: 3mm;
}

.planner-print__overview-grid section > b {
  width: 10mm;
  height: 10mm;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: var(--planner-accent);
  border-radius: 3mm;
  font-size: 10pt;
}

.planner-print__overview-grid section > div {
  display: grid;
  gap: 1mm;
}

.planner-print__overview-grid strong {
  font-size: 10pt;
}

.planner-print__overview-grid span {
  color: #667085;
  font-size: 8pt;
}

.planner-print__overview-grid .planner-print__overview-special {
  background: var(--planner-accent-soft);
  border-color: var(--planner-accent-border);
}

.planner-print__overview-grid .planner-print__overview-special > b {
  color: #ffffff;
  background: var(--planner-accent);
}

.planner-print__month-heading {
  min-height: 34mm;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10mm;
  padding: 6mm 0 5mm;
}

.planner-print__month-heading h2 {
  margin: 2mm 0 1mm;
  font-size: 28pt;
  line-height: 1;
}

.planner-print__month-heading p {
  margin: 0;
  color: #667085;
  font-size: 10pt;
}

.planner-print__month-heading > b {
  color: var(--planner-accent-faint);
  font-size: 48pt;
  line-height: 0.85;
}

.planner-print__weekday-row,
.planner-print__month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.planner-print__weekday-row {
  min-height: 8mm;
  align-items: center;
  color: #667085;
  background: var(--planner-accent-soft);
  border: 0.35mm solid var(--planner-accent-border);
  border-bottom: 0;
  border-radius: 3mm 3mm 0 0;
  font-size: 7pt;
  font-weight: 800;
  text-align: center;
}

.planner-print__month-grid {
  height: 132mm;
  grid-template-rows: repeat(4, 1fr);
  border-top: 0.35mm solid #dce2ea;
  border-inline-start: 0.35mm solid #dce2ea;
}

.planner-print__day {
  display: flex;
  flex-direction: column;
  gap: 2mm;
  padding: 3mm;
  border-inline-end: 0.35mm solid #dce2ea;
  border-bottom: 0.35mm solid #dce2ea;
}

.planner-print__day strong {
  color: var(--planner-accent-ink);
  font-size: 14pt;
}

.planner-print__day span {
  color: #667085;
  font-size: 6.8pt;
  line-height: 1.2;
}

.planner-print__month-notes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8mm;
  padding-top: 5mm;
}

.planner-print__month-notes section {
  min-height: 25mm;
}

.planner-print__month-notes i,
.planner-print__ruled i {
  display: block;
  height: 7mm;
  border-bottom: 0.3mm solid #dce2ea;
}

.planner-print__month-notes h3,
.planner-print__companion-heading span {
  color: var(--planner-accent-ink);
}

.planner-print__companion-heading {
  min-height: 34mm;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10mm;
  padding: 6mm 0 5mm;
}

.planner-print__companion-heading span {
  font-size: 8pt;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.planner-print__companion-heading h2 {
  margin: 2mm 0 0;
  font-size: 28pt;
  line-height: 1;
}

.planner-print__companion-heading > b {
  color: var(--planner-accent-faint);
  font-size: 48pt;
  line-height: 0.85;
}

.planner-print__companion-grid {
  height: 188mm;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-template-rows: repeat(4, 1fr);
  gap: 2mm;
}

.planner-print__companion-grid section {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2mm;
  padding: 3mm;
  background: var(--planner-accent-soft);
  border: 0.35mm solid var(--planner-accent-border);
  border-radius: 2.5mm;
}

.planner-print__companion-grid strong {
  color: var(--planner-accent-ink);
  font-size: 12pt;
}

.planner-print__companion-grid span {
  min-height: 6mm;
  color: #667085;
  font-size: 6.4pt;
  line-height: 1.2;
}

.planner-print__companion-grid i {
  display: block;
  height: 7mm;
  border-bottom: 0.3mm solid var(--planner-accent-border);
}

.planner-print__special-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6mm;
}

.planner-print__special-grid section {
  min-height: 47mm;
  display: grid;
  grid-template-columns: 17mm 1fr;
  align-items: center;
  gap: 5mm;
  padding: 7mm;
  background: var(--planner-accent-soft);
  border: 0.4mm solid var(--planner-accent-border);
  border-radius: 5mm;
}

.planner-print__special-grid section > span {
  width: 14mm;
  height: 14mm;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: var(--planner-accent);
  border-radius: 50%;
  font-size: 14pt;
  font-weight: 800;
}

.planner-print__special-grid h3,
.planner-print__special-grid p {
  margin: 0;
}

.planner-print__special-grid h3 {
  font-size: 14pt;
}

.planner-print__special-grid p {
  margin-top: 2mm;
  color: #667085;
  font-size: 9pt;
}

.planner-print__ruled {
  flex: 1;
  margin-top: 9mm;
}

.planner-print__ruled--large {
  margin-top: 13mm;
}

.planner-print__split-notes {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 6mm;
  padding-top: 6mm;
}

.planner-print__note-half {
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 5mm 6mm;
  background: var(--planner-accent-soft);
  border: 0.35mm solid var(--planner-accent-border);
  border-radius: 4mm;
}

.planner-print__note-half-heading {
  flex: none;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8mm;
  padding-bottom: 3mm;
}

.planner-print__note-half-heading span {
  color: var(--planner-accent-ink);
  font-size: 7.5pt;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.planner-print__note-half-heading h2 {
  margin: 0;
  color: var(--planner-accent-ink);
  font-size: 20pt;
  line-height: 1;
  text-align: right;
}

.planner-print__note-half-lines {
  flex: 1;
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(8, minmax(0, 1fr));
}

.planner-print__note-half-lines i {
  display: block;
  border-bottom: 0.3mm solid var(--planner-accent-border);
}

.planner-print__sources-copy {
  margin-top: 20mm;
}

.planner-print__sources-copy > p {
  margin-bottom: 7mm;
}

.planner-print__source-card {
  display: grid;
  grid-template-columns: 19mm 1fr;
  align-items: center;
  gap: 5mm;
  margin-top: 12mm;
  padding: 7mm;
  background: #f4f1ff;
  border: 0.4mm solid #d9cffd;
  border-radius: 5mm;
}

.planner-print__source-card strong,
.planner-print__source-card span {
  grid-column: 2;
}

.planner-print__source-card strong {
  align-self: end;
  font-size: 12pt;
}

.planner-print__source-card span {
  align-self: start;
  color: #667085;
  font-size: 9pt;
}

.planner-print__source-card .planner-print__brand-mark {
  grid-row: 1 / 3;
}

.planner-print__page--back {
  align-items: center;
  justify-content: center;
  gap: 12mm;
  text-align: center;
}

.planner-print__back-symbol {
  color: #ffc247;
  font-size: 72pt;
  font-weight: 900;
  line-height: 1;
}

.planner-print__page--back p {
  max-width: 120mm;
  margin: 0;
  font-size: 20pt;
  font-weight: 700;
  line-height: 1.25;
}

.planner-print__page--back strong {
  color: #b7c2d4;
  font-size: 11pt;
  letter-spacing: 0.08em;
}
</style>
