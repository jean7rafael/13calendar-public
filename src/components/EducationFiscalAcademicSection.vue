<template>
  <section
    id="education-fiscal-academic"
    class="education-section education-fiscal-academic"
    aria-labelledby="education-fiscal-academic-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ copy.eyebrow }}</p>
      <h2 id="education-fiscal-academic-title">{{ copy.title }}</h2>
      <p>{{ copy.introduction }}</p>
    </div>

    <!-- A igualdade fiscal nasce das 52 semanas, não de uma divisão
         artificial dos 13 meses. A equação antecede as aplicações. -->
    <div class="education-fiscal-academic__formula" role="group" :aria-label="copy.title">
      <span>{{ copy.formulaRegular }}</span>
      <q-icon name="arrow_forward" aria-hidden="true" />
      <span>{{ copy.formulaWeeks }}</span>
      <q-icon name="arrow_forward" aria-hidden="true" />
      <strong>{{ copy.formulaQuarters }}</strong>
    </div>

    <div class="education-fiscal-academic__cards">
      <article
        v-for="(card, index) in copy.cards"
        :key="card.title"
        :class="`education-fiscal-academic__card--${cardStyles[index].tone}`"
      >
        <q-icon :name="cardStyles[index].icon" aria-hidden="true" />
        <h3>{{ card.title }}</h3>
        <p>{{ card.text }}</p>
        <strong>{{ card.detail }}</strong>
      </article>
    </div>

    <!-- O mapa semanal permite comparar a camada fiscal com a escolar sem
         alterar a estrutura civil dos 13 meses de quatro semanas. -->
    <section class="education-year-map" :aria-labelledby="`${sectionId}-title`">
      <header class="education-year-map__heading">
        <div>
          <p class="education-year-map__eyebrow">{{ plannerCopy.eyebrow }}</p>
          <h3 :id="`${sectionId}-title`">{{ plannerCopy.title }}</h3>
          <p>{{ plannerCopy.introduction }}</p>
        </div>

        <!-- O seletor principal repete a linguagem visual da página de calendários. -->
        <div class="education-year-map__mode" role="group" :aria-label="plannerCopy.modeLabel">
          <span :class="{ 'education-year-map__mode-label--active': planningMode === 'fiscal' }">
            {{ plannerCopy.fiscal }}
          </span>
          <q-toggle
            v-model="planningMode"
            false-value="fiscal"
            true-value="school"
            color="primary"
            keep-color
            size="44px"
            :aria-label="plannerCopy.modeLabel"
          />
          <span :class="{ 'education-year-map__mode-label--active': planningMode === 'school' }">
            {{ plannerCopy.school }}
          </span>
        </div>
      </header>

      <!-- No modo escolar, o segundo controle escolhe a unidade pedagógica.
           No fiscal, permanece a divisão matematicamente exata de 4 × 13. -->
      <div class="education-year-map__controls">
        <q-btn-toggle
          v-if="planningMode === 'school'"
          v-model="academicPeriod"
          no-caps
          unelevated
          spread
          toggle-color="primary"
          color="transparent"
          text-color="primary"
          class="education-year-map__period-toggle"
          :aria-label="plannerCopy.periodLabel"
          :options="academicOptions"
        />
        <div v-else class="education-year-map__fiscal-selection">
          <q-icon name="equalizer" aria-hidden="true" />
          <span>{{ plannerCopy.fiscalSelection }}</span>
        </div>

        <div class="education-year-map__summary" aria-live="polite">
          <strong>{{ activeSummary }}</strong>
          <span>{{ activeDetail }}</span>
        </div>
      </div>

      <!-- Cada coluna representa um mês e cada célula uma de suas quatro semanas.
           As férias dos meses 1, 7 e 13 nunca recebem cor de período letivo. -->
      <div class="education-year-map__months" role="list" :aria-label="plannerCopy.calendarLabel">
        <article
          v-for="month in calendarMonths"
          :key="month.number"
          class="education-year-map__month"
          role="listitem"
          :title="month.longName"
        >
          <header>
            <strong>{{ month.number }}</strong>
            <span>{{ month.shortName }}</span>
          </header>
          <div class="education-year-map__weeks">
            <span
              v-for="week in month.weeks"
              :key="week.absolute"
              class="education-year-map__week"
              :class="[
                `education-year-map__week--period-${week.period}`,
                week.tone ? `education-year-map__week--season-${week.tone}` : '',
                {
                  'education-year-map__week--vacation': week.isVacation,
                },
              ]"
              :title="week.title"
              :aria-label="week.title"
            >
              {{ week.number }}
              <b
                v-if="week.season"
                class="education-year-map__season-marker"
                :class="`education-year-map__season-marker--${week.season.tone}`"
                aria-hidden="true"
              >
                {{ week.season.emoji }}
              </b>
            </span>
          </div>
        </article>
      </div>

      <!-- A legenda é calculada a partir do modo ativo para que cores, nomes
           e quantidades continuem coerentes em todos os idiomas. -->
      <div class="education-year-map__legend" :aria-label="plannerCopy.legendLabel">
        <span v-for="item in activeLegend" :key="item.label">
          <i
            :class="`education-year-map__legend-color--${item.tone || item.period}`"
            aria-hidden="true"
          />
          {{ item.label }}
        </span>
      </div>

      <!-- O hemisfério altera a estação iniciada em cada instante, mas não
           desloca a semana aproximada do equinócio ou solstício. -->
      <div class="education-year-map__hemisphere">
        <span>{{ plannerCopy.hemisphereLabel }}</span>
        <div role="group" :aria-label="plannerCopy.hemisphereLabel">
          <strong
            :class="{ 'education-year-map__hemisphere-label--active': hemisphere === 'north' }"
          >
            {{ plannerCopy.northHemisphere }}
          </strong>
          <q-toggle
            v-model="hemisphere"
            false-value="north"
            true-value="south"
            color="primary"
            keep-color
            size="40px"
            :aria-label="plannerCopy.hemisphereLabel"
          />
          <strong
            :class="{ 'education-year-map__hemisphere-label--active': hemisphere === 'south' }"
          >
            {{ plannerCopy.southHemisphere }}
          </strong>
        </div>
      </div>

      <div class="education-year-map__season-legend" aria-live="polite">
        <span
          v-for="season in activeSeasonLegend"
          :key="season.week"
          :class="`education-year-map__season-legend--${season.tone}`"
        >
          <b aria-hidden="true">{{ season.emoji }}</b>
          <span>{{ season.label }} · {{ season.eventLabel }}</span>
        </span>
      </div>

      <aside class="education-year-map__terminology">
        <q-icon name="edit_note" aria-hidden="true" />
        <div>
          <strong>{{ plannerCopy.terminologyTitle }}</strong>
          <p>{{ plannerCopy.terminologyText }}</p>
        </div>
      </aside>

      <aside class="education-year-map__seasons">
        <q-icon name="wb_sunny" aria-hidden="true" />
        <div>
          <strong>{{ plannerCopy.seasonsTitle }}</strong>
          <p>{{ plannerCopy.seasonsText }}</p>
        </div>
      </aside>
    </section>

    <aside class="education-fiscal-academic__note">
      <q-icon name="gavel" aria-hidden="true" />
      <p>{{ copy.note }}</p>
    </aside>

    <p class="education-fiscal-academic__sources">
      {{ copy.sources }}:
      <a
        href="https://www.irs.gov/businesses/small-businesses-self-employed/tax-years"
        target="_blank"
        rel="noopener noreferrer"
        >IRS, 52–53-week tax year</a
      >
      ·
      <a
        href="https://diofe.portal.ap.gov.br/portal/edicoes/visualizar_pdf/9841/"
        target="_blank"
        rel="noopener noreferrer"
        >Amapá, 40 semanas letivas</a
      >
      ·
      <a
        href="https://www.ncei.noaa.gov/news/meteorological-versus-astronomical-seasons"
        target="_blank"
        rel="noopener noreferrer"
        >NOAA, estações</a
      >
    </p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import { seasonEvents } from 'src/holidays/seasonDefinitions.js';
