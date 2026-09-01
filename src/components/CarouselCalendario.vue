<template>
  <div class="calendar-carousel-content app-no-double-tap" @dblclick.prevent>
    <!-- Carrossel para anos -->
    <q-carousel
      class="calendar-year-carousel"
      v-model="carouselYear"
      :transition-prev="yearTransition === 'slide-right' ? 'slide-right' : 'slide-left'"
      :transition-next="yearTransition === 'slide-left' ? 'slide-left' : 'slide-right'"
      swipeable
      animated
      infinite
      height="260px"
      control-color="primary"
    >
      <q-carousel-slide
        v-for="year in yearsRange"
        :key="year"
        :name="year"
        class="column calendar-carousel-slide"
      >
        <!-- Carrossel interno para meses -->
        <q-carousel
          class="calendar-month-carousel"
          v-model="carouselMonth"
          :transition-prev="monthTransition === 'slide-right' ? 'slide-right' : 'slide-left'"
          :transition-next="monthTransition === 'slide-left' ? 'slide-left' : 'slide-right'"
          swipeable
          animated
          infinite
          control-color="secondary"
          height="215px"
        >
          <q-carousel-slide
            class="calendar-carousel-slide"
            v-for="monthNumber in monthCount"
            :key="monthNumber"
            :name="monthNumber - 1"
          >
            <!-- Os dois dias intercalares recebem o mesmo resumo
                 explicativo utilizado pelo site de referência. -->
            <section v-if="monthNumber === 14" class="special-days-panel">
              <h3 class="special-days-title">
                {{ $t('calendar.specialDays.title') }}
              </h3>

              <button
                type="button"
                class="special-day-card special-day-card--year"
                :class="{ 'special-day-card--selected': isSelected(1, 13, year) }"
                @click="$emit('select-date', { day: 1, month: 13, year })"
              >
                <strong>{{ $t('calendar.specialDays.yearDay') }}</strong>
                <span class="special-day-timing">
                  {{ $t('calendar.specialDays.yearDayTiming') }}
                </span>
                <span class="special-day-description">
                  {{ $t('calendar.specialDays.yearDayDescription') }}
                </span>

                <span
                  v-if="moonPhaseFor(1, 13, year)"
                  class="special-day-moon"
                  aria-hidden="true"
                >
                  <span class="moon-emoji-glyph">
                    {{ getMoonPhaseEmoji(moonPhaseFor(1, 13, year).fase) }}
                  </span>
                </span>

                <q-tooltip v-if="moonPhaseFor(1, 13, year)">
                  {{ translateMoonPhase(moonPhaseFor(1, 13, year).fase) }}
                </q-tooltip>
              </button>

              <button
                type="button"
                class="special-day-card special-day-card--leap"
                :class="{
                  'special-day-card--inactive': !isLeapYear(year),
                  'special-day-card--selected': isSelected(2, 13, year),
                }"
                :disabled="!isLeapYear(year)"
                @click="$emit('select-date', { day: 2, month: 13, year })"
              >
                <strong>{{ $t('calendar.specialDays.leapDay') }}</strong>
                <span class="special-day-timing">
                  {{
                    isLeapYear(year)
                      ? $t('calendar.specialDays.leapYearTiming', { year })
                      : $t('calendar.specialDays.commonYearTiming', { year })
                  }}
                </span>
                <span class="special-day-description">
                  {{ $t('calendar.specialDays.leapDayDescription') }}
                </span>

                <span
                  v-if="moonPhaseFor(2, 13, year)"
                  class="special-day-moon"
                  aria-hidden="true"
                >
                  <span class="moon-emoji-glyph">
                    {{ getMoonPhaseEmoji(moonPhaseFor(2, 13, year).fase) }}
                  </span>
                </span>

                <q-tooltip v-if="moonPhaseFor(2, 13, year)">
                  {{ translateMoonPhase(moonPhaseFor(2, 13, year).fase) }}
                </q-tooltip>
              </button>

              <dl class="special-days-summary">
                <div>
                  <dt>{{ $t('calendar.specialDays.regularDays') }}</dt>
                  <dd>364</dd>
                </div>
                <div>
                  <dt>{{ $t('calendar.specialDays.yearDay') }}</dt>
                  <dd class="special-days-summary__year">+1</dd>
                </div>
                <div v-if="isLeapYear(year)">
                  <dt>{{ $t('calendar.specialDays.leapDay') }}</dt>
                  <dd class="special-days-summary__leap">+1</dd>
                </div>
                <div class="special-days-summary__total">
                  <dt>{{ $t('calendar.specialDays.total') }}</dt>
                  <dd>
                    {{
                      $t('calendar.specialDays.totalDays', {
                        count: isLeapYear(year) ? 366 : 365,
                      })
                    }}
                  </dd>
                </div>
              </dl>
            </section>

            <div v-else class="calendar-grid days-grid">
              <div
                v-for="n in monthNumber - 1 !== 13 ? firstDayOffset(monthNumber - 1) : 0"
                :key="'empty-' + n"
                class="calendar-empty"
              ></div>
              <q-btn
                v-for="day in getDaysInMonth(monthNumber - 1, year)"
                :key="day"
                class="calendar-day"
                :class="[
                  isWeekendDay(day) ? 'calendar-day--weekend' : 'calendar-day--weekday',
                  { selected: isSelected(day, monthNumber - 1, year) },
                ]"
                @click="$emit('select-date', { day, month: monthNumber - 1, year })"
                flat
                dense
                size="md"
              >
                <span class="calendar-day-number">{{ day }}</span>

                <span
                  v-if="moonPhaseFor(day, monthNumber - 1, year)"
                  class="calendar-moon-emoji"
                  aria-hidden="true"
                >
                  <span class="moon-emoji-glyph">
                    {{ getMoonPhaseEmoji(moonPhaseFor(day, monthNumber - 1, year).fase) }}
                  </span>
                </span>

                <q-tooltip v-if="moonPhaseFor(day, monthNumber - 1, year)">
                  {{ translateMoonPhase(moonPhaseFor(day, monthNumber - 1, year).fase) }}
                </q-tooltip>
              </q-btn>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup>
