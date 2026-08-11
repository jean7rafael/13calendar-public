import { ref, watch } from 'vue';

/* ===========================================================
   TRANSIÇÃO DOS CARROSSÉIS PRINCIPAIS

   A direção considera tanto a navegação linear quanto a volta
   circular do último item para o primeiro e vice-versa.
=========================================================== */

export function useCarouselTransition(currentValue, maxValue = null) {
  const transition = ref('slide-left');
  const internalValue = ref(currentValue.value);

  watch(currentValue, (newVal, oldVal) => {
    if (maxValue === null) {
      transition.value = newVal > oldVal ? 'slide-left' : 'slide-right';
    } else {
      const forward = newVal === 0 && oldVal === maxValue - 1;
      const backward = newVal === maxValue - 1 && oldVal === 0;

      if (forward) {
        transition.value = 'slide-left';
      } else if (backward) {
        transition.value = 'slide-right';
      } else {
        transition.value = newVal > oldVal ? 'slide-left' : 'slide-right';
      }
    }

    internalValue.value = newVal;
  });

  return {
    transition,
    internalValue,
  };
}

/* ===========================================================
   TRANSIÇÃO SUAVE DOS CABEÇALHOS

   Utiliza os mesmos critérios de direção com menor deslocamento
   visual, por meio das classes slide-soft.
=========================================================== */

export function useCarouselTransitionSoft(currentValue, maxValue = null) {
  const transition = ref('slide-soft-left');
  const internalValue = ref(currentValue.value);

  watch(currentValue, (newVal, oldVal) => {
    if (maxValue === null) {
      transition.value = newVal > oldVal ? 'slide-soft-left' : 'slide-soft-right';
    } else {
      const forward = newVal === 0 && oldVal === maxValue - 1;
      const backward = newVal === maxValue - 1 && oldVal === 0;
      if (forward) {
        transition.value = 'slide-soft-left';
      } else if (backward) {
        transition.value = 'slide-soft-right';
      } else {
        transition.value = newVal > oldVal ? 'slide-soft-left' : 'slide-soft-right';
      }
    }

    internalValue.value = newVal;
  });

  return {
    transition,
    internalValue,
  };
}