import { educationPlanningTranslations } from 'src/i18n/educationPlanningTranslations.js';
import { educationYearMapTranslations } from 'src/i18n/educationYearMapTranslations.js';

const sectionId = 'education-year-map';
const { locale } = useI18n({ useScope: 'global' });
const { months13Long, months13Short } = useCalendarTranslations();

/* Mantém a proposta escolar visível de início, preservando a opção fiscal
   como uma camada equivalente e independente. */
const planningMode = ref('school');
const academicPeriod = ref('trimester');
const hemisphere = ref('south');

const copy = computed(
  () =>
    educationPlanningTranslations[locale.value]?.fiscal ||
    educationPlanningTranslations['en-US'].fiscal,
);
const plannerCopy = computed(
  () => educationYearMapTranslations[locale.value] || educationYearMapTranslations['en-US'],
);

const cardStyles = [
  { icon: 'equalizer', tone: 'purple' },
  { icon: 'receipt_long', tone: 'green' },
  { icon: 'school', tone: 'pink' },
  { icon: 'event_busy', tone: 'amber' },
];

/* Os três formatos acadêmicos sempre partem das mesmas 40 semanas letivas. */
const academicOptions = computed(() => [
  { label: plannerCopy.value.bimester, value: 'bimester' },
  { label: plannerCopy.value.trimester, value: 'trimester' },
  { label: plannerCopy.value.semester, value: 'semester' },
]);

