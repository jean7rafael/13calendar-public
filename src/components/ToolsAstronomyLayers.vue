<template>
  <section id="astronomy" class="education-section" aria-labelledby="astronomy-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.astronomy.eyebrow') }}</p>
      <h2 id="astronomy-title">{{ t('education.tools.astronomy.title') }}</h2>
      <p>{{ t('education.tools.astronomy.description') }}</p>
    </div>

    <div class="astronomy-tools">
      <q-card flat bordered class="astronomy-year-card">
        <q-card-section class="astronomy-year-card__heading">
          <AppYearInput
            v-model="year"
            dense
            :min="1"
            :max="9999"
            :label="t('education.tools.astronomy.year')"
          />
          <span>{{ t('education.tools.astronomy.localTime') }}</span>
        </q-card-section>

        <q-separator />

        <q-list separator>
          <q-item v-for="event in astronomyEvents" :key="event.key">
            <q-item-section avatar>
              <q-icon :name="event.icon" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ event.label }}</q-item-label>
              <q-item-label caption>{{ event.fixed }}</q-item-label>
            </q-item-section>
            <q-item-section side class="astronomy-year-card__date">
              <time :datetime="event.iso">{{ event.date }}</time>
              <small v-if="event.distance">{{ event.distance }}</small>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <q-card flat bordered class="sunrise-card">
        <q-card-section>
          <div class="sunrise-card__intro">
            <q-icon name="wb_twilight" color="amber-7" aria-hidden="true" />
            <div>
              <h3>{{ t('education.tools.astronomy.locationTitle') }}</h3>
              <p>{{ t('education.tools.astronomy.locationText') }}</p>
            </div>
          </div>

          <q-btn
            no-caps
            unelevated
            class="app-action app-action--tertiary"
            icon="my_location"
            :loading="locating"
            :label="t('education.tools.astronomy.useLocation')"
            @click="requestLocation"
          />

          <div class="sunrise-card__fields">
            <q-input
              v-model.number="latitude"
              outlined
              type="number"
              step="0.0001"
              :label="t('education.tools.astronomy.latitude')"
            />
            <q-input
              v-model.number="longitude"
              outlined
              type="number"
              step="0.0001"
              :label="t('education.tools.astronomy.longitude')"
            />
            <AppDateInput
              v-model="sunDate"
              :label="t('education.tools.astronomy.date')"
            />
          </div>

          <p v-if="coordinateError" class="sunrise-card__error" role="alert">
            {{ coordinateError }}
          </p>

          <div v-else class="sunrise-card__results" aria-live="polite">
            <article>
              <q-icon name="wb_sunny" color="amber-7" aria-hidden="true" />
              <span>{{ t('education.tools.astronomy.sunrise') }}</span>
              <strong>{{ sunriseTime }}</strong>
            </article>
            <article>
              <q-icon name="nights_stay" color="deep-purple-4" aria-hidden="true" />
              <span>{{ t('education.tools.astronomy.sunset') }}</span>
              <strong>{{ sunsetTime }}</strong>
            </article>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ApsisKind,
  Body,
  NextPlanetApsis,
  Observer,
  SearchPlanetApsis,
  SearchRiseSet,
  Seasons,
} from 'astronomy-engine';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import AppDateInput from 'src/components/AppDateInput.vue';
import AppYearInput from 'src/components/AppYearInput.vue';
import {
  describeInternationalFixedDate,
  localDateToIso,
} from 'src/utils/calendarTools';

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();
const today = new Date();

const year = ref(today.getFullYear());
const latitude = ref(-23.5505);
const longitude = ref(-46.6333);
const sunDate = ref(localDateToIso(today));
const locating = ref(false);
const locationMessage = ref('');

const labels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));

