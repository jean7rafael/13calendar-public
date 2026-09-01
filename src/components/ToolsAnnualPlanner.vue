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
        <div class="app-action-group">
          <q-btn
            no-caps
            unelevated
            icon="event_available"
            class="app-action app-action--primary"
            :label="t('education.tools.planner.exportIcs')"
            @click="openIcsDialog"
          />
          <q-btn
            no-caps
            unelevated
            class="app-action app-action--secondary"
            icon="picture_as_pdf"
            :label="t('education.tools.planner.printPdf')"
            @click="openPdfDialog"
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

    <!-- O diálogo ICS separa marcos, favoritos locais e calendário diário. -->
    <q-dialog v-model="icsDialogOpen">
      <q-card class="annual-planner-ics-dialog">
        <q-card-section class="annual-planner-ics-dialog__heading">
          <div>
            <q-icon name="event_available" aria-hidden="true" />
          </div>
          <section>
            <h3>{{ t('education.tools.planner.ics.title') }}</h3>
          </section>
        </q-card-section>

        <q-list class="annual-planner-ics-dialog__options">
          <q-item
            v-for="option in icsOptions"
            :key="option.value"
            tag="label"
            clickable
            :disable="option.disabled"
            :class="{ 'is-selected': icsMode === option.value }"
          >
            <q-item-section avatar>
              <q-radio v-model="icsMode" :val="option.value" :disable="option.disabled" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ option.title }}</q-item-label>
              <q-item-label v-if="option.text" caption>{{ option.text }}</q-item-label>
              <q-item-label v-if="option.warning" class="annual-planner-ics-dialog__warning">
                {{ option.warning }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon :name="option.icon" aria-hidden="true" />
            </q-item-section>
          </q-item>
        </q-list>

        <q-card-section v-if="!savedFavorites.length" class="annual-planner-ics-dialog__empty">
          <span>{{ t('education.tools.favorites.empty') }}</span>
        </q-card-section>

        <q-card-actions align="center" class="annual-planner-ics-dialog__actions app-action-group">
          <q-btn
            v-if="!savedFavorites.length"
            v-close-popup
            no-caps
            icon-right="arrow_forward"
            class="app-action app-action--tertiary"
            :label="t('education.tools.favorites.add')"
            href="#favorites"
          />
          <q-btn
            v-close-popup
            no-caps
            class="app-action app-action--secondary"
            :label="t('holidaySettings.cancel')"
          />
          <q-btn
            no-caps
            unelevated
            icon="download"
            class="app-action app-action--primary"
            :label="t('education.tools.planner.exportIcs')"
            @click="exportIcs"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- O diálogo PDF escolhe o ano sem recorrer à paginação do navegador. -->
    <q-dialog v-model="pdfDialogOpen" persistent>
      <q-card class="annual-planner-ics-dialog annual-planner-pdf-dialog">
        <q-card-section class="annual-planner-ics-dialog__heading">
          <div>
            <q-icon name="picture_as_pdf" aria-hidden="true" />
          </div>
          <section>
            <h3>{{ t('education.tools.planner.pdf.title') }}</h3>
            <p>{{ t('education.tools.planner.pdf.description') }}</p>
          </section>
        </q-card-section>

        <q-card-section class="annual-planner-pdf-dialog__content">
          <AppYearInput
            v-model="pdfYear"
            :min="1"
            :max="9999"
            :label="t('education.tools.planner.year')"
          />

          <q-item class="annual-planner-pdf-dialog__model">
            <q-item-section avatar>
              <q-icon :name="pdfModelIcon" aria-hidden="true" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ pdfModelLabel }}</q-item-label>
              <q-item-label caption>
                {{
                  t('education.tools.planner.pdf.pageCount', {
                    count: ANNUAL_PLANNER_PAGE_COUNT,
                  })
                }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-linear-progress
            v-if="pdfGenerating"
            rounded
            size="8px"
            :value="pdfProgress / ANNUAL_PLANNER_PAGE_COUNT"
            color="deep-purple-4"
            track-color="grey-7"
          />
          <p v-if="pdfGenerating" class="annual-planner-pdf-dialog__progress" role="status">
            {{
              t('education.tools.planner.pdf.progress', {
                current: pdfProgress,
                total: ANNUAL_PLANNER_PAGE_COUNT,
              })
            }}
          </p>
          <p v-else-if="pdfError" class="annual-planner-pdf-dialog__error" role="alert">
            {{ pdfError }}
          </p>
        </q-card-section>

        <q-card-actions align="center" class="annual-planner-pdf-dialog__actions app-action-group">
          <q-btn
            no-caps
            class="app-action app-action--secondary"
            :disable="pdfGenerating"
            :label="t('holidaySettings.cancel')"
            @click="pdfDialogOpen = false"
          />
          <q-btn
            no-caps
            unelevated
            icon="download"
            class="app-action app-action--primary"
            :loading="pdfGenerating"
            :label="t('education.tools.planner.pdf.download')"
            @click="downloadPlannerPdf"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- O modelo A4 só entra no layout durante a captura das quarenta folhas. -->
    <ToolsAnnualPlannerPrint
      ref="plannerPdfRef"
      :year="Number(pdfYear)"
      :exporting="pdfGenerating"
    />
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import AppYearInput from 'src/components/AppYearInput.vue';
import ToolsAnnualPlannerPrint from 'src/components/ToolsAnnualPlannerPrint.vue';
import {
  buildInternationalFixedYear,
  createAnnualPlannerIcs,
  createDailyInternationalFixedIcs,
  createFavoriteDatesIcs,
  downloadBlob,
  formatGregorianComparison,
  formatGregorianParts,
  gregorianPartsToIso,
} from 'src/utils/calendarTools';
import { ANNUAL_PLANNER_PAGE_COUNT, createAnnualPlannerPdf } from 'src/utils/plannerPdf';

const { t, locale } = useI18n({ useScope: 'global' });
const { months13Long, weekDaysComparison } = useCalendarTranslations();
const year = ref(new Date().getFullYear());
const statusMessage = ref('');
const icsDialogOpen = ref(false);
const icsMode = ref('milestones');
const savedFavorites = ref([]);
const pdfDialogOpen = ref(false);
const pdfYear = ref(year.value);
const pdfGenerating = ref(false);
const pdfProgress = ref(0);
const pdfError = ref('');
const plannerPdfRef = ref(null);

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

/* O mesmo modelo visual atende todos os anos; esta condição altera somente
   o estado e o texto da página reservada ao Dia Bissexto. */
const pdfUsesLeapModel = computed(() =>
  buildInternationalFixedYear(Number(pdfYear.value)).specialDays.some(
    (specialDay) => specialDay.kind === 'leap-day',
  ),
);
const pdfModelIcon = computed(() => (pdfUsesLeapModel.value ? 'event_repeat' : 'event_note'));
const pdfModelLabel = computed(() =>
  t(
    pdfUsesLeapModel.value
      ? 'education.tools.planner.pdf.leapModel'
      : 'education.tools.planner.pdf.commonModel',
  ),
);

const calendarLabels = computed(() => ({
  months: months13Long.value,
  weekdays: weekDaysComparison.value,
  yearDay: t('education.tools.planner.yearDay'),
  leapDay: t('education.tools.planner.leapDay'),
  specialDays: t('education.tools.planner.specialDays'),
  position: (month, week) => t('education.converter.position', { month, week }),
  gregorianDate: t('education.converter.gregorianDate'),
  fixedDate: t('education.converter.fixedDate'),
  calendarName: `${t('education.hero.fixed')} ${year.value}`,
}));

/* As três modalidades de ICS compartilham o diálogo, mas produzem arquivos
   com finalidades e volumes diferentes. */
const icsOptions = computed(() => [
  {
    value: 'milestones',
    icon: 'flag',
    title: t('education.tools.planner.ics.milestonesTitle'),
    text: t('education.tools.planner.ics.milestonesText'),
  },
  {
    value: 'favorites',
    icon: 'bookmark',
    title: t('education.tools.favorites.eyebrow'),
    text: t('education.tools.favorites.description'),
    disabled: !savedFavorites.value.length,
  },
  {
    value: 'daily',
    icon: 'date_range',
    title: t('education.tools.planner.ics.dailyTitle'),
    warning: t('education.tools.planner.ics.dailyWarning'),
  },
]);

function loadSavedFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem('13calendar-local-favorites') || '[]');
    savedFavorites.value = Array.isArray(saved)
      ? saved.filter(
          (favorite) =>
            favorite && typeof favorite.date === 'string' && typeof favorite.label === 'string',
        )
      : [];
  } catch {
    savedFavorites.value = [];
  }
}