const activeSummary = computed(() =>
  planningMode.value === 'fiscal'
    ? plannerCopy.value.fiscalSummary
    : plannerCopy.value.academicSummaries[academicPeriod.value],
);
const activeDetail = computed(() =>
  planningMode.value === 'fiscal'
    ? plannerCopy.value.fiscalDetail
    : plannerCopy.value.academicDetails[academicPeriod.value],
);

/* Cada marco ocupa a penúltima semana de um trimestre fiscal. O catálogo
   compartilhado fornece o emoji correto para o hemisfério selecionado. */
const penultimateQuarterWeeks = [12, 25, 38, 51];
const seasonByWeek = computed(
  () =>
    new Map(
      seasonEvents.map((event, index) => {
        const season = event[hemisphere.value];
        const tone = season.nameId.replace('Begins', '');

        return [
          penultimateQuarterWeeks[index],
          {
            week: penultimateQuarterWeeks[index],
            emoji: season.emoji,
            tone,
            label: plannerCopy.value.seasonNames[season.nameId],
            eventLabel: plannerCopy.value.seasons[index],
          },
        ];
      }),
    ),
);

const activeSeasonLegend = computed(() => [...seasonByWeek.value.values()]);

/* Os recortes escolares compartilham uma sequência cromática por hemisfério.
   Bimestre usa quatro etapas, trimestre as três primeiras e semestre a
   primeira e a terceira, que correspondem às referências de março e setembro. */
const schoolPeriodTones = computed(() => {
  const sequence =
    hemisphere.value === 'south'
      ? ['autumn', 'blue', 'spring', 'summer']
      : ['spring', 'summer', 'autumn', 'blue'];

  return {
    bimester: sequence,
    trimester: sequence.slice(0, 3),
    semester: [sequence[0], sequence[2]],
  };
});

function toneForPeriod(period) {
  if (planningMode.value === 'fiscal') return activeSeasonLegend.value[period - 1]?.tone;
  return schoolPeriodTones.value[academicPeriod.value][period - 1];
}

function isVacationWeek(absoluteWeek) {
  const monthNumber = Math.ceil(absoluteWeek / 4);
  return monthNumber === 1 || monthNumber === 7 || monthNumber === 13;
}

/* Remove as 12 semanas de férias para obter a posição letiva de 1 a 40. */
function teachingWeekNumber(absoluteWeek) {
  let teachingWeek = 0;

  for (let week = 1; week <= absoluteWeek; week += 1) {
    if (!isVacationWeek(week)) teachingWeek += 1;
  }

  return teachingWeek;
}

/* Define a cor de cada semana segundo a camada e o recorte ativos. */
function periodForWeek(absoluteWeek) {
  if (planningMode.value === 'fiscal') return Math.ceil(absoluteWeek / 13);
  if (isVacationWeek(absoluteWeek)) return 0;

  const teachingWeek = teachingWeekNumber(absoluteWeek);

  if (academicPeriod.value === 'bimester') return Math.ceil(teachingWeek / 10);
  if (academicPeriod.value === 'semester') return Math.ceil(teachingWeek / 20);

  // Trimestres propostos: 13 + 14 + 13 semanas letivas.
  if (teachingWeek <= 13) return 1;
  if (teachingWeek <= 27) return 2;
  return 3;
}

