<template>
  <div class="calendar-header app-no-double-tap row items-center justify-between" @dblclick.prevent>
    <!-- ================================
         MODO COMBINADO (Mês/Ano juntos)
         ================================ -->
    <div v-if="props.mode === 'combined'" class="carousel-combinado">
      <!-- Transição suave aplicando ao conjunto Mês/Ano -->
      <transition :name="combinedTransition">
        <div class="slide-content" :key="carouselMes + '-' + carouselAno">
          {{ meses[carouselMes] }}/{{ carouselAno }}
        </div>
      </transition>
    </div>

    <!-- ===================================
         MODO PADRÃO (Split: mês e ano separados)
         =================================== -->
    <template v-else>
      <!-- Seletor de Mês com botões -->
      <div class="carousel-mes">
        <q-btn flat round dense size="sm" icon="chevron_left" @click="anteriorMes" />
        <transition :name="mesTransition">
          <div class="slide-content" :key="carouselMes">
            {{ meses[carouselMes] }}
          </div>
        </transition>
        <q-btn flat round dense size="sm" icon="chevron_right" @click="proximoMes" />
      </div>

      <!-- Seletor de Ano com botões -->
      <div class="carousel-ano">
        <q-btn flat round dense size="sm" icon="chevron_left" @click="anteriorAno" />
        <transition :name="anoTransition">
          <div class="slide-content" :key="carouselAno">
            {{ carouselAno }}
          </div>
        </transition>
        <q-btn flat round dense size="sm" icon="chevron_right" @click="proximoAno" />
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, toRef, watch, ref } from 'vue';
import { useCarouselTransitionSoft } from 'src/utils/carouselMecanism';
import { useCalendarTranslations } from 'src/composables/useCalendarTranslations';

// =======================
// Props recebidas
// =======================
const props = defineProps({
  currentMonth: Number,
  currentYear: Number,
  mode: {
    type: String,
    default: 'split', // "split" = padrão (com botões); "combined" = exibição simples
  },
});

// =======================
// Eventos emitidos (apenas no modo "split")
// =======================
const emit = defineEmits(['previous-month', 'next-month', 'previous-year', 'next-year']);

// =======================
// Lista de meses
// =======================
const { months12Long: meses } = useCalendarTranslations();

// =======================
// Transição de mês
// =======================
const mesRef = toRef(props, 'currentMonth');
const { transition: mesTransition, internalValue: carouselMes } = useCarouselTransitionSoft(
  mesRef,
  12,
);

// =======================
// Transição de ano
// =======================
const anoRef = toRef(props, 'currentYear');
const { transition: anoTransition, internalValue: carouselAno } = useCarouselTransitionSoft(anoRef);

const ultimaAlteracao = ref('mes');

watch(mesRef, (novo, antigo) => {
  if (novo !== antigo) ultimaAlteracao.value = 'mes';
});
watch(anoRef, (novo, antigo) => {
  if (novo !== antigo) ultimaAlteracao.value = 'ano';
});

const combinedTransition = computed(() =>
  ultimaAlteracao.value === 'mes' ? mesTransition.value : anoTransition.value,
);

// =======================
// Métodos de navegação (usados apenas no modo "split")
// =======================
function proximoMes() {
  emit('next-month');
}
function anteriorMes() {
  emit('previous-month');
}
function proximoAno() {
  emit('next-year');
}
function anteriorAno() {
  emit('previous-year');
}
</script>

<style scoped>
/* ========================================
  ESTILOS PARA O HEADER DO CALENDÁRIO
======================================== */
.carousel-mes,
.carousel-ano {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  overflow: hidden;
}
.carousel-mes {
  width: 65%;
}
.carousel-ano {
  width: 35%;
}

/* ========================================
  NOVO ESTILO: modo combinado (Mês/Ano juntos)
======================================== */
.carousel-combinado {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* ========================================
  Texto com transição suave
======================================== */
.slide-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: var(--calendar-date-font-weight);
  line-height: var(--calendar-date-line-height);
  position: relative;
}

/* ========================================
  Estilo dos botões de navegação (modo split)
======================================== */
.q-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}
.carousel-mes .q-btn:first-child {
  left: 0;
}
.carousel-mes .q-btn:last-child {
  right: 0;
}
.carousel-ano .q-btn:first-child {
  left: 0;
}
.carousel-ano .q-btn:last-child {
  right: 0;
}

/* ========================================
  Transições suaves (slide + fade)
======================================== */
.slide-soft-left-enter-active,
.slide-soft-left-leave-active,
.slide-soft-right-enter-active,
.slide-soft-right-leave-active {
  transition: all 0.2s ease;
  position: absolute;
  width: 100%;
}
.slide-soft-left-enter-from,
.slide-soft-right-leave-to {
  transform: translateX(10%);
  opacity: 0;
}
.slide-soft-left-leave-to,
.slide-soft-right-enter-from {
  transform: translateX(-10%);
  opacity: 0;
}
</style>
