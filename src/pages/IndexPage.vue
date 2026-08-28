<template>
  <q-page class="calendar-page" @wheel.capture="containCardWheel">
    <!-- Apresentação preservada da antiga prévia visual. -->
    <AppPageHero
      icon="calendar_month"
      :eyebrow="$t('introduction.eyebrow')"
      :title="$t('introduction.title')"
      :description="$t('introduction.description')"
    />

    <!-- Legenda comum aos indicadores lunares dos dois calendários. -->
    <MoonPhaseLegend class="calendar-moon-legend" />

    <!-- Na largura em que as colunas deixariam de caber, o mesmo
         seletor simples da referência escolhe qual conjunto exibir. -->
    <div class="calendar-mobile-view">
      <div
        class="calendar-mobile-view-switch"
        role="group"
        :aria-label="$t('introduction.title')"
      >
        <span
          :class="{ 'calendar-mobile-view-switch__label--active': !showFixedCalendarMobile }"
        >
          {{ $t('calendar.gregorian') }}
        </span>

        <q-toggle
          v-model="showFixedCalendarMobile"
          color="primary"
          keep-color
          size="44px"
          :aria-label="$t('introduction.title')"
        />

        <span :class="{ 'calendar-mobile-view-switch__label--active': showFixedCalendarMobile }">
          {{ $t('calendar.calendar13Short') }}
        </span>
      </div>

      <p class="calendar-mobile-view__hint">
        <q-icon name="screen_rotation" aria-hidden="true" />
        <span>{{ $t('calendar.mobileComparisonHint') }}</span>
      </p>
    </div>

    <!-- Cada coluna reúne calendário, feriados e fases do mesmo
         sistema. No desktop as duas continuam lado a lado. -->
    <div class="calendar-comparison">
      <section
        class="calendar-column calendar-column--gregorian"
        :class="{ 'calendar-column--active': !showFixedCalendarMobile }"
        :aria-label="$t('calendar.gregorianTitle')"
      >
        <Feriados12Calendario
          :mes12Fases="mes12Fases"
          :ano12Fases="ano12Fases"
          @update:modelValue="converterParaCalendario13"
        />

        <Calendario12Meses
          v-model="dataSelecionada"
          @update:modelValue="converterParaCalendario13"
          @update:mes12="mes12Fases = $event"
          @update:ano12="ano12Fases = $event"
        />

        <Fases12Lua
          :mes12Fases="mes12Fases"
          :ano12Fases="ano12Fases"
          @update:modelValue="converterParaCalendario13"
        />
      </section>

      <section
        class="calendar-column calendar-column--fixed"
        :class="{ 'calendar-column--active': showFixedCalendarMobile }"
        :aria-label="$t('calendar.fixedCalendarTitle')"
      >
        <Feriados13Calendario
          :mes13Fases="mes13Fases"
          :ano13Fases="ano13Fases"
          @update:modelValue="converterParaCalendario12"
        />

        <Calendario13Meses
          v-model="dataConvertida"
          @update:modelValue="converterParaCalendario12"
          @update:mes13="mes13Fases = $event"
          @update:ano13="ano13Fases = $event"
        />

        <Fases13Lua
          :mes13Fases="mes13Fases"
          :ano13Fases="ano13Fases"
          @update:modelValue="converterParaCalendario12"
        />
      </section>
    </div>

    <!-- Fontes, privacidade e limites pertencem somente aos calendários. -->
    <CalendarContextSection />

  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue';
import Calendario12Meses from 'src/components/Calendario12Meses.vue';
import Calendario13Meses from 'src/components/Calendario13Meses.vue';
import Feriados12Calendario from 'src/components/Feriados12Calendario.vue';
import Feriados13Calendario from 'src/components/Feriados13Calendario.vue';
import Fases12Lua from 'src/components/Fases12Lua.vue';
import Fases13Lua from 'src/components/Fases13Lua.vue';
import MoonPhaseLegend from 'src/components/MoonPhaseLegend.vue';
import CalendarContextSection from 'src/components/CalendarContextSection.vue';
import AppPageHero from 'src/components/AppPageHero.vue';
import { converterPara13Meses, converterParaGregoriano } from 'src/utils/conversorDatas';
import { useTodayNavigation } from 'src/composables/useTodayNavigation';

/* ===========================================================
   FORMATAÇÃO DA DATA LOCAL
=========================================================== */

function formatarDataLocal(data) {
  const ano = data.getFullYear();

  const mes = String(data.getMonth() + 1).padStart(2, '0');

  const dia = String(data.getDate()).padStart(2, '0');

  return `${ano}-${mes}-${dia}`;
}

/* ===========================================================
   ESTADO INICIAL DOS DOIS CALENDÁRIOS
=========================================================== */

const dataInicial = new Date();

const dataSelecionada = ref(formatarDataLocal(dataInicial));

const dataConvertida = ref(converterPara13Meses(dataSelecionada.value));

const mes12Fases = ref(dataInicial.getMonth() + 1);

