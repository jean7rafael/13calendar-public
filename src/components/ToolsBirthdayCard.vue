<template>
  <section id="birthday" class="education-section" aria-labelledby="birthday-title">
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.birthday.eyebrow') }}</p>
      <h2 id="birthday-title">{{ t('education.tools.birthday.title') }}</h2>
      <p>{{ t('education.tools.birthday.description') }}</p>
    </div>

    <q-card flat bordered class="birthday-tool">
      <q-card-section class="birthday-tool__inputs">
        <AppYearInput
          v-model="celebrationYear"
          :min="1"
          :max="9999"
          :label="t('education.tools.birthday.celebrationYear')"
        />
        <AppDateInput
          v-model="birthDate"
          month-day-only
          :reference-year="celebrationYear"
          :label="t('education.tools.birthday.original')"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="birthday-tool__result" aria-live="polite">
        <template v-if="celebrationParts && fixedPresentation">
          <article>
            <span>{{ t('education.tools.birthday.gregorian') }}</span>
            <AppComparisonDateTitle :title="gregorianCelebration" />
            <small>{{ comparisonYear }}</small>
          </article>
          <q-icon name="celebration" color="primary" aria-hidden="true" />
          <article>
            <span>{{ t('education.tools.birthday.fixed') }}</span>
            <AppComparisonDateTitle :title="fixedPresentation.title" />
            <small>{{ comparisonYear }}</small>
            <small>{{ fixedPresentation.caption }}</small>
          </article>
        </template>

        <div v-else class="birthday-tool__invalid">
          <q-icon name="event_busy" aria-hidden="true" />
          <span>{{ invalidMessage }}</span>
        </div>
      </q-card-section>

      <q-card-section v-if="celebrationParts && fixedPresentation" class="birthday-tool__footer">
        <p>{{ t('education.tools.birthday.weekdayFact') }}</p>
        <div class="app-action-group">
          <q-btn
            no-caps
            unelevated
            icon="download"
            class="app-action app-action--primary"
            :label="t('education.tools.birthday.download')"
            @click="downloadBirthdayCard"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--tertiary"
            icon="link"
            :label="t('education.tools.birthday.copy')"
            @click="copyBirthdayLink"
          />
        </div>
        <span v-if="statusMessage" role="status">{{ statusMessage }}</span>
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
import AppYearInput from 'src/components/AppYearInput.vue';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import {
  canvasToBlob,
  buildDateComparisonPresentation,
  copyText,
  createAbsoluteRouteUrl,
  downloadBlob,
  gregorianPartsToIso,
  isoToGregorianParts,
  splitComparisonTitle,
} from 'src/utils/calendarTools';

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();
const route = useRoute();
const router = useRouter();
const currentYear = new Date().getFullYear();

const initialBirthParts = isoToGregorianParts(route.query.birth);
const birthDate = ref(
  initialBirthParts
    ? gregorianPartsToIso({
        year: 2000,
        month: initialBirthParts.month,
        day: initialBirthParts.day,
      })
    : '',
);
const celebrationYear = ref(
  Number.isInteger(Number(route.query.year)) ? Number(route.query.year) : currentYear,
);
const statusMessage = ref('');

const birthParts = computed(() => isoToGregorianParts(birthDate.value));
const celebrationParts = computed(() => {
  if (!birthParts.value) return null;
  const selectedYear = Number(celebrationYear.value);
  if (!Number.isInteger(selectedYear) || selectedYear < 1 || selectedYear > 9999) return null;
  const candidate = {
    year: selectedYear,
    month: birthParts.value.month,
    day: birthParts.value.day,
  };
  return isoToGregorianParts(gregorianPartsToIso(candidate));
});
const labels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('calendar.specialDays.yearDay'),
  leapDay: t('calendar.specialDays.leapDay'),
  specialDays: t('calendar.specialDays.title'),
  position: (month, week) => t('education.converter.position', { month, week }),
}));
const comparison = computed(() =>
  celebrationParts.value
    ? buildDateComparisonPresentation(celebrationParts.value, locale.value, labels.value)
    : null,
);
const fixedPresentation = computed(() => comparison.value?.fixed || null);
const gregorianCelebration = computed(() =>
  comparison.value?.gregorianTitle || '',
);
const comparisonYear = computed(() => comparison.value?.year || '');
const invalidMessage = computed(() => {
  if (!birthDate.value) return t('education.tools.birthday.chooseDate');
  if (birthParts.value?.month === 2 && birthParts.value?.day === 29) {
    return t('education.tools.birthday.invalidLeap');
  }
  return t('education.converter.invalid');
});
const birthdayUrl = computed(() =>
  createAbsoluteRouteUrl('/tools', {
    birth: birthDate.value,
    year: celebrationYear.value,
  }),
);

