<template>
  <q-card class="fases-lua">
    <!-- Cabeçalho com layout limpo e alinhado -->
    <q-item class="linha-cabecalho no-wrap">
      <q-item-section class="cabeçalho-nome" side>
        <div class="titulo-nome">
          {{ $t('panels.moonPhases') }}
        </div>
      </q-item-section>

      <q-item-section class="cabeçalho-data">
        <CarouselSeletores
          :currentMonth="carouselMonth"
          :currentYear="carouselYear"
          mode="combined"
        />
      </q-item-section>

      <q-item-section side class="cabeçalho-filtro">
        <MoonPhaseFilterMenu />
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
                'fase-wrapper--scrollable': fasesCompletas.filter((item) => item.data).length > 5,
              }"
            >
              <q-list dense class="lista-lua">
                <q-item
                  v-for="(fase, index) in fasesCompletas"
                  :key="index"
                  class="linha linha-fase"
                  :clickable="Boolean(fase.data)"
                  @click="emitirDataSelecionada(fase)"
                >
                  <q-item-section class="fase-emoji">
                    <div class="emoji-container">
                      <span class="emoji">
                        <template v-if="fase.fase">
                          {{ getEmojiForFase(fase.fase) }}
                        </template>

                        <template v-else-if="index === 0"> 🌙 </template>
                      </span>
                    </div>
                  </q-item-section>

                  <q-item-section class="fase-nome">
                    <span class="fase-texto">
                      {{
                        fase.status === 'error'
                          ? $t('panels.loadError')
                          : fase.fase
                            ? translateMoonPhase(fase.fase)
                            : index === 0
                              ? $t('panels.noMoonPhases')
                              : ''
                      }}
                    </span>
                  </q-item-section>

                  <q-item-section class="fase-data">
                    <template v-if="fase.data">
                      <span class="fase-data-texto">
                        {{ converterPara13Meses(fase.data).replace(/-/g, '/') }}
                      </span>

                      <span v-if="showMoonPhaseTime && fase.instante" class="fase-horario">
                        {{ formatMoonPhaseTime(fase.instante) }}
                      </span>
                    </template>

                    <q-tooltip v-if="fase.data">
                      {{ fase.data.replace(/-/g, '/') }}
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
import { obterFasesLuaDoAno } from 'src/utils/fasesLua';
import { converterPara13Meses } from 'src/utils/conversorDatas';
import CarouselSeletores from 'src/components/Carousel13Seletores.vue';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';
import { useYearWindow } from 'src/composables/useYearWindow';
import { useMoonPhaseSettings } from 'src/composables/useMoonPhaseSettings';
import MoonPhaseFilterMenu from 'src/components/MoonPhaseFilterMenu.vue';

/* ===========================================================
   MÊS E ANO RECEBIDOS DO CALENDÁRIO DE 13 MESES
=========================================================== */

const props = defineProps({
  mes13Fases: Number,
  ano13Fases: Number,
});

/* ===========================================================
   SINCRONIZAÇÃO DO MÊS EXTERNO COM O ÍNDICE DO CARROSSEL
=========================================================== */

const propMes = ref(props.mes13Fases - 1);
watch(
  () => props.mes13Fases,
  (val) => {
    propMes.value = val - 1;
  },
);

/* ===========================================================
   TRANSIÇÕES E JANELA DINÂMICA DE ANOS
=========================================================== */

const { transition: yearTransition, internalValue: carouselYear } = useCarouselTransition(
  toRef(props, 'ano13Fases'),
);
const { transition: monthTransition, internalValue: carouselMonth } = useCarouselTransition(
  propMes,
  14,
);
const { yearsRange } = useYearWindow(carouselYear);

const { translateMoonPhase, formatMoonPhaseTime } = useCalendarTranslations();

const { showMoonPhaseTime } = useMoonPhaseSettings();

/* ===========================================================
   FASES LUNARES DO MÊS VISÍVEL
=========================================================== */

const fasesLua = ref([]);

/* Calcula o ano gregoriano e filtra pelo mês equivalente no CFI. */
watch(
  [carouselMonth, carouselYear],
  async ([mes, ano]) => {
    try {
      const todasFases = await obterFasesLuaDoAno(ano);
      fasesLua.value = todasFases.filter((fase) => {
        const data13 = converterPara13Meses(fase.data);
        if (!data13) return false;
        const [ano13, mes13] = data13.split('-');
        const match = parseInt(ano13, 10) === ano && parseInt(mes13, 10) === mes + 1;
        return match;
      });
    } catch (e) {
      console.error('❌ Erro ao obter fases da Lua:', e);
      fasesLua.value = [
        {
          fase: '',
          data: '',
          status: 'error',
        },
      ];
    }
  },
  { immediate: true },
);

/* Mantém cinco linhas visuais quando o mês possui poucos eventos. */
const fasesCompletas = computed(() => {
  const fases = [...fasesLua.value];
  while (fases.length < 5) fases.push({ data: '', fase: '' });
  return fases;
});

/* ===========================================================
   SELEÇÃO DE UMA FASE LUNAR
=========================================================== */

const emit = defineEmits(['update:modelValue']);

function emitirDataSelecionada(fase) {
  if (fase?.data) {
    const dataConvertida = converterPara13Meses(fase.data);
    emit('update:modelValue', dataConvertida);
  }
}

/* ===========================================================
   REPRESENTAÇÃO VISUAL DAS FASES
=========================================================== */

function getEmojiForFase(nome) {
  const emojis = {
    Nova: '🌑',
    Crescente: '🌓',
    Cheia: '🌕',
    Minguante: '🌗',
  };
  return emojis[nome] || '🌙';
}
</script>

<style scoped>
/* ===========================================================
  ESTILOS GERAIS DO COMPONENTE FASES DA LUA
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
}

.cabeçalho-data {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.cabeçalho-filtro {
  min-width: 28px;
  padding-left: 2px;
}

/* ===========================================================
  BLOCO 2 - LINHAS DAS FASES
=========================================================== */
.linha {
  height: 36.67px;
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

/* O contorno mantém visíveis as partes escuras dos emojis lunares. */
.emoji {
  filter: var(--moon-emoji-outline);
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
  flex-basis: 56%;
  flex-grow: 1;
  text-align: left;
  display: flex;
  align-items: flex-start;
  padding-left: 10px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
}

.fase-data {
  flex-basis: 34%;
  flex-grow: 1;
  text-align: right;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding-right: 10px;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  color: gray;
}

.fase-data-texto {
  line-height: 16px;
  font-variant-numeric: tabular-nums;
}

.fase-horario {
  margin-top: 1px;
  font-size: 11px;
  line-height: 12px;
  font-variant-numeric: tabular-nums;
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
  overflow: hidden;
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