function openIcsDialog() {
  statusMessage.value = '';
  loadSavedFavorites();
  if (icsMode.value === 'favorites' && !savedFavorites.value.length) {
    icsMode.value = 'milestones';
  }
  icsDialogOpen.value = true;
}

function exportIcs() {
  let contents;
  let filename;

  if (icsMode.value === 'favorites') {
    contents = createFavoriteDatesIcs(
      savedFavorites.value,
      {
        ...calendarLabels.value,
        calendarName: t('education.tools.favorites.eyebrow'),
      },
      locale.value,
    );
    filename = '13-calendar-minhas-datas.ics';
  } else if (icsMode.value === 'daily') {
    contents = createDailyInternationalFixedIcs(
      Number(year.value),
      calendarLabels.value,
      locale.value,
    );
    filename = `ifc-diario-${year.value}.ics`;
  } else {
    contents = createAnnualPlannerIcs(
      Number(year.value),
      months13Long.value.slice(0, 13),
      {
        yearDay: t('education.tools.planner.yearDay'),
        leapDay: t('education.tools.planner.leapDay'),
      },
      calendarLabels.value.calendarName,
    );
    filename = `ifc-marcos-${year.value}.ics`;
  }

  downloadBlob(new Blob([contents], { type: 'text/calendar;charset=utf-8' }), filename);
  icsDialogOpen.value = false;
  statusMessage.value = t('education.tools.planner.exported');
}