function drawCenteredComparisonTitle(context, title, weekdayY, dateY, color, dateSize) {
  const parts = splitComparisonTitle(title);
  context.fillStyle = color;

  if (!parts) {
    context.font = `800 ${dateSize}px Inter, Arial, sans-serif`;
    context.fillText(title, 600, dateY, 1060);
    return;
  }

  context.font = `750 ${Math.round(dateSize * 0.72)}px Inter, Arial, sans-serif`;
  context.fillText(`${parts.weekday} ·`, 600, weekdayY, 1060);
  context.font = `800 ${dateSize}px Inter, Arial, sans-serif`;
  context.fillText(parts.date, 600, dateY, 1060);
}

watch([birthDate, celebrationYear], ([birth, year]) => {
  statusMessage.value = '';
  if (
    !isoToGregorianParts(birth) ||
    !Number.isInteger(Number(year)) ||
    Number(year) < 1 ||
    Number(year) > 9999
  ) {
    return;
  }
  router.replace({
    query: { ...route.query, birth, year: String(year) },
    hash: route.hash,
  });
});

function createBirthdayCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 630;
  const context = canvas.getContext('2d');
  const gradient = context.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, '#0f172a');
  gradient.addColorStop(0.55, '#4c1d95');
  gradient.addColorStop(1, '#be185d');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.direction = document.documentElement.dir === 'rtl' ? 'rtl' : 'ltr';
  context.fillStyle = '#fbcfe8';
  context.font = '800 24px Inter, Arial, sans-serif';
  context.fillText(t('education.tools.birthday.cardTitle').toUpperCase(), 600, 92, 1050);
  drawCenteredComparisonTitle(context, gregorianCelebration.value, 162, 210, '#ffffff', 50);
  context.fillStyle = 'rgba(255,255,255,.7)';
  context.font = '500 25px Inter, Arial, sans-serif';
  context.fillText(String(comparisonYear.value), 600, 255, 1020);
  drawCenteredComparisonTitle(
    context,
    fixedPresentation.value.title,
    330,
    384,
    '#c4b5fd',
    58,
  );
  context.fillStyle = 'rgba(255,255,255,.7)';
  context.font = '500 25px Inter, Arial, sans-serif';
  context.fillText(String(comparisonYear.value), 600, 430, 1020);
  context.font = '500 21px Inter, Arial, sans-serif';
  context.fillText(fixedPresentation.value.caption, 600, 468, 1020);
  context.font = '600 22px Inter, Arial, sans-serif';
  context.fillText('13 Calendar · 13calendar.pages.dev', 600, 555, 1000);
  return canvas;
}

async function downloadBirthdayCard() {
  const blob = await canvasToBlob(createBirthdayCanvas());
  downloadBlob(blob, `13-calendar-birthday-${celebrationYear.value}.png`);
  statusMessage.value = t('education.tools.birthday.downloaded');
}

async function copyBirthdayLink() {
  await copyText(birthdayUrl.value);
  statusMessage.value = t('education.tools.birthday.copied');
}
</script>

<style scoped>
.birthday-tool {
  max-width: 920px;
  margin: 0 auto;
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.birthday-tool__inputs {
  display: grid;
  grid-template-columns: minmax(180px, 0.45fr) minmax(0, 1fr);
  gap: 14px;
  padding: 26px;
}

.birthday-tool__result {
  min-height: 240px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 52px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
  padding: 32px;
}

.birthday-tool__result article {
  width: 100%;
  min-height: 128px;
  display: grid;
  grid-template-rows: 18px minmax(2.5em, auto) 18px auto;
  align-content: start;
  gap: 8px;
  text-align: center;
}

.birthday-tool__result article > span,
.birthday-tool__result small {
  color: var(--app-text-muted);
  font-size: 12px;
}

.birthday-tool__result strong {
  font-size: clamp(20px, 3vw, 29px);
  line-height: 1.25;
}

.birthday-tool__result article:last-of-type strong {
  color: var(--app-primary-text);
}

.birthday-tool__result > .q-icon {
  justify-self: center;
  font-size: 32px;
}

.birthday-tool__invalid {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--app-text-muted);
}

.birthday-tool__footer {
  display: grid;
  justify-items: center;
  gap: 14px;
  padding: 22px 26px;
  background: var(--app-primary-soft);
  border-top: 1px solid var(--app-border);
  text-align: center;
}

.birthday-tool__footer p,
.birthday-tool__footer > span {
  margin: 0;
  color: var(--app-text-muted);
  font-size: 13px;
}

.birthday-tool__footer > div {
  --app-action-group-max: 520px;
  --app-action-min-width: 230px;
}

.birthday-tool__footer > span {
  color: #059669;
}

@media (max-width: 640px) {
  .birthday-tool__inputs,
  .birthday-tool__result {
    grid-template-columns: 1fr;
  }

  .birthday-tool__result > .q-icon {
    transform: rotate(90deg);
  }
}
</style>