const ano12Fases = ref(dataInicial.getFullYear());

const mes13Fases = ref(Number(dataConvertida.value.split('-')[1]));
const ano13Fases = ref(Number(dataConvertida.value.split('-')[0]));

/* O gregoriano é a primeira visão móvel; a escolha afeta apenas
   a apresentação e não desmonta nem dessincroniza o outro lado. */
const showFixedCalendarMobile = ref(false);

/* ===========================================================
   PEDIDO GLOBAL PARA VOLTAR À DATA DE HOJE
=========================================================== */

const { todayRequest } = useTodayNavigation();

/* ===========================================================
   CONTENÇÃO DA ROLAGEM DENTRO DOS ENCARTES

   A contenção só entra em ação quando existe transbordamento
   vertical real. Assim, um card sem barra nunca intercepta a
   rolagem normal da página; um card rolável preserva o gesto
   ao atingir o primeiro ou o último item.
=========================================================== */

const containedCardSelector = '.calendar-card, .custom-calendar, .fases-lua';
const minimumScrollOverflow = 8;

function findVerticalScrollContainer(startElement, cardElement) {
  let element = startElement;

  while (element) {
    const styles = window.getComputedStyle(element);
    const allowsVerticalScroll = ['auto', 'scroll', 'overlay'].includes(styles.overflowY);

    const verticalOverflow = element.scrollHeight - element.clientHeight;

    if (allowsVerticalScroll && verticalOverflow > minimumScrollOverflow) {
      return element;
    }

    if (element === cardElement) {
      break;
    }

    element = element.parentElement;
  }

  return null;
}

function containCardWheel(event) {
  /* Preserva o gesto de zoom do navegador, normalmente
     representado por Ctrl + roda ou pelo gesto de pinça. */
  if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
    return;
  }

  const target = event.target instanceof Element ? event.target : null;
  const card = target?.closest(containedCardSelector);

  if (!card) {
    return;
  }

  const scrollContainer = findVerticalScrollContainer(target, card);

  /* Sem transbordamento interno, a roda pertence à página.
     Bloquear esse caso faria os grandes cards parecerem uma área
     morta mesmo quando não existe nada para rolar dentro deles. */
  if (!scrollContainer) {
    return;
  }

  const reachedTop = scrollContainer.scrollTop <= 0;
  const reachedBottom =
    scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight - 1;

  if ((event.deltaY < 0 && reachedTop) || (event.deltaY > 0 && reachedBottom)) {
    event.preventDefault();
  }
}

/* ===========================================================
   CONVERSÃO DO GREGORIANO PARA O CALENDÁRIO DE 13 MESES
=========================================================== */

function converterParaCalendario13(novaData) {
  dataSelecionada.value = novaData;
  dataConvertida.value = converterPara13Meses(novaData);

  const [ano, mes] = novaData.split('-');
  mes12Fases.value = parseInt(mes, 10);
  ano12Fases.value = parseInt(ano, 10);
}

/* ===========================================================
   CONVERSÃO DO CALENDÁRIO DE 13 MESES PARA O GREGORIANO
=========================================================== */

function converterParaCalendario12(novaData13) {
  dataConvertida.value = novaData13;
  dataSelecionada.value = converterParaGregoriano(novaData13);

  const [ano, mes] = novaData13.split('-');
  mes13Fases.value = parseInt(mes, 10);
  ano13Fases.value = parseInt(ano, 10);
}

/* ===========================================================
   NAVEGAÇÃO SIMULTÂNEA PARA A DATA DE HOJE
=========================================================== */

function irParaHoje() {
  const hoje = formatarDataLocal(new Date());

  converterParaCalendario13(hoje);

  const [ano13, mes13] = dataConvertida.value.split('-');

  mes13Fases.value = parseInt(mes13, 10);
  ano13Fases.value = parseInt(ano13, 10);
}

watch(todayRequest, () => {
  irParaHoje();
});
</script>

<style scoped>
/* ===========================================================
   PÁGINA DOS CALENDÁRIOS

   As variáveis abaixo controlam a largura de todos os
   seis encartes a partir de um único lugar.
=========================================================== */

.calendar-page {
  --calendar-card-min-width: 320px;
  --calendar-card-max-width: 560px;
  --calendar-grid-width: 350px;
  --calendar-cell-gap: 5px;
  --calendar-cell-radius: 9px;
  --calendar-main-card-height: 520px;

  width: min(100%, 1180px);
  min-height: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 0 auto;
  padding: 24px 24px 36px;
  box-sizing: border-box;
  overflow-x: auto;
}

.calendar-moon-legend {
  margin-bottom: -4px;
}

/* ===========================================================
   DUAS COLUNAS SINCRONIZADAS
=========================================================== */

.calendar-comparison {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(var(--calendar-card-min-width), 1fr));
  gap: 22px;
}

.calendar-column {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

/* O seletor reproduz a lógica Standard ↔ 13-Mo da referência,
   mas usa os nomes localizados dos calendários do projeto. */
.calendar-mobile-view {
  display: none;
}

.calendar-mobile-view-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--app-text-muted);
  font-size: 14px;
  line-height: 20px;
}

