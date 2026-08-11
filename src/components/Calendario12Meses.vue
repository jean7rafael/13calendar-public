<template>
  <q-card class="q-pa-md calendar-card calendar-card--gregorian">
    <div class="calendar-card-title">
      {{ $t('calendar.gregorianTitle') }}
    </div>

    <div ref="calendarRootRef" class="calendar-date-wrapper">
      <q-date
        v-model="dataInterna"
        class="calendar-date"
        minimal
        today-btn
        :first-day-of-week="0"
        mask="YYYY/MM/DD"
        :events="hasMoonPhase"
        :event-color="moonPhaseEventClass"
        @update:modelValue="emitirData"
        @navigation="navegacaoCalendario"
      >
        <template v-slot:default>
          <div class="calendar-selected-summary q-mt-md text-center">
            <div class="calendar-selected-date">
              {{ $t('calendar.selectedDate') }}: {{ dataInterna }}
            </div>

            <div class="calendar-month-length">
              {{ $t('calendar.daysThisMonth', { count: displayedMonthDays }) }}
            </div>
          </div>
        </template>
      </q-date>

      <q-tooltip
        v-if="moonTooltipTarget"
        :model-value="moonTooltipVisible"
        :target="moonTooltipTarget"
        no-parent-event
      >
        {{ moonTooltipText }}
      </q-tooltip>
    </div>
  </q-card>
</template>

<script setup>
import { computed, nextTick, onMounted, onUpdated, ref, shallowRef, watch } from 'vue';
import { obterFasesLuaDoAno } from 'src/utils/fasesLua';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import {
  createMoonPhaseDateMap,
  getMoonPhaseEventClass,
} from 'src/utils/moonPhaseMarkers';

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue', 'update:mes12', 'update:ano12']);

/* ===========================================================
   DATA INTERNA UTILIZADA PELO Q-DATE
=========================================================== */

const dataInterna = ref(props.modelValue.replace(/-/g, '/'));
const displayedYear = ref(Number(dataInterna.value.slice(0, 4)));
const displayedMonth = ref(Number(dataInterna.value.slice(5, 7)));

/* Quantidade de dias do mês gregoriano atualmente visível. */
const displayedMonthDays = computed(() =>
  new Date(displayedYear.value, displayedMonth.value, 0).getDate(),
);

/* ===========================================================
   FASES LUNARES INDICADAS NO CALENDÁRIO
=========================================================== */

const moonPhasesByDate = ref(new Map());
let moonPhaseRequest = 0;
const calendarRootRef = ref(null);
const moonTooltipTarget = shallowRef(null);
const moonTooltipText = ref('');
const moonTooltipVisible = ref(false);
const { translateMoonPhase } = useCalendarTranslations();

async function loadMoonPhases(year) {
  const request = ++moonPhaseRequest;

  try {
    const phases = await obterFasesLuaDoAno(year);

    if (request === moonPhaseRequest) {
      moonPhasesByDate.value = createMoonPhaseDateMap(phases);
    }
  } catch (error) {
    console.error('Erro ao carregar os indicadores das fases da Lua:', error);

    if (request === moonPhaseRequest) {
      moonPhasesByDate.value = new Map();
    }
  }
}

function hasMoonPhase(date) {
  return moonPhasesByDate.value.has(date);
}

function moonPhaseEventClass(date) {
  return getMoonPhaseEventClass(moonPhasesByDate.value.get(date)?.fase);
}

/* O QDate não oferece slot individual para os dias. Um único
   tooltip é posicionado diretamente no botão que contém a fase. */
