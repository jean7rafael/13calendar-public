<template>
  <section
    id="moon-and-28-days"
    class="education-section education-moon"
    :aria-labelledby="showHeading ? 'education-moon-title' : undefined"
    :aria-label="showHeading ? undefined : t('education.moon.title')"
  >
    <div v-if="showHeading" class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.moon.eyebrow') }}</p>
      <h2 id="education-moon-title">{{ t('education.moon.title') }}</h2>
      <p>{{ t('education.moon.intro') }}</p>
    </div>

    <div class="education-moon__measures" role="list">
      <article v-for="measure in measures" :key="measure.label" role="listitem">
        <span>{{ measure.label }}</span>
        <strong>{{ t('education.moon.days', { value: measure.value }) }}</strong>
        <div class="education-moon__measure-track" aria-hidden="true">
          <span :style="{ width: measure.width }"></span>
        </div>
      </article>
    </div>

    <q-card flat bordered class="education-moon__drift">
      <q-card-section>
        <div class="education-moon__drift-icon" aria-hidden="true">🌑</div>
        <div>
          <h3>{{ t('education.moon.driftTitle') }}</h3>
          <p>{{ t('education.moon.driftText') }}</p>
        </div>
      </q-card-section>

      <div class="education-moon__drift-line" aria-hidden="true">
        <span v-for="marker in driftMarkers" :key="marker.month" :style="{ left: marker.left }">
          <i></i>
          <small>{{ marker.day }}</small>
        </span>
      </div>
    </q-card>

    <q-card flat bordered class="education-moon__live">
      <q-card-section class="education-moon__live-heading">
        <div class="education-moon__live-copy">
          <h3>{{ translateMoonPhase(selectedPhase) }} · {{ selectedYear }}</h3>
          <p>{{ t('education.moon.liveText') }}</p>
        </div>

        <div
          class="education-moon__phase-filter"
          role="radiogroup"
          :aria-label="t('panels.moonPhases')"
        >
          <button
            v-for="phase in phaseOptions"
            :key="phase"
            type="button"
            role="radio"
            :aria-label="translateMoonPhase(phase)"
            :aria-checked="selectedPhase === phase"
            :class="{ 'education-moon__phase-filter-button--active': selectedPhase === phase }"
            @click="selectedPhase = phase"
          >
            <span aria-hidden="true">{{ getMoonPhaseEmoji(phase) }}</span>
            <span class="education-moon__phase-filter-label">{{ translateMoonPhase(phase) }}</span>
            <q-tooltip>{{ translateMoonPhase(phase) }}</q-tooltip>
          </button>
        </div>

        <AppYearInput
          v-model="selectedYear"
          dense
          :label="t('education.converter.year')"
          :min="1600"
          :max="2600"
          class="education-moon__year"
        />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div v-if="loading" class="education-moon__loading">
          <q-spinner color="primary" size="28px" />
        </div>

        <div v-else-if="moonPhasePositions.length" class="education-moon__positions" role="list">
          <article v-for="position in moonPhasePositions" :key="position.instant" role="listitem">
            <span class="education-moon__phase" aria-hidden="true">{{ position.emoji }}</span>
            <div>
              <strong>{{ position.fixedTitle }}</strong>
              <span>{{ position.gregorianTitle }}</span>
            </div>
            <time :datetime="position.instant">{{ position.localTime }}</time>
          </article>
        </div>

        <p v-else class="education-moon__empty">{{ t('panels.noMoonPhases') }}</p>
      </q-card-section>
    </q-card>

    <div class="education-moon__boundaries">
      <AppNoticePanel
        tone="purple"
        icon="schedule"
        :title="t('education.moon.exactTitle')"
      >
        <p>{{ t('education.moon.exactText') }}</p>
      </AppNoticePanel>

      <AppNoticePanel
        tone="amber"
        icon="health_and_safety"
        :title="t('education.moon.claimsTitle')"
      >
        <p>{{ t('education.moon.claimsText') }}</p>
      </AppNoticePanel>
    </div>

    <div class="education-moon__methodology">
      <a
        href="https://github.com/jean7rafael/13calendar/blob/feature/vue-educational-migration/docs/PRODUCT_ROADMAP_AND_LUNAR_POLICY.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('education.moon.methodology') }}
        <q-icon name="open_in_new" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import AppNoticePanel from 'src/components/AppNoticePanel.vue';
