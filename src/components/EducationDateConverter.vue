<template>
  <section
    id="education-converter"
    class="education-section"
    aria-labelledby="education-converter-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.converter.eyebrow') }}</p>
      <h2 id="education-converter-title">{{ t('education.converter.title') }}</h2>
      <p>{{ t('education.converter.description') }}</p>
    </div>

    <q-card flat bordered class="education-converter">
      <q-card-section class="education-converter__mode">
        <q-btn-toggle
          v-model="mode"
          no-caps
          unelevated
          rounded
          color="transparent"
          text-color="grey-6"
          toggle-color="primary"
          toggle-text-color="white"
          :options="modeOptions"
          :aria-label="t('education.converter.title')"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="education-converter__body">
        <div v-if="mode === 'gregorian-to-fixed'" class="education-converter__input">
          <AppDateInput
            v-model="gregorianDate"
            :label="t('education.converter.gregorianDate')"
          />
        </div>

        <div v-else class="education-converter__input education-converter__input--fixed">
          <AppYearInput
            v-model="fixedYear"
            :label="t('education.converter.year')"
            :min="1"
            :max="9999"
          />

          <q-btn-toggle
            v-model="fixedKind"
            spread
            no-caps
            unelevated
            rounded
            color="transparent"
            text-color="grey-6"
            toggle-color="primary"
            toggle-text-color="white"
            :options="fixedKindOptions"
          />

          <div
            class="education-converter__fixed-fields"
            :class="{ 'education-converter__fixed-fields--reserved': fixedKind !== 'ordinary' }"
            :aria-hidden="fixedKind !== 'ordinary'"
          >
            <AppInternationalFixedDateInput
              v-model="fixedMonthDay"
              :label="t('education.converter.fixedDate')"
              :months="months13Long.slice(0, 13)"
              :weekdays="weekDaysShort"
            />
          </div>
        </div>

        <div class="education-converter__arrow" aria-hidden="true">
          <q-icon name="arrow_forward" />
        </div>

        <div
          class="education-converter__result"
          :class="{ 'education-converter__result--invalid': !conversionResult.valid }"
          aria-live="polite"
        >
          <template v-if="conversionResult.valid">
            <p class="education-converter__result-label">{{ conversionResult.label }}</p>
            <AppComparisonDateTitle :title="conversionResult.title" />
            <small>{{ conversionResult.year }}</small>
            <span>{{ conversionResult.caption }}</span>
          </template>

          <template v-else>
            <q-icon name="event_busy" aria-hidden="true" />
            <span>{{ t('education.converter.invalid') }}</span>
          </template>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section class="education-converter__note">
        <q-icon name="verified" color="primary" aria-hidden="true" />
        <div>
          <strong>{{ t('education.converter.sharedEngine') }}</strong>
          <p>{{ t('education.converter.fact') }}</p>
        </div>
      </q-card-section>
    </q-card>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import AppComparisonDateTitle from 'src/components/AppComparisonDateTitle.vue';
import AppDateInput from 'src/components/AppDateInput.vue';
import AppInternationalFixedDateInput from 'src/components/AppInternationalFixedDateInput.vue';
import AppYearInput from 'src/components/AppYearInput.vue';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import {
  buildDateComparisonPresentation,
  isoToGregorianParts,
  localDateToIso,
} from 'src/utils/calendarTools';
import {
  internationalFixedPartsToGregorian,
  isGregorianLeapYear,
} from '../../shared/internationalFixedCalendar.js';

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysShort, weekDaysComparison } = useCalendarTranslations();
const route = useRoute();
const router = useRouter();

const initialGregorianDate = isoToGregorianParts(route.query.date)
  ? String(route.query.date)
  : localDateToIso();
const initialFixed = String(route.query.ifc || '').match(/^(\d{1,4})-(?:(\d{1,2})-(\d{1,2})|(YD|LD))$/);
const mode = ref(route.query.direction === 'f2g' ? 'fixed-to-gregorian' : 'gregorian-to-fixed');
const gregorianDate = ref(initialGregorianDate);
const initialFixedYear = initialFixed ? Number(initialFixed[1]) : new Date().getFullYear();
const requestedFixedMonth = initialFixed?.[2] ? Number(initialFixed[2]) : 1;
const requestedFixedDay = initialFixed?.[3] ? Number(initialFixed[3]) : 1;
const requestedFixedKind =
  initialFixed?.[4] === 'YD' ? 'year-day' : initialFixed?.[4] === 'LD' ? 'leap-day' : 'ordinary';
const fixedYear = ref(initialFixedYear);
const fixedMonth = ref(
  Number.isInteger(requestedFixedMonth) && requestedFixedMonth >= 1 && requestedFixedMonth <= 13
    ? requestedFixedMonth
    : 1,
);
const fixedDay = ref(
  Number.isInteger(requestedFixedDay) && requestedFixedDay >= 1 && requestedFixedDay <= 28
    ? requestedFixedDay
    : 1,
);
const fixedKind = ref(
  requestedFixedKind === 'leap-day' && !isGregorianLeapYear(initialFixedYear)
    ? 'ordinary'
    : requestedFixedKind,
);

const modeOptions = computed(() => [
  { label: t('education.converter.gregorianToFixed'), value: 'gregorian-to-fixed' },
  { label: t('education.converter.fixedToGregorian'), value: 'fixed-to-gregorian' },
]);

