<template>
  <section
    id="annual-planner"
    class="education-section annual-planner-section"
    aria-labelledby="annual-planner-title"
  >
    <div class="education-section__heading">
      <p class="education-eyebrow">{{ t('education.tools.planner.eyebrow') }}</p>
      <h2 id="annual-planner-title">{{ t('education.tools.planner.title') }}</h2>
      <p>{{ t('education.tools.planner.description') }}</p>
    </div>

    <q-card flat bordered class="annual-planner">
      <q-card-section class="annual-planner__toolbar">
        <AppYearInput
          v-model="year"
          dense
          :min="1"
          :max="9999"
          :label="t('education.tools.planner.year')"
        />
        <div>
          <q-btn
            no-caps
            unelevated
            icon="event_available"
            class="app-action app-action--primary"
            :label="t('education.tools.planner.exportIcs')"
            @click="exportIcs"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--secondary"
            icon="print"
            :label="t('education.tools.planner.printPdf')"
            @click="printPlanner"
          />
        </div>
      </q-card-section>

      <q-separator />

      <div class="annual-planner__table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">{{ t('education.tools.planner.fixedMonth') }}</th>
              <th scope="col">{{ t('education.tools.planner.gregorianRange') }}</th>
              <th scope="col">{{ t('education.tools.planner.weekday') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in monthRows" :key="row.month">
              <th scope="row">
                <span>{{ row.month }}</span>
                {{ row.name }}
              </th>
              <td>{{ row.range }}</td>
              <td>{{ row.weekday }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <q-separator />

      <q-card-section class="annual-planner__special-days">
        <strong>{{ t('education.tools.planner.specialDays') }}</strong>
        <div v-for="specialDay in specialDayRows" :key="specialDay.kind">
          <span>{{ specialDay.label }}</span>
          <time :datetime="specialDay.iso">{{ specialDay.date }}</time>
        </div>
      </q-card-section>

      <p v-if="statusMessage" class="annual-planner__status" role="status">
        {{ statusMessage }}
      </p>
    </q-card>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import AppYearInput from 'src/components/AppYearInput.vue';
import {
  buildInternationalFixedYear,
  createAnnualPlannerIcs,
  downloadBlob,
  formatGregorianComparison,
  formatGregorianParts,
  gregorianPartsToIso,
} from 'src/utils/calendarTools';

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();
const year = ref(new Date().getFullYear());
const statusMessage = ref('');
let printCleanupTimer;

const plan = computed(() => buildInternationalFixedYear(Number(year.value)));
const monthRows = computed(() =>
  plan.value.months.map((month) => ({
    month: month.month,
    name: months13Long.value[month.month - 1],
    range: `${formatGregorianParts(month.start, locale.value, {
      month: 'short',
      day: 'numeric',
      year: undefined,
    })} – ${formatGregorianParts(month.end, locale.value, {
      month: 'short',
      day: 'numeric',
      year: undefined,
    })}`,
    weekday: weekDaysComparison.value[month.weekday],
  })),
);
const specialDayRows = computed(() =>
  plan.value.specialDays.map((specialDay) => ({
    kind: specialDay.kind,
    label: t(
      specialDay.kind === 'year-day'
        ? 'education.tools.planner.yearDay'
        : 'education.tools.planner.leapDay',
    ),
    iso: gregorianPartsToIso(specialDay.gregorian),
    date: formatGregorianComparison(specialDay.gregorian, locale.value),
  })),
);

function exportIcs() {
  const contents = createAnnualPlannerIcs(Number(year.value), months13Long.value.slice(0, 13), {
    yearDay: t('education.tools.planner.yearDay'),
    leapDay: t('education.tools.planner.leapDay'),
  });
  downloadBlob(new Blob([contents], { type: 'text/calendar;charset=utf-8' }), `ifc-${year.value}.ics`);
  statusMessage.value = t('education.tools.planner.exported');
}

function clearPrintMode() {
  document.body.classList.remove('printing-annual-planner');
  window.clearTimeout(printCleanupTimer);
}

function printPlanner() {
  document.body.classList.add('printing-annual-planner');
  window.addEventListener('afterprint', clearPrintMode, { once: true });
  printCleanupTimer = window.setTimeout(clearPrintMode, 30_000);
  window.print();
}

onBeforeUnmount(clearPrintMode);
</script>

<style scoped>
.annual-planner {
  max-width: 980px;
  margin: 0 auto;
  overflow: hidden;
  border-color: var(--app-border);
  border-radius: 24px;
  box-shadow: var(--app-card-shadow);
}

.annual-planner__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 26px;
}

.annual-planner__toolbar .q-field {
  width: 210px;
}

.annual-planner__toolbar > div {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.annual-planner__table-wrap {
  overflow-x: auto;
}

.annual-planner table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
}

.annual-planner th,
.annual-planner td {
  padding: 14px 24px;
  border-bottom: 1px solid var(--app-border);
  text-align: start;
}

.annual-planner thead th {
  color: var(--app-text-faint);
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.annual-planner tbody th {
  color: var(--app-text);
  font-size: 14px;
}

.annual-planner tbody th span {
  width: 25px;
  height: 25px;
  display: inline-grid;
  place-items: center;
  margin-inline-end: 8px;
  color: var(--app-primary-text);
  background: var(--app-primary-soft);
  border-radius: 8px;
  font-size: 11px;
}

.annual-planner tbody td {
  color: var(--app-text-muted);
  font-size: 13px;
}

.annual-planner tbody tr:last-child > * {
  border-bottom: 0;
}

.annual-planner__special-days {
  display: grid;
  grid-template-columns: minmax(150px, 1fr) repeat(2, minmax(160px, 1fr));
  gap: 14px;
  align-items: center;
  padding: 22px 26px;
  background: var(--app-primary-soft);
}

.annual-planner__special-days > div {
  display: grid;
  gap: 3px;
}

.annual-planner__special-days span {
  color: var(--app-primary-text);
  font-weight: 700;
}

.annual-planner__special-days time {
  color: var(--app-text-muted);
  font-size: 12px;
}

.annual-planner__status {
  margin: 0;
  padding: 0 26px 20px;
  color: #059669;
  font-size: 13px;
  text-align: center;
}

@media (max-width: 680px) {
  .annual-planner__toolbar,
  .annual-planner__special-days {
    grid-template-columns: 1fr;
  }

  .annual-planner__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .annual-planner__toolbar .q-field {
    width: auto;
  }

  .annual-planner__toolbar > div > * {
    flex: 1 1 180px;
  }

  .annual-planner__special-days {
    display: grid;
  }
}
</style>