function showMoonPhaseTooltip(button) {
  const day = Number.parseInt(button.textContent, 10);
  const date = [
    String(displayedYear.value).padStart(4, '0'),
    String(displayedMonth.value).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('/');
  const phase = moonPhasesByDate.value.get(date)?.fase;

  if (!phase) {
    hideMoonPhaseTooltip();
    return;
  }

  moonTooltipVisible.value = false;
  moonTooltipTarget.value = button;
  moonTooltipText.value = translateMoonPhase(phase);

  nextTick(() => {
    if (moonTooltipTarget.value === button) {
      moonTooltipVisible.value = true;
    }
  });
}

function hideMoonPhaseTooltip() {
  moonTooltipVisible.value = false;
}

/* O QDate recria seus botões ao navegar. As ligações são
   refeitas depois de cada renderização relevante. */
async function bindMoonPhaseTooltips() {
  await nextTick();

  const calendarRoot = calendarRootRef.value;

  if (!calendarRoot) {
    return;
  }

  calendarRoot.dataset.moonTooltipsReady = 'true';

  calendarRoot.querySelectorAll('.q-date__calendar-item > button').forEach((button) => {
    if (button.querySelector('.q-date__event')) {
      const day = Number.parseInt(button.textContent, 10);
      const date = [
        String(displayedYear.value).padStart(4, '0'),
        String(displayedMonth.value).padStart(2, '0'),
        String(day).padStart(2, '0'),
      ].join('/');
      const phase = moonPhasesByDate.value.get(date)?.fase;

      /* O title funciona como fallback nativo de acessibilidade;
         o QTooltip continua sendo a apresentação visual principal. */
      button.title = phase ? translateMoonPhase(phase) : '';

      button.dataset.moonTooltipBound = 'true';
      button.onmouseenter = () => showMoonPhaseTooltip(button);
      button.onmouseleave = hideMoonPhaseTooltip;
    }
  });
}

/* ===========================================================
   SINCRONIZAÇÃO DE ALTERAÇÕES RECEBIDAS DO COMPONENTE PAI
=========================================================== */

watch(
  () => props.modelValue,
  (novaData) => {
    const novaDataFormatada = novaData.replace(/-/g, '/');

    if (novaDataFormatada !== dataInterna.value) {
      dataInterna.value = novaDataFormatada;
    }

    displayedYear.value = Number(novaDataFormatada.slice(0, 4));
    displayedMonth.value = Number(novaDataFormatada.slice(5, 7));
  },
);

watch(
  () => Number(dataInterna.value.slice(0, 4)),
  (year) => loadMoonPhases(year),
  { immediate: true },
);

watch([displayedYear, displayedMonth, moonPhasesByDate], bindMoonPhaseTooltips, {
  immediate: true,
  flush: 'post',
});

onMounted(bindMoonPhaseTooltips);
onUpdated(bindMoonPhaseTooltips);

/* ===========================================================
   EMISSÃO DA DATA SELECIONADA
=========================================================== */

function emitirData(valor) {
  emit('update:modelValue', valor.replace(/\//g, '-'));
  atualizarMesAno(valor);
}

/* ===========================================================
   ATUALIZAÇÃO DO MÊS E DO ANO EXIBIDOS NOS OUTROS CARDS
=========================================================== */

function atualizarMesAno(valor) {
  const [ano, mes] = valor.split('/');

  emit('update:mes12', parseInt(mes, 10));
  emit('update:ano12', parseInt(ano, 10));
}

function navegacaoCalendario({ year, month }) {
  displayedYear.value = year;
  displayedMonth.value = month;
  emit('update:mes12', month);
  emit('update:ano12', year);
  loadMoonPhases(year);
}
</script>

<style scoped>
.q-card {
  width: 100%;
  min-width: var(--calendar-card-min-width, 320px);
  max-width: var(--calendar-card-max-width, 520px);
  height: var(--calendar-main-card-height, 430px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.calendar-card-title {
  flex: 0 0 auto;
  margin-bottom: 8px;
  color: var(--app-text);
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: 600;
  line-height: var(--calendar-date-line-height);
  text-align: center;
}

.calendar-date-wrapper {
  width: 100%;
  min-height: 0;
  flex: 1 1 auto;
}

.q-date {
  width: 100%;
  height: 100%;
  max-width: none;
  color: var(--app-text);
  background: transparent;
  box-shadow: none;
}

/* ===========================================================
   CABEÇALHO E LARGURA ÚTIL DA GRADE
=========================================================== */

.calendar-date :deep(.q-date__view) {
  min-height: 0;
  padding: 10px 6px 0;
}

.calendar-date :deep(.q-date__navigation),
.calendar-date :deep(.q-date__calendar-weekdays),
.calendar-date :deep(.q-date__calendar-days) {
  width: min(100%, var(--calendar-grid-width, 336px)) !important;
  margin-right: auto;
  margin-left: auto;
}

.calendar-date :deep(.q-date__calendar-weekdays) {
  height: 30px;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--calendar-cell-gap, 5px);
}

.calendar-date :deep(.q-date__calendar-weekdays > div) {
  width: auto !important;
  height: auto !important;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--app-text-faint);
  opacity: 1;
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-weekday-font-size);
  font-weight: var(--calendar-weekday-font-weight);
  line-height: var(--calendar-weekday-line-height);
}

/* ===========================================================
   CÉLULAS QUADRADAS E SEPARADAS
=========================================================== */

.calendar-date :deep(.q-date__calendar-days-container) {
  height: auto;
  min-height: 0;
  /* Mantém a transição entre meses dentro da grade. Sem
     este recorte, o mês que sai fica visível na borda do card. */
  overflow: hidden;
}

/* ===========================================================
   TRANSIÇÃO ENTRE MESES SEM SOBREPOSIÇÃO

   A nova grade preserva o movimento lateral nativo utilizado
   nos demais carrosséis. A grade anterior é retirada antes da
   entrada para impedir os números fantasma observados durante
   a sobreposição das duas grades.
=========================================================== */

.calendar-date :deep(.q-transition--slide-left-leave-active),
.calendar-date :deep(.q-transition--slide-right-leave-active) {
  display: none !important;
}

.calendar-date :deep(.q-date__calendar-days) {
  height: auto !important;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: var(--calendar-cell-gap, 5px);
}

.calendar-date :deep(.q-date__calendar-days > div),
.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item) {
  width: auto !important;
  height: auto !important;
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item) {
  aspect-ratio: 1 / 1;
  padding: 0;
  overflow: hidden;
  background: var(--calendar-weekday-cell);
  border-radius: var(--calendar-cell-radius, 9px);
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item:nth-child(7n + 1)),
.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item:nth-child(7n)) {
  background: var(--calendar-weekend-cell);
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item:nth-child(7n + 1) > button),
.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item:nth-child(7n) > button) {
  color: var(--calendar-weekend-text);
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item--fill) {
  visibility: hidden;
  background: transparent !important;
  pointer-events: none;
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item--fill > *) {
  visibility: hidden;
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item > button),
.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item > div) {
  width: 100%;
  height: 100%;
  border-radius: var(--calendar-cell-radius, 9px);
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item > button) {
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: var(--calendar-date-font-weight);
  line-height: var(--calendar-date-line-height);
}

