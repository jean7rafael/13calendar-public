import { nextTick } from 'vue';

/* ===========================================================
   LIMPEZA PADRÃO DE FORMULÁRIOS CONCLUÍDOS

   Os valores devem ser apagados antes desta chamada. A rotina
   espera a atualização visual e remove somente a validação da
   operação concluída; uma nova tentativa inválida continua
   obedecendo às regras normais do QForm.
=========================================================== */

export function useSuccessfulFormReset() {
  async function resetSuccessfulForm({ form, fields = [] } = {}) {
    await nextTick();

    for (const field of fields) {
      field?.resetValidation?.();
    }

    form?.resetValidation?.();

    /* Alguns componentes aplicam seu estado interno no mesmo ciclo do
       modelo. A segunda passagem impede que esse estado atrasado volte
       a pintar um campo que acabou de ser concluído com sucesso. */
    await nextTick();

    for (const field of fields) {
      field?.resetValidation?.();
    }

    form?.resetValidation?.();
  }

  return { resetSuccessfulForm };
}
