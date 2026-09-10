<template>
  <q-card class="q-pa-md custom-calendar app-no-double-tap" @dblclick.prevent>
    <div class="calendar-card-title">
      {{ $t('calendar.fixedCalendarTitle') }}
    </div>

    <div class="calendar-main-area">
      <!-- Calendário normal -->
      <template v-if="selectorMode === null">
        <div class="calendar-header-space"></div>

        <CarouselSeletores
          :currentMonth="currentMonth"
          :currentYear="currentYear"
          @previous-month="previousMonth"
          @next-month="nextMonth"
          @previous-year="previousYear"
          @next-year="nextYear"
          @open-month-selector="toggleMonthSelector"
          @open-year-selector="toggleYearSelector"
        />

        <div
          class="calendar-grid week-days"
          :class="{ 'week-days--special': currentMonth === 13 }"
        >
          <div
            v-for="day in weekDays"
            :key="day"
            class="calendar-day-header"
            :class="{ 'faded-text': currentMonth === 13 }"
          >
            {{ day }}
          </div>
        </div>

        <div class="calendar-carousel-wrapper">
          <CarouselCalendario
            :currentMonth="currentMonth"
            :currentYear="currentYear"
            :selectedDay="selectedDay"
            :selectedMonth="selectedMonth"
            :selectedYear="selectedYear"
            @select-date="updateSelectedDate"
          />
        </div>
      </template>

      <!-- Seleção de mês -->
      <div v-else-if="selectorMode === 'month'" class="calendar-selector-panel">
        <div class="selector-grid month-selector-grid">
          <q-btn
            v-for="(monthLabel, index) in monthLabelsShort"
            :key="monthLabel"
            :label="monthLabel"
            flat
            dense
            no-caps
            class="selector-option"
            :class="{ 'selector-option-active': currentMonth === index }"
            @click="selectMonthFromGrid(index)"
          />
        </div>
      </div>

      <!-- Seleção de ano -->
      <div v-else class="calendar-selector-panel year-selector-panel">
        <q-btn
          flat
          round
          dense
          size="md"
          icon="chevron_left"
          class="year-page-arrow year-page-arrow-left"
          :disable="yearPageStart <= minYear"
          @click="previousYearPage"
        />

        <div class="selector-grid year-selector-grid">
          <q-btn
            v-for="year in visibleYears"
            :key="year"
            :label="year"
            flat
            dense
            no-caps
            class="selector-option"
            :class="{ 'selector-option-active': currentYear === year }"
            @click="selectYearFromGrid(year)"
          />
        </div>

        <q-btn
          flat
          round
          dense
          size="md"
          icon="chevron_right"
          class="year-page-arrow year-page-arrow-right"
          @click="nextYearPage"
        />
      </div>
    </div>

    <!-- Bloco 5: Resumo da data e da duração do mês -->
    <div class="calendar-selected-summary text-center">
      <div class="selected-date">
        {{ $t('calendar.selectedDate') }}: {{ formattedDate }}
      </div>

      <div v-if="currentMonth < 13" class="calendar-month-length">
        <i18n-t keypath="calendar.daysEveryMonth" tag="span">
          <template #count>
            <span class="calendar-month-length__number">28</span>
          </template>
        </i18n-t>
      </div>
    </div>

    <CalendarTodayButton />
  </q-card>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import CarouselCalendario from 'src/components/CarouselCalendario.vue';
import CarouselSeletores from 'src/components/Carousel13Seletores.vue';
import CalendarTodayButton from 'src/components/CalendarTodayButton.vue';

/* O QDate agrupa o seletor em blocos fixos de 20 anos e
   mostra também o primeiro ano do bloco seguinte. */
const YEAR_PAGE_INTERVAL = 20;
const YEARS_PER_PAGE = YEAR_PAGE_INTERVAL + 1;

function getYearPageStart(year, minYear = 1) {
  const numericYear = Number(year);
  const alignedStart = numericYear - (numericYear % YEAR_PAGE_INTERVAL);

  return Math.max(minYear, alignedStart);
}

function parseSelectedDate(modelValue) {
  const [year, month, day] = String(modelValue || '')
    .split('-')
    .map(Number);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  return {
    year,
    month: month - 1,
    day,
  };
}

/* ===========================================================
   CALENDÁRIO DE 13 MESES
=========================================================== */

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue', 'update:mes13', 'update:ano13']);
const { t } = useI18n({ useScope: 'global' });

const parsedInitialDate = parseSelectedDate(props.modelValue);
const initialYear = parsedInitialDate?.year || new Date().getFullYear();
const initialMonth = parsedInitialDate?.month || 0;