import { ref, toRef, watch } from 'vue';
import { useCarouselTransition } from 'src/utils/carouselMecanism';
import { useYearWindow } from 'src/composables/useYearWindow';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import { obterFasesLuaDoAno } from 'src/utils/fasesLua';
import { converterPara13Meses } from 'src/utils/conversorDatas';
import {
  createMoonPhaseDateMap,
  getMoonPhaseEmoji,
} from 'src/utils/moonPhaseMarkers';

/* ===========================================================
   ESTADO RECEBIDO DO CALENDÁRIO DE 13 MESES
=========================================================== */

const props = defineProps({
  currentMonth: Number,
  currentYear: Number,
  selectedDay: Number,
  selectedMonth: Number,
  selectedYear: Number,
});

/* ===========================================================
   TRANSIÇÕES E JANELA DINÂMICA DE ANOS
=========================================================== */

const { transition: monthTransition, internalValue: carouselMonth } = useCarouselTransition(
  toRef(props, 'currentMonth'),
);
const { transition: yearTransition, internalValue: carouselYear } = useCarouselTransition(
  toRef(props, 'currentYear'),
);
const { yearsRange } = useYearWindow(carouselYear);

const monthCount = 14;

/* ===========================================================
   FASES LUNARES INDICADAS NO CALENDÁRIO
=========================================================== */

const { translateMoonPhase } = useCalendarTranslations();
const moonPhasesByDate = ref(new Map());
let moonPhaseRequest = 0;

