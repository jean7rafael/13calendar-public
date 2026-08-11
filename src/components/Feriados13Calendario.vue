<template>
  <q-card class="fases-lua">
    <!-- Cabeçalho -->
    <q-item class="linha-cabecalho no-wrap">
      <q-item-section class="cabeçalho-nome" side>
        <div class="titulo-nome">
          <span>
            {{ $t('panels.holidays') }}
          </span>

          <span v-if="holidayCountryFlag" class="holiday-country-flag" aria-hidden="true">
            {{ holidayCountryFlag }}
          </span>
        </div>
      </q-item-section>

      <q-item-section class="cabeçalho-data">
        <CarouselSeletores
          :currentMonth="carouselMonth"
          :currentYear="carouselYear"
          mode="combined"
        />
      </q-item-section>

      <q-item-section side class="cabeçalho-acoes">
        <Calendar13HolidayModeMenu />

        <HolidayFilterMenu />
      </q-item-section>
    </q-item>

    <!-- Carrossel de Anos -->
    <q-carousel
      v-model="carouselYear"
      :transition-prev="yearTransition === 'slide-right' ? 'slide-right' : 'slide-left'"
      :transition-next="yearTransition === 'slide-left' ? 'slide-left' : 'slide-right'"
      swipeable
      animated
      infinite
      height="185px"
      class="carrossel-externo"
    >
      <q-carousel-slide v-for="year in yearsRange" :key="year" :name="year" class="column">
        <!-- Carrossel de Meses -->
        <q-carousel
          v-model="carouselMonth"
          :transition-prev="monthTransition === 'slide-right' ? 'slide-right' : 'slide-left'"
          :transition-next="monthTransition === 'slide-left' ? 'slide-left' : 'slide-right'"
          swipeable
          animated
          infinite
          height="185px"
          class="carrossel-interno"
        >
          <q-carousel-slide
            v-for="monthIndex in Array.from({ length: 14 }, (_, i) => i)"
            :key="monthIndex"
            :name="monthIndex"
            class="relative-slide"
          >
            <div
              class="fase-wrapper"
              :class="{
                'fase-wrapper--scrollable':
                  feriadosCompletos.filter((item) => item.date13).length > 5,
              }"
            >
              <q-list dense class="lista-lua">
                <q-item
                  v-for="(feriado, index) in feriadosCompletos"
                  :key="feriado.id || `empty-${index}`"
                  class="linha linha-fase"
                  :clickable="Boolean(feriado.date13)"
                  @click="emitirDataSelecionada(feriado)"
                >
                  <q-item-section class="fase-emoji">
                    <div class="emoji-container">
                      <span class="emoji">
                        <template v-if="feriado.emoji">
                          {{ feriado.emoji }}
                        </template>

                        <template v-else-if="index === 0"> 🗓️ </template>
                      </span>

                      <q-tooltip v-if="feriado.occurrenceKind === 'observed'">
                        {{
                          $t('holidaySettings.observedDateFor', {
                            holiday: nomeDoFeriado(feriado),
                          })
                        }}
                      </q-tooltip>
                    </div>
                  </q-item-section>

                  <q-item-section class="fase-nome">
                    <span class="fase-texto">
                      {{
                        feriado.status === 'error'
                          ? $t('panels.loadError')
                          : feriado.nameId
                            ? nomeDoFeriado(feriado)
                            : index === 0
                              ? $t('panels.noHolidays')
                              : ''
                      }}
                    </span>
                  </q-item-section>

                  <q-item-section class="fase-data">
                    <span>
                      {{ feriado.date13 ? feriado.date13.replace(/-/g, '/') : '' }}
                    </span>

                    <q-tooltip v-if="feriado.gregorianDate">
                      {{ feriado.gregorianDate.replace(/-/g, '/') }}
                      ({{ $t('calendar.gregorian') }})
                    </q-tooltip>
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-carousel-slide>
        </q-carousel>
      </q-carousel-slide>
    </q-carousel>
  </q-card>
</template>

<script setup>
import { ref, computed, watch, toRef } from 'vue';

import { useCarouselTransition } from 'src/utils/carouselMecanism';

import { getThirteenMonthHolidaysForMonth } from 'src/holidays/holidayEngine';

import CarouselSeletores from 'src/components/Carousel13Seletores.vue';

import { useI18n } from 'vue-i18n';

import { resolveHolidayName } from 'src/holidays/holidayNameResolver';

import { loadHolidayTranslations } from 'src/holidays/holidayTranslationRuntime';

import { useHolidaySettings } from 'src/composables/useHolidaySettings';

import { findHolidayCountryConfig } from 'src/holidays/countryRegistry';

import HolidayFilterMenu from 'src/components/HolidayFilterMenu.vue';

import Calendar13HolidayModeMenu from 'src/components/Calendar13HolidayModeMenu.vue';

import { useYearWindow } from 'src/composables/useYearWindow';

/* ===========================================================
   MÊS, ANO E EVENTO DE SELEÇÃO
=========================================================== */

const props = defineProps({
  mes13Fases: Number,
  ano13Fases: Number,
});

const emit = defineEmits(['update:modelValue']);

/* ===========================================================
   IDIOMA, PAÍS E FILTROS COMPARTILHADOS
=========================================================== */

const { locale } = useI18n({
  useScope: 'global',
});

const { holidayCountry, holidayFilters, calendar13HolidayMode } = useHolidaySettings();

/* ===========================================================
   BANDEIRA DO PAÍS DOS FERIADOS
=========================================================== */