const activePeriodLabels = computed(() => {
  if (planningMode.value === 'fiscal') return plannerCopy.value.fiscalPeriods;
  return plannerCopy.value.academicPeriods[academicPeriod.value];
});

/* Constrói os 13 mini meses e suas quatro semanas reativamente. */
const calendarMonths = computed(() =>
  months13Long.value.slice(0, 13).map((longName, monthIndex) => ({
    number: monthIndex + 1,
    longName,
    shortName: months13Short.value[monthIndex],
    weeks: Array.from({ length: 4 }, (_, weekIndex) => {
      const absolute = monthIndex * 4 + weekIndex + 1;
      const isVacation = planningMode.value === 'school' && isVacationWeek(absolute);
      const period = periodForWeek(absolute);
      const season = seasonByWeek.value.get(absolute);
      const periodLabel = isVacation
        ? plannerCopy.value.vacation
        : activePeriodLabels.value[period - 1];

      return {
        absolute,
        number: weekIndex + 1,
        period,
        tone: toneForPeriod(period),
        isVacation,
        season,
        title: [
          longName,
          `${plannerCopy.value.week} ${weekIndex + 1}`,
          periodLabel,
          season && `${season.emoji} ${season.label} · ${season.eventLabel}`,
        ]
          .filter(Boolean)
          .join(' · '),
      };
    }),
  })),
);

const activeLegend = computed(() => {
  const periods = activePeriodLabels.value.map((label, index) => ({
    period: index + 1,
    tone: toneForPeriod(index + 1),
    label,
  }));

  if (planningMode.value === 'school') {
    periods.push({ period: 'vacation', label: plannerCopy.value.vacation });
  }

  return periods;
});
</script>

<style scoped>
.education-fiscal-academic {
  border-top: 1px solid color-mix(in srgb, var(--app-accent-green-border) 58%, transparent);
}

.education-fiscal-academic .education-eyebrow,
.education-year-map__eyebrow {
  color: var(--app-accent-green-strong);
}

.education-fiscal-academic__formula {
  max-width: 900px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 0.75fr) auto minmax(0, 1.2fr);
  align-items: center;
  gap: 12px;
  margin: 0 auto 26px;
  padding: 16px;
  background: var(--app-surface-raised);
  border: 1px solid var(--app-accent-green-border);
  border-radius: 18px;
  box-shadow: var(--app-card-shadow);
}

.education-fiscal-academic__formula span,
.education-fiscal-academic__formula strong {
  padding: 11px 14px;
  border-radius: 12px;
  font-size: 13px;
  text-align: center;
}

.education-fiscal-academic__formula span {
  color: var(--app-text-muted);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
}

.education-fiscal-academic__formula strong {
  color: var(--app-accent-green-text);
  background: var(--app-accent-green-soft);
  border: 1px solid var(--app-accent-green-border);
}

.education-fiscal-academic__formula .q-icon {
  color: var(--app-text-faint);
}

.education-fiscal-academic__cards {
  max-width: 1080px;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin: 0 auto;
}

.education-fiscal-academic__cards article {
  --card-color: var(--app-accent-purple-text);
  --card-soft: var(--app-accent-purple-soft);
  --card-border: var(--app-accent-purple-border);
  min-height: 238px;
  display: flex;
  flex-direction: column;
  padding: clamp(22px, 3vw, 30px);
  color: var(--card-color);
  background: color-mix(in srgb, var(--card-soft) 78%, var(--app-surface));
  border: 1px solid var(--card-border);
  border-radius: 20px;
}

.education-fiscal-academic__card--green {
  --card-color: var(--app-accent-green-text) !important;
  --card-soft: var(--app-accent-green-soft) !important;
  --card-border: var(--app-accent-green-border) !important;
}

.education-fiscal-academic__card--pink {
  --card-color: var(--calendar-sunday-text) !important;
  --card-soft: var(--calendar-sunday-cell) !important;
  --card-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent) !important;
}

.education-fiscal-academic__card--amber {
  --card-color: var(--app-accent-amber-text) !important;
  --card-soft: var(--app-accent-amber-soft) !important;
  --card-border: var(--app-accent-amber-border) !important;
}

.education-fiscal-academic__cards .q-icon {
  font-size: 28px;
}