watch(
  () => props.currentYear,
  async (year) => {
    const request = ++moonPhaseRequest;

    try {
      const phases = await obterFasesLuaDoAno(year);

      if (request === moonPhaseRequest) {
        moonPhasesByDate.value = createMoonPhaseDateMap(phases, converterPara13Meses);
      }
    } catch (error) {
      console.error('Erro ao carregar os indicadores das fases da Lua:', error);

      if (request === moonPhaseRequest) {
        moonPhasesByDate.value = new Map();
      }
    }
  },
  { immediate: true },
);

function moonPhaseFor(day, month, year) {
  const date = [
    String(year).padStart(4, '0'),
    String(month + 1).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('/');

  return moonPhasesByDate.value.get(date);
}

/* ===========================================================
   REGRAS DE QUANTIDADE E POSICIONAMENTO DOS DIAS
=========================================================== */

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getDaysInMonth(month, year) {
  return month === 13 ? (isLeapYear(year) ? 2 : 1) : 28;
}

function firstDayOffset(month) {
  return month === 13 ? 0 : (month * 28) % 7;
}

function isWeekendDay(day) {
  return day % 7 === 1 || day % 7 === 0;
}

function isSelected(day, month, year) {
  return props.selectedYear === year && props.selectedMonth === month && props.selectedDay === day;
}
</script>

<style scoped>
/* Os dois níveis do carrossel ocupam toda a largura disponível. */
.calendar-carousel-content,
.calendar-year-carousel,
.calendar-month-carousel {
  width: 100%;
}

/* A área interna usa toda a altura do invólucro para que o
   resumo dos Dias Especiais não seja cortado na parte inferior. */
.calendar-month-carousel {
  height: 260px !important;
}

/* Remove o espaçamento padrão que deslocaria a grade de dias. */
.calendar-carousel-slide {
  padding: 0 !important;
}

/* ===========================================================
   GRADE DE CÉLULAS QUADRADAS
=========================================================== */

.calendar-grid.days-grid {
  width: min(100%, var(--calendar-grid-width, 336px));
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--calendar-cell-gap, 5px);
  justify-items: stretch;
}

/* ===========================================================
   PAINEL DOS DIAS ESPECIAIS

   A composição compacta preserva os textos, as cores e a
   hierarquia da referência dentro da altura do calendário.
=========================================================== */

.special-days-panel {
  width: min(100%, var(--calendar-grid-width, 336px));
  height: 100%;
  max-height: 100%;
  margin: 0 auto;
  padding: 0 2px 4px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  color: var(--app-text);
  font-family: var(--calendar-date-font-family);
}

/* A barra permanece invisível quando o painel cabe por inteiro.
   Se o Safari ou o zoom exigirem mais altura, ela aparece somente
   durante a interação, sem cortar os textos e o total do ano. */
.special-days-panel {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.special-days-panel:hover {
  scrollbar-color: rgb(148 163 184 / 45%) transparent;
}

.special-days-panel::-webkit-scrollbar {
  width: 5px;
}

.special-days-panel::-webkit-scrollbar-track {
  background: transparent;
}

.special-days-panel::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}

.special-days-panel:hover::-webkit-scrollbar-thumb {
  background: rgb(148 163 184 / 45%);
}

.special-days-title {
  margin: 0 0 5px;
  color: #047857;
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
}