/* Data completa exibida na base do calendário. */
.calendar-selected-date {
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: var(--calendar-date-font-weight);
  line-height: var(--calendar-date-line-height);
}

.calendar-month-length {
  margin-top: 2px;
  color: var(--app-text-muted);
  font-family: var(--calendar-date-font-family);
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}

.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item > button:not(.bg-primary):hover) {
  background: var(--calendar-cell-hover) !important;
}

/* Remove o contorno nativo aplicado pelo QDate ao dia, mês
   e ano atuais. A borda da seleção continua independente. */
.calendar-date :deep(.q-date__calendar-days .q-date__today),
.calendar-date :deep(.q-date__months .q-date__today),
.calendar-date :deep(.q-date__years .q-date__today) {
  box-shadow: none;
}

/* A seleção ocupa toda a célula e substitui o antigo círculo. */
.calendar-date :deep(.q-date__calendar-days .q-date__calendar-item > button.bg-primary) {
  color: white;
  background: var(--q-primary) !important;
  box-shadow:
    0 8px 18px rgb(79 70 229 / 24%),
    inset 0 0 0 2px var(--calendar-selection-border);
}

/* ===========================================================
   EMOJIS DAS FASES NO CANTO INFERIOR DIREITO
=========================================================== */

.calendar-date :deep(.q-date__event) {
  right: 4px;
  bottom: 4px;
  left: auto;
  width: 8px;
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: var(--moon-emoji-ring-background) !important;
  border: 0.5px solid var(--moon-emoji-ring);
  border-radius: 50%;
  transform: none;
  font-size: 0;
  line-height: 0;
}

.calendar-date :deep(.q-date__event::before) {
  display: block;
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
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

.calendar-date :deep(.q-date__event.bg-moon-new::before) {
  content: '🌑';
}

.calendar-date :deep(.q-date__event.bg-moon-waxing::before) {
  content: '🌓';
}

.calendar-date :deep(.q-date__event.bg-moon-full::before) {
  content: '🌕';
}

.calendar-date :deep(.q-date__event.bg-moon-waning::before) {
  content: '🌗';
}
</style>