const holidayCountryFlag = computed(
  () => findHolidayCountryConfig(holidayCountry.value)?.flag || '',
);

/* Resolve o nome no idioma atual usando o catálogo central. */
function nomeDoFeriado(feriado) {
  return resolveHolidayName(feriado, locale.value);
}

/* ===========================================================
   SINCRONIZAÇÃO DO MÊS COM O CARROSSEL
=========================================================== */

const propMes = ref(props.mes13Fases - 1);

watch(
  () => props.mes13Fases,
  (value) => {
    propMes.value = value - 1;
  },
);

/* ===========================================================
   TRANSIÇÕES E JANELA DINÂMICA DE ANOS
=========================================================== */

const { transition: yearTransition, internalValue: carouselYear } = useCarouselTransition(
  toRef(props, 'ano13Fases'),
);

const { yearsRange } = useYearWindow(carouselYear);

const { transition: monthTransition, internalValue: carouselMonth } = useCarouselTransition(
  propMes,
  14,
);

/* ===========================================================
   FERIADOS DO MÊS VISÍVEL NO CALENDÁRIO DE 13 MESES
=========================================================== */

const feriados = ref([]);
let holidayRequestId = 0;

/* Recalcula a lista ao navegar ou alterar país e filtros. */
watch(
  [
    carouselMonth,
    carouselYear,
    holidayCountry,
    holidayFilters,
    locale,
    calendar13HolidayMode,
  ],
  async ([month, year, country]) => {
    const requestId = ++holidayRequestId;

    try {
      await loadHolidayTranslations(country);

      const nextHolidays = getThirteenMonthHolidaysForMonth({
        country,
        year,
        month: month + 1,
        locale: locale.value,
        filters: holidayFilters,
        mode: calendar13HolidayMode.value,
      });

      if (requestId === holidayRequestId) {
        feriados.value = nextHolidays;
      }
    } catch (error) {
      console.error('Erro ao calcular feriados de 13 meses:', error);

      if (requestId === holidayRequestId) {
        feriados.value = [
          {
            id: 'error',
            status: 'error',
            date13: '',
          },
        ];
      }
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

/* Completa apenas as linhas visuais que faltarem até o total de cinco. */
const feriadosCompletos = computed(() => {
  const list = [...feriados.value];

  while (list.length < 5) {
    list.push({
      id: `empty-${list.length}`,
      date13: '',
      gregorianDate: '',
      nameId: '',
      emoji: '',
    });
  }

  return list;
});

/* ===========================================================
   SELEÇÃO DE UM FERIADO
=========================================================== */

function emitirDataSelecionada(holiday) {
  if (holiday?.date13) {
    emit('update:modelValue', holiday.date13);
  }
}
</script>

<style scoped>
/* ===========================================================
  ESTILOS GERAIS DO COMPONENTE DE FERIADOS
=========================================================== */
.fases-lua {
  width: 100%;
  min-width: var(--calendar-card-min-width, 320px);
  max-width: var(--calendar-card-max-width, 520px);
  height: 230px;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
}

/* ===========================================================
  BLOCO 1 - CABEÇALHO (TÍTULO + DATA)
=========================================================== */
.linha-cabecalho {
  height: 36.67px;
  border-bottom: 1px solid #ccc;
  font-weight: bold;
  align-items: center;
  padding: 0 10px;
  display: flex;
}

.cabeçalho-nome {
  display: flex;
  align-items: center;
  font-size: 14px;
  white-space: nowrap;
  color: rgb(0, 0, 0);
}

.titulo-nome {
  margin-top: 7px;
  font-weight: bold;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.holiday-country-flag {
  font-size: 16px;
  line-height: 1;
}

.cabeçalho-data {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.cabeçalho-acoes {
  min-width: 54px;
  padding-left: 2px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
}

/* ===========================================================
  BLOCO 2 - LINHAS DOS FERIADOS
=========================================================== */
.linha {
  min-height: 36px;
  height: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
}

.linha-fase {
  margin: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

.emoji-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fase-emoji {
  flex-basis: 10%;
  flex-grow: 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  height: 100%;
}

.fase-nome {
  flex: 1 1 auto;
  min-width: 0;
  text-align: left;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 5px 0 5px 10px;
  font-size: 14px;
  white-space: normal;
  overflow: visible;
  line-height: 1.25;
}

.fase-texto {
  width: 100%;
  min-width: 0;
  text-align: left;
  overflow-wrap: anywhere;
}

.fase-data {
  flex: 0 0 105px;
  min-width: 105px;
  text-align: right;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-right: 10px;
  font-size: 14px;
  white-space: nowrap;
  overflow: visible;
  color: gray;
}

.fase-data > span {
  width: 100%;
  text-align: right;
}

/* ===========================================================
  BLOCO 3 - CARROSSEL E WRAPPERS INTERNOS
=========================================================== */
.fase-wrapper {
  position: relative;
  width: 100%;
  height: 100% !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  overflow-y: auto;
}

/* Firefox */
.fase-wrapper {
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.fase-wrapper:hover {
  scrollbar-color: rgba(0, 0, 0, 0.45) transparent;
}

/* Chrome, Safari e aplicativo */
.fase-wrapper::-webkit-scrollbar {
  width: 5px;
}

.fase-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.fase-wrapper::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 10px;
}

.fase-wrapper:hover::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.45);
}

.fase-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.65);
}

.lista-lua {
  padding: 0 !important;
  margin: 0 !important;
}

.carrossel-externo,
.carrossel-interno,
.column,
.relative-slide {
  position: relative;
  height: 100% !important;
  max-height: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
}
</style>