const fixedYearIsLeap = computed(() => isGregorianLeapYear(Number(fixedYear.value)));
const fixedKindOptions = computed(() => [
  { label: t('education.converter.ordinary'), value: 'ordinary' },
  { label: t('education.converter.yearDay'), value: 'year-day' },
  {
    label: t('education.converter.leapDay'),
    value: 'leap-day',
    disable: !fixedYearIsLeap.value,
  },
]);
const fixedMonthDay = computed({
  get: () => ({ month: fixedMonth.value, day: fixedDay.value }),
  set: ({ month, day }) => {
    fixedMonth.value = Number(month);
    fixedDay.value = Number(day);
  },
});
const comparisonLabels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));

function createGregorianResult() {
  const month = fixedKind.value === 'ordinary' ? Number(fixedMonth.value) : 14;
  const day =
    fixedKind.value === 'ordinary'
      ? Number(fixedDay.value)
      : fixedKind.value === 'year-day'
        ? 1
        : 2;
  const parts = internationalFixedPartsToGregorian(Number(fixedYear.value), month, day);

  if (!parts) return { valid: false };
  const comparison = buildDateComparisonPresentation(
    parts,
    locale.value,
    comparisonLabels.value,
  );

  if (!comparison) return { valid: false };

  return {
    valid: true,
    label: t('education.converter.gregorianDate'),
    title: comparison.gregorianTitle,
    year: comparison.year,
    caption: [
      parts.year,
      String(parts.month).padStart(2, '0'),
      String(parts.day).padStart(2, '0'),
    ].join('-'),
  };
}

function createFixedResult() {
  const [year, month, day] = String(gregorianDate.value).split('-').map(Number);
  const comparison = buildDateComparisonPresentation(
    { year, month, day },
    locale.value,
    comparisonLabels.value,
  );

  if (!comparison) return { valid: false };

  return {
    valid: true,
    label: t('education.converter.fixedDate'),
    title: comparison.fixedTitle,
    year: comparison.year,
    caption: comparison.fixedCaption,
  };
}

const conversionResult = computed(() =>
  mode.value === 'gregorian-to-fixed' ? createFixedResult() : createGregorianResult(),
);

watch(fixedYear, (year) => {
  if (fixedKind.value === 'leap-day' && !isGregorianLeapYear(Number(year))) {
    fixedKind.value = 'ordinary';
  }
});

watch(
  [mode, gregorianDate, fixedYear, fixedMonth, fixedDay, fixedKind],
  () => {
    const query = { ...route.query };
    if (mode.value === 'gregorian-to-fixed') {
      query.direction = 'g2f';
      query.date = gregorianDate.value;
      delete query.ifc;
    } else {
      query.direction = 'f2g';
      query.ifc =
        fixedKind.value === 'ordinary'
          ? `${fixedYear.value}-${fixedMonth.value}-${fixedDay.value}`
          : `${fixedYear.value}-${fixedKind.value === 'year-day' ? 'YD' : 'LD'}`;
      delete query.date;
    }
    router.replace({ query, hash: route.hash });
  },
  { flush: 'post' },
);
</script>

<style scoped>
.education-converter {
  max-width: 880px;
  margin: 0 auto;
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.education-converter__mode {
  display: flex;
  justify-content: center;
  padding: 18px;
}

.education-converter__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 48px minmax(0, 1fr);
  align-items: center;
  gap: 20px;
  min-height: 250px;
  padding: 28px;
}

.education-converter__input {
  display: grid;
  gap: 16px;
}

.education-converter__fixed-fields {
  min-width: 0;
}

.education-converter__fixed-fields--reserved {
  visibility: hidden;
  pointer-events: none;
}

.education-converter__arrow {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  color: var(--app-primary-text);
  background: var(--app-primary-soft);
  border: 1px solid color-mix(in srgb, var(--app-primary-text) 26%, transparent);
  border-radius: 50%;
  font-size: 20px;
}

.education-converter__result {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  color: var(--app-text);
  background: var(--app-primary-soft);
  border: 1px solid color-mix(in srgb, var(--app-primary-text) 24%, transparent);
  border-radius: 18px;
  text-align: center;
}

.education-converter__result-label {
  margin: 0;
  color: var(--app-primary-text);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.education-converter__result strong {
  font-size: clamp(18px, 3vw, 25px);
  line-height: 1.25;
}

.education-converter__result small {
  color: var(--app-text-muted);
  font-size: 13px;
}

.education-converter__result > span {
  color: var(--app-text-muted);
  font-size: 13px;
}

.education-converter__result--invalid {
  color: var(--app-text-muted);
  background: color-mix(in srgb, var(--app-surface) 84%, transparent);
  border-color: var(--app-border);
}

.education-converter__result--invalid .q-icon {
  font-size: 30px;
}

.education-converter__note {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: var(--app-text-muted);
}

.education-converter__note .q-icon {
  margin-top: 2px;
  font-size: 20px;
}

.education-converter__note strong {
  color: var(--app-text);
  font-size: 13px;
}

.education-converter__note p {
  margin: 3px 0 0;
  font-size: 12px;
  line-height: 1.55;
}

@media (max-width: 700px) {
  .education-converter__body {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .education-converter__arrow {
    margin: 0 auto;
    transform: rotate(90deg);
  }

  .education-converter__fixed-fields {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 420px) {
  .education-converter__mode :deep(.q-btn-group) {
    width: 100%;
  }

  .education-converter__mode :deep(.q-btn) {
    min-height: 48px;
    padding-inline: 10px;
    font-size: 12px;
  }
}
</style>