import AppYearInput from 'src/components/AppYearInput.vue';
import { obterFasesLuaDoAno } from 'src/utils/fasesLua';
import { getMoonPhaseEmoji } from 'src/utils/moonPhaseMarkers';
import { buildDateComparisonPresentation } from 'src/utils/calendarTools';

defineProps({
  showHeading: {
    type: Boolean,
    default: true,
  },
});

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison, translateMoonPhase } = useCalendarTranslations();

const selectedYear = ref(new Date().getFullYear());
const selectedPhase = ref('Cheia');
const loading = ref(true);
const moonPhases = ref([]);
const phaseOptions = Object.freeze(['Nova', 'Crescente', 'Cheia', 'Minguante']);

const measures = computed(() => [
  { label: t('education.moon.fixedMonth'), value: localeNumber(28, 0), width: '93.6%' },
  { label: t('education.moon.synodicCycle'), value: localeNumber(29.5306, 4), width: '98.4%' },
  { label: t('education.moon.phaseInterval'), value: localeNumber(7.3826, 4), width: '24.6%' },
]);

const driftMarkers = computed(() =>
  Array.from({ length: 13 }, (_, index) => {
    const accumulatedDay = 1 + index * 1.5306;

    return {
      month: index + 1,
      day: localeNumber(accumulatedDay, 1),
      left: `${(index / 12) * 100}%`,
    };
  }),
);