.education-fiscal-academic__cards h3 {
  margin: 18px 0 9px;
  font-size: 22px;
  line-height: 1.2;
}

.education-fiscal-academic__cards p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.65;
}

.education-fiscal-academic__cards strong {
  margin-top: auto;
  padding-top: 18px;
  font-size: 12px;
  line-height: 1.45;
}

/* ===========================================================
   MAPA INTERATIVO DAS 52 SEMANAS
=========================================================== */

.education-year-map {
  max-width: 1160px;
  margin: 34px auto 0;
  padding: clamp(20px, 3.5vw, 34px);
  background: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.education-year-map__heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 28px;
}

.education-year-map__eyebrow {
  margin: 0 0 7px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.education-year-map__heading h3 {
  margin: 0;
  color: var(--app-text);
  font-size: clamp(24px, 3vw, 34px);
  line-height: 1.12;
}

.education-year-map__heading p:last-child {
  max-width: 720px;
  margin: 10px 0 0;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 1.6;
}

.education-year-map__mode {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 999px;
}

.education-year-map__mode span {
  color: var(--app-text-faint);
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.education-year-map__mode .education-year-map__mode-label--active {
  color: var(--app-text);
}

.education-year-map__controls {
  display: grid;
  grid-template-columns: minmax(300px, 0.85fr) minmax(0, 1.15fr);
  align-items: stretch;
  gap: 18px;
  margin-top: 26px;
}

.education-year-map__period-toggle,
.education-year-map__fiscal-selection {
  min-height: 52px;
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 14px;
  overflow: hidden;
}

.education-year-map__period-toggle :deep(.q-btn) {
  min-width: max-content;
  padding-inline: 14px;
  white-space: nowrap;
}

.education-year-map__fiscal-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  color: var(--app-accent-purple-text);
  background: var(--app-accent-purple-soft);
  font-size: 13px;
  font-weight: 700;
}

.education-year-map__summary {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3px;
  padding: 11px 16px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 14px;
}

.education-year-map__summary strong {
  color: var(--app-text);
  font-size: 13px;
}

.education-year-map__summary span {
  color: var(--app-text-muted);
  font-size: 11px;
  line-height: 1.45;
}

.education-year-map__months {
  display: grid;
  grid-template-columns: repeat(13, minmax(58px, 1fr));
  gap: 7px;
  margin-top: 24px;
}

.education-year-map__month {
  min-width: 0;
  padding: 8px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 12px;
}

.education-year-map__month header {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 7px;
}

.education-year-map__month header strong {
  width: 20px;
  height: 20px;
  flex: none;
  display: grid;
  place-items: center;
  color: var(--app-text);
  background: var(--app-surface-raised);
  border-radius: 6px;
  font-size: 9px;
}

.education-year-map__month header span {
  min-width: 0;
  flex: 1;
  color: var(--app-text-muted);
  font-size: 9px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}

.education-year-map__weeks {
  display: grid;
  gap: 4px;
}

.education-year-map__week {
  --week-color: var(--app-accent-purple-text);
  --week-soft: var(--app-accent-purple-soft);
  --week-border: var(--app-accent-purple-border);
  position: relative;
  min-height: 25px;
  display: grid;
  place-items: center;
  color: var(--week-color);
  background: var(--week-soft);
  border: 1px solid var(--week-border);
  border-radius: 7px;
  font-size: 8px;
  font-weight: 800;
}

.education-year-map__week--period-2 {
  --week-color: var(--app-accent-green-text);
  --week-soft: var(--app-accent-green-soft);
  --week-border: var(--app-accent-green-border);
}

.education-year-map__week--period-3 {
  --week-color: var(--calendar-sunday-text);
  --week-soft: var(--calendar-sunday-cell);
  --week-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent);
}

.education-year-map__week--period-4 {
  --week-color: var(--app-accent-amber-text);
  --week-soft: var(--app-accent-amber-soft);
  --week-border: var(--app-accent-amber-border);
}

.education-year-map__week--vacation {
  --week-color: var(--app-text-muted);
  --week-soft: color-mix(in srgb, var(--app-text-faint) 12%, var(--app-surface));
  --week-border: var(--app-border);
}

/* No modo fiscal, cada conjunto completo de 13 semanas herda a cor da
   estação ligada ao seu marco. As classes vêm depois das cores trimestrais. */