const currentYear = ref(initialYear);
const currentMonth = ref(initialMonth);
const selectedDay = ref(parsedInitialDate?.day ?? null);
const selectedMonth = ref(initialMonth);
const selectedYear = ref(initialYear);
const selectorMode = ref(null);
const minYear = 1;
const yearPageStart = ref(getYearPageStart(initialYear));
let syncingModelValue = true;

const monthLabelsShort = computed(() =>
  Array.from({ length: 14 }, (_, index) => t(`calendar.months13Short.${index}`)),
);

const weekDays = computed(() =>
  Array.from({ length: 7 }, (_, index) => t(`calendar.weekDaysShort.${index}`)),
);

const formattedDate = computed(() => {
  if (selectedDay.value === null) {
    return t('calendar.noDate');
  }

  const monthFormatted =
    selectedMonth.value === 13 ? 'XX' : String(selectedMonth.value + 1).padStart(2, '0');
  return `${selectedYear.value}/${monthFormatted}/${String(selectedDay.value).padStart(2, '0')}`;
});

const visibleYears = computed(() =>
  Array.from({ length: YEARS_PER_PAGE }, (_, index) => yearPageStart.value + index),
);

function syncModelValue(modelValue) {
  const selectedDate = parseSelectedDate(modelValue);

  if (!selectedDate) {
    return;
  }

  syncingModelValue = true;
  selectedYear.value = selectedDate.year;
  currentYear.value = selectedDate.year;
  selectedMonth.value = selectedDate.month;
  currentMonth.value = selectedDate.month;
  selectedDay.value = selectedDate.day;

  nextTick(() => {
    syncingModelValue = false;
  });
}

function emitirData() {
  if (selectedDay.value === null) {
    return;
  }

  const month = String(selectedMonth.value + 1).padStart(2, '0');
  const day = String(selectedDay.value).padStart(2, '0');
  emit('update:modelValue', `${selectedYear.value}-${month}-${day}`);
}

watch(
  () => props.modelValue,
  syncModelValue,
  { immediate: true },
);

watch([selectedDay, selectedMonth, selectedYear], () => {
  if (!syncingModelValue) {
    emitirData();
  }
});

nextTick(() => {
  syncingModelValue = false;
});

function toggleMonthSelector() {
  selectorMode.value = selectorMode.value === 'month' ? null : 'month';
}

function toggleYearSelector() {
  const shouldOpen = selectorMode.value !== 'year';
  selectorMode.value = shouldOpen ? 'year' : null;

  if (shouldOpen) {
    alignYearPage(currentYear.value);
  }
}

function alignYearPage(year) {
  yearPageStart.value = getYearPageStart(year, minYear);
}

function previousYearPage() {
  yearPageStart.value = Math.max(minYear, yearPageStart.value - YEAR_PAGE_INTERVAL);
}

function nextYearPage() {
  yearPageStart.value += YEAR_PAGE_INTERVAL;
}

function selectMonthFromGrid(monthIndex) {
  currentMonth.value = monthIndex;
  emit('update:mes13', monthIndex + 1);
  selectorMode.value = null;
}

function selectYearFromGrid(year) {
  currentYear.value = year;
  emit('update:ano13', year);
  selectorMode.value = null;
}

function updateSelectedDate({ day, month, year }) {
  selectedDay.value = day;
  selectedMonth.value = month;
  selectedYear.value = year;
  currentMonth.value = month;
  currentYear.value = year;
}

function nextYear() {
  currentYear.value += 1;
  emit('update:ano13', currentYear.value);
}

function previousYear() {
  currentYear.value -= 1;
  emit('update:ano13', currentYear.value);
}

function nextMonth() {
  if (currentMonth.value === 13) {
    currentMonth.value = 0;
    emit('update:mes13', 1);
    nextYear();
  } else {
    currentMonth.value += 1;
    emit('update:mes13', currentMonth.value + 1);
  }
}

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 13;
    emit('update:mes13', 14);
    previousYear();
  } else {
    currentMonth.value -= 1;
    emit('update:mes13', currentMonth.value + 1);
  }
}
</script>

<style>
/* ===========================================================
  ESTILOS GERAIS DO CALENDÁRIO
=========================================================== */
.custom-calendar {
  position: relative;
  width: 100%;
  min-width: var(--calendar-card-min-width, 320px);
  max-width: var(--calendar-card-max-width, 520px);
  height: var(--calendar-main-card-height, 430px);
  box-sizing: border-box;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  padding-right: 16px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  font-family: inherit;
  color: var(--app-text);
}

