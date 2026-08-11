import { ref } from 'vue';

/* ===========================================================
   PEDIDO GLOBAL DE NAVEGAÇÃO PARA HOJE

   O contador permite que o cabeçalho solicite a navegação sem
   depender diretamente dos componentes dos calendários.
=========================================================== */

const todayRequest = ref(0);

export function useTodayNavigation() {
  /* Registra uma nova solicitação observada pela página principal. */
  function requestToday() {
    todayRequest.value += 1;
  }

  return {
    todayRequest,
    requestToday,
  };
}