function formatInstant(date) {
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatFixedInstant(date) {
  const presentation = describeInternationalFixedDate(
    {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
    },
    labels.value,
    locale.value,
  );
  return presentation
    ? `${presentation.title} · ${presentation.year}`
    : t('education.converter.invalid');
}

function findEarthApsides(selectedYear) {
  const found = [];
  let apsis = SearchPlanetApsis(
    Body.Earth,
    new Date(Date.UTC(selectedYear - 1, 11, 15)),
  );

  for (let index = 0; index < 4; index += 1) {
    if (apsis.time.date.getUTCFullYear() === selectedYear) found.push(apsis);
    if (apsis.time.date.getUTCFullYear() > selectedYear) break;
    apsis = NextPlanetApsis(Body.Earth, apsis);
  }
  return found;
}

const astronomyEvents = computed(() => {
  const selectedYear = Number(year.value);
  try {
    const seasons = Seasons(selectedYear);
    const baseEvents = [
      ['marchEquinox', 'brightness_5', seasons.mar_equinox.date],
      ['juneSolstice', 'wb_sunny', seasons.jun_solstice.date],
      ['septemberEquinox', 'brightness_6', seasons.sep_equinox.date],
      ['decemberSolstice', 'ac_unit', seasons.dec_solstice.date],
    ];
    const apsides = findEarthApsides(selectedYear).map((apsis) => [
      apsis.kind === ApsisKind.Pericenter ? 'perihelion' : 'aphelion',
      apsis.kind === ApsisKind.Pericenter ? 'south_america' : 'public',
      apsis.time.date,
      t('education.tools.astronomy.distance', {
        value: (apsis.dist_km / 1_000_000).toLocaleString(locale.value, {
          maximumFractionDigits: 2,
        }),
      }),
    ]);

    return [...baseEvents, ...apsides]
      .sort((left, right) => left[2] - right[2])
      .map(([key, icon, date, distance]) => ({
        key,
        icon,
        label: t(`education.tools.astronomy.${key}`),
        date: formatInstant(date),
        fixed: formatFixedInstant(date),
        iso: date.toISOString(),
        distance,
      }));
  } catch {
    return [];
  }
});

const coordinatesValid = computed(
  () =>
    Number.isFinite(Number(latitude.value)) &&
    Number.isFinite(Number(longitude.value)) &&
    Number(latitude.value) >= -90 &&
    Number(latitude.value) <= 90 &&
    Number(longitude.value) >= -180 &&
    Number(longitude.value) <= 180,
);

const coordinateError = computed(() => {
  if (locationMessage.value) return locationMessage.value;
  if (!coordinatesValid.value) return t('education.tools.astronomy.invalidCoordinates');
  return '';
});

const riseSet = computed(() => {
  if (!coordinatesValid.value || !sunDate.value) return { rise: null, set: null };
  try {
    const observer = new Observer(Number(latitude.value), Number(longitude.value), 0);
    const start = new Date(`${sunDate.value}T00:00:00`);
    return {
      rise: SearchRiseSet(Body.Sun, observer, 1, start, 1)?.date ?? null,
      set: SearchRiseSet(Body.Sun, observer, -1, start, 1)?.date ?? null,
    };
  } catch {
    return { rise: null, set: null };
  }
});

function formatTime(date) {
  if (!date) return t('education.tools.astronomy.noSunEvent');
  return new Intl.DateTimeFormat(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

const sunriseTime = computed(() => formatTime(riseSet.value.rise));
const sunsetTime = computed(() => formatTime(riseSet.value.set));

function requestLocation() {
  locationMessage.value = '';
  if (!navigator.geolocation) {
    locationMessage.value = t('education.tools.astronomy.locationDenied');
    return;
  }

  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (position) => {
      latitude.value = Number(position.coords.latitude.toFixed(5));
      longitude.value = Number(position.coords.longitude.toFixed(5));
      locating.value = false;
    },
    () => {
      locationMessage.value = t('education.tools.astronomy.locationDenied');
      locating.value = false;
    },
    { enableHighAccuracy: false, timeout: 10_000, maximumAge: 3_600_000 },
  );
}
</script>

<style scoped>
.astronomy-tools {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
  align-items: stretch;
  gap: 22px;
  max-width: 1120px;
  margin: 0 auto;
}

.astronomy-year-card,
.sunrise-card {
  height: 100%;
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.astronomy-year-card {
  position: relative;
  display: grid;
  grid-template-rows: repeat(7, minmax(0, 1fr));
}

.astronomy-year-card__heading {
  grid-row: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 6px 24px;
}

.astronomy-year-card > .q-separator {
  position: absolute;
  inset-inline: 0;
  top: calc(100% / 7);
}

.astronomy-year-card .q-list {
  grid-row: 2 / span 6;
  min-height: 0;
  display: grid;
  grid-template-rows: repeat(6, minmax(0, 1fr));
}

.astronomy-year-card .q-item {
  min-height: 0;
  height: 100%;
}

.astronomy-year-card__heading .q-field {
  width: 190px;
}

.astronomy-year-card__heading span,
.astronomy-year-card__date small {
  color: var(--app-text-faint);
  font-size: 11px;
}

.astronomy-year-card__date {
  align-items: flex-end;
  gap: 3px;
  padding-inline-start: 14px;
  color: var(--app-text-muted);
  text-align: end;
}

.sunrise-card .q-card__section {
  display: grid;
  gap: 22px;
  padding: 26px;
}

.sunrise-card__intro {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.sunrise-card__intro > .q-icon {
  font-size: 30px;
}

.sunrise-card__intro h3 {
  margin: 0;
  font-size: 21px;
}

.sunrise-card__intro p {
  margin: 7px 0 0;
  color: var(--app-text-muted);
  line-height: 1.55;
}

.sunrise-card__fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.sunrise-card__fields > :last-child {
  grid-column: 1 / -1;
}

.sunrise-card__error {
  margin: 0;
  color: #dc2626;
  font-size: 13px;
}

.sunrise-card__results {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.sunrise-card__results article {
  display: grid;
  justify-items: center;
  gap: 7px;
  padding: 18px 10px;
  background: var(--app-primary-soft);
  border: 1px solid var(--app-border);
  border-radius: 16px;
  text-align: center;
}

.sunrise-card__results .q-icon {
  font-size: 27px;
}

.sunrise-card__results span {
  color: var(--app-text-muted);
  font-size: 12px;
}

@media (max-width: 860px) {
  .astronomy-tools {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .astronomy-year-card,
  .sunrise-card {
    height: auto;
  }

  .astronomy-year-card {
    display: block;
  }

  .astronomy-year-card__heading {
    padding: 22px 24px;
  }

  .astronomy-year-card > .q-separator {
    position: static;
  }

  .astronomy-year-card .q-list {
    display: block;
  }

  .astronomy-year-card .q-item {
    min-height: 48px;
    height: auto;
  }
}

@media (max-width: 520px) {
  .astronomy-year-card__heading,
  .sunrise-card__fields,
  .sunrise-card__results {
    grid-template-columns: 1fr;
  }

  .astronomy-year-card__heading {
    align-items: stretch;
    flex-direction: column;
  }

  .astronomy-year-card__heading .q-field {
    width: auto;
  }

  .astronomy-year-card__date {
    max-width: 130px;
  }

  .sunrise-card__fields > :last-child {
    grid-column: auto;
  }
}
</style>