.calendar-card-title {
  flex: 0 0 auto;
  margin-bottom: 8px;
  color: var(--calendar-fixed-title);
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: 600;
  line-height: var(--calendar-date-line-height);
  letter-spacing: 0.1em;
  text-align: center;
  text-transform: uppercase;
}

.calendar-main-area {
  width: 100%;
  height: 330px;
  flex: 0 0 330px;
  overflow: hidden;
}

/* ===========================================================
  BLOCO 1 - Header Espaço em Branco
=========================================================== */
.calendar-header-space {
  height: 13.3125px;
  margin-top: 0;
}

/* ===========================================================
  BLOCO 2 - Seletores de Mês e Ano
=========================================================== */
.calendar-seletores-wrapper {
  overflow: hidden;
  height: 40px; /* mesma altura definida no q-carousel do CarouselSeletores.vue */
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: -10px;
}

/* O recuo horizontal e a largura mínima do conjunto do ano
   reproduzem a distribuição utilizada internamente pelo QDate. */
.custom-calendar > .calendar-main-area > .calendar-header {
  box-sizing: border-box;
  width: min(100%, var(--calendar-grid-width, 336px));
  margin-right: auto;
  margin-left: auto;
  padding-right: 0;
  padding-left: 0;
}

/* ===========================================================
  BLOCO 3 - Dias da Semana
=========================================================== */
.calendar-grid.week-days {
  width: min(100%, var(--calendar-grid-width, 336px));
  height: 30px;
  margin: 3.3125px auto 0;
  font-family: var(--calendar-date-font-family);
  font-weight: var(--calendar-weekday-font-weight);
  font-size: var(--calendar-weekday-font-size);
  line-height: var(--calendar-weekday-line-height);
  text-align: center;
  color: var(--app-text-faint);
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--calendar-cell-gap, 5px);
  justify-items: center;
}

/* Dias Especiais não exibem cabeçalhos semanais. A linha
   transparente devolve espaço ao resumo para compensar as
   métricas de fonte maiores utilizadas pelo Safari. */
.calendar-grid.week-days.week-days--special {
  height: 16px;
  margin-top: 0;
}
.calendar-day-header {
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  padding: 0px;
}
.faded-text {
  color: transparent; /* Remove a cor do texto */
  pointer-events: none; /* Evita interação */
}

/* ===========================================================
  BLOCO 4 - Dias (Carrossel externo)
=========================================================== */
.calendar-carousel-wrapper {
  overflow: hidden; /* impede o conteúdo de ultrapassar as bordas */
  height: 260px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-top: 0;
}

/* ===========================================================
  BLOCO 5 - RESUMO INFERIOR
=========================================================== */
.calendar-selected-summary {
  height: 70px;
  display: flex;
  flex: 0 0 70px;
  flex-direction: column;
  margin-top: auto;
}

.selected-date {
  flex: 0 0 auto;
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: var(--calendar-date-font-weight);
  line-height: var(--calendar-date-line-height);
  color: var(--app-text);
}

.calendar-month-length {
  min-height: 0;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  color: var(--calendar-fixed-summary);
  font-family: var(--calendar-date-font-family);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.calendar-month-length__number {
  color: var(--calendar-fixed-summary-number);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* ===========================================================
  PAINÉIS DE SELEÇÃO DE MÊS E ANO
=========================================================== */
.calendar-selector-panel {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.selector-grid {
  width: 100%;
  display: grid;
  gap: 4px;
}

.month-selector-grid {
  height: 100%;
  box-sizing: border-box;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 0;
  padding: 25px 0 5px;
  align-items: center;
}

.month-selector-grid .selector-option {
  width: 60px;
  min-width: 60px;
  min-height: 36px;
  padding: 0 !important;
  justify-self: center;
}

.year-selector-panel {
  position: relative;
}

.year-selector-grid {
  width: calc(100% - 72px);
  grid-template-columns: repeat(3, 1fr);
  gap: 4px;
  transform: translateY(10px);
}

.year-selector-grid .selector-option {
  width: 40px;
  min-width: 40px;
  min-height: 32px;
  padding: 0 !important;
  justify-self: center;
}

.year-page-arrow {
  position: absolute;
  top: calc(50% + 10px);
  transform: translateY(-50%);
  z-index: 2;
}

.year-page-arrow-left {
  left: 0;
}

.year-page-arrow-right {
  right: 0;
}

.selector-option {
  min-height: 34px;
  font-size: 14px;
  font-weight: 400;
  color: var(--app-text);
  border-radius: 8px;
}

.selector-option-active {
  background: var(--q-primary) !important;
  color: white !important;
}

.selector-option-active:hover {
  background: var(--q-primary) !important;
}
</style>