.calendar-mobile-view-switch span {
  transition: color 160ms ease;
}

.calendar-mobile-view-switch__label--active {
  color: var(--app-primary-text);
  font-weight: 600;
}

.calendar-mobile-view__hint {
  max-width: 430px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 6px;
  margin: 0;
  color: var(--app-text-faint);
  font-size: 12px;
  line-height: 1.45;
  text-align: center;
}

.calendar-mobile-view__hint .q-icon {
  flex: 0 0 auto;
  margin-top: 1px;
  font-size: 16px;
}

/* ===========================================================
   SUPERFÍCIES DOS SEIS ENCARTES

   As regras profundas uniformizam componentes antigos sem
   alterar a lógica independente de cada um deles.
=========================================================== */

.calendar-page :deep(.q-card) {
  color: var(--app-text);
  background: var(--app-surface);
  border: 1px solid var(--app-border);
  border-radius: 18px;
  box-shadow: var(--app-card-shadow);
}

/* Os calendários tornam-se roláveis somente quando o zoom ou
   uma fonte com métricas maiores fizer o conteúdo exceder o card. */
.calendar-page :deep(.calendar-card),
.calendar-page :deep(.custom-calendar),
.calendar-page :deep(.fases-lua) {
  overflow-y: auto;
}

.calendar-page :deep(.q-carousel),
.calendar-page :deep(.q-carousel__slide) {
  color: var(--app-text);
  background: transparent;
}

.calendar-page :deep(.linha-cabecalho) {
  min-height: 47px;
  height: 47px;
  padding: 0 14px;
  color: var(--app-text);
  border-bottom: 1px solid var(--app-border);
}

.calendar-page :deep(.cabeçalho-nome),
.calendar-page :deep(.cabeçalho-data),
.calendar-page :deep(.titulo-nome) {
  color: var(--app-text);
}

/* Datas, anos e meses seguem a tipografia exata do calendário
   de referência; apenas os títulos dos encartes permanecem fortes. */
.calendar-page :deep(.cabeçalho-data),
.calendar-page :deep(.fase-data),
.calendar-page :deep(.fase-data-texto),
.calendar-page :deep(.calendar-selected-date),
.calendar-page :deep(.selected-date),
.calendar-page :deep(.slide-content),
.calendar-page :deep(.selector-option),
.calendar-page :deep(.calendar-day-number) {
  font-family: var(--calendar-date-font-family);
  font-size: var(--calendar-date-font-size);
  font-weight: var(--calendar-date-font-weight);
  line-height: var(--calendar-date-line-height);
}

.calendar-page :deep(.cabeçalho-nome),
.calendar-page :deep(.titulo-nome) {
  font-weight: 600;
}

.calendar-page :deep(.fase-data),
.calendar-page :deep(.fase-horario) {
  color: var(--app-text-muted);
}

.calendar-page :deep(.linha-fase) {
  color: var(--app-text);
  border-radius: 8px;
}

.calendar-page :deep(.linha-fase.q-item--clickable:hover) {
  background: var(--app-hover);
}

/* As listas ficam recuadas das bordas do card para que o hover
   arredondado nunca encoste no contorno externo. A altura extra
   preserva cinco linhas completas sem criar rolagem artificial. */
.calendar-page :deep(.fases-lua) {
  height: 246px;
}

.calendar-page :deep(.fases-lua .carrossel-externo),
.calendar-page :deep(.fases-lua .carrossel-interno) {
  height: 197px !important;
}

.calendar-page :deep(.fases-lua .fase-wrapper) {
  width: calc(100% - 16px);
  height: calc(100% - 12px) !important;
  margin: 6px 8px !important;
  /* A própria altura do conteúdo decide se existe rolagem.
     Isso cobre tanto uma sexta linha quanto cinco nomes que
     ocupem duas ou mais linhas. Sem transbordamento, o navegador
     não desenha nenhuma barra. */
  overflow-y: auto !important;
}

.calendar-page :deep(.fases-lua .fase-wrapper--scrollable) {
  overflow-y: auto !important;
}

/* A rolagem pertence apenas à lista interna. O painel do
   QCarousel não deve criar uma segunda barra por causa das margens. */
.calendar-page :deep(.fases-lua .q-panel) {
  overflow: hidden !important;
}

.calendar-page :deep(.navigation-arrow),
.calendar-page :deep(.year-page-arrow) {
  color: var(--app-text-muted);
}

/* ===========================================================
   JANELAS ESTREITAS

   Um único calendário e seus dois encartes permanecem visíveis.
=========================================================== */

@media (max-width: 760px) {
  .calendar-page {
    --calendar-card-min-width: 0px;

    padding: 16px 12px 28px;
  }

  .calendar-mobile-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .calendar-comparison {
    grid-template-columns: minmax(0, 1fr);
  }

  .calendar-column {
    display: none;
  }

  .calendar-column--active {
    display: flex;
  }

}
</style>