function openPdfDialog() {
  pdfYear.value = Number(year.value);
  pdfProgress.value = 0;
  pdfError.value = '';
  statusMessage.value = '';
  pdfDialogOpen.value = true;
}

/* Fontes e duas pinturas precisam estar concluídas antes da captura; isso
   impede que uma tradução ainda em acomodação seja gravada cortada no PDF. */
async function waitForPlannerLayout() {
  await nextTick();
  await document.fonts?.ready;
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

/* Cada clique gera o arquivo inteiramente no navegador e sincroniza o ano da
   tabela somente depois que as quarenta páginas foram concluídas. */
async function downloadPlannerPdf() {
  if (pdfGenerating.value) return;

  pdfGenerating.value = true;
  pdfProgress.value = 0;
  pdfError.value = '';
  statusMessage.value = '';

  try {
    await waitForPlannerLayout();
    const pageElements = plannerPdfRef.value?.getPageElements() || [];
    const blob = await createAnnualPlannerPdf(pageElements, {
      year: Number(pdfYear.value),
      locale: locale.value,
      onProgress: (completed) => {
        pdfProgress.value = completed;
      },
    });

    downloadBlob(blob, `13-calendar-planner-${pdfYear.value}.pdf`);
    year.value = Number(pdfYear.value);
    pdfDialogOpen.value = false;
    statusMessage.value = t('education.tools.planner.pdf.downloaded', {
      count: ANNUAL_PLANNER_PAGE_COUNT,
    });
  } catch (error) {
    console.error('Falha ao gerar o PDF do planejador.', error);
    pdfError.value = t('education.tools.planner.pdf.failed');
  } finally {
    pdfGenerating.value = false;
  }
}

/* Os parâmetros existem para links diretos e testes, mas abrem o mesmo fluxo
   visual usado por uma pessoa ao clicar no botão. */
onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search);
  const requestedYear = Number(searchParams.get('planner-year'));
  if (Number.isInteger(requestedYear) && requestedYear >= 1 && requestedYear <= 9999) {
    year.value = requestedYear;
    pdfYear.value = requestedYear;
  }

  if (searchParams.get('planner-pdf') === '1') {
    openPdfDialog();
  }
});
</script>