function localeNumber(value, maximumFractionDigits) {
  return new Intl.NumberFormat(locale.value, {
    minimumFractionDigits: maximumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

async function loadMoonPhases(year) {
  const numericYear = Number(year);

  if (!Number.isInteger(numericYear) || numericYear < 1600 || numericYear > 2600) {
    moonPhases.value = [];
    loading.value = false;
    return;
  }

  loading.value = true;

  try {
    moonPhases.value = await obterFasesLuaDoAno(numericYear);
  } finally {
    loading.value = false;
  }
}

const comparisonLabels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));

function createMoonPosition(phase) {
  const [year, month, day] = phase.data.split('-').map(Number);
  const instantDate = new Date(phase.instante);
  const comparison = buildDateComparisonPresentation(
    { year, month, day },
    locale.value,
    comparisonLabels.value,
  );

  return {
    instant: phase.instante,
    fixedTitle: comparison
      ? `${comparison.fixedTitle} · ${comparison.year}`
      : t('education.converter.invalid'),
    gregorianTitle: comparison
      ? `${comparison.gregorianTitle} · ${comparison.year}`
      : t('education.converter.invalid'),
    localTime: new Intl.DateTimeFormat(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(instantDate),
    emoji: getMoonPhaseEmoji(phase.fase),
  };
}

const moonPhasePositions = computed(() =>
  moonPhases.value.filter((phase) => phase.fase === selectedPhase.value).map(createMoonPosition),
);

watch(selectedYear, loadMoonPhases, { immediate: true });
</script>

<style scoped>
.education-moon__measures {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  max-width: 980px;
  margin: 0 auto 18px;
}

.education-moon__measures article {
  padding: 20px;
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
}

.education-moon__measures span {
  display: block;
  color: var(--app-text-muted);
  font-size: 12px;
}

.education-moon__measures strong {
  display: block;
  margin-top: 8px;
  color: var(--app-text);
  font-size: clamp(20px, 4vw, 30px);
}

.education-moon__measure-track {
  height: 5px;
  margin-top: 14px;
  overflow: hidden;
  background: var(--app-border);
  border-radius: 99px;
}

.education-moon__measure-track span {
  height: 100%;
  background: linear-gradient(90deg, #6366f1, #a855f7);
  border-radius: inherit;
}

.education-moon__drift,
.education-moon__live {
  max-width: 980px;
  margin: 18px auto;
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 22px;
  box-shadow: var(--app-card-shadow);
}

.education-moon__drift .q-card__section {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
}

.education-moon__drift-icon {
  font-size: 34px;
}

.education-moon h3 {
  margin: 0;
  color: var(--app-text);
  font-size: 17px;
}

.education-moon p {
  margin: 7px 0 0;
  color: var(--app-text-muted);
  line-height: 1.65;
}

.education-moon__drift-line {
  position: relative;
  height: 72px;
  margin: 0 34px 28px;
  border-bottom: 2px solid var(--app-border-strong);
}

.education-moon__drift-line > span {
  position: absolute;
  bottom: -25px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
}

.education-moon__drift-line i {
  width: 9px;
  height: 9px;
  margin-bottom: 8px;
  background: #8b5cf6;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgb(139 92 246 / 14%);
}

.education-moon__drift-line small {
  color: var(--app-text-faint);
  font-size: 9px;
}

.education-moon__live-heading {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto 120px;
  align-items: flex-start;
  gap: 18px;
  padding: 24px;
}

.education-moon__live-copy {
  min-width: 0;
}

.education-moon__year {
  width: 120px;
}

.education-moon__phase-filter {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 2px;
}

.education-moon__phase-filter button {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 10px;
  color: var(--app-text-muted);
  background: var(--app-surface-raised);
  border: 1px solid var(--app-border);
  border-radius: 999px;
  font: inherit;
  font-size: 11px;
  cursor: pointer;
  white-space: nowrap;
}

.education-moon__phase-filter button:hover,
.education-moon__phase-filter button:focus-visible,
.education-moon__phase-filter-button--active {
  color: var(--app-primary-text) !important;
  background: var(--app-primary-soft) !important;
  border-color: var(--app-accent-purple-border) !important;
  outline: none;
}

.education-moon__loading {
  min-height: 100px;
  display: grid;
  place-items: center;
}

.education-moon__positions {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.education-moon__positions article {
  min-width: 0;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: color-mix(in srgb, var(--app-primary-soft) 70%, transparent);
  border: 1px solid color-mix(in srgb, var(--app-primary-text) 15%, transparent);
  border-radius: 14px;
}

.education-moon__phase {
  font-size: 24px;
}

.education-moon__positions strong,
.education-moon__positions article > div > span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.education-moon__positions strong {
  color: var(--app-text);
  font-size: 13px;
}

.education-moon__positions article > div > span,
.education-moon__positions time {
  color: var(--app-text-muted);
  font-size: 10px;
}

.education-moon__empty {
  padding: 24px;
  text-align: center;
}

.education-moon__boundaries {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  max-width: 980px;
  margin: 18px auto;
}

.education-moon__methodology {
  text-align: center;
}

.education-moon__methodology a {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--app-primary-text);
  font-weight: 700;
  text-decoration: none;
}

@media (max-width: 800px) {
  .education-moon__measures,
  .education-moon__positions {
    grid-template-columns: 1fr;
  }

  .education-moon__boundaries {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .education-moon__live-heading {
    grid-template-columns: minmax(180px, 1fr) auto 112px;
    gap: 12px;
  }

  .education-moon__year {
    width: 112px;
  }

  .education-moon__phase-filter button {
    width: 32px;
    min-width: 32px;
    justify-content: center;
    padding-inline: 0;
  }

  .education-moon__phase-filter-label {
    display: none;
  }
}

@media (max-width: 520px) {
  .education-moon__live-heading {
    grid-template-columns: minmax(0, 1fr) 108px;
  }

  .education-moon__phase-filter {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
    justify-content: flex-start;
  }

  .education-moon__year {
    grid-column: 2;
    grid-row: 1;
    width: 108px;
  }

  .education-moon__drift-line {
    margin-inline: 20px;
  }
}
</style>