.education-year-map__week--season-autumn {
  --week-color: var(--calendar-sunday-text);
  --week-soft: var(--calendar-sunday-cell);
  --week-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent);
}

.education-year-map__week--season-winter {
  --week-color: var(--app-accent-purple-text);
  --week-soft: var(--app-accent-purple-soft);
  --week-border: var(--app-accent-purple-border);
}

.education-year-map__week--season-blue {
  --week-color: var(--calendar-weekend-text);
  --week-soft: var(--calendar-weekend-cell);
  --week-border: var(--calendar-selection-border);
}

.education-year-map__week--season-spring {
  --week-color: var(--app-accent-green-text);
  --week-soft: var(--app-accent-green-soft);
  --week-border: var(--app-accent-green-border);
}

.education-year-map__week--season-summer {
  --week-color: var(--app-accent-amber-text);
  --week-soft: var(--app-accent-amber-soft);
  --week-border: var(--app-accent-amber-border);
}

/* O emoji é apenas um marcador discreto: fica fora do fluxo e não desloca
   nem recobre o número central da semana. */
.education-year-map__season-marker {
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 7px;
  font-weight: 400;
  line-height: 1;
}

.education-year-map__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  margin-top: 18px;
}

.education-year-map__legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--app-text-muted);
  font-size: 10px;
}

.education-year-map__legend i {
  width: 10px;
  height: 10px;
  background: var(--app-accent-purple-soft);
  border: 1px solid var(--app-accent-purple-border);
  border-radius: 3px;
}

.education-year-map__legend .education-year-map__legend-color--2 {
  background: var(--app-accent-green-soft);
  border-color: var(--app-accent-green-border);
}

.education-year-map__legend .education-year-map__legend-color--3 {
  background: var(--calendar-sunday-cell);
  border-color: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent);
}

.education-year-map__legend .education-year-map__legend-color--4 {
  background: var(--app-accent-amber-soft);
  border-color: var(--app-accent-amber-border);
}

.education-year-map__legend .education-year-map__legend-color--vacation {
  background: color-mix(in srgb, var(--app-text-faint) 12%, var(--app-surface));
  border-color: var(--app-border);
}

.education-year-map__legend .education-year-map__legend-color--autumn {
  background: var(--calendar-sunday-cell);
  border-color: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent);
}

.education-year-map__legend .education-year-map__legend-color--winter {
  background: var(--app-accent-purple-soft);
  border-color: var(--app-accent-purple-border);
}

.education-year-map__legend .education-year-map__legend-color--blue {
  background: var(--calendar-weekend-cell);
  border-color: var(--calendar-selection-border);
}

.education-year-map__legend .education-year-map__legend-color--spring {
  background: var(--app-accent-green-soft);
  border-color: var(--app-accent-green-border);
}

.education-year-map__legend .education-year-map__legend-color--summer {
  background: var(--app-accent-amber-soft);
  border-color: var(--app-accent-amber-border);
}

.education-year-map__hemisphere {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--app-border);
}

.education-year-map__hemisphere > span {
  color: var(--app-text-muted);
  font-size: 11px;
  font-weight: 700;
}

.education-year-map__hemisphere > div {
  display: flex;
  align-items: center;
  gap: 6px;
}

.education-year-map__hemisphere strong {
  color: var(--app-text-faint);
  font-size: 10px;
  white-space: nowrap;
}

.education-year-map__hemisphere .education-year-map__hemisphere-label--active {
  color: var(--app-text);
}

.education-year-map__season-legend {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
}

.education-year-map__season-legend > span {
  --season-color: var(--app-accent-purple-text);
  --season-soft: var(--app-accent-purple-soft);
  --season-border: var(--app-accent-purple-border);

  min-width: 0;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 10px;
  color: var(--season-color);
  background: var(--season-soft);
  border: 1px solid var(--season-border);
  border-radius: 10px;
}

.education-year-map__season-legend--autumn {
  --season-color: var(--calendar-sunday-text) !important;
  --season-soft: var(--calendar-sunday-cell) !important;
  --season-border: color-mix(in srgb, var(--calendar-sunday-text) 34%, transparent) !important;
}