.special-day-card {
  position: relative;
  width: 100%;
  margin: 0 0 5px;
  padding: 6px 26px 6px 10px;
  display: grid;
  color: var(--app-text);
  background: rgb(16 185 129 / 5%);
  border: 1px solid rgb(16 185 129 / 20%);
  border-radius: 10px;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.special-day-card strong {
  color: #065f46;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
}

.special-day-timing {
  color: #059669;
  font-size: 9px;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.special-day-description {
  margin-top: 2px;
  color: var(--app-text-muted);
  font-size: 11px;
  font-weight: 400;
  line-height: 14px;
}

.special-day-moon {
  position: absolute;
  right: 8px;
  bottom: 7px;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--moon-emoji-ring-background);
  border: 0.5px solid var(--moon-emoji-ring);
  border-radius: 50%;
  pointer-events: none;
}

.special-day-card--leap {
  background: var(--app-accent-amber-soft);
  border-color: var(--app-accent-amber-border);
}

.special-day-card--leap strong,
.special-day-card--leap .special-day-timing {
  color: var(--app-accent-amber-text);
}

.special-day-card--inactive {
  background: transparent;
  border-color: var(--app-border);
  cursor: default;
}

.special-day-card--inactive strong,
.special-day-card--inactive .special-day-timing,
.special-day-card--inactive .special-day-description {
  color: var(--app-text-faint);
}

.special-day-card--selected {
  box-shadow: 0 0 0 1px var(--q-primary);
}

.special-days-summary {
  margin: 1px 0 0;
  padding: 5px 0 0;
  color: var(--app-text-muted);
  border-top: 1px solid var(--app-border);
  font-size: 10px;
  font-weight: 400;
  line-height: 13px;
}

.special-days-summary > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.special-days-summary dt,
.special-days-summary dd {
  margin: 0;
}

.special-days-summary dd {
  color: var(--app-text);
  font-variant-numeric: tabular-nums;
}

.special-days-summary .special-days-summary__year {
  color: var(--app-accent-green);
}

.special-days-summary .special-days-summary__leap {
  color: var(--app-accent-amber);
}

.special-days-summary__total {
  margin-top: 3px;
  padding-top: 3px;
  color: var(--app-text-muted);
  border-top: 1px solid var(--app-border);
  font-size: 11px;
}

.special-days-summary__total dd {
  font-weight: 500;
}

body.body--dark .special-days-title {
  color: #6ee7b7;
}

body.body--dark .special-day-card strong {
  color: #d1fae5;
}

body.body--dark .special-day-card--inactive strong,
body.body--dark .special-day-card--inactive .special-day-timing,
body.body--dark .special-day-card--inactive .special-day-description {
  color: var(--app-text-faint);
}

.calendar-day.q-btn:not(.app-action),
.calendar-empty {
  width: 100%;
  min-width: 0;
  height: auto;
  min-height: 0;
  aspect-ratio: 1 / 1;
  margin: 0;
  border-radius: var(--calendar-cell-radius, 9px);
}

.calendar-day.q-btn {
  position: relative;
  padding: 0;
  color: var(--app-text);
  background: var(--calendar-weekday-cell);
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: var(--calendar-date-font-weight);
  line-height: var(--calendar-date-line-height);
}

.calendar-day--weekend.q-btn {
  color: var(--calendar-weekend-text);
  background: var(--calendar-weekend-cell);
}

.calendar-day.q-btn:hover:not(.selected) {
  background: var(--calendar-cell-hover);
}

.calendar-day.q-btn.selected {
  color: white;
  background: var(--q-primary) !important;
  box-shadow:
    0 8px 18px rgb(79 70 229 / 24%),
    inset 0 0 0 2px var(--calendar-selection-border);
}

.calendar-day.q-btn.selected:hover {
  background: var(--q-primary) !important;
}

.calendar-day-number {
  font-variant-numeric: tabular-nums;
}

/* Emoji mínimo, alinhado ao canto inferior direito da célula. */
.calendar-moon-emoji {
  position: absolute;
  right: 4px;
  bottom: 4px;
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--moon-emoji-ring-background);
  border: 0.5px solid var(--moon-emoji-ring);
  border-radius: 50%;
  pointer-events: none;
}

/* O Safari pode desenhar Apple Color Emoji acima do tamanho de
   fonte solicitado. O glifo parte de uma caixa conhecida e é
   reduzido por transformação, mantendo-o dentro do contorno. */
.moon-emoji-glyph {
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
  display: block;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-size: 10px;
  line-height: 10px;
  text-align: center;
  filter: var(--moon-emoji-outline);
  transform: scale(0.5);
  transform-origin: center;
  -webkit-transform: scale(0.5);
  -webkit-transform-origin: center;
}

.special-day-moon .moon-emoji-glyph {
  transform: scale(0.7);
  -webkit-transform: scale(0.7);
}
</style>
