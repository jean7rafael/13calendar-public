<template>
  <q-page class="calendar-page">
    <!-- Apresentação preservada da antiga prévia visual. -->
    <section class="calendar-introduction">
      <p class="calendar-introduction__eyebrow">
        {{ $t('introduction.eyebrow') }}
      </p>

      <h1>{{ $t('introduction.title') }}</h1>

      <p class="calendar-introduction__description">
        {{ $t('introduction.description') }}
      </p>
    </section>

    <!-- Legenda comum aos indicadores lunares dos dois calendários. -->
    <MoonPhaseLegend class="calendar-moon-legend" />

    <!-- Linha 1 -->
    <div class="linha">
      <div class="coluna">
        <Feriados12Calendario
          :mes12Fases="mes12Fases"
          :ano12Fases="ano12Fases"
          @update:modelValue="converterParaCalendario13"
        />
      </div>
      <div class="coluna">
        <Feriados13Calendario
          :mes13Fases="mes13Fases"
          :ano13Fases="ano13Fases"
          @update:modelValue="converterParaCalendario12"
        />
      </div>
    </div>

    <!-- Linha 2 -->
    <div class="linha">
      <div class="coluna">
        <Calendario12Meses
          v-model="dataSelecionada"
          @update:modelValue="converterParaCalendario13"
          @update:mes12="mes12Fases = $event"
          @update:ano12="ano12Fases = $event"
        />
      </div>
      <div class="coluna">
        <Calendario13Meses
          v-model="dataConvertida"
          @update:modelValue="converterParaCalendario12"
          @update:mes13="mes13Fases = $event"
          @update:ano13="ano13Fases = $event"
        />
      </div>
    </div>

    <!-- Linha 3 -->
    <div class="linha">
      <div class="coluna">
        <Fases12Lua
          :mes12Fases="mes12Fases"
          :ano12Fases="ano12Fases"
          @update:modelValue="converterParaCalendario13"
        />
      </div>
      <div class="coluna">
        <Fases13Lua
          :mes13Fases="mes13Fases"
          :ano13Fases="ano13Fases"
          @update:modelValue="converterParaCalendario12"
        />
      </div>
    </div>

    <!-- Rodapé comum com fontes, privacidade e limites dos dados. -->
    <AppFooter />
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
import AppFooter from 'src/components/AppFooter.vue';
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

/* ===========================================================
   PEDIDO GLOBAL PARA VOLTAR À DATA DE HOJE
=========================================================== */

const { todayRequest } = useTodayNavigation();

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
  --calendar-main-card-height: 470px;

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
   APRESENTAÇÃO DA IDENTIDADE VISUAL
=========================================================== */

.calendar-introduction {
  max-width: 720px;
  margin: 20px auto 2px;
  text-align: center;
}

.calendar-introduction__eyebrow {
  margin: 0 0 10px;
  color: #8b5cf6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.calendar-introduction h1 {
  margin: 0;
  color: var(--app-text);
  font-size: clamp(28px, 5vw, 48px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.calendar-introduction__description {
  max-width: 620px;
  margin: 18px auto 0;
  color: var(--app-text-muted);
  font-size: 16px;
  line-height: 1.65;
}

/* ===========================================================
   LINHAS COM DOIS CALENDÁRIOS

   As duas colunas possuem sempre a mesma largura.
=========================================================== */

.linha {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(var(--calendar-card-min-width), 1fr));
  gap: 22px;
}

/* ===========================================================
   POSICIONAMENTO DOS ENCARTES
=========================================================== */

.coluna {
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
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
  /* Ao chegar ao primeiro ou ao último item, a roda do mouse
     permanece pertencendo ao encarte e não movimenta a página. */
  overscroll-behavior: contain;
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

   Os encartes passam a ficar um abaixo do outro,
   preservando a largura mínima de 320px.
=========================================================== */

@media (max-width: 760px) {
  .calendar-page {
    padding: 16px 12px 28px;
  }

  .linha {
    grid-template-columns: minmax(var(--calendar-card-min-width), 1fr);
  }

  .calendar-introduction {
    margin-top: 8px;
  }

  .calendar-introduction__description {
    font-size: 14px;
  }
}
</style>