.education-year-map__season-legend--spring {
  --season-color: var(--app-accent-green-text) !important;
  --season-soft: var(--app-accent-green-soft) !important;
  --season-border: var(--app-accent-green-border) !important;
}

.education-year-map__season-legend--summer {
  --season-color: var(--app-accent-amber-text) !important;
  --season-soft: var(--app-accent-amber-soft) !important;
  --season-border: var(--app-accent-amber-border) !important;
}

.education-year-map__season-legend b {
  flex: none;
  font-size: 15px;
  line-height: 1;
}

.education-year-map__season-legend span span {
  min-width: 0;
  font-size: 9px;
  font-weight: 700;
  line-height: 1.35;
}

.education-year-map__terminology,
.education-year-map__seasons {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px 17px;
  border-radius: 14px;
}

.education-year-map__terminology {
  margin-top: 20px;
  color: var(--app-accent-purple-text);
  background: color-mix(in srgb, var(--app-accent-purple-soft) 62%, var(--app-surface));
  border: 1px solid var(--app-accent-purple-border);
}

.education-year-map__seasons {
  margin-top: 12px;
  color: var(--app-accent-amber-text);
  background: color-mix(in srgb, var(--app-accent-amber-soft) 55%, var(--app-surface));
  border: 1px solid var(--app-accent-amber-border);
}

.education-year-map__terminology .q-icon,
.education-year-map__seasons .q-icon {
  flex: none;
  margin-top: 2px;
  font-size: 21px;
}

.education-year-map__terminology strong,
.education-year-map__seasons strong {
  font-size: 12px;
}

.education-year-map__terminology strong {
  color: var(--app-accent-purple-text);
}

.education-year-map__seasons strong {
  color: var(--app-accent-amber-text);
}

.education-year-map__terminology p,
.education-year-map__seasons p {
  margin: 3px 0 0;
  color: var(--app-text-muted);
  font-size: 11px;
  line-height: 1.55;
}

.education-fiscal-academic__note {
  max-width: 1080px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin: 22px auto 0;
  padding: 18px 20px;
  color: var(--app-accent-amber-text);
  background: var(--app-accent-amber-soft);
  border: 1px solid var(--app-accent-amber-border);
  border-radius: 16px;
}

.education-fiscal-academic__note .q-icon {
  flex: none;
  margin-top: 2px;
  font-size: 21px;
}

.education-fiscal-academic__note p {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 13px;
  line-height: 1.6;
}

.education-fiscal-academic__sources {
  max-width: 960px;
  margin: 22px auto 0;
  color: var(--app-text-faint);
  font-size: 11px;
  line-height: 1.7;
  text-align: center;
}

.education-fiscal-academic__sources a {
  color: inherit;
  text-underline-offset: 3px;
}

.education-fiscal-academic__sources a:hover,
.education-fiscal-academic__sources a:focus-visible {
  color: var(--app-accent-green-text);
}

@media (max-width: 1040px) {
  .education-year-map__months {
    grid-template-columns: repeat(7, minmax(72px, 1fr));
  }

  .education-year-map__season-legend {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .education-fiscal-academic__formula {
    grid-template-columns: 1fr;
  }

  .education-fiscal-academic__formula .q-icon {
    justify-self: center;
    transform: rotate(90deg);
  }

  .education-fiscal-academic__cards,
  .education-year-map__heading,
  .education-year-map__controls {
    grid-template-columns: 1fr;
  }

  .education-fiscal-academic__cards article {
    min-height: 0;
  }

  .education-year-map__mode {
    justify-self: stretch;
  }

  .education-year-map__months {
    grid-template-columns: repeat(4, minmax(64px, 1fr));
  }

  .education-year-map__hemisphere {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 430px) {
  .education-year-map {
    padding-inline: 14px;
  }

  .education-year-map__mode {
    gap: 4px;
    padding-inline: 7px;
  }

  .education-year-map__mode span {
    font-size: 10px;
  }

  .education-year-map__period-toggle {
    overflow-x: auto;
  }

  .education-year-map__period-toggle :deep(.q-btn) {
    min-width: max-content;
    padding-inline: 10px;
    font-size: 11px;
  }

  .education-year-map__months {
    grid-template-columns: repeat(2, minmax(92px, 1fr));
  }

  .education-year-map__season-legend {
    grid-template-columns: 1fr;
  }
}
</style>