<style scoped>
/* Superfície e tabela interativa exibidas normalmente na página Ferramentas. */
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
  --app-action-group-max: 480px;
  --app-action-min-width: 220px;
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

/* Os diálogos ICS e PDF compartilham a mesma identidade e o contrato global
   de alinhamento de botões, sem definir alturas locais. */
.annual-planner-ics-dialog {
  width: min(620px, calc(100vw - 28px));
  max-width: 620px;
  overflow: hidden;
  color: var(--app-text);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 24px;
}

.annual-planner-ics-dialog__heading {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 14px;
  padding: 24px;
}

.annual-planner-ics-dialog__heading > div {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  color: var(--app-primary-text);
  background: var(--app-primary-soft);
  border-radius: 14px;
  font-size: 24px;
}

.annual-planner-ics-dialog__heading h3,
.annual-planner-ics-dialog__heading p {
  margin: 0;
}

.annual-planner-ics-dialog__heading h3 {
  font-size: 20px;
  line-height: 1.25;
}

.annual-planner-ics-dialog__heading p {
  margin-top: 7px;
  color: var(--app-text-muted);
  font-size: 13px;
  line-height: 1.5;
}

.annual-planner-ics-dialog__options {
  display: grid;
  gap: 8px;
  padding: 0 16px;
}

.annual-planner-ics-dialog__options .q-item {
  min-height: 86px;
  border: 1px solid var(--app-border);
  border-radius: 16px;
}

.annual-planner-ics-dialog__options .q-item.is-selected {
  background: var(--app-primary-soft);
  border-color: var(--app-primary-border);
}

.annual-planner-ics-dialog__options .q-item__label:not(.q-item__label--caption) {
  font-weight: 750;
}

.annual-planner-ics-dialog__options .q-item__label--caption {
  margin-top: 4px;
  color: var(--app-text-muted);
  line-height: 1.4;
}

.annual-planner-ics-dialog__warning {
  margin-top: 5px;
  color: #d97706;
  font-size: 11px;
  line-height: 1.35;
}

.annual-planner-ics-dialog__empty {
  padding: 14px 24px 0;
  color: var(--app-text-muted);
  font-size: 12px;
  text-align: center;
}

.annual-planner-ics-dialog__empty .q-btn {
  color: var(--app-primary-text);
}

.annual-planner-ics-dialog__actions {
  --app-action-group-max: 520px;
  --app-action-min-width: 145px;

  margin-inline: auto;
  padding: 20px 24px 24px;
}

.annual-planner-pdf-dialog__content {
  display: grid;
  gap: 16px;
  padding: 0 24px;
}

.annual-planner-pdf-dialog__model {
  min-height: 78px;
  color: var(--app-text);
  background: var(--app-primary-soft);
  border: 1px solid var(--app-primary-border);
  border-radius: 16px;
}

.annual-planner-pdf-dialog__model .q-icon {
  color: var(--app-primary-text);
  font-size: 28px;
}

.annual-planner-pdf-dialog__model .q-item__label:first-child {
  font-weight: 750;
}

.annual-planner-pdf-dialog__progress,
.annual-planner-pdf-dialog__error {
  margin: -4px 0 0;
  font-size: 12px;
  text-align: center;
}

.annual-planner-pdf-dialog__progress {
  color: var(--app-text-muted);
}

.annual-planner-pdf-dialog__error {
  color: var(--q-negative);
}

.annual-planner-pdf-dialog__actions {
  --app-action-group-max: 520px;

  margin-inline: auto;
  padding: 20px 24px 24px;
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

  .annual-planner-ics-dialog__heading {
    grid-template-columns: 1fr;
  }

  .annual-planner-ics-dialog__actions {
    --app-action-min-width: 145px;
  }
}

@media (max-width: 520px) {
  .annual-planner-ics-dialog__actions {
    --app-action-min-width: 100%;
  }
}
</style>
